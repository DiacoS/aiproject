// src/components/cvbuilder/preview/templates/executiveClean.jsx
export default function executiveClean(cv, { forPdf } = {}) {
    const {
        basics = {},
        summary = "",
        experience = [],
        education = [],
        skills = [],
        accentColor = "#6D28D9",
    } = cv || {};

    return `
  <div style="font-family: Inter, Arial, sans-serif; color:#0f172a;">
    <!-- Top card -->
    <div style="background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:18px;">
      <div style="display:flex; justify-content:space-between; gap:18px; align-items:flex-start;">
        <div>
          <div style="font-size:28px; font-weight:950; letter-spacing:-0.03em;">
            ${escapeHtml(basics.fullName || "Dit navn")}
          </div>
          <div style="margin-top:6px; font-size:14px; color:#334155;">
            ${basics.headline
            ? `<span style="font-weight:800; color:${accentColor};">${escapeHtml(
                basics.headline
            )}</span>`
            : ""
        }
            ${basics.location ? `<span> • ${escapeHtml(basics.location)}</span>` : ""}
          </div>

          <div style="margin-top:10px; height:2px; width:120px; background:${accentColor}; border-radius:999px;"></div>
        </div>

        <div style="text-align:right; font-size:12px; color:#475569; line-height:1.7;">
          ${basics.email ? `<div>${escapeHtml(basics.email)}</div>` : ""}
          ${basics.phone ? `<div>${escapeHtml(basics.phone)}</div>` : ""}
          ${basics.linkedin ? `<div>${escapeHtml(basics.linkedin)}</div>` : ""}
          ${basics.github ? `<div>${escapeHtml(basics.github)}</div>` : ""}
          ${basics.website ? `<div>${escapeHtml(basics.website)}</div>` : ""}
        </div>
      </div>

      ${summary
            ? `
      <div style="margin-top:16px; padding-top:14px; border-top:1px solid #e5e7eb;">
        <div style="font-size:12px; font-weight:950; letter-spacing:0.10em;">PROFIL</div>
        <div style="margin-top:10px; font-size:13.2px; line-height:1.7; color:#334155;">
          ${escapeHtml(summary)}
        </div>
      </div>`
            : ""
        }
    </div>

    <div style="margin-top:16px; display:grid; gap:14px;">
      <!-- Experience card -->
      <div style="background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:16px;">
        <div style="font-size:12px; font-weight:950; letter-spacing:0.10em;">ERFARING</div>
        <div style="margin-top:12px; display:grid; gap:14px;">
          ${experience
            .map(
                (job) => `
            <div>
              <div style="display:flex; justify-content:space-between; gap:10px; align-items:baseline;">
                <div style="font-weight:950; color:#0f172a;">
                  ${escapeHtml(job.role || "")}${job.company ? ` — ${escapeHtml(job.company)}` : ""}
                </div>
                <div style="font-size:12px; color:#64748b;">
                  ${escapeHtml(job.from || "")}${job.to ? ` - ${escapeHtml(job.to)}` : ""}
                </div>
              </div>

              ${(job.bullets || []).filter(Boolean).length
                        ? `
                <ul style="margin:8px 0 0 18px; padding:0; font-size:12.8px; color:#334155; line-height:1.65;">
                  ${(job.bullets || [])
                            .filter(Boolean)
                            .slice(0, 10)
                            .map((b) => `<li>${escapeHtml(b)}</li>`)
                            .join("")}
                </ul>`
                        : ""
                    }
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Two cards -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
        <div style="background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:16px;">
          <div style="font-size:12px; font-weight:950; letter-spacing:0.10em;">UDDANNELSE</div>
          <div style="margin-top:12px; display:grid; gap:10px;">
            ${education
            .map(
                (ed) => `
              <div>
                <div style="font-weight:900;">${escapeHtml(ed.program || "")}</div>
                <div style="font-size:12px; color:#64748b; margin-top:2px;">
                  ${escapeHtml(ed.school || "")}
                </div>
                <div style="font-size:12px; color:#64748b; margin-top:2px;">
                  ${escapeHtml(ed.from || "")}${ed.to ? ` - ${escapeHtml(ed.to)}` : ""}
                </div>
              </div>
            `
            )
            .join("")}
          </div>
        </div>

        <div style="background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:16px;">
          <div style="font-size:12px; font-weight:950; letter-spacing:0.10em;">KOMPETENCER</div>
          <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
            ${skills
            .slice(0, 22)
            .map(
                (s) => `
              <span style="border:1px solid #e5e7eb; background:#fff; padding:6px 10px; border-radius:999px; font-size:12px;">
                ${escapeHtml(s)}
              </span>`
            )
            .join("")}
          </div>
        </div>
      </div>
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
