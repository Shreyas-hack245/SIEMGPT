from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def generate_query_with_ai(user_input):

    prompt = f"""
    Convert the following cybersecurity investigation request
    into an Elasticsearch DSL query.

    User Request:
    {user_input}

    Return ONLY valid JSON query.
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a cybersecurity SIEM assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return response.choices[0].message.content