// src/components/Profile.jsx
import Navbar from "./Navbar";

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto py-12 px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profil</h1>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <p className="text-gray-700 mb-4">Brugerindstillinger kommer her…</p>
        </div>
      </main>
    </div>
  );
}
