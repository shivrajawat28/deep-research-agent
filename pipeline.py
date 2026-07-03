import re

from agents import build_reader_agent, build_search_agent, writer_chain, critic_chain
from tools import scrape_url


def extract_first_url(text: str) -> str | None:
    match = re.search(r"https?://[^\s)>\]]+", text)
    if not match:
        return None
    return match.group(0).rstrip(".,;:")

def run_research_pipleline(topic: str) -> dict:
    state = {}

    #search agent working
    print("\n"+" = "* 50)
    print("Step 1 - Search agent is working")
    
    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages": [("user", f"Find recent, reliable and detailed information about {topic}.")]
    })

    state['search_result'] = search_result['messages'][-1].content

    print("\n search result", state['search_result'])


    #reader agent
    print("\n"+" = "* 50)
    print("Step 2 - Reader agent is working")

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user",
            f"Based on the following search results about '{topic}', "
            f"pick the most relevant URL and scrape it for deeper content. "
            f"Return the scraped article text, not only the URL. \n\n"
            f"Search Result: \n{state['search_result']}"
        )]
    })
    state['scraped_content'] = reader_result['messages'][-1].content

    url_to_scrape = extract_first_url(state['scraped_content']) or extract_first_url(state['search_result'])
    if url_to_scrape and len(state['scraped_content']) < 1500:
        state['scraped_content'] = scrape_url.invoke({"url": url_to_scrape})

    print("\nscraped content", state['scraped_content'])

    #writer-chain
    print("\n"+" = "* 50)
    print("Step 3 - Writer is drafting the report")

    research_combined = (
        f"SEARCH RESULTS:\n{state['search_result']}\n\n"
        f"DETAILED SCRAPED CONTENT:\n{state['scraped_content']}"
    )

    state['report'] = writer_chain.invoke({
        "topic": topic,
        "research": research_combined
    })

    print("\n Final Report \n", state['report'])


    #critic report
    print("\n"+" = "* 50)
    print("Step 4 - Critic is reviewing the report")
    state['feedback'] = critic_chain.invoke({
        "report": state['report']
    })

    print("\n critic report \n", state['feedback'])

    return state


if __name__ == "__main__":
    topic = input("\n Enter a research topic: ")
    run_research_pipleline(topic)
