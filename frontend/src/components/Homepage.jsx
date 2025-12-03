import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Login from './Login';
import Navbar from './Navbar.jsx';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Clock, 
  FileText, 
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

import AiForm from './AiForm.jsx';

function Homepage() {
  const { currentUser } = useAuth();

  // ------------------- UI -------------------
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {currentUser ? (
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
              <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(0deg,white,transparent)]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
              
              <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white/90">AI-drevet ansøgningsgenerering</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Skriv den perfekte
                    <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      jobansøgning på sekunder
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Lad AI'en skrive professionelle, skræddersyede ansøgninger baseret på dit CV og jobopslaget. 
                    Spar timer og øg dine chancer for at få drømmejobbet.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 text-white/70 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>100% skræddersyet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>Professionel kvalitet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>Hurtig generering</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </section>

         

            {/* CTA Section - Form */}
            <section className="py-16 md:py-20 bg-white">
              <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Generér din første ansøgning nu
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Udfyld formularen nedenfor, og få en professionel ansøgning på sekunder
                  </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10">
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">AI Ansøgningsgenerator</h3>
                        <p className="text-gray-600 text-sm">Skræddersyet til dit næste job</p>
                      </div>
                    </div>
                  </div>
                  
                  <AiForm />
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Om projektet
                  </h3>
                  <p className="text-gray-600">
                    Udviklet som hovedopgave til datamatiker eksamen
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Diaco & Morten
                    </div>
                    <div className="text-gray-600 font-medium">Udviklere bag projektet</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      Hovedopgave
                    </div>
                    <div className="text-gray-600 font-medium">Datamatiker eksamen 2024</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                      AI & Firebase
                    </div>
                    <div className="text-gray-600 font-medium">Moderne teknologi stack</div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
}

export default Homepage;
