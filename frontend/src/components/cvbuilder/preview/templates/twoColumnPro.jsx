// src/components/cvbuilder/preview/templates/twoColumnPro.jsx
export default function twoColumnPro(cv, { forPdf } = {}) {
    const {
        basics = {},
        summary = "",
        experience = [],
        education = [],
        skills = [],
        accentColor = "#6D28D9",
    } = cv || {};

    return `
  <div style="font-family: Inter, Arial, sans-serif; color:#111827;">
    <!-- Header -->
    <div style="border-bottom:2px solid ${accentColor}; padding-bottom:12px; margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; gap:16px;">
        <div>
          <div style="font-size:26px; font-weight:900; letter-spacing:-0.02em;">
            ${escapeHtml(basics.fullName || "Dit navn")}
          </div>
          <div style="margin-top:4px; font-size:14px; color:#374151;">
            ${basics.headline
            ? `<span style="font-weight:700; color:${accentColor};">${escapeHtml(
                basics.headline
            )}</span>`
            : ""
        }
            ${basics.location ? `<span> • ${escapeHtml(basics.location)}</span>` : ""}
          </div>
        </div>

        <div style="text-align:right; font-size:12px; color:#4b5563; line-height:1.6;">
          ${basics.email ? `<div>${escapeHtml(basics.email)}</div>` : ""}
          ${basics.phone ? `<div>${escapeHtml(basics.phone)}</div>` : ""}
          ${basics.linkedin ? `<div>${escapeHtml(basics.linkedin)}</div>` : ""}
          ${basics.github ? `<div>${escapeHtml(basics.github)}</div>` : ""}
          ${basics.website ? `<div>${escapeHtml(basics.website)}</div>` : ""}
        </div>
      </div>
    </div>

    <!-- Two columns -->
    <div style="display:grid; grid-template-columns: 0.9fr 1.6fr; gap:18px; align-items:start;">
      
      <!-- Left -->
      <div>
        ${skills.length
            ? `
          <div style="margin-bottom:14px;">
            <div style="font-size:12px; font-weight:900; letter-spacing:0.10em;">KOMPETENCER</div>
            <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:8px;">
              ${skills
                .slice(0, 18)
                .map(
                    (s) => `
                <span style="border:1px solid #e5e7eb; background:#fff; padding:6px 10px; border-radius:999px; font-size:12px;">
                  ${escapeHtml(s)}
                </span>`
                )
                .join("")}
            </div>
          </div>`
            : ""
        }

        ${education.length
            ? `
          <div style="margin-bottom:14px;">
            <div style="font-size:12px; font-weight:900; letter-spacing:0.10em;">UDDANNELSE</div>
            <div style="margin-top:10px; display:grid; gap:10px;">
              ${education
                .map(
                    (ed) => `
                <div>
                  <div style="font-weight:800; color:#111827;">
                    ${escapeHtml(ed.program || "")}
                  </div>
                  <div style="font-size:12px; color:#6b7280; margin-top:2px;">
                    ${escapeHtml(ed.school || "")}
                  </div>
                  <div style="font-size:12px; color:#6b7280; margin-top:2px;">
                    ${escapeHtml(ed.from || "")}${ed.to ? ` - ${escapeHtml(ed.to)}` : ""}
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>`
            : ""
        }
      </div>

      <!-- Right -->
      <div>
        ${summary
            ? `
          <div style="margin-bottom:14px;">
            <div style="font-size:12px; font-weight:900; letter-spacing:0.10em;">PROFIL</div>
            <div style="margin-top:10px; font-size:13px; line-height:1.6; color:#374151;">
              ${escapeHtml(summary)}
            </div>
          </div>`
            : ""
        }

        <div>
          <div style="font-size:12px; font-weight:900; letter-spacing:0.10em;">ERFARING</div>
          <div style="margin-top:12px; display:grid; gap:14px;">
            ${experience
            .map(
                (job) => `
              <div>
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:baseline;">
                  <div style="font-weight:900; color:#111827;">
                    ${escapeHtml(job.role || "")}${job.company ? ` — ${escapeHtml(job.company)}` : ""}
                  </div>
                  <div style="font-size:12px; color:#6b7280;">
                    ${escapeHtml(job.from || "")}${job.to ? ` - ${escapeHtml(job.to)}` : ""}
                  </div>
                </div>

                ${(job.bullets || []).filter(Boolean).length
                        ? `
                  <ul style="margin:8px 0 0 18px; padding:0; font-size:12.8px; color:#374151; line-height:1.55;">
                    ${(job.bullets || [])
                            .filter(Boolean)
                            .slice(0, 8)
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
