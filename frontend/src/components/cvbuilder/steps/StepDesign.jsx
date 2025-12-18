export default function StepDesign({ cv, setCv, templates }) {
    return (
        <div style={{ display: "grid", gap: 12 }}>
            <h2>Design</h2>

            <label>
                Template:
                <select
                    value={cv.templateId}
                    onChange={e => setCv(prev => ({ ...prev, templateId: e.target.value }))}
                >
                    {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </label>

            <label>
                Accent color:
                <input
                    type="color"
                    value={cv.accentColor}
                    onChange={e => setCv(prev => ({ ...prev, accentColor: e.target.value }))}
                />
            </label>

            <input
                placeholder="CV titel (valgfri)"
                value={cv.title}
                onChange={e => setCv(prev => ({ ...prev, title: e.target.value }))}
            />
        </div>
    );
}
