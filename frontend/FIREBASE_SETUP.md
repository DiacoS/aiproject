# Firebase Authentication Setup Guide

## 1. Aktiver Firebase Authentication

Du skal **IKKE** manuelt oprette en database. Firebase Authentication håndteres automatisk.

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Vælg dit projekt (truth-or-touch)
3. Gå til **Authentication** i venstre menu
4. Klik på **Get Started**
5. Vælg **Email/Password** som sign-in method
6. Aktiver **Email/Password** og klik **Save**

## 2. Konfigurer Environment Variabler

Du har allerede Firebase konfiguration i `backend/.env`. Du skal bare tilføje samme værdier til frontend.

### Option 1: Opret .env i frontend/ (anbefalet)

Opret en `.env` fil i `frontend/` mappen med samme værdier som i `backend/.env`, men med `VITE_` prefix:

```env
VITE_FIREBASE_API_KEY=samme-værdi-som-i-backend
VITE_FIREBASE_AUTH_DOMAIN=samme-værdi-som-i-backend
VITE_FIREBASE_PROJECT_ID=samme-værdi-som-i-backend
VITE_FIREBASE_STORAGE_BUCKET=samme-værdi-som-i-backend
VITE_FIREBASE_MESSAGING_SENDER_ID=samme-værdi-som-i-backend
VITE_FIREBASE_APP_ID=samme-værdi-som-i-backend
```

**Vigtigt:** Værdierne skal være IDENTISKE med dem i `backend/.env`, bare med `VITE_` prefix (fordi Vite kræver det for at eksponere variabler til browseren).

### Option 2: Brug fælles .env i roden (alternativ)

Du kan også oprette en `.env` fil i projektets rod og bruge den i begge mapper, men det kræver ekstra konfiguration.

### Hvorfor to .env filer?

- **Backend** bruger `process.env.FIREBASE_*` (Node.js)
- **Frontend** bruger `import.meta.env.VITE_FIREBASE_*` (Vite/browser)
- Begge skal have samme værdier, men forskellige navne pga. teknisk forskel

## 3. Test Login

1. Start frontend: `npm run dev`
2. Gå til login siden
3. Klik på "Opret konto" for at oprette en ny bruger
4. Eller log ind hvis du allerede har en konto

## Funktioner

- ✅ Email/Password login
- ✅ Opret ny konto
- ✅ Log ud
- ✅ Automatisk session management
- ✅ Fejlhåndtering med danske fejlbeskeder
