import { useAuth } from "../contexts/AuthContext";
import {
    Sparkles,
    FileText,
    Home,
    LogOut,
    Menu,
    X,
    Settings,
    User,
    ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const { currentUser, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Fejl ved logout:", error);
        }
    };

    return (
        <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white sticky top-0 z-50 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <button
                        onClick={() => navigateTo("/")}
                        className="flex items-center gap-3 group"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                                Ansøgningsværktøj
                            </h1>
                            <p className="text-xs text-purple-300 font-medium">
                                Den nemme vej til en stærk ansøgning
                            </p>
                        </div>
                    </button>

                    {/* Desktop nav */}
                    {currentUser && (
                        <>
                            <nav className="hidden md:flex items-center gap-2">
                                <NavBtn icon={Home} label="Hjem" onClick={() => navigateTo("/")} />
                                <NavBtn
                                    icon={FileText}
                                    label="CV"
                                    onClick={() => navigateTo("/cv")}
                                />
                                <NavBtn
                                    icon={FileText}
                                    label="Ansøgninger"
                                    onClick={() => navigateTo("/ansøgninger")}
                                />

                                <div className="w-px h-8 bg-white/20 mx-2" />

                                {/* Profile dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen((v) => !v)}
                                        onBlur={() =>
                                            setTimeout(() => setDropdownOpen(false), 200)
                                        }
                                        className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 border border-white/20 hover:bg-white/15 transition"
                                    >
                                        <Avatar email={currentUser.email} photoURL={currentUser.photoURL} />
                                        <span className="text-sm hidden lg:inline">
                                            {currentUser.email}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition ${dropdownOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden">

                                            <div className="p-3 border-b border-white/10">
                                                <p className="text-sm font-medium">
                                                    {currentUser.email}
                                                </p>
                                                <p className="text-xs text-white/60">Online</p>
                                            </div>

                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group"

                                                >
                                                    <User className="w-4 h-4" />
                                                    Rediger profil
                                                </Link>
                                            </div>

                                            <div className="border-t border-white/10 py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"

                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Log ud
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </nav>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen((v) => !v)}
                                className="md:hidden p-2 rounded-lg hover:bg-white/10"
                            >
                                {mobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile nav */}
                {currentUser && mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-2">
                        <MobileBtn label="Hjem" onClick={() => navigateTo("/")} />
                        <MobileBtn label="CV" onClick={() => navigateTo("/cv")} />
                        <MobileBtn
                            label="Ansøgninger"
                            onClick={() => navigateTo("/ansøgninger")}
                        />

                        <div className="pt-2 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                            >
                                <LogOut className="w-5 h-5" />
                                Log ud
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}

/* ---------- små sub-components ---------- */

function NavBtn({ icon: Icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition"
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}

function MobileBtn({ label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10"
        >
            {label}
        </button>
    );
}

function Avatar({ email, photoURL }) {
    return (
        <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                {photoURL ? (
                    <img
                        src={photoURL}
                        alt="Profil"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-sm font-bold text-white">
                        {email?.charAt(0)?.toUpperCase()}
                    </span>
                )}
            </div>

            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900" />
        </div>
    );
}

