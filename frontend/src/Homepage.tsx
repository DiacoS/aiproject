import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';

function Homepage() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-12 px-8 text-center shadow-md">
        <h1 className="m-0 text-5xl font-bold tracking-tight md:text-4xl">Velkommen til AI Project</h1>
        <p className="mt-2 text-xl opacity-90 font-light md:text-base">Din AI-drevne løsning</p>
        {currentUser && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="m-0 text-base opacity-95">Logget ind som: {currentUser.email}</p>
            <button 
              onClick={logout} 
              className="bg-white/20 text-white border-2 border-white px-6 py-2 rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-white/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Log ud
            </button>
          </div>
        )}
      </header>
      
      <main className="flex-1 max-w-6xl w-full mx-auto py-16 px-8 md:py-8 md:px-4">
        {currentUser ? (
          <section className="text-center py-8">
            <h2 className="text-4xl mb-4 text-gray-800 md:text-3xl">Velkommen tilbage!</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">Du er nu logget ind og klar til at bruge applikationen.</p>
          </section>
        ) : (
          <Login />
        )}
      </main>
      
      <footer className="bg-gray-100 py-8 px-8 text-center text-gray-600 border-t border-gray-300">
        <p className="m-0 text-sm">&copy; 2025 AI Project. Alle rettigheder forbeholdes.</p>
      </footer>
    </div>
  );
}

export default Homepage;

