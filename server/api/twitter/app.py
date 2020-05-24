from starlette.applications import Starlette
from starlette.responses import UJSONResponse
import gpt_2_simple as gpt2
import uvicorn
import os
from random import uniform
import tweepy

# Twitter app configuration information: required
CONSUMER_KEY = os.environ.get('CONSUMER_KEY', None)
CONSUMER_SECRET = os.environ.get('CONSUMER_SECRET', None)
ACCESS_KEY = os.environ.get('ACCESS_KEY', None)
ACCESS_SECRET = os.environ.get('ACCESS_SECRET', None)

assert all([CONSUMER_KEY, CONSUMER_SECRET, ACCESS_KEY, ACCESS_SECRET]
           ), "Not all Twitter app config tokens have been specified."

# Request token: optional
REQUEST_TOKEN = os.environ.get('REQUEST_TOKEN', None)
MODEL_ENDPOINT = 'https://gpt-tfsma6beea-ez.a.run.app/'

app = Starlette(debug=False)

# Needed to avoid cross-domain issues
response_header = {
    'Access-Control-Allow-Origin': '*'
}

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)

api = tweepy.API(auth)


# @app.route('/', methods=['GET', 'POST', 'HEAD'])
# async def homepage(request):

#     if request.method == 'GET':
#         params = request.query_params
#     elif request.method == 'POST':
#         params = await request.json()
#     elif request.method == 'HEAD':
#         return UJSONResponse({'text': ''},
#                              headers=response_header)

#     # Validate request token
#     if REQUEST_TOKEN and params.get('token') != REQUEST_TOKEN:
#         return UJSONResponse({'text': 'Incorrect request token.'},
#                              headers=response_header)

#     while True:
#         # You can adapt this block for any text-generation method.
#         text = gpt2.generate(sess,
#                              length=300,
#                              temperature=uniform(0.7, 1.0),
#                              top_k=40,
#                              return_as_list=True
#                              )[0]

req = requests.post('MODEL_ENDPOINT',
                    json={'length': 100, 'temperature': 1.0})
                    
text = req.json()['text']
print(text)

if (len(text) > 0 and len(text) <= 280
        and '<|startoftext|>' not in text):
    break

transformed_text = (text[:280]) if len(text) > 280 else text

api.update_status(transformed_text)

return UJSONResponse({'text': 'Tweet successful!'},
                        headers=response_header)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))