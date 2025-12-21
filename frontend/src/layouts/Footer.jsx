import { Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold">Ansøgningsværktøj</p>
                            <p className="text-xs text-white/60">AI-drevet ansøgningsgenerator</p>
                        </div>
                    </div>

                    <div className="text-sm text-white/60 text-center md:text-right">
                        <p>Udviklet af Diaco & Morten</p>
                        <p>Datamatiker hovedopgave · 2024</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
