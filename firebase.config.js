// Fælles Firebase konfiguration
// Denne fil indeholder Firebase konfigurationsstrukturen
// Brug denne som reference når du opretter .env filer

export const firebaseConfigTemplate = {
  apiKey: "din-api-key-her",
  authDomain: "din-project.firebaseapp.com",
  projectId: "din-project-id",
  storageBucket: "din-project.appspot.com",
  messagingSenderId: "din-sender-id",
  appId: "din-app-id"
};

// Backend bruger: process.env.FIREBASE_API_KEY (uden prefix)
// Frontend bruger: import.meta.env.VITE_FIREBASE_API_KEY (med VITE_ prefix)
// Men værdierne skal være IDENTISKE!

