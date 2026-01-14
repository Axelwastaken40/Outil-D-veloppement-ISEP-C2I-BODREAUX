// --- Variables principales ---
let jauges = {
    stabilite: 50,
    peur: 50,
    economie: 50,
    loyaute: 50,
    moral: 50
};
let documents = [];
let documentActuel = null;
let journal = [];

// --- Téléphone ---
let telephoneActif = false;
let telephoneMessages = [
    "Le Parti exige un rapport immédiat.",
    "Un espion a été repéré dans le secteur 7.",
    "Pénurie de charbon signalée dans le Nord.",
    "Le moral du peuple est en baisse.",
    "Un conseiller souhaite vous parler en privé.",
    "Le Ministère de la Sécurité attend votre décision."
];

function sonnerieTelephone() {
    if (!telephoneActif && Math.random() < 0.25) { // 25% de chance chaque document
        telephoneActif = true;
        const msg = telephoneMessages[Math.floor(Math.random()*telephoneMessages.length)];
        const notif = document.getElementById('notification-telephone');
        notif.textContent = msg;
        notif.style.display = 'block';
        // Effet sonore (optionnel)
        // let audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b7b2b7c.mp3');
        // audio.play();
    }
}

function repondreTelephone() {
    if (telephoneActif) {
        telephoneActif = false;
        document.getElementById('notification-telephone').style.display = 'none';
        journal.push("Appel téléphonique traité.");
        afficherJournal();
    }
}

// --- Générateur de dossiers complexes ---
function genererDossierComplexe() {
    const nomsCitoyens = ["Ivanov", "Petrov", "Smirnov", "Kuznetsov", "Popov", "Sokolov", "Volkov", "Morozov"];
    const nomsMinistres = ["Ministre de l'Intérieur", "Ministre de l'Économie", "Ministre de la Sécurité", "Ministre de la Propagande"];
    const motifs = ["comportement suspect", "liens avec l'opposition", "corruption", "sabotage", "pénurie", "protection d'un coupable", "rapport falsifié"];
    const indices = ["contradiction dans le rapport", "note manuscrite cachée", "témoignage incohérent", "preuve indirecte", "archive manquante", "dossier lié à un autre"];

    const citoyen = nomsCitoyens[Math.floor(Math.random()*nomsCitoyens.length)];
    const ministre = nomsMinistres[Math.floor(Math.random()*nomsMinistres.length)];
    const motif = motifs[Math.floor(Math.random()*motifs.length)];
    const indice = indices[Math.floor(Math.random()*indices.length)];
    const lien = Math.random() < 0.5 ? `Lié au dossier de ${nomsCitoyens[Math.floor(Math.random()*nomsCitoyens.length)]}` : `Protégé par ${ministre}`;
    const innocent = Math.random() < 0.5;
    const consequences = genererConsequences(motif, ministre);
    // Effet direct simplifié
    const effet = {
        stabilite: Math.floor(Math.random()*7)-3,
        peur: Math.floor(Math.random()*7)-3,
        economie: Math.floor(Math.random()*7)-3,
        loyaute: Math.floor(Math.random()*7)-3,
        moral: Math.floor(Math.random()*7)-3
    };
    return {
        titre: innocent ? "Dossier citoyen" : "Dossier suspect",
        contenu: `Nom : ${citoyen}<br>Motif : ${motif}<br>Indice : ${indice}<br>Lien : ${lien}`,
        effet,
        consequences
    };
}

function genererConsequences(motif, ministre) {
    let consequences = [];
    if(motif === "corruption") {
        consequences.push({type: "scandale", delai: 3, effet: {loyaute: -10, economie: -5}, message: "Scandale révélé dans le Parti."});
    }
    if(motif === "liens avec l'opposition") {
        consequences.push({type: "surveillance", delai: 2, effet: {securite: 5}, message: "Surveillance accrue des opposants."});
    }
    if(motif === "rapport falsifié") {
        consequences.push({type: "perte_confiance", delai: 4, effet: {loyaute: -8, moral: -6}, message: "Perte de confiance dans le Parti."});
    }
    if(motif === "protection d'un coupable") {
        consequences.push({type: "complot_ministre", delai: 5, effet: {securite: -7, loyaute: -5}, message: "Complot interne du ministre."});
        consequences.push({type: "risque_purge", delai: 6, effet: {loyaute: -12}, message: "Risque de purge interne."});
    }
    if(Math.random() < 0.3) {
        consequences.push({type: "revele_plus_tard", delai: 7, effet: {stabilite: -10}, message: "Un secret est révélé plus tard."});
    }
    return consequences;
}

// --- Importation du module de narration ---
// (En usage navigateur, remplacer module.exports par window.narrationModule)
// Simulé ici pour usage direct
const narrationModule = {
    personnages: [
        { id: "ministre_interieur", nom: "Ministre de l'Intérieur", motivation: "Pouvoir et sécurité", relation: "rival" },
        { id: "ministre_economie", nom: "Ministre de l'Économie", motivation: "Croissance et influence", relation: "allié" },
        { id: "agent_double", nom: "Agent Double", motivation: "Survie et manipulation", relation: "inconnu" },
        { id: "citoyen_dissident", nom: "Citoyen Dissident", motivation: "Justice et réforme", relation: "opposant" }
    ],
    arcsNarratifs: [
        {
            id: "mouvement_clandestin",
            titre: "Montée d’un mouvement clandestin",
            etapes: ["Rumeurs de réunions secrètes", "Découverte d’un réseau clandestin", "Manifestations discrètes", "Révolte ouverte ou répression"],
            jaugeDeclencheur: { peuple: "<40" },
            resolution: ["Révolte populaire", "Répression sanglante", "Réforme politique"]
        },
        {
            id: "rivalite_ministres",
            titre: "Rivalité entre deux ministres",
            etapes: ["Tensions dans les rapports", "Accusations mutuelles", "Scandale ou purge", "Changement d’alliances"],
            jaugeDeclencheur: { parti: "<50" },
            resolution: ["Purge interne", "Chantage", "Nouvelle alliance"]
        },
        {
            id: "crise_economique",
            titre: "Crise économique progressive",
            etapes: ["Pénuries récurrentes", "Grèves et ralentissements", "Intervention du Parti", "Effondrement ou relance"],
            jaugeDeclencheur: { economie: "<30" },
            resolution: ["Effondrement économique", "Relance", "Corruption accrue"]
        }
    ],
    evenementsDynamiques: [
        {
            id: "scandale_corruption",
            condition: { parti: "<40" },
            options: ["Purge", "Réforme", "Chantage", "Fuite d’informations", "Révolte locale"],
            consequence: function(choix) {
                switch(choix) {
                    case "Purge": return { parti: -10, securite: 5 };
                    case "Réforme": return { economie: 8, peuple: 5 };
                    case "Chantage": return { influence: 3, moral: -2 };
                    case "Fuite d’informations": return { stabilite: -7, peuple: 4 };
                    case "Révolte locale": return { peuple: -8, securite: -5 };
                    default: return {};
                }
            }
        }
    ],
    elementsNarratifs: [
        { type: "lettre_anonyme", contenu: "Le Parti vous surveille. Méfiez-vous de vos ministres." },
        { type: "rapport_secret", contenu: "Un agent double a infiltré le ministère de la Sécurité." },
        { type: "telephone", contenu: "Un investisseur étranger souhaite vous parler en privé." },
        { type: "visite_surprise", contenu: "Le ministre de l’Intérieur arrive sans prévenir." },
        { type: "document_falsifie", contenu: "Ce rapport semble avoir été modifié par un tiers." },
        { type: "rumeur", contenu: "On parle d’un réseau clandestin dans le Nord." }
    ],
    declencherArc: function(jauges) {
        return this.arcsNarratifs.filter(arc => {
            const [jauge, condition] = Object.entries(arc.jaugeDeclencheur)[0];
            if(condition.startsWith('<')) return jauges[jauge] < parseInt(condition.slice(1));
            if(condition.startsWith('>')) return jauges[jauge] > parseInt(condition.slice(1));
            return false;
        });
    },
    genererEvenement: function(jauges) {
        return this.evenementsDynamiques.filter(ev => {
            const [jauge, condition] = Object.entries(ev.condition)[0];
            if(condition.startsWith('<')) return jauges[jauge] < parseInt(condition.slice(1));
            if(condition.startsWith('>')) return jauges[jauge] > parseInt(condition.slice(1));
            return false;
        });
    },
    tirerElementNarratif: function() {
        return this.elementsNarratifs[Math.floor(Math.random()*this.elementsNarratifs.length)];
    }
};

// --- Initialisation de la journée ---
function nouvelleJournee() {
        documents = [];
        for(let i=0; i<5; i++) {
                documents.push(genererDossierComplexe());
        }
        afficherDocument(0);
        journal = [];
        documentActuel = 0;
        afficherJauges();
        // Narration dynamique : tirer un élément narratif
        const elementNarratif = narrationModule.tirerElementNarratif();
        journal.push(`[${elementNarratif.type}] ${elementNarratif.contenu}`);
        // Déclencher arcs narratifs selon jauges
        const arcs = narrationModule.declencherArc(jauges);
        arcs.forEach(arc => {
                journal.push(`[ARC] ${arc.titre} : ${arc.etapes[0]}`);
        });
        // Événements dynamiques
        const evs = narrationModule.genererEvenement(jauges);
        evs.forEach(ev => {
                journal.push(`[ÉVÉNEMENT] ${ev.id} : options ${ev.options.join(', ')}`);
        });
        afficherJournal();
}

// --- Affichage des jauges ---
function afficherJauges() {
    for(let k in jauges) {
        document.getElementById(k).textContent = jauges[k];
    }
}

// --- Générateur d'options immersives ---
function genererOptionsImmersives(doc) {
    // Options thématiques selon le motif du dossier
    const options = [];
    const motif = doc.contenu;
    // Exemples d'options, à adapter selon le contexte réel du dossier
    options.push({
        label: "Envoyer au Goulag",
        effet: { securite: 3, peur: 2, moral: -4 },
        description: "Détention politique sans procès"
    });
    options.push({
        label: "Rééducation idéologique",
        effet: { loyaute: 2, moral: -2 },
        description: "Propagande intensive et surveillance"
    });
    options.push({
        label: "Surveillance renforcée",
        effet: { securite: 2, peuple: -2 },
        description: "Mise sous écoute et filature"
    });
    options.push({
        label: "Ignorer le dossier",
        effet: { stabilite: -2, economie: 1 },
        description: "Ne pas agir, espérer le meilleur"
    });
    // Option rare
    if(Math.random() > 0.7) {
        options.push({
            label: "Exécution administrative",
            effet: { peur: 3, moral: -5, loyaute: -2 },
            description: "Suppression radicale, sans bruit"
        });
    }
    return options;
}

// --- Affichage des documents et options immersives ---
function afficherDocument(idx) {
    const pile = document.getElementById('pile-documents');
    pile.innerHTML = '';
    const actionsDiv = document.getElementById('actions-immersives');
    actionsDiv.innerHTML = '';
    if(documents[idx]) {
        const doc = documents[idx];
        pile.innerHTML = `<div class='document'><strong>${doc.titre}</strong><br>${doc.contenu}<br><em>Conséquences différées : ${doc.consequences.map(c=>c.type).join(', ') || 'Aucune'}</em></div>`;
        // Générer et afficher les options immersives
        const options = genererOptionsImmersives(doc);
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt.label;
            btn.title = opt.description;
            btn.onclick = function() {
                appliquerEffet(opt.effet, opt.label);
                documentActuel++;
                afficherDocument(documentActuel);
            };
            actionsDiv.appendChild(btn);
        });
        sonnerieTelephone();
    } else {
        pile.innerHTML = '<em>Fin de la journée. Cliquez pour recommencer.</em>';
        actionsDiv.innerHTML = '';
    }
}

// --- Affichage du journal ---
function afficherJournal() {
    document.getElementById('journal').innerHTML = journal.join('<br>');
}

// --- Actions du joueur ---
function appliquerEffet(effet, action) {
    // Effet direct
    for(let k in effet) {
        jauges[k] += effet[k];
        jauges[k] = Math.max(0, Math.min(100, jauges[k]));
    }
    // Conséquences différées
    if(documents[documentActuel] && documents[documentActuel].consequences) {
        documents[documentActuel].consequences.forEach(conseq => {
            setTimeout(() => {
                for(let k in conseq.effet) {
                    jauges[k] += conseq.effet[k];
                    jauges[k] = Math.max(0, Math.min(100, jauges[k]));
                }
                journal.push(`Conséquence différée : ${conseq.message}`);
                afficherJauges();
                afficherJournal();
            }, conseq.delai * 1000); // delai en secondes
        });
    }
    journal.push(`Document traité : ${action}`);
    afficherJauges();
    afficherJournal();
}

// Les anciennes fonctions d'action ne sont plus utilisées (remplacées par les options immersives)

// --- Lancer le jeu ---
window.onload = nouvelleJournee;
