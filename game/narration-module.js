// Module de narration dynamique et stratégie pour jeu bureaucratique autoritaire

// Personnages récurrents
const personnages = [
  { id: "ministre_interieur", nom: "Ministre de l'Intérieur", motivation: "Pouvoir et sécurité", relation: "rival" },
  { id: "ministre_economie", nom: "Ministre de l'Économie", motivation: "Croissance et influence", relation: "allié" },
  { id: "agent_double", nom: "Agent Double", motivation: "Survie et manipulation", relation: "inconnu" },
  { id: "citoyen_dissident", nom: "Citoyen Dissident", motivation: "Justice et réforme", relation: "opposant" }
];

// Arcs narratifs persistants
const arcsNarratifs = [
  {
    id: "mouvement_clandestin",
    titre: "Montée d’un mouvement clandestin",
    etapes: [
      "Rumeurs de réunions secrètes",
      "Découverte d’un réseau clandestin",
      "Manifestations discrètes",
      "Révolte ouverte ou répression"
    ],
    jaugeDeclencheur: { peuple: "<40" },
    resolution: ["Révolte populaire", "Répression sanglante", "Réforme politique"]
  },
  {
    id: "rivalite_ministres",
    titre: "Rivalité entre deux ministres",
    etapes: [
      "Tensions dans les rapports",
      "Accusations mutuelles",
      "Scandale ou purge",
      "Changement d’alliances"
    ],
    jaugeDeclencheur: { parti: "<50" },
    resolution: ["Purge interne", "Chantage", "Nouvelle alliance"]
  },
  {
    id: "crise_economique",
    titre: "Crise économique progressive",
    etapes: [
      "Pénuries récurrentes",
      "Grèves et ralentissements",
      "Intervention du Parti",
      "Effondrement ou relance"
    ],
    jaugeDeclencheur: { economie: "<30" },
    resolution: ["Effondrement économique", "Relance", "Corruption accrue"]
  }
];

// Événements dynamiques
const evenementsDynamiques = [
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
];

// Lettres anonymes, rapports secrets, conversations téléphoniques
const elementsNarratifs = [
  { type: "lettre_anonyme", contenu: "Le Parti vous surveille. Méfiez-vous de vos ministres." },
  { type: "rapport_secret", contenu: "Un agent double a infiltré le ministère de la Sécurité." },
  { type: "telephone", contenu: "Un investisseur étranger souhaite vous parler en privé." },
  { type: "visite_surprise", contenu: "Le ministre de l’Intérieur arrive sans prévenir." },
  { type: "document_falsifie", contenu: "Ce rapport semble avoir été modifié par un tiers." },
  { type: "rumeur", contenu: "On parle d’un réseau clandestin dans le Nord." }
];

// Fonction pour déclencher un arc narratif selon les jauges et décisions
function declencherArc(jauges, decisions) {
  return arcsNarratifs.filter(arc => {
    const [jauge, condition] = Object.entries(arc.jaugeDeclencheur)[0];
    if(condition.startsWith('<')) return jauges[jauge] < parseInt(condition.slice(1));
    if(condition.startsWith('>')) return jauges[jauge] > parseInt(condition.slice(1));
    return false;
  });
}

// Fonction pour générer un événement dynamique selon les jauges
function genererEvenement(jauges) {
  return evenementsDynamiques.filter(ev => {
    const [jauge, condition] = Object.entries(ev.condition)[0];
    if(condition.startsWith('<')) return jauges[jauge] < parseInt(condition.slice(1));
    if(condition.startsWith('>')) return jauges[jauge] > parseInt(condition.slice(1));
    return false;
  });
}

// Fonction pour tirer un élément narratif aléatoire
function tirerElementNarratif() {
  return elementsNarratifs[Math.floor(Math.random()*elementsNarratifs.length)];
}

module.exports = {
  personnages,
  arcsNarratifs,
  evenementsDynamiques,
  elementsNarratifs,
  declencherArc,
  genererEvenement,
  tirerElementNarratif
};
