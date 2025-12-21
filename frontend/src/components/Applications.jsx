// src/components/Applications.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import { Link } from "react-router-dom";

import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

import {
  FileText,
  Trash2,
  Calendar,
  Building,
  User,
  Copy,
  Check,
} from "lucide-react";

export default function Applications() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // 🔐 Auth gate
  if (!currentUser) return <Login />;

  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      where("uid", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const apps = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setApplications(apps);
      },
      (err) => {
        console.error("onSnapshot error (Applications/applications):", err);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleDelete = async (id) => {
    if (!confirm("Er du sikker på, at du vil slette denne ansøgning?")) return;

    try {
      await deleteDoc(doc(db, "applications", id));
    } catch (err) {
      console.error("Fejl ved sletning:", err);
      alert("Kunne ikke slette ansøgningen");
    }
  };

  const handleCopy = async (text, id) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Kunne ikke kopiere:", err);
      alert("Kunne ikke kopiere til udklipsholder");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Ukendt dato";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleDateString("da-DK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto py-12 px-8">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Dine ansøgninger
        </h2>
        <p className="text-gray-600">Her kan du se alle dine gemte ansøgninger</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ingen ansøgninger endnu
          </h3>
          <p className="text-gray-600 mb-6">
            Generér og gem din første ansøgning for at se den her
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Generér ansøgning
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {app.jobTitle || "Ansøgning"}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        {app.companyName && (
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            <span>{app.companyName}</span>
                          </div>
                        )}

                        {app.fullName && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{app.fullName}</span>
                          </div>
                        )}

                        {app.timestamp && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(app.timestamp)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(app.generatedText, app.id)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Kopier ansøgning"
                  >
                    {copiedId === app.id ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Slet ansøgning"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tekst */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-5 border border-gray-100">
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {app.generatedText}
                </p>
              </div>

              {app.cvFilename && (
                <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>Brugt CV: {app.cvFilename}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
