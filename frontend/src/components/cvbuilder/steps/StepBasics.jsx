export default function StepBasics({ cv, setCv }) {
    const b = cv.basics;

    function set(field, value) {
        setCv(prev => ({ ...prev, basics: { ...prev.basics, [field]: value } }));
    }

    return (
        <div style={{ display: "grid", gap: 10 }}>
            <h2>Basics</h2>

            <input placeholder="Fulde navn" value={b.fullName} onChange={e => set("fullName", e.target.value)} />
            <input placeholder="Titel / Headline" value={b.headline} onChange={e => set("headline", e.target.value)} />
            <input placeholder="By" value={b.location} onChange={e => set("location", e.target.value)} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input placeholder="Email" value={b.email} onChange={e => set("email", e.target.value)} />
                <input placeholder="Telefon" value={b.phone} onChange={e => set("phone", e.target.value)} />
            </div>

            <input placeholder="LinkedIn URL" value={b.linkedin} onChange={e => set("linkedin", e.target.value)} />
            <input placeholder="GitHub URL" value={b.github} onChange={e => set("github", e.target.value)} />
            <input placeholder="Website/Portfolio" value={b.website} onChange={e => set("website", e.target.value)} />

            <textarea
                rows={5}
                placeholder="Profiltekst (kan også genereres med AI)"
                value={cv.summary}
                onChange={e => setCv(prev => ({ ...prev, summary: e.target.value }))}
            />
        </div>
    );
}
