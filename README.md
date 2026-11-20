🌸 Asha Voice Care

A Multilingual Voice Assistant for ASHA Healthcare Workers

📌 About the Project

Asha Voice Care is a voice-based assistant concept designed to support ASHA (Accredited Social Health Activist) workers through multilingual communication.

It aims to make health information easier to access using voice interaction in Indian languages.

❗ Problem Statement

ASHA workers may face challenges when accessing digital health information, particularly due to language barriers and complex interfaces.

💡 Proposed Solution

Asha Voice Care provides a simple interface where users can:

- Select their preferred language.
- Speak using a microphone.
- Type questions.
- Receive spoken demonstration responses.

✨ Current Features

- English, Hindi and Kannada language options.
- Browser-based speech recognition (where supported).
- Text-to-speech responses.
- Simple and responsive user interface.
- Node.js and Express backend.

🛠️ Technology Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- Browser Speech Recognition and Speech Synthesis APIs

## 🏗️ Project Architecture

```mermaid
flowchart TD
    A[ASHA Worker] --> B[Web Application]
    B --> C{Input Method}
    C --> D[Microphone]
    C --> E[Text Input]
    D --> F[Speech Recognition]
    F --> G[JavaScript Logic]
    E --> G
    G --> H[Demo Assistant Reply]
    H --> I[Display Response]
    H --> J[Speech Synthesis]
    J --> K[Voice Response]
    B --> L[Node.js and Express Server]


🚀 How to Run the Project

Prerequisites

- Node.js
- npm
- VS Code

Installation

1. Clone the repository:

git clone https://github.com/akhileshkh28032007-ops/asha-voice-care.git

2. Open the project folder:

cd asha-voice-care

3. Install dependencies:

npm install

4. Start the server:

npm start

5. Open your browser:

http://localhost:5000

🔌 Gnani API Integration

Gnani API integration is planned for multilingual voice capabilities.

Integration status: Pending API access and official documentation.

The current prototype uses browser speech recognition and speech synthesis. It does not yet connect to Gnani APIs.

🔒 Safety Notice

This prototype is intended for demonstration and health-information support concepts only. It does not diagnose conditions or replace qualified medical professionals.

👨‍💻 Project Status

Prototype development in progress.

📄 License

This project is developed for hackathon demonstration purposes.