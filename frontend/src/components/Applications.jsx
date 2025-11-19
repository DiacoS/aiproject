// frontend/src/components/Applications.jsx
import Navbar from "./Navbar.jsx";

export default function Applications() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto py-12 px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Dine ansøgninger</h2>
        <p className="text-gray-600">
          Her kan du senere vise gemte/genererede ansøgninger.
        </p>
      </main>
    </div>
  );
}
