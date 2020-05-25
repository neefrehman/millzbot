from starlette.applications import Starlette
from starlette.responses import UJSONResponse
import gpt_2_simple as gpt2
import tensorflow as tf
import string
import uvicorn
import os
import gc

app = Starlette(debug=False)

sess = gpt2.start_tf_sess(threads=1)
gpt2.load_gpt2(sess)

# Needed to avoid cross-domain issues
response_header = {
    'Access-Control-Allow-Origin': '*'
}

REQUEST_TOKEN = os.environ.get('REQUEST_TOKEN', None)

generate_count = 0

@app.route('/', methods=['GET', 'POST', 'HEAD'])
async def homepage(request):
    global generate_count
    global sess

    if request.method == 'GET':
        params = request.query_params
    elif request.method == 'POST':
        params = await request.json()
    elif request.method == 'HEAD':
        return UJSONResponse({'text': ''},
                             headers=response_header)
    
    # Validate request token
    if REQUEST_TOKEN and params.get('token') != REQUEST_TOKEN:
        return UJSONResponse({'text': 'Incorrect request token.'},
                             headers=response_header)

    def generate_text():
        generated_text = gpt2.generate(sess,
                            length=int(params.get('length', 300)),
                            temperature=float(params.get('temperature', 0.9)),
                            top_p=float(params.get('top_p', 0.7)),
                            truncate=params.get('truncate', '<|endoftext|>'),
                            prefix=params.get('prompt', '<|startoftext|>')[:500],
                            include_prefix=str(params.get(
                             'include_prefix', False)).lower() == 'true',
                            return_as_list=True,
                            nsamples=int(params.get('count', 1)),
                            batch_size=int(params.get('count', 1))
                            )[0]
        return generated_text

    text = generate_text()

    # Retry once if returned text is empty (may happen with prompts)
    text = generate_text() if len(text) == 0 and '<|startoftext|>' not in text else text

    generate_count += 1
    if generate_count == 8:
        # Reload model to prevent Graph/Session from going OOM
        tf.reset_default_graph()
        sess.close()
        sess = gpt2.start_tf_sess(threads=1)
        gpt2.load_gpt2(sess)
        generate_count = 0

    gc.collect()
    return UJSONResponse({'text': text},
                         headers=response_header)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))