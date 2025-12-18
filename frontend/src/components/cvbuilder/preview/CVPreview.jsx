export default function CVPreview({ cv, template }) {
    const html = template.render(cv, { forPdf: false });

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                <strong>Live preview</strong>
            </div>
            <div
                style={{ padding: 12, background: "#f9fafb" }}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
