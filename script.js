// ---------- Uhr ----------
function updateClock() {
    const now = new Date();

    document.getElementById("datum").innerHTML =
        "📅 " + now.toLocaleDateString("de-CH");

    document.getElementById("uhr").innerHTML =
        "🕒 " + now.toLocaleTimeString("de-CH");
}

setInterval(updateClock,1000);
updateClock();


// ---------- Name ----------
const nameInput=document.getElementById("name");

nameInput.value=localStorage.getItem("mitarbeiter")||"";

nameInput.addEventListener("input",()=>{
    localStorage.setItem("mitarbeiter",nameInput.value);
});


// ---------- Daten ----------
let historie=JSON.parse(localStorage.getItem("historie"))||[];

let status=localStorage.getItem("status")||"";

let startZeit=null;
let pauseStart=null;
let pauseMinuten=0;


// Historie anzeigen
anzeigen();


// ---------- Stempeln ----------
function stempeln(aktion){

    const jetzt=new Date();

    const zeit=jetzt.toLocaleTimeString("de-CH",{
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit"
    });

    switch(aktion){

        case "🟢 Kommen":

            if(status!==""){
                alert("Du bist bereits gekommen.");
                return;
            }

            status="arbeiten";
            startZeit=jetzt.getTime();

        break;


        case "☕ Pause Start":

            if(status!=="arbeiten"){
                alert("Zuerst kommen.");
                return;
            }

            status="pause";
            pauseStart=jetzt.getTime();

        break;


        case "▶️ Pause Ende":

            if(status!=="pause"){
                alert("Keine Pause gestartet.");
                return;
            }

            status="arbeiten";

            pauseMinuten+=Math.floor((jetzt.getTime()-pauseStart)/60000);

        break;


        case "🔴 Gehen":

            if(status===""){
                alert("Du musst zuerst kommen.");
                return;
            }

            const ende=jetzt.getTime();

            const arbeitsMinuten=Math.floor(
                (ende-startZeit)/60000
            )-pauseMinuten;

            historie.push({
                zeit:zeit,
                aktion:aktion
            });

            historie.push({
                zeit:"",
                aktion:"Gesamtarbeitszeit: "+formatZeit(arbeitsMinuten)
            });

            status="";

            speichern();

            anzeigen();

            return;

    }


    historie.push({
        zeit:zeit,
        aktion:aktion
    });

    speichern();

    anzeigen();

}



// ---------- Speichern ----------
function speichern(){

    localStorage.setItem(
        "historie",
        JSON.stringify(historie)
    );

    localStorage.setItem(
        "status",
        status
    );

}



// ---------- Anzeige ----------
function anzeigen(){

    const liste=document.getElementById("historie");

    liste.innerHTML="";

    historie.forEach(e=>{

        const li=document.createElement("li");

        li.innerHTML="<strong>"+e.zeit+"</strong> "+e.aktion;

        liste.appendChild(li);

    });

}



// ---------- Minuten formatieren ----------
function formatZeit(min){

    const h=Math.floor(min/60);

    const m=min%60;

    return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");

}



// ---------- Teilen ----------
function teilen(){

    const name=nameInput.value||"Mitarbeiter";

    let text="ZEITERFASSUNG\n\n";

    text+="Name: "+name+"\n";

    text+="Datum: "+new Date().toLocaleDateString("de-CH")+"\n\n";

    historie.forEach(e=>{

        text+=e.zeit+" "+e.aktion+"\n";

    });

    if(navigator.share){

        navigator.share({

            title:"Zeiterfassung",

            text:text

        });

    }else{

        navigator.clipboard.writeText(text);

        alert("Bericht kopiert.");

    }

}



// ---------- Neuer Tag ----------
function neuerTag(){

    if(!confirm("Neuen Tag beginnen?"))
        return;

    historie=[];

    status="";

    startZeit=null;

    pauseStart=null;

    pauseMinuten=0;

    localStorage.removeItem("historie");

    localStorage.removeItem("status");

    anzeigen();

}
