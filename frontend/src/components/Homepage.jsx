import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Navbar from './Navbar.jsx';
import { Upload, FileText, Sparkles, Zap, CheckCircle } from 'lucide-react';

// Firebase imports
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";

import { db, storage } from "../firebase";

import AiForm from './AiForm.jsx';

function Homepage() {
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

  // ------------------- REAL-TIME FILER -------------------
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, "cv"), (snapshot) => {
      const files = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userFiles = files.filter((f) => f.uid === currentUser.uid);
      setUploadedFiles(userFiles);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // ------------------- UI -------------------
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto py-12 px-8">
        {currentUser ? (
          <div className="space-y-12">

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

            {/* AI form */}
            <section className="max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Generér din ansøgning</h3>
                <p className="text-gray-600 mb-6">
                  Udfyld felterne herunder – så skriver AI'en en skræddersyet ansøgning til dig.
                </p>
                <AiForm />
              </div>
            </section>

          </div>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
}

export default Homepage;
