import express from "express";
import { generateApplication } from "../ai/generateApplication.js";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebase.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const data = req.body;
    const text = await generateApplication(data);

    // Når AI virker, kan vi slå Firestore til igen
    // const docRef = await addDoc(collection(db, "applications"), {
    //   ...data,
    //   generatedText: text,
    //   timestamp: serverTimestamp(),
    // });

    res.json({ text });
  } catch (error) {
    console.error("Fejl i /api/generate:", error);

    res.status(500).json({
      error:
        error?.message ||
        error?.error?.message ||
        "Ukendt fejl fra backend / OpenAI",
    });
  }
});

export default router;
