from dotenv import load_dotenv
from langchain.tools import tool
import requests
import os
from bs4 import BeautifulSoup
from tavily import TavilyClient
from rich import print
load_dotenv()

tavily = TavilyClient(api_key= os.getenv("TAVILY_API_KEY"))


#live web search tool
@tool
def web_search(query: str) -> str:
    """
    Search the web for the given query and give return and reliale topics. Return title urls and snippets of the query.
    """
    results = tavily.search(query = query, max_results = 3)
    
    out = []

    for r in results['results']:
        out.append(f"Title: {r['title']}\nURL: {r['url']}\nContent: {r['content']}\n")

    return "\n".join(out)


#beautiful soup tool
@tool
def scrape_url(url: str) -> str:
    """
    Scrape and return clean tex content from a given URL for deeper reading.
    """
    try:
        resp = requests.get(url, timeout = 8, headers = {"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", 'style', 'nav', 'footer']):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        return text[:12000]
    except Exception as e:
        return f"Could not scrape URL: {str(e)}"

