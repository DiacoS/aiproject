// src/components/settings/ConnectionItem.jsx

export default function ConnectionItem({
    name,
    providerId,
    isConnected,
    onConnect,
    onDisconnect,
    comingSoon = false,
}) {
    return (
        <div className="flex justify-between items-center p-4 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900">

            <span className="font-medium text-slate-800 dark:text-slate-200">
                {name}
            </span>

            {comingSoon ? (
                <button className="px-4 py-2 bg-slate-400 text-white rounded-lg cursor-not-allowed">
                    Kommer snart
                </button>
            ) : isConnected ? (
                <button
                    onClick={() => onDisconnect(providerId)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                    Fjern
                </button>
            ) : (
                <button
                    onClick={onConnect}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    Tilslut
                </button>
            )}
        </div>
    );
}
