// src/components/settings/Profile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Login from "../Login";

import {
  updateEmail,
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

import { db, storage } from "../../firebase";

// Helpers
import { applyTheme } from "./theme";

export default function Profile() {
  const { currentUser, logout } = useAuth();

  // 🔐 Auth gate
  if (!currentUser) return <Login />;

  // ------------ STATES ------------
  const [activeTab, setActiveTab] = useState("general");

  const [profileInfo, setProfileInfo] = useState({
    displayName: "",
    birthdate: "",
    phone: "",
    profileURL: "",
  });

  const [email, setEmail] = useState(currentUser.email || "");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Password modal
  const [passwordModal, setPasswordModal] = useState(false);
  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [pwdRepeat, setPwdRepeat] = useState("");
  const [pwdError, setPwdError] = useState("");

  // Delete data modal
  const [deleteModal, setDeleteModal] = useState(false);

  // Theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  // Date helper
  const todayStr = new Date().toISOString().split("T")[0];

  // ------------ TOAST ------------
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ------------ LOAD USER PROFILE ------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setProfileInfo({
            displayName: data.displayName || currentUser.displayName || "",
            birthdate: data.birthdate || "",
            phone: data.phone || "",
            profileURL: data.profileURL || currentUser.photoURL || "",
          });
          setEmail(data.email || currentUser.email || "");
        } else {
          await setDoc(userRef, {
            displayName: currentUser.displayName || "",
            birthdate: "",
            phone: "",
            profileURL: currentUser.photoURL || "",
            email: currentUser.email || "",
          });

          setProfileInfo({
            displayName: currentUser.displayName || "",
            birthdate: "",
            phone: "",
            profileURL: currentUser.photoURL || "",
          });
          setEmail(currentUser.email || "");
        }
      } catch (err) {
        console.error("Kunne ikke hente profil:", err);
        showToast("Kunne ikke hente profil.");
      }
    };

    loadData();
  }, [currentUser]);

  // ------------ THEME LOGIC ------------
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // ------------ UPDATE ACCOUNT INFO ------------
  const saveAccountInfo = async () => {
    try {
      setLoading(true);

      // valider fødselsdato
      if (profileInfo.birthdate) {
        const birthDateObj = new Date(profileInfo.birthdate);
        const minDate = new Date("1900-01-01");
        const maxDate = new Date();

        if (birthDateObj < minDate || birthDateObj > maxDate) {
          showToast("Fødselsdato skal være mellem 01-01-1900 og i dag.");
          return;
        }
      }

      const userRef = doc(db, "users", currentUser.uid);

      // Update Firestore
      await updateDoc(userRef, {
        displayName: profileInfo.displayName,
        birthdate: profileInfo.birthdate,
        phone: profileInfo.phone,
      });

      // Update Auth displayName
      await updateProfile(currentUser, {
        displayName: profileInfo.displayName,
      });

      // EMAIL CHANGE (requires re-auth)
      if (email && email !== currentUser.email) {
        const pwd = window.prompt(
          "For at ændre din email skal du bekræfte din adgangskode:"
        );

        if (!pwd) {
          showToast("Email blev ikke ændret – ingen adgangskode angivet.");
        } else {
          try {
            const cred = EmailAuthProvider.credential(currentUser.email, pwd);
            await reauthenticateWithCredential(currentUser, cred);
            await updateEmail(currentUser, email);

            // gem email i Firestore (valgfrit men nice)
            await updateDoc(userRef, { email });

            showToast("Emailadresse opdateret!");
          } catch (error) {
            console.error(error);
            if (error.code === "auth/wrong-password") {
              showToast("Forkert adgangskode – email blev ikke ændret.");
            } else if (error.code === "auth/email-already-in-use") {
              showToast("Den nye emailadresse er allerede i brug.");
            } else if (error.code === "auth/requires-recent-login") {
              showToast("Log ind igen for at kunne ændre email.");
            } else {
              showToast("Kunne ikke opdatere email.");
            }
          }
        }
      }

      showToast("Profil opdateret!");
    } catch (error) {
      console.error(error);
      showToast("Kunne ikke opdatere profil.");
    } finally {
      setLoading(false);
    }
  };

  // ------------ PROFILE PIC UPLOAD ------------
  const uploadProfilePic = async () => {
    if (!profilePic) return;

    setLoading(true);
    try {
      const fileRef = ref(storage, `profile/${currentUser.uid}`);
      await uploadBytes(fileRef, profilePic);

      const url = await getDownloadURL(fileRef);

      // Update Auth + Firestore
      await updateProfile(currentUser, { photoURL: url });
      await updateDoc(doc(db, "users", currentUser.uid), { profileURL: url });

      setProfileInfo((p) => ({ ...p, profileURL: url }));
      showToast("Profilbillede opdateret!");
    } catch (err) {
      console.error(err);
      showToast("Fejl ved upload.");
    } finally {
      setLoading(false);
    }
  };

  // ------------ PASSWORD CHANGE ------------
  const changePassword = async () => {
    setPwdError("");

    if (!pwdCurrent || !pwdNew || !pwdRepeat) {
      setPwdError("Udfyld alle felter.");
      return;
    }

    if (pwdNew.length < 8) {
      setPwdError("Adgangskoden skal være mindst 8 tegn.");
      return;
    }

    if (pwdNew !== pwdRepeat) {
      setPwdError("Adgangskoder matcher ikke.");
      return;
    }

    try {
      setLoading(true);

      const cred = EmailAuthProvider.credential(currentUser.email, pwdCurrent);
      await reauthenticateWithCredential(currentUser, cred);
      await updatePassword(currentUser, pwdNew);

      setPasswordModal(false);
      setPwdCurrent("");
      setPwdNew("");
      setPwdRepeat("");
      showToast("Adgangskode opdateret!");
    } catch (error) {
      console.error(error);
      setPwdError("Fejl: Forkert nuværende adgangskode.");
    } finally {
      setLoading(false);
    }
  };

  // ------------ DELETE USER DATA (NOT ACCOUNT) ------------
  const deleteUserData = async () => {
    try {
      setLoading(true);

      // 1) Delete CVs (kun brugerens folder)
      const userCvRef = ref(storage, `cv/${currentUser.uid}`);
      const userCVs = await listAll(userCvRef);
      await Promise.all(userCVs.items.map((item) => deleteObject(item)));

      // 2) Delete applications (await korrekt)
      const appsQuery = query(
        collection(db, "applications"),
        where("uid", "==", currentUser.uid)
      );
      const appsSnap = await getDocs(appsQuery);
      await Promise.all(
        appsSnap.docs.map((d) => deleteDoc(doc(db, "applications", d.id)))
      );

      // 3) Delete Firestore profile doc
      await deleteDoc(doc(db, "users", currentUser.uid));

      // 4) Log out user
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      showToast("Kunne ikke slette data.");
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  // ------------ PHONE INPUT HELPER ------------
  const handlePhoneChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 8);
    setProfileInfo({ ...profileInfo, phone: onlyDigits });
  };

  // ===================================================================
  // UI
  // ===================================================================
  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      {toast && (
        <div className="fixed top-24 right-6 px-4 py-3 rounded-xl bg-slate-800 text-white shadow-xl z-50">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-10 flex gap-6 p-4">
        {/* SIDEBAR */}
        <aside className="w-72 bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-6 border dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
            Indstillinger
          </h2>

          <nav className="space-y-2">
            {[
              { id: "general", label: "Generelt" },
              { id: "account", label: "Kontooplysninger" },
              { id: "security", label: "Sikkerhed & Privatliv" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium ${activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-10 border dark:border-slate-700">
          {/* GENERAL */}
          {activeTab === "general" && (
            <>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Generelt
              </h1>

              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Tema
              </h2>

              <div className="space-y-2">
                {["light", "dark", "system"].map((t) => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={theme === t}
                      onChange={() => setTheme(t)}
                    />
                    <span className="capitalize text-slate-700 dark:text-slate-200">
                      {t === "light"
                        ? "Lyst tema"
                        : t === "dark"
                          ? "Mørkt tema"
                          : "System (auto)"}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}

          {/* ACCOUNT */}
          {activeTab === "account" && (
            <>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Kontooplysninger
              </h1>

              <div className="flex gap-10">
                <div>
                  <img
                    src={profileInfo.profileURL || "https://i.imgur.com/3GvwNBf.png"}
                    alt="Profil"
                    className="w-32 h-32 rounded-full object-cover border dark:border-slate-600"
                  />

                  <input
                    type="file"
                    className="mt-3"
                    onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                  />

                  <button
                    onClick={uploadProfilePic}
                    disabled={loading || !profilePic}
                    className="mt-3 px-4 py-2 bg-indigo-600 disabled:opacity-60 text-white rounded-xl shadow hover:bg-indigo-700"
                  >
                    Upload
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300">
                      Navn
                    </label>
                    <input
                      type="text"
                      value={profileInfo.displayName}
                      onChange={(e) =>
                        setProfileInfo({ ...profileInfo, displayName: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300">
                      Fødselsdato
                    </label>
                    <input
                      type="date"
                      value={profileInfo.birthdate}
                      onChange={(e) =>
                        setProfileInfo({ ...profileInfo, birthdate: e.target.value })
                      }
                      min="1900-01-01"
                      max={todayStr}
                      className="w-full p-3 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300">
                      Telefonnummer
                    </label>
                    <input
                      type="tel"
                      value={profileInfo.phone}
                      onChange={handlePhoneChange}
                      maxLength={8}
                      inputMode="numeric"
                      className="w-full p-3 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300">
                      Emailadresse
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300">
                      BrugerID (UID)
                    </label>
                    <input
                      disabled
                      value={currentUser.uid}
                      className="w-full p-3 rounded-xl border bg-slate-100 dark:bg-slate-700 text-slate-600"
                    />
                  </div>

                  <button
                    onClick={saveAccountInfo}
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 disabled:opacity-60 text-white rounded-xl shadow hover:bg-indigo-700"
                  >
                    Gem ændringer
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Sikkerhed & Privatliv
              </h1>

              {/* Change password */}
              <div className="p-5 rounded-xl border dark:border-slate-700 mb-6 bg-slate-50 dark:bg-slate-900">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                      Adgangskode
                    </h2>
                    <p className="text-sm text-slate-500">
                      Opdater din adgangskode for øget sikkerhed.
                    </p>
                  </div>

                  <button
                    onClick={() => setPasswordModal(true)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                  >
                    Redigér
                  </button>
                </div>
              </div>

              {/* Download data */}
              <div className="p-5 rounded-xl border dark:border-slate-700 mb-6 bg-slate-50 dark:bg-slate-900">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Download dine data
                </h2>

                <button
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg"
                  onClick={() => alert("Implementerer JSON download når du ønsker")}
                >
                  Download data (JSON)
                </button>
              </div>

              {/* Delete data */}
              <div className="p-5 rounded-xl border dark:border-slate-700 bg-red-50 dark:bg-red-900">
                <h2 className="font-semibold text-red-600 dark:text-red-300 mb-2">
                  Slet alle dine data
                </h2>

                <p className="text-sm text-red-500 mb-3">
                  Dette sletter alle CV’er, ansøgninger og profilinformation – men ikke din konto.
                </p>

                <button
                  onClick={() => setDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Slet mine data
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* PASSWORD MODAL */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Skift adgangskode</h2>

            {pwdError && (
              <p className="mb-3 text-sm text-red-600 dark:text-red-400">{pwdError}</p>
            )}

            <label>Nuværende adgangskode</label>
            <input
              type="password"
              value={pwdCurrent}
              onChange={(e) => setPwdCurrent(e.target.value)}
              className="w-full p-3 mb-3 rounded-xl border dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
            />

            <label>Ny adgangskode</label>
            <input
              type="password"
              value={pwdNew}
              onChange={(e) => setPwdNew(e.target.value)}
              className="w-full p-3 mb-3 rounded-xl border dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
            />

            <label>Gentag ny adgangskode</label>
            <input
              type="password"
              value={pwdRepeat}
              onChange={(e) => setPwdRepeat(e.target.value)}
              className="w-full p-3 mb-6 rounded-xl border dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setPasswordModal(false)}
                className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-black dark:text-white rounded-lg"
              >
                Annuller
              </button>

              <button
                onClick={changePassword}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 disabled:opacity-60 text-white rounded-lg"
              >
                Gem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE DATA MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Vil du slette alle dine data?
            </h2>

            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Dette kan ikke fortrydes. Dine CV’er, ansøgninger og profilinformation slettes permanent.
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-black dark:text-white rounded-lg"
              >
                Annuller
              </button>

              <button
                onClick={deleteUserData}
                disabled={loading}
                className="px-4 py-2 bg-red-600 disabled:opacity-60 text-white rounded-lg"
              >
                Slet alt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
