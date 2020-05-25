# These guides were helpful for building a serverless pyhton function with the slack API:
# https://chatbotslife.com/write-a-serverless-slack-chat-bot-using-aws-e2d2432c380e
# https://github.com/slackapi/python-slackclient

import os
import requests
import json
from flask import jsonify
from slack import WebClient
from slack.signature import SignatureVerifier
from dotenv import load_dotenv

load_dotenv()
SLACK_BOT_USER_TOKEN=os.environ["SLACK_BOT_USER_TOKEN"]
SLACK_SIGNING_SECRET = os.environ["SLACK_SIGNING_SECRET"]
SLACK_CLIENT_ID = os.environ["SLACK_CLIENT_ID"]
SLACK_CLIENT_SECRET = os.environ["SLACK_CLIENT_SECRET"]
REQUEST_TOKEN = os.environ["REQUEST_TOKEN"]
STAGE = os.environ.get("STAGE", None)

MODEL_ENDPOINT = "https://gpt-tfsma6beea-ez.a.run.app/"
SLACK_URL = "https://slack.com/api/chat.postMessage"

slack_client = WebClient(token=SLACK_BOT_USER_TOKEN)
signature_verifier = SignatureVerifier(os.environ["SLACK_SIGNING_SECRET"])

def form_response(status_code, body):
    return jsonify({
        "isBase64Encoded": True,
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": body
    })

def handle_slack_request(request):
    if request.method != "POST":
        return form_response(405, {"Error": "only POST requests are accepted"})

    if STAGE is "prod":
        if not signature_verifier.is_valid_request(request.get_data(), request.headers):
            return form_response(400, {"Error": "Bad Request Signature"})

    parsed_request = request.get_json(silent=True)

    if "challenge" in parsed_request:
        return form_response(200, {"challenge": parsed_request["challenge"]})

    slack_event = parsed_request["event"]

    if slack_event["type"] == "app_mention":
        input_text = slack_event["text"]
        channel_id = slack_event["channel"]

        # prompt_text = input_text.replace("<@millzbot>", "")

        # req = requests.post(MODEL_ENDPOINT, json={"token": REQUEST_TOKEN, "prompt": prompt_text})  
        # text = req.json()["text"]
        
        # generated_text = "I literally actually couldn't come up with a response to that" if len(text) == 0 else text

        response = slack_client.chat_postMessage(
            channel=channel_id,
            text=input_text.replace("<@A0147PCH0GK>", "")) # TODO: swap

    return form_response(200, "OK")