export default function StepEducation({ cv, setCv }) {
    const edu = cv.education || [];

    function update(i, patch) {
        setCv(prev => {
            const next = [...prev.education];
            next[i] = { ...next[i], ...patch };
            return { ...prev, education: next };
        });
    }

    function addEdu() {
        setCv(prev => ({
            ...prev,
            education: [...prev.education, { program: "", school: "", from: "", to: "", location: "" }],
        }));
    }

    return (
        <div style={{ display: "grid", gap: 14 }}>
            <h2>Uddannelse</h2>

            {edu.map((e, i) => (
                <div key={i} style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 14 }}>
                    <input placeholder="Uddannelse" value={e.program} onChange={ev => update(i, { program: ev.target.value })} />
                    <input placeholder="Skole" value={e.school} onChange={ev => update(i, { school: ev.target.value })} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <input placeholder="Fra" value={e.from} onChange={ev => update(i, { from: ev.target.value })} />
                        <input placeholder="Til" value={e.to} onChange={ev => update(i, { to: ev.target.value })} />
                    </div>
                </div>
            ))}

            <button onClick={addEdu}>+ Tilføj uddannelse</button>
        </div>
    );
}
