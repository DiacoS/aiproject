import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { readCvContent } from "./readCv.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateApplication(data) {
  const {
    fullName,
    jobTitle,
    companyName,
    experience,
    skills,
    extraInfo,
    cvUrl,
  } = data;

  // Læs CV-indhold hvis CV URL er angivet
  let cvContent = null;
  if (cvUrl) {
    console.log("Læser CV fra URL:", cvUrl);
    cvContent = await readCvContent(cvUrl);
    if (cvContent) {
      console.log("CV indhold læst succesfuldt. Længde:", cvContent.length, "tegn");
    } else {
      console.log("Kunne ikke læse CV-indhold");
    }
  } else {
    console.log("Ingen CV URL angivet");
  }

  const prompt = `
Du er en professionel tekstforfatter, der skriver jobansøgninger på dansk.

Skriv en motiveret jobansøgning i jeg-form baseret på følgende oplysninger:

Navn: ${fullName || "Ikke angivet"}
Stilling der søges: ${jobTitle || "Ikke angivet"}
Virksomhed: ${companyName || "Ikke angivet"}

${cvContent ? `CV-indhold:
${cvContent}

` : ""}Erfaring:
${experience || "Ikke angivet"}

Kompetencer:
${skills || "Ikke angivet"}

Ekstra info fra ansøgeren:
${extraInfo || "Ingen ekstra info"}

Krav til ansøgningen:
- Dansk sprog
- Professionel men jordnær tone
- Max ca. 400–500 ord
- Struktureret med indledning, midterafsnit og afslutning
- Ingen overskrifter, bare brødtekst
- Brug informationer fra CV'et hvis det er relevant
  `;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  // (valgfrit) log strukturen første gang:
  console.log("OpenAI response raw:", JSON.stringify(response, null, 2));

  const text =
    response.output?.[0]?.content?.[0]?.text?.trim() ??
    response.output_text ??
    "AI returnerede ingen tekst";

  return text;
}