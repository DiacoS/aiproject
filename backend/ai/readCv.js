import https from "https";
import http from "http";
import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
// pdf-parse v1.1.1 exporterer en callable function direkte
const pdfParse = require("pdf-parse");

/**
 * Henter en fil fra URL og returnerer buffer
 */
async function fetchFile(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Fejl ved hentning: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks)));
      response.on("error", reject);
    }).on("error", reject);
  });
}

/**
 * Læser tekst fra CV-fil (PDF, DOCX)
 */
export async function readCvContent(cvUrl) {
  if (!cvUrl) {
    console.log("readCvContent: Ingen CV URL angivet");
    return null;
  }

  console.log("readCvContent: Forsøger at læse CV fra:", cvUrl);

  try {
    const buffer = await fetchFile(cvUrl);
    console.log("readCvContent: Buffer hentet, størrelse:", buffer.length, "bytes");
    
    // Tjek filtype baseret på URL (fjern query parameters først)
    const urlWithoutParams = cvUrl.split('?')[0].toLowerCase();
    
    if (urlWithoutParams.endsWith(".pdf")) {
      console.log("readCvContent: Behandler som PDF");
      const data = await pdfParse(buffer);
      console.log("readCvContent: PDF parset, tekst længde:", data.text.length);
      return data.text.trim();
    } else if (urlWithoutParams.endsWith(".docx")) {
      console.log("readCvContent: Behandler som DOCX");
      const result = await mammoth.extractRawText({ buffer });
      console.log("readCvContent: DOCX parset, tekst længde:", result.value.length);
      return result.value.trim();
    } else if (urlWithoutParams.endsWith(".doc")) {
      console.log("readCvContent: DOC format ikke supporteret");
      return "CV-indhold kunne ikke læses (DOC format). Upload venligst som PDF eller DOCX.";
    } else {
      // Prøv PDF som standard
      console.log("readCvContent: Ukendt filtype, prøver som PDF");
      try {
        const data = await pdfParse(buffer);
        console.log("readCvContent: PDF parset, tekst længde:", data.text.length);
        return data.text.trim();
      } catch (pdfError) {
        console.error("readCvContent: Kunne ikke parse som PDF:", pdfError.message);
        return null;
      }
    }
  } catch (error) {
    console.error("readCvContent: Fejl ved læsning af CV:", error.message);
    console.error("readCvContent: Stack trace:", error.stack);
    return null;
  }
} 


