import os
import json
import requests
from flask import jsonify
from dotenv import load_dotenv

load_dotenv()
REQUEST_TOKEN = os.environ["REQUEST_TOKEN"]
MODEL_ENDPOINT = os.environ["MODEL_ENDPOINT"]

def handle_frontend_request(request):
    # Handle CORS headers for initial options request
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600"
        }
        return ("", 204, headers)

    # Set CORS headers for the main request
    headers = {
        "Access-Control-Allow-Origin": "*"
    }

    parsed_request = request.get_json(silent=True)
    prompt_text = parsed_request["prompt"] if "prompt" in parsed_request else "<|startoftext|>"

    req = requests.post(MODEL_ENDPOINT, json={"token": REQUEST_TOKEN, "prompt": prompt_text})  
    response_text = req.json()["text"]

    return (jsonify(response_text), 200, headers)