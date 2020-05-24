const { WebClient } = require("@slack/web-api");
const express = require("express");

const app = express();
const port = 5555;

const slackWebClient = new WebClient(process.env.SLACK_TOKEN);
const modelEndpoint = "https://gpt-tfsma6beea-ez.a.run.app/";
const REQUEST_TOKEN = os.environ.get('REQUEST_TOKEN') // TODO: fix

app.use(express.json());

app.post("/", async (req, res) => {
    const body = req.body;
    res.sendStatus(200);
    const slackChannelId = body.event.channel;

    if (body.event.type === "app_mention") {
        postResponseToSlack(body.event.text, slackChannelId);
    }
});

const postResponseToSlack = async (input, channel) => {
    const prompt = input.replace("<@millzbot>", "").trim();

    const textGenerationOptions = {
        token = REQUEST_TOKEN,
        length: 200,
        top_p: 0.9,
        prompt,
        include_prefix = false,
    }

    try {
        const generatedText = await fetch(modelEndpoint, {
            method: post,
            body: JSON.stringify(textGenerationOptions)
        });

        // The server retries once on empty text,
        // but the second try may still be empty with obscure prompts
        const responseText = generatedText.length !== 0 
            ? generatedText
            : "I literally actually couldn't come up with a response to that";

        await slackWebClient.chat.postMessage({
            text: responseText,
            channel: channel
        });
    } catch (e) {
        const errorMessages = [
            "I'm Literally actually having an error right now",
            "I'm not not having an error",
            "Request failed. Sinx must have shut me down"
        ];

        const randomErrorMessage =
            errorMessages[Math.floor(Math.random() * errorMessages.length)];

        await slackWebClient.chat.postMessage({
            text: randomErrorMessage,
            channel: channel
        });
    }
};