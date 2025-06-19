import requests

url = "http://127.0.0.1:5000/query"
data = {
    "query": "Show cancer patients older than 45"
}

response = requests.post(url, json=data)
print(response.json())
