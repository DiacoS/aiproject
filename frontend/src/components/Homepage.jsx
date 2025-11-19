import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import { Upload, FileText, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { useState } from 'react';

function Homepage() {
  const { currentUser, logout } = useAuth();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Fil uploadet:', file.name);
      // Her kan du tilføje din upload-logik
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      console.log('Fil droppet:', file.name);
      // Her kan du tilføje din upload-logik
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-6 px-8 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">AI Ansøgningsgenerator</h1>
          </div>
          {currentUser && (
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-90 hidden md:inline">{currentUser.email}</span>
              <button 
                onClick={logout} 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                Log ud
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 max-w-6xl w-full mx-auto py-12 px-8">
        {currentUser ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-4">
              <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-2">
                ✨ AI-Drevet Teknologi
              </div>
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Skab den perfekte <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ansøgning</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Upload dit CV og lad vores AI generere skræddersyede jobansøgninger på få sekunder
              </p>
            </section>

            {/* Upload Section */}
            <section className="max-w-3xl mx-auto">
              <div 
                className={`relative border-3 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-50 scale-105' 
                    : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'
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
                  <button 
                    type="button"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Vælg fil
                  </button>
                </label>
              </div>
            </section>

            {/* Features Section */}
            <section className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lynhurtig AI</h3>
                <p className="text-gray-600">
                  Generer professionelle ansøgninger på under 30 sekunder
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Skræddersyet Indhold</h3>
                <p className="text-gray-600">
                  AI'en tilpasser ansøgningen til jobbets specifikke krav
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professionel Kvalitet</h3>
                <p className="text-gray-600">
                  Ansøgninger skrevet af AI trænet på tusindvis af succesfulde eksempler
                </p>
              </div>
            </section>

            {/* How It Works */}
            <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-10 mt-12">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Sådan virker det</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    1
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Upload CV</h4>
                  <p className="text-gray-600">Upload dit CV, så analyserer AI'en dine kompetencer</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    2
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Angiv jobkrav</h4>
                  <p className="text-gray-600">Indsæt jobbeskrivelsen eller nøglekrav</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    3
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Få din ansøgning</h4>
                  <p className="text-gray-600">AI'en genererer en professionel, skræddersyet ansøgning</p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <Login />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8 px-8 text-center text-gray-600">
        <p className="text-sm">&copy; 2025 AI Ansøgningsgenerator. Alle rettigheder forbeholdes.</p>
      </footer>
    </div>
  );
}

export default Homepage;