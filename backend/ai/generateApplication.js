import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateApplication(data) {
  const prompt = `
Skriv en professionel jobansøgning.
Navn: ${data.name}
Stilling: ${data.position}
Erfaring: ${data.experience}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }]
  });

  return completion.choices[0].message.content;
}
