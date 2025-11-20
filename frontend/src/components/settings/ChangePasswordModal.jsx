// src/components/settings/ChangePasswordModal.jsx

import { useState } from "react";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "firebase/auth";

export default function ChangePasswordModal({ authUser, onClose, onSuccess }) {
    const [current, setCurrent] = useState("");
    const [pwd1, setPwd1] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pwdError, setPwdError] = useState("");

    const submit = async () => {
        setError(null);

        if (pwd1.length < 8) {
            setError("Adgangskoden skal være mindst 8 tegn.");
            return;
        }

        if (pwd1 !== pwd2) {
            setError("Adgangskoderne matcher ikke.");
            return;
        }

        try {
            setLoading(true);

            const cred = EmailAuthProvider.credential(authUser.email, current);
            await reauthenticateWithCredential(authUser, cred);
            await updatePassword(authUser, pwd1);

            onSuccess("Adgangskode opdateret!");
            onClose();
        } catch (err) {
            console.error(err);
            setError("Kunne ikke opdatere adgangskoden. Tjek det nuværende password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">

                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
                    Skift adgangskode
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <label className="text-sm font-medium">Nuværende adgangskode</label>
                <input
                    type="password"
                    className="w-full p-3 mb-3 rounded-xl border dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                />

                <label className="text-sm font-medium">Ny adgangskode</label>
                <input
                    type="password"
                    className="w-full p-3 mb-3 rounded-xl border dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                    value={pwd1}
                    onChange={(e) => setPwd1(e.target.value)}
                />

                <label className="text-sm font-medium">Gentag ny adgangskode</label>
                <input
                    type="password"
                    className="w-full p-3 mb-6 rounded-xl border dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                    value={pwd2}
                    onChange={(e) => setPwd2(e.target.value)}
                />

                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-black dark:text-white rounded-lg"
                    >
                        Annuller
                    </button>

                    <button
                        onClick={submit}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {loading ? "Gemmer..." : "Gem"}
                    </button>
                </div>
            </div>
        </div>
    );
}
