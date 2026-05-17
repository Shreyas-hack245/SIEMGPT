conversation_memory = []

def save_conversation(user_query, response):

    conversation_memory.append({
        "user_query": user_query,
        "response": response
    })

def get_conversation_history():

    return conversation_memory