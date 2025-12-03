// src/components/Cv.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Navbar from './Navbar.jsx';
import { Upload, FileText, Trash2 } from 'lucide-react';

// Firebase imports
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db, storage } from "../firebase";

export default function Cv() {
  const { currentUser } = useAuth();

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // ------------------- FILE UPLOAD LOGIK -------------------
  const handleFile = async (file) => {
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      alert("Kun PDF, DOC og DOCX er tilladt.");
      return;
    }

    try {
      const fileRef = ref(storage, `cv/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);

      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, "cv"), {
        filename: file.name,
        url,
        createdAt: serverTimestamp(),
        uid: currentUser.uid,
      });

      alert("Upload færdig!");
    } catch (err) {
      console.error("Fejl under upload:", err);
      alert("Upload fejlede");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // ------------------- DELETE CV -------------------
  const handleDelete = async (cvId, fileUrl) => {
    if (!confirm("Er du sikker på, at du vil slette dette CV?")) return;

    try {
      // Slet fra Firestore
      await deleteDoc(doc(db, "cv", cvId));

      // Slet fra Storage
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);

      alert("CV slettet!");
    } catch (err) {
      console.error("Fejl under sletning:", err);
      alert("Sletning fejlede");
    }
  };

  // ------------------- REAL-TIME FILER -------------------
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
      setUploadedFiles(files);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // ------------------- UI -------------------
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto py-12 px-8">
        {currentUser ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dit CV</h2>
              <p className="text-gray-600">
                Upload og administrer dine CV'er her. Du kan vælge et CV når du genererer en ansøgning.
              </p>
            </div>

            {/* ---------------- UPLOAD CV ---------------- */}
            <section className="max-w-3xl mx-auto">
              <div
                className={`relative border-3 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50 scale-105"
                    : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <label
                  htmlFor="cv-upload"
                  className="flex flex-col items-center gap-4 cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg">
                    <Upload className="w-12 h-12 text-white" />
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">Upload dit CV</h3>
                    <p className="text-gray-600">
                      Træk og slip din fil her, eller klik for at vælge
                    </p>
                    <p className="text-sm text-gray-500">
                      Understøtter PDF, DOC, DOCX (maks. 10MB)
                    </p>
                  </div>

                  <label
                    htmlFor="cv-upload"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    Vælg fil
                  </label>
                </label>
              </div>
            </section>

            {/* ---------------- UPLOADED CVs ---------------- */}
            {uploadedFiles.length > 0 && (
              <section className="max-w-3xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Dine uploadede CV'er ({uploadedFiles.length})
                </h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{file.filename}</p>
                          <p className="text-sm text-gray-500">
                            {file.createdAt?.toDate?.().toLocaleDateString("da-DK") || "Ukendt dato"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Se
                        </a>
                        <button
                          onClick={() => handleDelete(file.id, file.url)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Slet CV"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
}
