# Nexus: Tactical Disaster Response Grid

A cinematic, real-time disaster monitoring and response platform built with React, Tailwind CSS, and Firebase.

## 🚀 Getting Started

If you have exported this from Google AI Studio, follow these steps to get it running locally or on GitHub:

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Firebase Project (free tier works)

### 2. Firebase Setup (Required)
The application relies on Firebase for real-time data. To make it work:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named "Nexus-Grid".
3. Add a **Web App** to your project to get your configuration object.
4. Enable **Firestore Database** in production mode.
5. Enable **Google Authentication** in the "Authentication" section.

### 3. Connection Configuration
Create a file at `src/firebase-applet-config.json` (or update the one from export) with your credentials:
```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT.appspot.com",
  "messagingSenderId": "...",
  "appId": "...",
  "firestoreDatabaseId": "(default)"
}
```

### 4. Deploy Security Rules
Copy the content of `firestore.rules` from this repository and paste it into the **Rules** tab of your Firestore Database in the Firebase Console. This is critical for data access.

### 5. Local Development
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🛠 Features
- **Global Seismic Sync**: Real-time earthquake data via USGS API.
- **Orbital Weather Imagery**: Live weather telemetry and wind-speed alerts.
- **Neural History**: Log of tactical grid operations.
- **Core Overrides**: Simulation control for high-stress disaster scenarios.
- **Interactive 3D Elements**: CSS-based tactical globe and motion-enhanced UI components.

## 📡 Deployment
To host on GitHub Pages:
1. Install the gh-pages package: `npm install gh-pages --save-dev`
2. Add `homepage` to `package.json`.
3. Run `npm run deploy`.

---
*Note: This project was initially generated using Google AI Studio Build.*
