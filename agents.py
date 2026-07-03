from langchain.agents import create_agent
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search, scrape_url
from rich import print
import os
from dotenv import load_dotenv

load_dotenv()

llm_endpoint = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_KEY"),
    max_new_tokens=2500,
)

#llm
llm = ChatHuggingFace(
    llm=llm_endpoint,
    temperature=0
)

#first agent
def build_search_agent():
    return create_agent(
        model = llm,
        tools = [web_search]
    )

#second agent
def build_reader_agent():
    return create_agent(
        model = llm,
        tools = [scrape_url]
    )


#LCEL pipeline
writer_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert research writer. Write complete, clear, structured and insightful reports. Never stop mid-sentence. Finish every requested section."),
    ("human", """Write a detailed research report on the topic below.

Topic: {topic}

Research Gathered:
{research}

Structure the report as:
- Introduction
- Key Findings (minimum 3 well-explained points)
- Detailed Analysis
- Summary Bullet Points (5 concise bullets)
- Conclusion
- Sources (list all URLs found in the research)
- One Line Verdict

Important:
- Complete the full report.
- Do not end with a broken markdown link or half-written source.
- Do not include implementation notes like [:3000], truncation markers, or internal limits.
- Keep sources as complete markdown links.

Be detailed, factual and professional."""),
])

writer_chain = writer_prompt | llm | StrOutputParser()

#critic_chain 
critic_prompt = ChatPromptTemplate.from_messages([
     ("system", "You are a sharp and constructive research critic. Be honest and specific."),
    ("human", """Review the research report below and evaluate it strictly.

Report:
{report}

Respond in this exact format:

Score: X/10

Strengths:
- ...
- ...

Areas to Improve:
- ...
- ...

One line verdict:
..."""),
])

critic_chain = critic_prompt | llm | StrOutputParser()
