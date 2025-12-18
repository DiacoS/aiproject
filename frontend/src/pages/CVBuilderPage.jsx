// src/pages/CVBuilderPage.jsx
import { useMemo, useState } from "react";
import { defaultCv } from "../lib/cvDefaults";
import { templates } from "../lib/cvTemplates";

import CVWizard from "../components/cvbuilder/CVWizard";
import CVPreview from "../components/cvbuilder/preview/CVPreview";

import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Login from "../components/Login";

export default function CVBuilderPage() {
    const { currentUser } = useAuth();

    const [cv, setCv] = useState(defaultCv);

    const template = useMemo(
        () => templates.find((t) => t.id === cv.templateId) || templates[0],
        [cv.templateId]
    );

    async function aiGenerateSummary() {
        if (!currentUser) return;

        const res = await fetch("http://localhost:5000/api/cv/ai/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                basics: cv.basics,
                experience: cv.experience,
                skills: cv.skills,
                education: cv.education,
            }),
        });

        const data = await res.json();
        setCv((prev) => ({ ...prev, summary: data.text || prev.summary }));
    }

    async function exportPdfAndSave() {
        if (!currentUser) {
            alert("Du skal være logget ind for at gemme et CV.");
            return;
        }

        try {
            // 1) HTML fra template
            const html = template.render(cv, { forPdf: true });

            // 2) Hent PDF fra backend
            const res = await fetch("http://localhost:5000/api/cv/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ html }),
            });

            if (!res.ok) throw new Error("PDF export failed");
            const blob = await res.blob();

            // 3) Upload til Storage
            const safeName = (cv.basics.fullName || "CV")
                .replace(/[\/\\?%*:|"<>]/g, "-")
                .trim();
            const fileName = `${safeName} - generated.pdf`;

            const storagePath = `cv/${currentUser.uid}/${Date.now()}-${fileName}`;
            const storageRef = ref(storage, storagePath);

            await uploadBytes(storageRef, blob);

            // ✅ 4) HENT DOWNLOAD URL (så jeres "Se" link virker)
            const downloadUrl = await getDownloadURL(storageRef);

            // 5) Gem i samme collection som Cv.jsx bruger: "cv"
            await addDoc(collection(db, "cv"), {
                filename: fileName,
                url: downloadUrl, // ✅ vigtig
                storagePath,      // (valgfri, men nice til debugging/slet)
                createdAt: serverTimestamp(),
                uid: currentUser.uid,
                type: "generated-cv",
                content: cv,      // valgfri (brugbar hvis I vil redigere senere)
            });

            alert("CV gemt ✅");
        } catch (err) {
            console.error(err);
            alert("Noget gik galt ved export/gem. Se console.");
        }
    }

    if (!currentUser) return <Login />;

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr",
                gap: 24,
            }}
        >
            <div>
                <CVWizard
                    cv={cv}
                    setCv={setCv}
                    templates={templates}
                    onAiSummary={aiGenerateSummary}
                    onExportPdf={exportPdfAndSave}
                />
            </div>

            <div>
                <CVPreview cv={cv} template={template} />
            </div>
        </div>
    );
}
