export default function modernMinimal(cv, { forPdf }) {
    const { basics, summary, experience, education, skills, accentColor } = cv;

    return `
  <div style="font-family: Inter, Arial, sans-serif; color:#111827;">
    <div style="border-bottom:2px solid ${accentColor}; padding-bottom:10px; margin-bottom:14px;">
      <div style="font-size:26px; font-weight:800;">${basics.fullName || "Dit navn"}</div>
      <div style="font-size:14px; color:#374151; margin-top:4px;">
        <span style="font-weight:600; color:${accentColor};">${basics.headline || ""}</span>
        ${basics.location ? ` • ${basics.location}` : ""}
      </div>
      <div style="font-size:12px; color:#4b5563; margin-top:6px; display:flex; gap:10px; flex-wrap:wrap;">
        ${basics.email ? `<span>${basics.email}</span>` : ""}
        ${basics.phone ? `<span>${basics.phone}</span>` : ""}
        ${basics.linkedin ? `<span>${basics.linkedin}</span>` : ""}
        ${basics.github ? `<span>${basics.github}</span>` : ""}
      </div>
    </div>

    ${summary ? `
      <div style="margin-bottom:14px;">
        <div style="font-size:13px; font-weight:800; letter-spacing:0.06em; color:#111827;">PROFIL</div>
        <div style="margin-top:6px; font-size:13px; line-height:1.45; color:#374151;">${escapeHtml(summary)}</div>
      </div>
    ` : ""}

    <div style="display:grid; gap:14px;">
      <div>
        <div style="font-size:13px; font-weight:800; letter-spacing:0.06em;">ERFARING</div>
        <div style="margin-top:8px; display:grid; gap:10px;">
          ${(experience || []).map(job => `
            <div>
              <div style="display:flex; justify-content:space-between; gap:10px;">
                <div style="font-weight:700;">${job.role || ""} ${job.company ? `— ${job.company}` : ""}</div>
                <div style="font-size:12px; color:#6b7280;">${job.from || ""}${job.to ? ` - ${job.to}` : ""}</div>
              </div>
              <ul style="margin:6px 0 0 18px; color:#374151; font-size:12.8px; line-height:1.45;">
                ${(job.bullets || []).filter(Boolean).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
              </ul>
            </div>
          `).join("")}
        </div>
      </div>

      <div>
        <div style="font-size:13px; font-weight:800; letter-spacing:0.06em;">UDDANNELSE</div>
        <div style="margin-top:8px; display:grid; gap:8px;">
          ${(education || []).map(ed => `
            <div style="display:flex; justify-content:space-between; gap:10px;">
              <div><span style="font-weight:700;">${ed.program || ""}</span> ${ed.school ? `— ${ed.school}` : ""}</div>
              <div style="font-size:12px; color:#6b7280;">${ed.from || ""}${ed.to ? ` - ${ed.to}` : ""}</div>
            </div>
          `).join("")}
        </div>
      </div>

      ${(skills || []).length ? `
        <div>
          <div style="font-size:13px; font-weight:800; letter-spacing:0.06em;">KOMPETENCER</div>
          <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
            ${(skills || []).map(s => `
              <span style="border:1px solid #e5e7eb; padding:6px 10px; border-radius:999px; font-size:12px;">
                ${escapeHtml(s)}
              </span>
            `).join("")}
          </div>
        </div>
      ` : ""}
    </div>
  </div>
  `;
}

function escapeHtml(str = "") {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")
        .replaceAll("\n", "<br/>");
}
