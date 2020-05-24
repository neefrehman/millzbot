# Server-side code

This subdirectory contains the code to create a server that will run our GPT-2 model and respond to requests, as well as the middleware endpoints that will be making those requests — written as serverless functions (or lambdas).

## Deploying your model

For deploying the trained model to a server, I've closely followed Max Woolf's [GPT-2-cloud-run instructions](https://github.com/minimaxir/gpt-2-cloud-run), and you should to! I've included the `app.py` (with some modifiactions to the default parameters and logic for retrying if a response is blank) and `Dockerfile` from that repo in the `model` folder here to make it easier to start with the server. Once you've added your trained model (uncompressed) to that folder, the folder's structure should look something like this:

```bash
|____model
| |____checkpoint
| | |____run1
| | | |____lots-of-files.here
| |____Dockerfile
| |____app.py
```

Now that everything is in the right place, you'll need to create a free account and project on Google Cloud Platform to use [Cloud Run](https://cloud.google.com/run/), install [Docker](https://docs.docker.com/get-docker/) and the [Google Cloud SDK](https://cloud.google.com/sdk/docs), then build and push the the Docker container to Cloud Run using the code in [Max's instructions](https://github.com/minimaxir/gpt-2-cloud-run#how-to-build-the-container-and-start-cloud-run):

To build the image:

```shell
docker build . -t gpt2
```

You can now test your model locally by running the below command and then visiting http://0.0.0.0:8080. You should see generated text on the page!

```shell
docker run -p 8080:8080 --memory="2g" --cpus="1" gpt2
```

Then, tag and upload the image to the Google [Container Registry](https://console.cloud.google.com/kubernetes/images/list) (the name of the project you should have created in GCP will be your `[PROJECT_ID]`):

```shell
docker tag gpt2 gcr.io/[PROJECT-ID]/gpt2
docker push gcr.io/[PROJECT-ID]/gpt2
```

Once done (which will take a while!), deploy the uploaded image from the [Container Registry Dashboard](https://console.cloud.google.com/kubernetes/images/list) to [Cloud Run](https://console.cloud.google.com/run), and make sure to **Set 'Memory Allocated' to `2 GB` and 'Maximum Requests Per Container' to `1`**! In this step, you may also want to create an enviroment variable for the server called `REQUEST_TOKEN`. If you create this, requests won't be fulfilled unless the same token is passed as a parameter in any requests to the server, helping ensure your model isn't triggered by anything else (as the url is publicly accessible).

Once you've done this, you should be all set up with an API to interact with your model. Neat! The `app.py` that takes the requests and runs the model includes default parameters for text generation (like the ones we saw earlier when generating text in the Colaboratory notebook). These can be overriden by parameters sent in the body of the request via JSON. An example of a request that overrides these defaults with JavaScript could look like the following (where MODEL_ENDPOINT_URL is the url provided by Cloud Run to your hosted model):

```js
const getResponseFromModel = async () => {
    const textGenerationOptions = {
        length: 200,
        top_p: 0.9,
        prefix: prompt,
        include_prefix = false,
    }

    const generatedText = await fetch(MODEL_ENDPOINT_URL, {
        method: post,
        body: JSON.stringify(textGenerationOptions)
    });

    return generatedText;
};
```

## Middleware API

For this project I've also included some functions that act as a middleware API. These connect the model to the platforms that the bot will be interacting with (in this case, Twitter and Slack). I've done this to separate each platform's concerns and dependencies from one another. These are each deployed as [Google Cloud Functions](https://cloud.google.com/functions), and you can find them in the `api` folder.

For the demo website (found in the `/www` folder), I've also created a `generate-text.js` function, which is deployed along with the site to [Netlify Functions](https://docs.netlify.com/functions/configure-and-deploy/). This allows me to hide the `REQUEST_TOKEN` as an environment variable. If you're not using a token for validation, you can simply request text form the Cloud Run server directly from the client.