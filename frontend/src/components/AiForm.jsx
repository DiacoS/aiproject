import { useState } from "react";

function AiForm() {
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [extraInfo, setExtraInfo] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          jobTitle,
          companyName,
          experience,
          skills,
          extraInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Fejl fra server:", data);
        setError(data.error || "Serverfejl under generering.");
        return;
      }

      setResult(data.text);
    } catch (err) {
      console.error("Netværksfejl:", err);
      setError("Kunne ikke kontakte serveren.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Fulde navn
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Morten Friis Davidsen"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Stillingen du søger
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Datamatiker / Junior udvikler"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Virksomhed
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Diaco A/S"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Nøglekompetencer
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="React, Node, Firebase, teamwork…"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Erfaring / profil
        </label>
        <textarea
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
          placeholder="Skriv kort om din erfaring, studie, tidligere jobs, projekter osv."
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Ekstra info (valgfrit)
        </label>
        <textarea
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="Fx arbejdstider, motivation, særlige ønsker, referencer osv."
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
      </div>

      {/* Knap + fejl */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Genererer..." : "Lav ansøgning"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {/* Resultat */}
      {result && (
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Genereret ansøgning
          </h4>
          <p className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}

export default AiForm;
