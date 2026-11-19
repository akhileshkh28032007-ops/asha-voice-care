const micButton = document.getElementById("micButton");
const sendButton = document.getElementById("sendButton");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");
const statusText = document.getElementById("status");
const language = document.getElementById("language");

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition;

function addMessage(text, type) {
  const message = document.createElement("p");
  message.className = type;
  message.textContent = text;
  messages.appendChild(message);
}

function assistantReply() {
  const reply =
    "Thank you for sharing. This is a demonstration version. " +
    "Please contact a qualified healthcare worker for medical guidance.";

  addMessage(reply, "bot");

  if ("speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance(reply);
    speech.lang = language.value;
    window.speechSynthesis.speak(speech);
  }
}

function sendMessage(text) {
  const question = text.trim();

  if (!question) return;

  addMessage(question, "user");
  userInput.value = "";

  assistantReply();
}

sendButton.addEventListener("click", () => {
  sendMessage(userInput.value);
});

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage(userInput.value);
  }
});

if (!SpeechRecognition) {
  statusText.textContent =
    "Voice recognition is not supported in this browser. Try Chrome.";

  micButton.disabled = true;
} else {
  recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = language.value;

  micButton.addEventListener("click", () => {
    recognition.lang = language.value;

    try {
      recognition.start();
      statusText.textContent = "Listening... Speak now!";
    } catch (error) {
      statusText.textContent =
        "Please wait and try the microphone again.";
    }
  });

  recognition.onresult = (event) => {
    const transcript =
      event.results[0][0].transcript;

    statusText.textContent = "Voice received!";
    sendMessage(transcript);
  };

  recognition.onerror = (event) => {
    statusText.textContent =
      "Microphone error: " + event.error;
  };

  recognition.onend = () => {
    if (statusText.textContent === "Listening... Speak now!") {
      statusText.textContent = "Tap the microphone to speak again.";
    }
  };
}

language.addEventListener("change", () => {
  if (recognition) {
    recognition.lang = language.value;
  }
});