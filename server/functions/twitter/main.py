# This article will help guide you through wiritng a serverless Twitterbot with python and GCP:
# https://www.cookieshq.co.uk/posts/how-to-build-a-serverless-twitter-bot-with-python-and-google-cloud

import os
import requests
import tweepy
from dotenv import load_dotenv

load_dotenv()
CONSUMER_KEY = os.environ.get('CONSUMER_KEY', None)
CONSUMER_SECRET = os.environ.get('CONSUMER_SECRET', None)
ACCESS_KEY = os.environ.get('ACCESS_KEY', None)
ACCESS_SECRET = os.environ.get('ACCESS_SECRET', None)

assert all([CONSUMER_KEY, CONSUMER_SECRET, ACCESS_KEY, ACCESS_SECRET]
           ), "Not all Twitter tokens have been specified."

MODEL_ENDPOINT = 'https://gpt-tfsma6beea-ez.a.run.app/'
REQUEST_TOKEN = os.environ.get('REQUEST_TOKEN', None)


def setup_api():
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
    return tweepy.API(auth)


def handle_post_tweet(data):
    api = setup_api()

    req = requests.post(MODEL_ENDPOINT, json={'token': REQUEST_TOKEN})
    text = req.json()['text']
    truncated_text = (text[:280]) if len(text) >= 280 else text

    status = api.update_status(status=truncated_text)

    return 'Tweet Posted'
