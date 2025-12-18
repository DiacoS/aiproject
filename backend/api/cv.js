import express from "express";
import OpenAI from "openai";
import puppeteer from "puppeteer";

const router = express.Router();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- PDF GENERATION ---
router.post("/cv/pdf", async (req, res) => {
    try {
        const { html } = req.body;
        if (!html) return res.status(400).json({ error: "Missing html" });

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "14mm", right: "14mm", bottom: "14mm", left: "14mm" },
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");
        return res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "PDF generation failed" });
    }
});

// --- AI: PROFILTEKST ---
router.post("/cv/ai/summary", async (req, res) => {
    try {
        const { basics, experience, skills, education } = req.body;

        const prompt = `
Du skriver en professionel CV-profiltekst på dansk (3-5 linjer).
Stil: konkret, moden, uden fluff. Fokus på værdi og kompetencer. Ingen emojis.
Input:
- Navn/titel: ${basics?.fullName || ""} – ${basics?.headline || ""}
- Erfaring (kort): ${(experience || []).map(e => `${e.role} hos ${e.company} (${e.from}-${e.to})`).join(" | ")}
- Skills: ${(skills || []).join(", ")}
- Uddannelse: ${(education || []).map(ed => `${ed.program} - ${ed.school}`).join(" | ")}

Skriv kun selve profilen.`;

        const completion = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
        });

        const text = completion.choices?.[0]?.message?.content?.trim() || "";
        res.json({ text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI summary failed" });
    }
});

// --- AI: FORBEDR BULLET POINTS ---
router.post("/cv/ai/bullets", async (req, res) => {
    try {
        const { rawText, context } = req.body;

        const prompt = `
Du omskriver til 3-5 CV-bullet points på dansk.
Stil: resultatorienteret, konkret, aktivt sprog. Ingen fluff.
Hvis tal/mål ikke findes, så undlad at opfinde dem.
Context: ${context || ""}
Tekst: ${rawText || ""}

Returnér KUN bullets, én per linje, med "- " som prefix.`;

        const completion = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        });

        const bullets = (completion.choices?.[0]?.message?.content || "")
            .split("\n")
            .map(l => l.trim())
            .filter(l => l.startsWith("- "))
            .map(l => l.replace(/^- /, "").trim());

        res.json({ bullets });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI bullets failed" });
    }
});

export default router;
