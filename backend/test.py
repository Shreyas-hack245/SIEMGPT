import requests
response = requests.post("http://127.0.0.1:8000/api/v1/chat", json={"message": "Investigate failed login attempts from the last 24 hours"})
print("Status Code:", response.status_code)
print("Response:", response.text)
