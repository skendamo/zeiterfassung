// Live-Uhr
function updateClock() {
    const now = new Date();

    document.getElementById("datum").innerHTML =
        "📅 " + now.toLocaleDateString("de-CH");

    document.getElementById("uhr").innerHTML =
        "🕒 " + now.toLocaleTimeString("de-CH");
}

setInterval(updateClock, 1000);
updateClock();


// Name speichern
const nameInput = document.getElementById("name");

nameInput.value = localStorage.getItem("mitarbeiter") || "";

nameInput.addEventListener("input", () => {
    localStorage.setItem("mitarbeiter", nameInput.value);
});


// Historie laden
let historie = JSON.parse(localStorage.getItem("historie")) || [];

anzeigen();


// Neue Buchung
function stempeln(aktion) {

    const zeit = new Date().toLocaleTimeString("de-CH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    historie.push({
        zeit: zeit,
        aktion: aktion
    });

    localStorage.setItem("historie", JSON.stringify(historie));

    anzeigen();
}


// Historie anzeigen
function anzeigen() {

    const liste = document.getElementById("historie");

    liste.innerHTML = "";

    historie.forEach(eintrag => {

        const li = document.createElement("li");

        li.innerHTML =
            "<strong>" +
            eintrag.zeit +
            "</strong> &nbsp; " +
            eintrag.aktion;

        liste.appendChild(li);

    });

}


// Bericht teilen
function teilen() {

    const name = document.getElementById("name").value || "Mitarbeiter";

    let text = "🕒 Zeiterfassung\n\n";

    text += "Name: " + name + "\n";
    text += "Datum: " + new Date().toLocaleDateString("de-CH") + "\n\n";

    historie.forEach(e => {
        text += e.zeit + "  " + e.aktion + "\n";
    });

    if (navigator.share) {

        navigator.share({
            title: "Zeiterfassung",
            text: text
        });

    } else {

        navigator.clipboard.writeText(text);

        alert("Bericht wurde in die Zwischenablage kopiert.");

    }

}


// Neuer Tag
function neuerTag() {

    if (!confirm("Historie wirklich löschen?"))
        return;

    historie = [];

    localStorage.removeItem("historie");

    anzeigen();

}
