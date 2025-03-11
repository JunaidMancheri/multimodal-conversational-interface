# Multimodal User Interface

The Onboarding-User Client is a **multimodal user interface** designed to interact seamlessly with the AI-powered onboarding agent. Built with **React**, this client enables users to onboard using text, voice, and image inputs, ensuring an intuitive and accessible experience.

## Engineering & Technology Stack

The client application is designed to provide a **dynamic, interactive, and accessible** onboarding experience across multiple input modalities.

### **Architecture & Design**
- **Multimodal Interface** supporting text, voice, and image inputs.
- **Component-Based UI** using React for a modular and scalable front-end.
- **Real-Time Communication** with the AI agent via WebSockets & RESTful APIs.

### **Core Functionalities**
- **User Data Input & Interaction:**
  - Collects email, phone number, image, name, user type, and location.
  - Supports **speech-to-text (STT)** for voice-based onboarding.
  - **Text-to-speech (TTS)** for AI-generated responses, enabling conversational interaction.
  - Captures user images for **biometric authentication**.
- **Verification & Enrichment:**
  - **Phone verification** via Twilio OTP.
  - **Email verification** using Nodemailer.
  - **Location detection** via Google Maps API.
  - **Profile enrichment** using LinkedIn public data.

### **Technology Stack**
- **Frontend:** React
- **APIs & Communication:** WebSockets & REST APIs for interaction with the AI agent.
- **AI & NLP:** Google Gemini for natural language understanding and conversation.
- **Authentication & Security:**
  - Twilio for phone verification.
  - Nodemailer for email verification.
  - Google Cloud Storage for secure image storage.
- **Infrastructure & Hosting:** Deployed on Vercel for efficient scaling and performance.

The Onboarding-User Client delivers a **seamless, interactive, and secure** onboarding experience, ensuring smooth user engagement with the AI agent across multiple modalities.

