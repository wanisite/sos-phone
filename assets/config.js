/* ═══════════════════════════════════════════════════════════════
   CONFIG — SOS Phone
   Le seul fichier à toucher pour changer un numéro ou un lien.
   Une valeur vide ("") = la fonction est désactivée, sans erreur.
   ═══════════════════════════════════════════════════════════════ */
const CONFIG = {
  MARQUE: "SOS Phone",
  ZONE: "Île-de-France",

  /* Numéro WhatsApp : indicatif + numéro, sans +, sans espace. Ex "33612345678" */
  WHATSAPP: "",
  /* Utilisé si le réglage WordPress est vide (numéro du Linktree SOS Phone). */
  WHATSAPP_DEFAUT: "33749015531",

  /* Numéro affiché sur l'écran de confirmation (« L'appel viendra du … »). */
  NUMERO_APPEL: "",


  /* Compte Instagram, sans @. Vide = lien masqué. */
  INSTAGRAM: "sosphoneparis75",

  /* Webhook (Apps Script, Make, Zapier…) qui reçoit chaque demande en JSON.
     Vide = rien n'est envoyé ; la demande est gardée dans le navigateur. */
  WEBHOOK: "",

  /* Heures d'appel, heure de Paris. */
  HEURE_DEBUT_APPEL: 9,
  HEURE_FIN_APPEL: 21,

  /* Codes promo : taux = part du total (0.15 = 15 %), mois optionnel (10 = octobre). */
  CODES_PROMO: [
    { code: "LIVE15", taux: 0.15 },
    { code: "OCTOBRE10", taux: 0.10, mois: 10 }
  ],

  /* Pays acceptés pour le numéro. Le premier est proposé par défaut. */
  PAYS: [
    { drapeau: "🇫🇷", nom: "France", indicatif: "33" },
    { drapeau: "🇧🇪", nom: "Belgique", indicatif: "32" },
    { drapeau: "🇨🇭", nom: "Suisse", indicatif: "41" },
    { drapeau: "🇱🇺", nom: "Luxembourg", indicatif: "352" },
    { drapeau: "🇩🇪", nom: "Allemagne", indicatif: "49" },
    { drapeau: "🇪🇸", nom: "Espagne", indicatif: "34" },
    { drapeau: "🇮🇹", nom: "Italie", indicatif: "39" },
    { drapeau: "🇵🇹", nom: "Portugal", indicatif: "351" },
    { drapeau: "🇳🇱", nom: "Pays-Bas", indicatif: "31" },
    { drapeau: "🇬🇧", nom: "Royaume-Uni", indicatif: "44" },
    { drapeau: "🇬🇵", nom: "Guadeloupe", indicatif: "590" },
    { drapeau: "🇲🇶", nom: "Martinique", indicatif: "596" },
    { drapeau: "🇬🇫", nom: "Guyane", indicatif: "594" },
    { drapeau: "🇷🇪", nom: "La Réunion", indicatif: "262" },
    { drapeau: "🇲🇦", nom: "Maroc", indicatif: "212" },
    { drapeau: "🇩🇿", nom: "Algérie", indicatif: "213" },
    { drapeau: "🇹🇳", nom: "Tunisie", indicatif: "216" }
  ]
};
