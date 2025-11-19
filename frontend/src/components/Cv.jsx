import { Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

function Cv() {
  const { currentUser } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // ------------------- FILE UPLOAD LOGIK -------------------
  const handleFile = async (file) => {
    if (!file) return;

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
      console.error("Fejl:", err);
      alert("Upload fejlede");
    }
  };

  const handleFileUpload = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // ------------------- REAL-TIME HENTNING AF CV -------------------
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cv"), (snapshot) => {
      const files = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((file) => file.uid === currentUser.uid);

      setUploadedFiles(files);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) return <p className="text-center mt-20">Log ind for at se dine CV’er</p>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Dine CV Filer</h1>

      {/* UPLOAD BOX */}
      <section className="max-w-3xl mx-auto mb-12">
        <div
          className={`border-3 border-dashed rounded-2xl p-12 transition-all ${
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

          <label htmlFor="cv-upload" className="flex flex-col items-center gap-4 cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg">
              <Upload className="w-12 h-12 text-white" />
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold">Upload dit CV</h3>
              <p className="text-gray-600">Træk en fil her eller klik for at vælge</p>
            </div>
          </label>
        </div>
      </section>

      {/* LISTE AF UPLOADEDE FILER */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Uploaded filer</h2>

        {uploadedFiles.length === 0 ? (
          <p className="text-gray-600">Ingen filer uploadet endnu.</p>
        ) : (
          <ul className="space-y-3">
            {uploadedFiles.map((file) => (
              <li key={file.id} className="p-4 bg-white rounded-xl shadow border flex justify-between items-center">
                <span>{file.filename}</span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Åbn
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Cv;
