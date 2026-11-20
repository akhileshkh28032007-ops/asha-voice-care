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

// Display messages
function addMessage(text, type) {
  const message = document.createElement("p");
  message.className = type;
  message.textContent = text;
  messages.appendChild(message);
}

// Find the topic
function getReply(question) {
  const lang = language.value;
  const q = question.toLowerCase();

  const topics = {
    pregnancy: [
      "pregnancy", "pregnant", "antenatal",
      "ಗರ್ಭಿಣಿ", "ಗರ್ಭಾವಸ್ಥೆ", "गर्भवती", "गर्भावस्था"
    ],
    nutrition: [
      "nutrition", "food", "diet",
      "ಆಹಾರ", "ಪೌಷ್ಟಿಕ", "पोषण", "खाना"
    ],
    child: [
      "child", "baby", "growth",
      "ಮಗು", "ಮಕ್ಕಳು", "ಬೆಳವಣಿಗೆ", "बच्चा", "बच्चे"
    ],
    vaccine: [
      "vaccine", "vaccination", "immunization",
      "ಲಸಿಕೆ", "टीका", "टीकाकरण"
    ],
    hygiene: [
      "hygiene", "clean", "sanitation", "handwash",
      "ಸ್ವಚ್ಛತೆ", "ಕೈ ತೊಳೆಯಿರಿ", "सफाई", "स्वच्छता"
    ],
    newborn: [
      "newborn", "new born", "birth",
      "ನವಜಾತ", "ಹುಟ್ಟಿದ ಮಗು", "नवजात", "नवजात शिशु"
    ],
    help: [
      "danger", "emergency", "doctor", "hospital", "health worker",
      "ಅಪಾಯ", "ತುರ್ತು", "ವೈದ್ಯ", "ಆಸ್ಪತ್ರೆ",
      "खतरा", "आपातकाल", "डॉक्टर", "अस्पताल"
    ]
  };

  let topic = "general";

  for (const [name, words] of Object.entries(topics)) {
    if (words.some(word => q.includes(word))) {
      topic = name;
      break;
    }
  }

  const replies = {
    "en-IN": {
      pregnancy:
        "Pregnancy awareness: Encourage regular antenatal checkups, follow health worker guidance and attend scheduled appointments.",
      nutrition:
        "Nutrition awareness: Encourage a balanced diet, safe drinking water and locally available nutritious foods.",
      child:
        "Child health: Encourage regular growth monitoring, age-appropriate nutrition and visits to the local health centre.",
      vaccine:
        "Immunization awareness: Follow the official government immunization schedule. Contact your local health centre for vaccination details.",
      hygiene:
        "Hygiene awareness: Wash hands with soap, use safe drinking water and maintain clean surroundings.",
      newborn:
        "Newborn care: Encourage early breastfeeding, warmth, clean care and timely newborn checkups. Seek advice from a qualified health professional.",
      help:
        "Health support: If someone has a serious or worrying health concern, contact a qualified healthcare professional or visit a health facility promptly. For emergencies in India, call 112.",
      general:
        "Welcome to Asha Voice Care! I can share general information about pregnancy, nutrition, child health, immunization, hygiene, newborn care and health support."
    },

    "hi-IN": {
      pregnancy:
        "गर्भावस्था: नियमित प्रसवपूर्व जांच करवाएं और स्वास्थ्यकर्मी की सलाह का पालन करें।",
      nutrition:
        "पोषण: संतुलित आहार लें, सुरक्षित पानी पिएं और पौष्टिक स्थानीय खाद्य पदार्थ खाएं।",
      child:
        "बाल स्वास्थ्य: बच्चों की नियमित वृद्धि जांच करवाएं और स्थानीय स्वास्थ्य केंद्र से संपर्क रखें।",
      vaccine:
        "टीकाकरण: सरकारी टीकाकरण कार्यक्रम का पालन करें। जानकारी के लिए स्थानीय स्वास्थ्य केंद्र से संपर्क करें।",
      hygiene:
        "स्वच्छता: साबुन से हाथ धोएं, सुरक्षित पानी पिएं और आसपास सफाई रखें।",
      newborn:
        "नवजात शिशु की देखभाल: स्तनपान, बच्चे को गर्म रखना और नियमित जांच करवाना महत्वपूर्ण है। स्वास्थ्यकर्मी की सलाह लें।",
      help:
        "स्वास्थ्य सहायता: गंभीर स्वास्थ्य समस्या होने पर योग्य स्वास्थ्यकर्मी या अस्पताल से तुरंत संपर्क करें। भारत में आपातकाल के लिए 112 पर कॉल करें।",
      general:
        "नमस्ते! मैं गर्भावस्था, पोषण, बाल स्वास्थ्य, टीकाकरण, स्वच्छता और नवजात शिशु की देखभाल के बारे में सामान्य जानकारी दे सकती हूं।"
    },

    "kn-IN": {
      pregnancy:
        "ಗರ್ಭಾವಸ್ಥೆ: ನಿಯಮಿತ ಗರ್ಭಪೂರ್ವ ತಪಾಸಣೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ ಮತ್ತು ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರ ಸಲಹೆ ಅನುಸರಿಸಿ.",
      nutrition:
        "ಪೌಷ್ಟಿಕ ಆಹಾರ: ಸಮತೋಲಿತ ಆಹಾರ ಸೇವಿಸಿ, ಸುರಕ್ಷಿತ ಕುಡಿಯುವ ನೀರನ್ನು ಬಳಸಿ ಮತ್ತು ಪೌಷ್ಟಿಕ ಸ್ಥಳೀಯ ಆಹಾರ ಸೇವಿಸಿ.",
      child:
        "ಮಕ್ಕಳ ಆರೋಗ್ಯ: ಮಕ್ಕಳ ಬೆಳವಣಿಗೆಯನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸ್ಥಳೀಯ ಆರೋಗ್ಯ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      vaccine:
        "ಲಸಿಕೆ: ಸರ್ಕಾರದ ಅಧಿಕೃತ ಲಸಿಕಾ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಅನುಸರಿಸಿ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಸ್ಥಳೀಯ ಆರೋಗ್ಯ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      hygiene:
        "ಸ್ವಚ್ಛತೆ: ಸಾಬೂನಿನಿಂದ ಕೈ ತೊಳೆಯಿರಿ, ಸುರಕ್ಷಿತ ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಪರಿಸರವನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ.",
      newborn:
        "ನವಜಾತ ಶಿಶುವಿನ ಆರೈಕೆ: ಆರಂಭಿಕ ಸ್ತನ್ಯಪಾನ, ಮಗುವನ್ನು ಬೆಚ್ಚಗಿಡುವುದು ಮತ್ತು ನಿಯಮಿತ ತಪಾಸಣೆ ಮುಖ್ಯ. ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರ ಸಲಹೆ ಪಡೆಯಿರಿ.",
      help:
        "ಆರೋಗ್ಯ ಸಹಾಯ: ಗಂಭೀರ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಇದ್ದರೆ ಅರ್ಹ ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರನ್ನು ಅಥವಾ ಆಸ್ಪತ್ರೆಗೆ ತಕ್ಷಣ ಸಂಪರ್ಕಿಸಿ. ಭಾರತದಲ್ಲಿ ತುರ್ತು ಪರಿಸ್ಥಿತಿಗೆ 112 ಕರೆ ಮಾಡಿ.",
      general:
        "ನಮಸ್ಕಾರ! ಗರ್ಭಾವಸ್ಥೆ, ಪೌಷ್ಟಿಕ ಆಹಾರ, ಮಕ್ಕಳ ಆರೋಗ್ಯ, ಲಸಿಕೆ, ಸ್ವಚ್ಛತೆ ಮತ್ತು ನವಜಾತ ಶಿಶುವಿನ ಆರೈಕೆಯ ಬಗ್ಗೆ ಸಾಮಾನ್ಯ ಮಾಹಿತಿ ನೀಡಬಹುದು."
    }
  };

  return replies[lang]?.[topic] || replies["en-IN"].general;
}

// Text-to-speech
function speak(text) {
  if (!("speechSynthesis" in window)) {
    statusText.textContent = "Speech output is not supported.";
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = language.value;
  speech.rate = 0.9;

  const voices = window.speechSynthesis.getVoices();

  const voice = voices.find(v =>
    v.lang.toLowerCase().startsWith(
      language.value.slice(0, 2).toLowerCase()
    )
  );

  if (voice) {
    speech.voice = voice;
  }

  speech.onstart = () => {
    statusText.textContent = "Speaking...";
  };

  speech.onend = () => {
    statusText.textContent = "Ready";
  };

  speech.onerror = () => {
    statusText.textContent = "Voice may not be available for this language.";
  };

  window.speechSynthesis.speak(speech);
}

// Send message
function sendMessage(text) {
  const question = text.trim();

  if (!question) return;

  addMessage(question, "user");
  userInput.value = "";

  const reply = getReply(question);

  addMessage(reply, "bot");
  speak(reply);
}

// Send button
sendButton.addEventListener("click", () => {
  sendMessage(userInput.value);
});

// Enter key
userInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    sendMessage(userInput.value);
  }
});

// Microphone recognition
if (!SpeechRecognition) {
  statusText.textContent =
    "Voice recognition is not supported. Please try Chrome.";
  micButton.disabled = true;
} else {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  micButton.addEventListener("click", () => {
    recognition.lang = language.value;

    try {
      recognition.start();
      statusText.textContent = "Listening... Speak now!";
    } catch (error) {
      statusText.textContent = "Please wait and try again.";
    }
  });

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    statusText.textContent = "Voice received!";
    sendMessage(transcript);
  };

  recognition.onerror = event => {
    statusText.textContent = "Microphone error: " + event.error;
  };

  recognition.onend = () => {
    if (statusText.textContent === "Listening... Speak now!") {
      statusText.textContent = "Tap the microphone to speak again.";
    }
  };
}

// Language selection
language.addEventListener("change", () => {
  if (recognition) {
    recognition.lang = language.value;
  }

  window.speechSynthesis?.cancel();
  statusText.textContent = "Language changed.";
});