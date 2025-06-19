import requests

url = "http://127.0.0.1:5000/query"
data = {
    "query": "Show me all diabetic patients over 50"
}

response = requests.post(url, json=data)
print(response.json())
