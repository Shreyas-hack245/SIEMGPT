from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def generate_query_with_ai(user_input, history):

    messages = [
        {
            "role": "system",
            "content": """
            You are an AI-powered cybersecurity SIEM assistant.
            Convert investigation requests into Elasticsearch DSL queries.
            Maintain conversational context.
            Return only Elasticsearch JSON query.
            """
        }
    ]

    messages.extend(history)

    messages.append({
        "role": "user",
        "content": user_input
    })

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0
    )

    return response.choices[0].message.content