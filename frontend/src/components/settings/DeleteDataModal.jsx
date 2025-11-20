// src/components/settings/DeleteDataModal.jsx

import { deleteDoc, doc, getDocs, query, where, collection } from "firebase/firestore";
import { listAll, deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../firebase";

export default function DeleteDataModal({ user, onClose, onSuccess }) {

    const deleteData = async () => {
        try {
            // 1) Delete CVs in /cv/
            const cvFolder = ref(storage, `cv/`);
            const allFiles = await listAll(cvFolder);

            for (const item of allFiles.items) {
                const name = item.name;
                // Only delete this user's files
                if (name.includes(user.uid)) {
                    await deleteObject(item);
                }
            }

            // 2) Delete Firestore: applications
            const appsQuery = query(
                collection(db, "applications"),
                where("uid", "==", user.uid)
            );

            const snap = await getDocs(appsQuery);
            snap.forEach((d) => deleteDoc(doc(db, "applications", d.id)));

            // 3) Delete Firestore user document
            await deleteDoc(doc(db, "users", user.uid));

            onSuccess("Alle brugerdata er slettet.");
            onClose();
        } catch (err) {
            console.error(err);
            onSuccess("Fejl ved sletning af data.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-full max-w-md shadow-xl">

                <h2 className="text-xl font-bold text-red-600 mb-4">
                    Slet alle dine data?
                </h2>

                <p className="text-slate-700 dark:text-slate-300 mb-6">
                    Dette vil slette alle dine CV'er, ansøgninger og profilinformation permanent.
                </p>

                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-300 dark:bg-slate-700 rounded-lg text-black dark:text-white"
                    >
                        Annuller
                    </button>

                    <button
                        onClick={deleteData}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                        Slet alt
                    </button>
                </div>
            </div>
        </div>
    );
}
