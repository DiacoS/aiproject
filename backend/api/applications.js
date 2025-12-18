import express from "express";
import { generateApplication } from "../ai/generateApplication.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const data = req.body;

    // 🔹 generateApplication returnerer nu { text, meta }
    const result = await generateApplication(data);
    const text = result.text;
    const meta = result.meta;

    const docRef = await addDoc(collection(db, "applications"), {
      ...data,
      generatedText: text,
      meta,                               // ✅ gem meta
      timestamp: serverTimestamp(),
      uid: data.uid || null,
    });

    res.json({ text, id: docRef.id, meta }); // ✅ send meta til frontend
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


// Endpoint til at gemme en eksisterende ansøgning
router.post("/save", async (req, res) => {
  try {
    const { uid, fullName, jobTitle, companyName, generatedText, cvId, cvFilename } = req.body;

    if (!uid || !generatedText) {
      return res.status(400).json({ error: "Manglende påkrævede felter" });
    }

    const docRef = await addDoc(collection(db, "applications"), {
      uid,
      fullName,
      jobTitle,
      companyName,
      generatedText,
      cvId: cvId || null,
      cvFilename: cvFilename || null,
      timestamp: serverTimestamp(),
    });

    res.json({ id: docRef.id, message: "Ansøgning gemt" });
  } catch (error) {
    console.error("Fejl i /api/save:", error);
    res.status(500).json({
      error: error?.message || "Fejl ved gemning af ansøgning",
    });
  }
});

export default router;
