const form = document.querySelector("form");
const promptButton = document.querySelector("input[type=button]");
const promptInput = document.querySelector("input[type=text]");
const responseContainer = document.querySelector(".response-container");

promptButton.addEventListener("click", () => {
    promptInput.style.display = "inline-block";
    promptButton.style.display = "none";
    promptInput.focus();
});

const addBubble = (style, text) => {
    const newBubble = document.createElement("p");
    newBubble.className = style;
    newBubble.innerHTML = text;
    setTimeout(
        () => {
            responseContainer.appendChild(newBubble);
            newBubble.scrollIntoView(false);
        },
        style.includes("loading-indicator") ? 500 : 0
    );

    if (style === "response") {
        document.querySelector(".response.loading-indicator").remove();
        form.removeAttribute("disabled");
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

    const request = await fetch("/.netlify/functions/generate-text", {
        method: "POST",
        body: JSON.stringify(requestBody)
    });
    const generatedText = await request.json();

    addBubble("response", generatedText);
};
