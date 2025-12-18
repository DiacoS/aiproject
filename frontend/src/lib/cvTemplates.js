// src/lib/cvTemplates.js
import modernMinimal from "../components/cvbuilder/preview/templates/modernMinimal";
import twoColumnPro from "../components/cvbuilder/preview/templates/twoColumnPro";
import executiveClean from "../components/cvbuilder/preview/templates/executiveClean";

export const templates = [
    { id: "modern-minimal", name: "Modern Minimal", render: modernMinimal },
    { id: "two-column-pro", name: "Two Column Pro", render: twoColumnPro },
    { id: "executive-clean", name: "Executive Clean", render: executiveClean }
];
