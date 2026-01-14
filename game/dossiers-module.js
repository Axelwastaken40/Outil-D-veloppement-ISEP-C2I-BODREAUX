// Module de génération de dossiers complexes et gestion des conséquences

const nomsCitoyens = ["Ivanov", "Petrov", "Smirnov", "Kuznetsov", "Popov", "Sokolov", "Volkov", "Morozov"];
const nomsMinistres = ["Ministre de l'Intérieur", "Ministre de l'Économie", "Ministre de la Sécurité", "Ministre de la Propagande"];
const motifs = ["comportement suspect", "liens avec l'opposition", "corruption", "sabotage", "pénurie", "protection d'un coupable", "rapport falsifié"];
const indices = ["contradiction dans le rapport", "note manuscrite cachée", "témoignage incohérent", "preuve indirecte", "archive manquante", "dossier lié à un autre"];

function genererDossierComplexe() {
    // Génère un dossier avec contradictions, indices et liens
    const citoyen = nomsCitoyens[Math.floor(Math.random()*nomsCitoyens.length)];
    const ministre = nomsMinistres[Math.floor(Math.random()*nomsMinistres.length)];
    const motif = motifs[Math.floor(Math.random()*motifs.length)];
    const indice = indices[Math.floor(Math.random()*indices.length)];
    const lien = Math.random() < 0.5 ? `Lié au dossier de ${nomsCitoyens[Math.floor(Math.random()*nomsCitoyens.length)]}` : `Protégé par ${ministre}`;
    return {
        nom: citoyen,
        motif: motif,
        indice: indice,
        lien: lien,
        innocent: Math.random() < 0.5,
        consequences: genererConsequences(motif, ministre)
    };
}

function genererConsequences(motif, ministre) {
    // Génère des conséquences indirectes et différées
    let consequences = [];
    if(motif === "corruption") {
        consequences.push({type: "scandale", delai: 3, effet: {parti: -10, economie: -5}});
    }
    if(motif === "liens avec l'opposition") {
        consequences.push({type: "surveillance", delai: 2, effet: {securite: 5}});
    }
    if(motif === "rapport falsifié") {
        consequences.push({type: "perte_confiance", delai: 4, effet: {parti: -8, peuple: -6}});
    }
    if(motif === "protection d'un coupable") {
        consequences.push({type: "complot_ministre", delai: 5, effet: {securite: -7, parti: -5}});
        consequences.push({type: "risque_purge", delai: 6, effet: {parti: -12}});
    }
    // Conséquence cachée si le ministre est impliqué
    if(Math.random() < 0.3) {
        consequences.push({type: "revele_plus_tard", delai: 7, effet: {stabilite: -10}});
    }
    return consequences;
}

// Exemple d'utilisation
// const dossier = genererDossierComplexe();
// console.log(dossier);

module.exports = { genererDossierComplexe };
