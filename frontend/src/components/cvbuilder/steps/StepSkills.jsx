import { useState } from "react";

export default function StepSkills({ cv, setCv }) {
    const [value, setValue] = useState("");

    function addSkill() {
        const v = value.trim();
        if (!v) return;
        if ((cv.skills || []).includes(v)) return;
        setCv(prev => ({ ...prev, skills: [...(prev.skills || []), v] }));
        setValue("");
    }

    function removeSkill(skill) {
        setCv(prev => ({ ...prev, skills: (prev.skills || []).filter(s => s !== skill) }));
    }

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <h2>Kompetencer</h2>

            <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="Tilføj skill (fx React)" value={value} onChange={e => setValue(e.target.value)} />
                <button onClick={addSkill}>Tilføj</button>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(cv.skills || []).map(s => (
                    <button key={s} onClick={() => removeSkill(s)} style={{ borderRadius: 999, padding: "6px 10px" }}>
                        {s} ✕
                    </button>
                ))}
            </div>
        </div>
    );
}
