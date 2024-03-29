const form = document.querySelector("form");
const promptButton = document.querySelector("input[type=button]");
const promptInput = document.querySelector("input[type=text]");
const chatWindow = document.querySelector(".chat-window");
const responseContainer = document.querySelector(".response-container");

const ENDPOINT_URL =
    "https://europe-west2-millzbot.cloudfunctions.net/handle_frontend_request";

promptButton.addEventListener("click", () => {
    promptInput.style.display = "inline-block";
    promptButton.style.display = "none";
    promptInput.focus();
});

const addBubble = (bubbleClass, text) => {
    const newBubble = document.createElement("p");
    newBubble.className = bubbleClass;
    newBubble.innerHTML = text;

    setTimeout(
        () => {
            responseContainer.appendChild(newBubble);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        },
        bubbleClass.includes("loading-indicator") ? 500 : 0
    );

    if (bubbleClass === "response") {
        document.querySelector(".response.loading-indicator")?.remove();
        form.removeAttribute("disabled");

        if (!document.hasFocus()) {
            document.title = "millzbot has replied";
            window.addEventListener("focus", (e) => {
                setTimeout(() => (document.title = "millzbot"), 500);
            });
        }
    }
};

form.onsubmit = async (event) => {
    event.preventDefault();
    form.setAttribute("disabled", true);

    if (promptInput.value) {
        addBubble("prompt", promptInput.value);
    } else {
        promptInput.style.display = "none";
        promptButton.style.display = "inline-block";
        promptInput.focus();
    }

    addBubble("response loading-indicator", "thinking");

    const requestBody = promptInput.value ? { prompt: promptInput.value } : {};

    promptInput.value = null;

    const longResponseTimeout = setTimeout(() => {
        addBubble("response", "I'm taking a while. Must be busy right now!");
    }, 60000);

    const request = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });
    const generatedText = await request.json();

    addBubble("response", generatedText);
    clearTimeout(longResponseTimeout);
};
