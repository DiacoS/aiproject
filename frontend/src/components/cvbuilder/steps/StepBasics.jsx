export default function StepBasics({ cv, setCv }) {
    const b = cv.basics;

    function set(field, value) {
        setCv((prev) => ({ ...prev, basics: { ...prev.basics, [field]: value } }));
    }

    return (
        <section className="cvStep">
            <header className="cvStepHeader">
                <h2 className="cvStepTitle">Basics</h2>
                <p className="cvStepHint">
                    Udfyld dine kontaktoplysninger – de vises øverst i dit CV.
                </p>
            </header>

            {/* Card: Personlige oplysninger */}
            <div className="cvCard">
                <div className="cvCardHeader">
                    <h3 className="cvCardTitle">Personlige oplysninger</h3>
                </div>

                <div className="cvGrid">
                    <div className="cvField">
                        <label className="cvLabel">Fulde navn</label>
                        <input
                            className="cvInput"
                            placeholder="Fx Morten Friis Davidsen"
                            value={b.fullName}
                            onChange={(e) => set("fullName", e.target.value)}
                        />
                    </div>

                    <div className="cvField">
                        <label className="cvLabel">Titel / Headline</label>
                        <input
                            className="cvInput"
                            placeholder="Fx Datamatikerstuderende · Full-stack udvikler"
                            value={b.headline}
                            onChange={(e) => set("headline", e.target.value)}
                        />
                    </div>

                    <div className="cvField">
                        <label className="cvLabel">By</label>
                        <input
                            className="cvInput"
                            placeholder="Fx Næstved"
                            value={b.location}
                            onChange={(e) => set("location", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Card: Kontakt */}
            <div className="cvCard">
                <div className="cvCardHeader">
                    <h3 className="cvCardTitle">Kontakt</h3>
                </div>

                <div className="cvGrid2">
                    <div className="cvField">
                        <label className="cvLabel">Email</label>
                        <input
                            className="cvInput"
                            placeholder="Fx morten@mail.dk"
                            value={b.email}
                            onChange={(e) => set("email", e.target.value)}
                        />
                    </div>

                    <div className="cvField">
                        <label className="cvLabel">Telefon</label>
                        <input
                            className="cvInput"
                            placeholder="Fx +45 12 34 56 78"
                            value={b.phone}
                            onChange={(e) => set("phone", e.target.value)}
                        />
                    </div>
                </div>

                <div className="cvGrid">
                    <div className="cvField">
                        <label className="cvLabel">LinkedIn</label>
                        <input
                            className="cvInput"
                            placeholder="https://linkedin.com/in/..."
                            value={b.linkedin}
                            onChange={(e) => set("linkedin", e.target.value)}
                        />
                    </div>

                    <div className="cvField">
                        <label className="cvLabel">GitHub</label>
                        <input
                            className="cvInput"
                            placeholder="https://github.com/..."
                            value={b.github}
                            onChange={(e) => set("github", e.target.value)}
                        />
                    </div>

                    <div className="cvField">
                        <label className="cvLabel">Website / Portfolio</label>
                        <input
                            className="cvInput"
                            placeholder="https://..."
                            value={b.website}
                            onChange={(e) => set("website", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Card: Profiltekst */}
            <div className="cvCard">
                <div className="cvCardHeader cvCardHeaderRow">
                    <div>
                        <h3 className="cvCardTitle">Profiltekst</h3>
                        <p className="cvCardSub">
                            En kort intro der matcher jobbet (kan også genereres med AI).
                        </p>
                    </div>

                    {/* Hvis du har en AI-knap senere kan den sidde her */}
                    {/* <button className="cvBtn">AI-forslag</button> */}
                </div>

                <div className="cvField">
                    <textarea
                        className="cvTextarea"
                        rows={6}
                        placeholder="Skriv 3-6 linjer om dig selv, dine styrker og hvad du søger..."
                        value={cv.summary}
                        onChange={(e) => setCv((prev) => ({ ...prev, summary: e.target.value }))}
                    />
                </div>
            </div>
        </section>
    );
}
