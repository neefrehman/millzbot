const form = document.querySelector("form");
const promptButton = document.querySelector("input[type=button]");
const promptInput = document.querySelector("input[type=text]");
const chatWindow = document.querySelector(".chat-window");
const responseContainer = document.querySelector(".response-container");

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
        document.querySelector(".response.loading-indicator").remove();
        form.removeAttribute("disabled");
    }
};

const endpoint_url = "http://0.0.0.0:8080"; // TODO url

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

    const request = await fetch(endpoint_url, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(requestBody)
    });
    const generatedText = await request.json();
    console.log(generatedText);

    addBubble("response", generatedText);
};
