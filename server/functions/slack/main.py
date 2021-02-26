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
SLACK_BOT_USER_TOKEN = os.environ["SLACK_BOT_USER_TOKEN"]
SLACK_SIGNING_SECRET = os.environ["SLACK_SIGNING_SECRET"]
SLACK_CLIENT_ID = os.environ["SLACK_CLIENT_ID"]
SLACK_CLIENT_SECRET = os.environ["SLACK_CLIENT_SECRET"]
REQUEST_TOKEN = os.environ["REQUEST_TOKEN"]
MODEL_ENDPOINT = os.environ["MODEL_ENDPOINT"]
STAGE = os.environ.get("STAGE", None)

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

    # Respond quickly to slack retry attempts to stop them coming, since generating text takes ages
    # https://github.com/slackapi/python-slackclient/issues/335
    if "X-Slack-Retry-Num" in request.headers:
        return form_response(200, "OK")

    # Verify Slack signature. Seems to work OK but can't print the boolean result 🤔
    if STAGE is "prod":
        if not signature_verifier.is_valid_request(request.get_data(), request.headers):
            return form_response(403, {"Error": "Bad Request Signature"})

    parsed_request = request.get_json(silent=True)

    # Respond to slack challenge. Only needed at initial authentication
    if "challenge" in parsed_request:
        return form_response(200, {"challenge": parsed_request["challenge"]})

    slack_event = parsed_request["event"]

    if slack_event["type"] == "app_mention":
        input_text = slack_event["text"]
        channel_id = slack_event["channel"]
        bot_name = "<@U015GFAC2AE>"
        # ^This was tricky to find. I had to change this script to get millzbot to respond with:
        # input_text.replace("<@", "")) to get the bot name without Slack's formatting

        prompt_text = input_text.replace(bot_name, "")
        prompt_text = "<|startoftext|>" if len(
            prompt_text) <= 3 else prompt_text

        req = requests.post(MODEL_ENDPOINT, json={
                            "token": REQUEST_TOKEN, "prompt": prompt_text})
        text = req.json()["text"]
        response_text = (text[:350]) if len(text) >= 350 else text

        response = slack_client.chat_postMessage(
            channel=channel_id,
            text=response_text)

    return form_response(200, "OK")
