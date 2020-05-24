import fetch from "node-fetch";
require("dotenv").config();

const modelEndpoint =
    process.env.CONTEXT !== "local"
        ? "https://gpt-tfsma6beea-ez.a.run.app/"
        : "http://0.0.0.0:8080";

const token = process.env.REQUEST_TOKEN;

exports.handler = async function (event) {
    const options = await event.body;
    const parsedOptions = JSON.parse(options);

    let response;

    try {
        const request = await fetch(modelEndpoint, {
            method: "POST",
            body: JSON.stringify({
                token,
                ...parsedOptions
            })
        });

        const requestData = await request.json();
        const generatedText = await requestData.text;

        response =
            generatedText.length !== 0
                ? JSON.stringify(generatedText)
                : "I don't know what to say to that";
    } catch (err) {
        response = "I'm literally actually having an error right now: " + err;
    }

    return {
        statusCode: 200,
        body: response
    };
};
