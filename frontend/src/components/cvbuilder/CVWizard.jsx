import { useState } from "react";
import StepBasics from "./steps/StepBasics";
import StepExperience from "./steps/StepExperience";
import StepEducation from "./steps/StepEducation";
import StepSkills from "./steps/StepSkills";
import StepDesign from "./steps/StepDesign";

const steps = [
    { id: "basics", title: "Basics", Comp: StepBasics },
    { id: "experience", title: "Erfaring", Comp: StepExperience },
    { id: "education", title: "Uddannelse", Comp: StepEducation },
    { id: "skills", title: "Kompetencer", Comp: StepSkills },
    { id: "design", title: "Design & Export", Comp: StepDesign },
];

export default function CVWizard({ cv, setCv, templates, onAiSummary, onExportPdf }) {
    const [idx, setIdx] = useState(0);
    const Step = steps[idx].Comp;

    return (
        <div>

            <div style={{ display: "flex", gap: 8, margin: "12px 0 18px" }}>
                {steps.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setIdx(i)}
                        style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            background: i === idx ? "#111827" : "white",
                            color: i === idx ? "white" : "#111827",
                            cursor: "pointer",
                        }}
                    >
                        {s.title}
                    </button>
                ))}
            </div>

            <Step cv={cv} setCv={setCv} templates={templates} onAiSummary={onAiSummary} />

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>Tilbage</button>
                <button disabled={idx === steps.length - 1} onClick={() => setIdx(i => i + 1)}>Næste</button>

                <div style={{ flex: 1 }} />

                <button onClick={onAiSummary}>AI: Profiltekst</button>
                <button onClick={onExportPdf}>Export PDF + Gem</button>
            </div>
        </div>
    );
}
