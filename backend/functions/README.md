# Middleware API

The functions in this folder act as middleware API layers to connect the model to various other services (Twitter, Slack, and a website for the bot).

These are each deployed as [Google Cloud Functions](https://cloud.google.com/functions) in a 'serverless' fashion, requiring very little overhead to run.