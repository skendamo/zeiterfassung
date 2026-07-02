// ===============================
// Zeiterfassung V2
// ===============================

const nameInput = document.getElementById("name");
const historieListe = document.getElementById("historie");
const gesamtzeit = document.getElementById("gesamtzeit");

const btnKommen = document.getElementById("btnKommen");
const btnPauseStart = document.getElementById("btnPauseStart");
const btnPauseEnde = document.getElementById("btnPauseEnde");
const btnGehen = document.getElementById("btnGehen");

let historie = JSON.parse(localStorage.getItem("historie")) || [];

let status = localStorage.getItem("status") || "bereit";

let startZeit = localStorage.getItem("startZeit");
let pauseStart = localStorage.getItem("pauseStart");
let pauseGesamt = Number(localStorage.getItem("pauseGesamt")) || 0;


// Name laden

nameInput.value = localStorage.getItem("mitarbeiter") || "";

nameInput.oninput = () => {

    localStorage.setItem("mitarbeiter", nameInput.value);

};


// Uhr

setInterval(updateClock,1000);

updateClock();

setInterval(updateArbeitszeit,1000);

anzeigen();

updateButtons();


// -------------------------------

function updateClock(){

    const now = new Date();

    document.getElementById("datum").innerHTML =
        now.toLocaleDateString("de-CH");

    document.getElementById("uhr").innerHTML =
        now.toLocaleTimeString("de-CH");

}


// -------------------------------

function stempeln(aktion){

    const jetzt = new Date();

    const zeit = jetzt.toLocaleTimeString("de-CH");

    switch(aktion){

        case "Kommen":

            startZeit = jetzt.getTime();

            status = "arbeiten";

        break;


        case "Pause Start":

            pauseStart = jetzt.getTime();

            status = "pause";

        break;


        case "Pause Ende":

            pauseGesamt +=

                Math.floor(

                    (jetzt.getTime()-pauseStart)/1000

                );

            pauseStart = null;

            status = "arbeiten";

        break;


        case "Gehen":

            status = "fertig";

        break;

    }


    historie.push({

        zeit:zeit,

        aktion:aktion

    });


    speichern();

    anzeigen();

    updateButtons();

}


// -------------------------------

function anzeigen(){

    historieListe.innerHTML="";

    historie.forEach(e=>{

        let farbe="";

        switch(e.aktion){

            case "Kommen":

                farbe="green";

            break;

            case "Pause Start":

                farbe="orange";

            break;

            case "Pause Ende":

                farbe="dodgerblue";

            break;

            case "Gehen":

                farbe="red";

            break;

        }

        historieListe.innerHTML +=

        `<li>

            <span style="
                display:inline-block;
                width:12px;
                height:12px;
                border-radius:50%;
                background:${farbe};
                margin-right:15px;
            "></span>

            ${e.zeit}

            &nbsp;&nbsp;

            ${e.aktion}

        </li>`;

    });

}


// -------------------------------

function updateArbeitszeit(){

    if(!startZeit){

        gesamtzeit.innerHTML="00:00";

        return;

    }

    let jetzt = Date.now();

    let sekunden =

        Math.floor(

            (jetzt-startZeit)/1000

        )-pauseGesamt;

    if(status=="pause"){

        sekunden -= Math.floor(

            (jetzt-pauseStart)/1000

        );

    }

    if(sekunden<0)

        sekunden=0;

    let h=Math.floor(sekunden/3600);

    let m=Math.floor((sekunden%3600)/60);

    gesamtzeit.innerHTML=

        String(h).padStart(2,"0")

        +":"

        +String(m).padStart(2,"0");

}


// -------------------------------

function updateButtons(){

    btnKommen.disabled=false;
    btnPauseStart.disabled=true;
    btnPauseEnde.disabled=true;
    btnGehen.disabled=true;

    if(status=="arbeiten"){

        btnKommen.disabled=true;
        btnPauseStart.disabled=false;
        btnGehen.disabled=false;

    }

    if(status=="pause"){

        btnKommen.disabled=true;
        btnPauseStart.disabled=true;
        btnPauseEnde.disabled=false;

    }

    if(status=="fertig"){

        btnKommen.disabled=true;
        btnPauseStart.disabled=true;
        btnPauseEnde.disabled=true;
        btnGehen.disabled=true;

    }

}


// -------------------------------

function speichern(){

    localStorage.setItem(

        "historie",

        JSON.stringify(historie)

    );

    localStorage.setItem(

        "status",

        status

    );

    localStorage.setItem(

        "startZeit",

        startZeit

    );

    localStorage.setItem(

        "pauseStart",

        pauseStart

    );

    localStorage.setItem(

        "pauseGesamt",

        pauseGesamt

    );

}


// -------------------------------

function neuerTag(){

    if(!confirm("Neuen Tag beginnen?"))

        return;

    historie=[];

    status="bereit";

    startZeit=null;

    pauseStart=null;

    pauseGesamt=0;

    localStorage.clear();

    anzeigen();

    updateButtons();

    updateArbeitszeit();

}


// -------------------------------

function teilen(){

    let text="ZEITERFASSUNG\n\n";

    text+="Mitarbeiter: "+nameInput.value+"\n";

    text+="Datum: "+new Date().toLocaleDateString("de-CH")+"\n\n";

    historie.forEach(e=>{

        text+=e.zeit+"   "+e.aktion+"\n";

    });

    text+="\nGesamtarbeitszeit: "+gesamtzeit.innerHTML;

    if(navigator.share){

        navigator.share({

            title:"Zeiterfassung",

            text:text

        });

    }else{

        navigator.clipboard.writeText(text);

        alert("Bericht wurde kopiert.");

    }

}
