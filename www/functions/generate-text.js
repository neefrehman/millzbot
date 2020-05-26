import fetch from "node-fetch";
require("dotenv").config();

const modelEndpoint =
    process.env.LOCATION_CONTEXT !== "local"
        ? "https://gpt-tfsma6beea-ez.a.run.app/"
        : "http://0.0.0.0:8080";

const token = process.env.REQUEST_TOKEN;

const timeoutPromise = (ms, promise) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error("request timeout :—)"));
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    });
};

exports.handler = async function (event) {
    const options = await event.body;
    const parsedOptions = JSON.parse(options);

    let response;

    try {
        const request = await timeoutPromise(
            90000,
            fetch(modelEndpoint, {
                method: "POST",
                body: JSON.stringify({
                    token,
                    ...parsedOptions
                })
            })
        );

        const requestData = await request.json();
        const generatedText = await requestData.text;

        response = JSON.stringify(generatedText);
    } catch (err) {
        response = "I'm literally actually having an error right now: " + err;
    }

    return {
        statusCode: 200,
        body: response
    };
};
