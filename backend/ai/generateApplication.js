import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

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
  } = data;

  const prompt = `
Du er en professionel tekstforfatter, der skriver jobansøgninger på dansk.

Skriv en motiveret jobansøgning i jeg-form baseret på følgende oplysninger:

Navn: ${fullName || "Ikke angivet"}
Stilling der søges: ${jobTitle || "Ikke angivet"}
Virksomhed: ${companyName || "Ikke angivet"}

Erfaring:
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
