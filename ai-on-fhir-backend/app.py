from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from collections import Counter

app = Flask(__name__)
CORS(app)

nlp = spacy.load("en_core_web_sm")

# Known medical conditions (English + Spanish)
CONDITION_MAP = {
    "diabetes": "diabetes",
    "asthma": "asthma",
    "hypertension": "hypertension",
    "cancer": "cancer",
    "obesity": "obesity",
    "obesidad": "obesity",
    "cáncer": "cancer",
    "asma": "asthma",
    "hipertensión": "hypertension"
}

# Operator keywords in English and Spanish
OVER_WORDS = ["over", "older", "greater", "above", "mayores", "más", "mas"]
UNDER_WORDS = ["under", "younger", "less", "below", "menores"]

def extract_info(query):
    query_lower = query.lower()
    doc = nlp(query_lower)

    age = None
    operator = None
    condition = None

    tokens = [token.text.lower() for token in doc]

    for i, token in enumerate(tokens):
        if token in OVER_WORDS and i + 1 < len(tokens):
            operator = "over"
            try:
                age = int(tokens[i + 1])
                break
            except ValueError:
                continue
        elif token in UNDER_WORDS and i + 1 < len(tokens):
            operator = "under"
            try:
                age = int(tokens[i + 1])
                break
            except ValueError:
                continue

    for word in tokens:
        if word in CONDITION_MAP:
            condition = CONDITION_MAP[word]
            break

    return {"age": age, "condition": condition, "operator": operator}

def simulate_fhir_response(parsed):
    from collections import Counter

    all_patients = [
    {"name": "Alice Johnson", "age": 62, "condition": "cancer"},
    {"name": "Bob Lee", "age": 70, "condition": "cancer"},
    {"name": "Carla Singh", "age": 53, "condition": "cancer"},
    {"name": "David Nguyen", "age": 67, "condition": "hypertension"},
    {"name": "Esha Patel", "age": 59, "condition": "asthma"},
    {"name": "Felix Wang", "age": 45, "condition": "obesity"},
    {"name": "Gina Torres", "age": 38, "condition": "diabetes"},
    {"name": "Hector Silva", "age": 29, "condition": "asthma"},
    {"name": "Irene Kim", "age": 64, "condition": "cancer"},
    {"name": "Jason Park", "age": 72, "condition": "cancer"},
    {"name": "Kelly Brown", "age": 48, "condition": "cancer"},
    {"name": "Luis Romero", "age": 51, "condition": "hypertension"},
    {"name": "Maria Lopez", "age": 60, "condition": "diabetes"},
    {"name": "Nina Shah", "age": 57, "condition": "cancer"},
    {"name": "Omar Malik", "age": 66, "condition": "cancer"}
]


    age = parsed.get("age")
    operator = parsed.get("operator")
    target_condition = parsed.get("condition")

    # Filter patients based on age
    if age is not None and operator:
        if operator == "over":
            filtered = [p for p in all_patients if p["age"] > age]
        elif operator == "under":
            filtered = [p for p in all_patients if p["age"] < age]
        else:
            filtered = all_patients
    else:
        filtered = all_patients

    # Further filter by condition if present
    if target_condition:
        filtered = [p for p in filtered if p["condition"] == target_condition]

    # Build FHIR-like response
    entries = []
    for i, p in enumerate(filtered):
        entries.append({
            "resource": {
                "resourceType": "Patient",
                "id": str(i+1).zfill(3),
                "name": [{"given": [p["name"].split()[0]], "family": p["name"].split()[1]}],
                "age": p["age"],
                "condition": p["condition"]
            }
        })

    # Build condition count
    condition_counts = Counter([p["condition"] for p in filtered])
    chart_data = [{"label": cond, "value": count} for cond, count in condition_counts.items()]

    # Build age distribution
    age_dist = Counter([p["age"] for p in filtered])
    age_distribution = [{"label": str(age), "value": count} for age, count in sorted(age_dist.items())]

    return {
        "resourceType": "Bundle",
        "type": "searchset",
        "entry": entries,
        "chart_data": chart_data,
        "age_distribution": age_distribution
    }
    all_patients = [
        {"name": "Alice Johnson", "age": 62, "condition": "cancer"},
        {"name": "Bob Lee", "age": 70, "condition": "cancer"},
        {"name": "Carla Singh", "age": 53, "condition": "cancer"},
        {"name": "David Nguyen", "age": 67, "condition": "hypertension"},
        {"name": "Esha Patel", "age": 59, "condition": "asthma"},
        {"name": "Felix Wang", "age": 45, "condition": "obesity"},
        {"name": "Gina Torres", "age": 38, "condition": "diabetes"},
        {"name": "Hector Silva", "age": 29, "condition": "asthma"},
    ]

    age = parsed.get("age")
    operator = parsed.get("operator")
    target_condition = parsed.get("condition")

    # Filter patients based on age
    if age is not None and operator:
        if operator == "over":
            filtered = [p for p in all_patients if p["age"] > age]
        elif operator == "under":
            filtered = [p for p in all_patients if p["age"] < age]
        else:
            filtered = all_patients
    else:
        filtered = all_patients

    # Further filter by condition if present
    if target_condition:
        filtered = [p for p in filtered if p["condition"] == target_condition]

    # Build FHIR-like response
    entries = []
    for i, p in enumerate(filtered):
        entries.append({
            "resource": {
                "resourceType": "Patient",
                "id": str(i+1).zfill(3),
                "name": [{"given": [p["name"].split()[0]], "family": p["name"].split()[1]}],
                "age": p["age"],
                "condition": p["condition"]
            }
        })

    # Count condition distribution in filtered patients (for chart)
    condition_counts = Counter([p["condition"] for p in filtered])
    chart_data = [{"label": cond, "value": count} for cond, count in condition_counts.items()]

    return {
        "resourceType": "Bundle",
        "type": "searchset",
        "entry": entries,
        "chart_data": chart_data
    }

@app.route("/query", methods=["POST"])
def handle_query():
    data = request.get_json()
    query = data.get("query", "")
    parsed = extract_info(query)
    response = simulate_fhir_response(parsed)
    return jsonify({"parsed": parsed, "fhir_response": response})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
