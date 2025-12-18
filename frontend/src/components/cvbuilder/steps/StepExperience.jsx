export default function StepExperience({ cv, setCv }) {
    const exp = cv.experience || [];

    function update(i, patch) {
        setCv(prev => {
            const next = [...prev.experience];
            next[i] = { ...next[i], ...patch };
            return { ...prev, experience: next };
        });
    }

    function updateBullet(i, bi, value) {
        setCv(prev => {
            const next = [...prev.experience];
            const bullets = [...(next[i].bullets || [])];
            bullets[bi] = value;
            next[i] = { ...next[i], bullets };
            return { ...prev, experience: next };
        });
    }

    function addJob() {
        setCv(prev => ({
            ...prev,
            experience: [...prev.experience, { role: "", company: "", from: "", to: "", location: "", bullets: [""] }],
        }));
    }

    function removeJob(i) {
        setCv(prev => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));
    }

    return (
        <div style={{ display: "grid", gap: 14 }}>
            <h2>Erfaring</h2>

            {exp.map((e, i) => (
                <div key={i} style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <input placeholder="Jobtitel" value={e.role} onChange={ev => update(i, { role: ev.target.value })} />
                        <input placeholder="Virksomhed" value={e.company} onChange={ev => update(i, { company: ev.target.value })} />
                        <input placeholder="Fra (fx 2023)" value={e.from} onChange={ev => update(i, { from: ev.target.value })} />
                        <input placeholder="Til (fx 2025 / nu)" value={e.to} onChange={ev => update(i, { to: ev.target.value })} />
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <strong>Bullet points</strong>
                        {(e.bullets || []).map((b, bi) => (
                            <input
                                key={bi}
                                style={{ width: "100%", marginTop: 6 }}
                                placeholder="Fx: Udviklede X der forbedrede Y..."
                                value={b}
                                onChange={ev => updateBullet(i, bi, ev.target.value)}
                            />
                        ))}
                        <button
                            onClick={() => update(i, { bullets: [...(e.bullets || []), ""] })}
                            style={{ marginTop: 8 }}
                        >
                            + Tilføj punkt
                        </button>
                    </div>

                    <button onClick={() => removeJob(i)} style={{ marginTop: 10 }}>
                        Fjern job
                    </button>
                </div>
            ))}

            <button onClick={addJob}>+ Tilføj job</button>
        </div>
    );
}
