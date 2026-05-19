conversation_history = []

def save_message(role, content):

    conversation_history.append({
        "role": role,
        "content": content
    })

def get_conversation_history():

    return conversation_history 