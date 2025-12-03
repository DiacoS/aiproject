import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2, Sparkles, Save, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

function AiForm() {
  const { currentUser } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [selectedCv, setSelectedCv] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [cvFiles, setCvFiles] = useState([]);
  const [saved, setSaved] = useState(false);

  // ------------------- HENT CV'er -------------------
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "cv"),
      where("uid", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCvFiles(files);
      
      // Auto-select første CV hvis der er et og intet er valgt
      if (files.length > 0 && !selectedCv) {
        setSelectedCv(files[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentUser, selectedCv]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult("");
    setSaved(false);

    try {
      const selectedCvData = cvFiles.find((cv) => cv.id === selectedCv);
      
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser?.uid,
          fullName,
          jobTitle,
          companyName,
          experience,
          skills,
          extraInfo,
          cvId: selectedCv || null,
          cvUrl: selectedCvData?.url || null,
          cvFilename: selectedCvData?.filename || null,
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

  const handleSave = async () => {
    if (!result || !currentUser) return;

    setSaving(true);
    setError("");

    try {
      const selectedCvData = cvFiles.find((cv) => cv.id === selectedCv);
      
      const res = await fetch("http://localhost:5000/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser.uid,
          fullName,
          jobTitle,
          companyName,
          generatedText: result,
          cvId: selectedCv || null,
          cvFilename: selectedCvData?.filename || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Fejl ved gemning:", data);
        setError(data.error || "Fejl ved gemning af ansøgning.");
        return;
      }

      setSaved(true);
    } catch (err) {
      console.error("Netværksfejl:", err);
      setError("Kunne ikke gemme ansøgningen.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* CV Valg */}
      {cvFiles.length > 0 ? (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Vælg CV (anbefalet)
          </label>
          <select
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all hover:border-gray-300"
            value={selectedCv}
            onChange={(e) => setSelectedCv(e.target.value)}
          >
            <option value="">Ingen CV valgt</option>
            {cvFiles.map((cv) => (
              <option key={cv.id} value={cv.id}>
                {cv.filename}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Vælg et CV fra dine uploadede filer for bedre resultater.{" "}
            <Link to="/cv" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
              Upload flere CV'er
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Upload dit CV for bedre resultater
              </p>
              <p className="text-xs text-gray-600">
                Ved at uploade dit CV kan AI'en skrive en mere præcis ansøgning.{" "}
                <Link to="/cv" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                  Upload CV nu →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Fulde navn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-300 bg-white"
            placeholder=""
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Stillingen du søger <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-300 bg-white"
            placeholder=""
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Virksomhed <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-300 bg-white"
            placeholder="  "
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Nøglekompetencer
          </label>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-300 bg-white"
            placeholder=" "
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          Erfaring / profil
        </label>
        <textarea
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-300 bg-white resize-none"
          rows={5}
          placeholder="Skriv kort om din erfaring, studie, tidligere jobs, projekter osv."
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          Ekstra info <span className="text-gray-500 font-normal">(valgfrit)</span>
        </label>
        <textarea
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-300 bg-white resize-none"
          rows={4}
          placeholder="Fx arbejdstider, motivation, særlige ønsker, referencer osv."
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
      </div>

      {/* Knap + fejl */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full md:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Genererer ansøgning...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generér ansøgning</span>
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Resultat */}
      {result && (
        <div className="mt-8 pt-8 border-t-2 border-gray-200">
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  Din ansøgning er klar!
                </h4>
                <p className="text-sm text-gray-600">Kopier teksten nedenfor</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {result}
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Du kan kopiere teksten og bruge den direkte i din ansøgning</span>
              </div>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Gemt!</span>
                  </>
                ) : saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Gemmer...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Gem ansøgning</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiForm;
