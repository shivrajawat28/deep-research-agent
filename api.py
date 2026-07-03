import re
import asyncio
import os
from concurrent.futures import ThreadPoolExecutor
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from pipeline import run_research_pipleline


class ResearchRequest(BaseModel):
    topic: str = Field(..., min_length=1)


app = FastAPI(title="Deep Research AI API")

default_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

frontend_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=default_origins + frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

executor = ThreadPoolExecutor(max_workers=2)


def clean_report_text(text: str) -> str:
    cleaned = re.sub(r"\[:\d+\]", "", text)
    cleaned = re.sub(r"\n\s*\*?Source:\s*\[[^\]]*$", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\n\s*\*?Source:\s*\[[^\]]+\]\(https?://[^)\n]*$", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+\n", "\n", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def is_valid_source_url(url: str) -> bool:
    try:
        host = url.split("/")[2]
    except IndexError:
        return False
    return "." in host and host not in {"www", "www."}


def extract_sources(state: dict[str, Any]) -> list[dict[str, str]]:
    text = "\n".join(
        str(state.get(key, ""))
        for key in ("search_result", "scraped_content", "report")
    )
    urls = []
    seen = {}

    for title, url in re.findall(r"\[([^\]]+)\]\((https?://[^)]+)\)", text):
        clean_url = url.rstrip(".,;:")
        if not is_valid_source_url(clean_url):
            continue
        seen[clean_url] = title.strip()

    for title, url in re.findall(
        r"Title:\s*(.+?)\nURL:\s*(https?://[^\s]+)",
        text,
        flags=re.IGNORECASE,
    ):
        clean_url = url.rstrip(".,;:")
        if not is_valid_source_url(clean_url):
            continue
        seen[clean_url] = title.strip()

    for url, title in seen.items():
        urls.append(
            {
                "site": re.sub(r"^www\.", "", url.split("/")[2]),
                "title": title or "Source article",
                "url": url,
            }
        )

    for url in re.findall(r"https?://[^\s)>\]]+", text):
        clean_url = url.rstrip(".,;:")
        if not is_valid_source_url(clean_url):
            continue
        if clean_url in seen:
            continue

        seen[clean_url] = "Source article"
        urls.append(
            {
                "site": re.sub(r"^www\.", "", clean_url.split("/")[2]),
                "title": "Source article",
                "url": clean_url,
            }
        )

    return urls


def extract_verdict(feedback: str) -> str:
    match = re.search(
        r"One[- ]line verdict:\s*(.+)",
        feedback,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not match:
        return ""
    return match.group(1).strip().splitlines()[0].strip()


def ensure_complete_report(state: dict[str, Any], sources: list[dict[str, str]]) -> str:
    report = clean_report_text(state.get("report", ""))
    feedback = clean_report_text(state.get("feedback", ""))
    additions = []

    if not re.search(r"summary bullet points", report, flags=re.IGNORECASE):
        additions.append(
            "## Summary Bullet Points\n"
            "- The research agent gathered current web results and article-level context.\n"
            "- The report highlights the most relevant developments found in the sources.\n"
            "- Key findings are based on the available search results and scraped content.\n"
            "- Source links are preserved below for verification.\n"
            "- The critic review notes quality, coverage, and improvement areas."
        )

    if sources and not re.search(r"\n#+\s*Sources|\*\*Sources\*\*", report, flags=re.IGNORECASE):
        source_lines = "\n".join(
            f"- [{source['title']}]({source['url']})" for source in sources
        )
        additions.append(f"## Sources\n{source_lines}")

    if not re.search(r"one[- ]line verdict", report, flags=re.IGNORECASE):
        verdict = extract_verdict(feedback)
        if verdict:
            additions.append(f"## One Line Verdict\n{verdict}")

    if additions:
        report = f"{report}\n\n" + "\n\n".join(additions)

    return clean_report_text(report)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/research")
async def research(payload: ResearchRequest) -> dict[str, Any]:
    topic = payload.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required")

    try:
        loop = asyncio.get_running_loop()
        state = await loop.run_in_executor(executor, run_research_pipleline, topic)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    sources = extract_sources(state)
    return {
        "topic": topic,
        "report": ensure_complete_report(state, sources),
        "feedback": clean_report_text(state.get("feedback", "")),
        "searchResult": state.get("search_result", ""),
        "scrapedContent": state.get("scraped_content", ""),
        "sources": sources,
    }
