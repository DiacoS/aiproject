import express from "express";
import { generateApplication } from "../ai/generateApplication.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const data = req.body;
    const text = await generateApplication(data);

    // Gem i Firestore
    const docRef = await addDoc(collection(db, "applications"), {
      ...data,
      generatedText: text,
      timestamp: serverTimestamp()
    });

    res.json({ id: docRef.id, text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Noget gik galt" });
  }
});

export default router;
