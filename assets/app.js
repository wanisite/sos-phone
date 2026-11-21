/* ═══════════════════════════════════════════════════════════════
   VISUELS DES TÉLÉPHONES — SOS Phone
   Chaque modèle est dessiné dans le même cadre (100 × 200), vu de dos :
   même format partout, net sur tous les écrans, aucun fichier image.

   POUR UN NOUVEAU MODÈLE : ajoute une ligne
     "Nom exact du modèle": ["disposition", "couleur"],
   Dispositions : simple, pilule, diagonale, carre2, pro3, plateau, air, android
   ═══════════════════════════════════════════════════════════════ */
const VISUELS = {
  "iPhone 17 Pro Max":   ["plateau",   "#2f4a6b"],  // bleu intense
  "iPhone 17 Pro":       ["plateau",   "#e8742f"],  // orange cosmique
  "iPhone 17 Air":       ["air",       "#cfe1f1"],  // bleu ciel
  "iPhone 17":           ["pilule",    "#d8cde9"],  // lavande
  "iPhone 17e":          ["simple",    "#f1f1f3"],  // blanc
  "iPhone 16 Pro Max":   ["pro3",      "#bdb6aa"],  // titane naturel
  "iPhone 16 Pro":       ["pro3",      "#c6a888"],  // titane désert
  "iPhone 16 Plus":      ["pilule",    "#7083dd"],  // outremer
  "iPhone 16":           ["pilule",    "#94c9c2"],  // sarcelle
  "iPhone 16e":          ["simple",    "#f1f1f3"],  // blanc
  "iPhone 15 Pro Max":   ["pro3",      "#414b5a"],  // titane bleu
  "iPhone 15 Pro":       ["pro3",      "#bab4aa"],  // titane naturel
  "iPhone 15 Plus":      ["diagonale", "#d6e5d1"],  // vert
  "iPhone 15":           ["diagonale", "#f3d8da"],  // rose
  "iPhone 14 Pro Max":   ["pro3",      "#4d4459"],  // violet intense
  "iPhone 14 Pro":       ["pro3",      "#e9dcc3"],  // or
  "iPhone 14 Plus":      ["diagonale", "#a8bbd2"],  // bleu
  "iPhone 14":           ["diagonale", "#d7cde4"],  // mauve
  "iPhone 13 Pro Max":   ["pro3",      "#a1b7cd"],  // bleu alpin
  "iPhone 13 Pro":       ["pro3",      "#57554f"],  // graphite
  "iPhone 13":           ["diagonale", "#f5dfdb"],  // rose
  "iPhone 13 mini":      ["diagonale", "#2d333a"],  // minuit
  "iPhone 12 Pro Max":   ["pro3",      "#30495e"],  // bleu pacifique
  "iPhone 12 Pro":       ["pro3",      "#e6d4b6"],  // or
  "iPhone 12":           ["carre2",    "#24527d"],  // bleu
  "iPhone 12 mini":      ["carre2",    "#f1f1f3"],  // blanc
  "iPhone 11 Pro Max":   ["pro3",      "#3b3b3d"],
  "iPhone 11 Pro":       ["pro3",      "#3b3b3d"],
  "iPhone 11":           ["carre2",    "#2b2b2d"],
  "iPhone XS Max":       ["carre2",    "#3b3b3d"],
  "iPhone XS":           ["carre2",    "#3b3b3d"],
  "iPhone XR":           ["simple",    "#2b2b2d"],
  "iPhone X":            ["carre2",    "#3b3b3d"],
  "iPhone SE (2020 / 2022)": ["simple",  "#2b2b2d"],
  "iPhone 8 Plus":       ["carre2",    "#3b3b3d"],
  "iPhone 8":            ["simple",    "#3b3b3d"],
  "iPhone 7 Plus":       ["carre2",    "#2b2b2d"],
  "iPhone 7":            ["simple",    "#2b2b2d"],
  "Un autre modèle":     ["android",   "#b9bcc4"]
};

/* ── VRAIES PHOTOS ──────────────────────────────────────────────
   Photos officielles Apple, toutes en noir/graphite pour que la
   liste reste homogène. photos/dos/ = vu de dos (liste des modèles),
   photos/face/ = vu de face (pannes d'écran). Même nom de fichier
   dans les deux dossiers. Un modèle absent garde son illustration. */
const PHOTOS = {
  "iPhone 17 Pro Max": "17promax", "iPhone 17 Pro": "17pro", "iPhone 17 Air": "17air", "iPhone 17": "17", "iPhone 17e": "17e",
  "iPhone 16 Pro Max": "16promax", "iPhone 16 Pro": "16pro", "iPhone 16 Plus": "16plus", "iPhone 16": "16", "iPhone 16e": "16e",
  "iPhone 15 Pro Max": "15promax", "iPhone 15 Pro": "15pro", "iPhone 15 Plus": "15plus", "iPhone 15": "15",
  "iPhone 14 Pro Max": "14promax", "iPhone 14 Pro": "14pro", "iPhone 14 Plus": "14plus", "iPhone 14": "14",
  "iPhone 13 Pro Max": "13promax", "iPhone 13 Pro": "13pro", "iPhone 13": "13", "iPhone 13 mini": "13mini",
  "iPhone 12 Pro Max": "12promax", "iPhone 12 Pro": "12pro", "iPhone 12": "12", "iPhone 12 mini": "12mini",
  "iPhone 11 Pro Max": "11promax", "iPhone 11 Pro": "11pro", "iPhone 11": "11",
  "iPhone XS Max": "xsmax", "iPhone XS": "xs", "iPhone XR": "xr", "iPhone X": "x", "iPhone SE (2020 / 2022)": "se",
  "iPhone 8 Plus": "8plus", "iPhone 8": "8", "iPhone 7 Plus": "7plus", "iPhone 7": "7"
};
var PHOTOS_BASE = (document.currentScript && document.currentScript.src
  ? document.currentScript.src.replace(/[^\/]*$/, "") : "") + "photos/";
function photoUrl(nom, cote) { return PHOTOS[nom] ? PHOTOS_BASE + cote + "/" + PHOTOS[nom] + ".webp" : ""; }

function slugModele(nom) {
  return nom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* Renvoie la photo du modèle (de dos) si elle existe, sinon son dessin SVG. */
function visuelTelephone(nom) {
  if (PHOTOS[nom]) {
    return '<span class="phone-img phone-photo"><img src="' + photoUrl(nom, "dos") + '" alt="" loading="lazy" decoding="async"></span>';
  }
  return dessinTelephone(nom);
}

/* ═══════════════════════════════════════════════════════════════
   SCÈNE — le téléphone en grand qui « montre » la panne
   Par défaut on voit le dos. Une panne d'écran le retourne face
   avant, une panne de dos le laisse de dos. Chaque panne a sa
   petite animation (FX) jouée par jouerPanne(scene, id).
   ═══════════════════════════════════════════════════════════════ */
var FELURE = '<svg class="fx-crack" viewBox="0 0 100 210" preserveAspectRatio="none" aria-hidden="true">' +
  ["M64 74 L80 42 L86 20 L96 0", "M64 74 L92 66 L100 61", "M64 74 L88 106 L100 128", "M64 74 L59 118 L51 160 L47 210",
   "M64 74 L31 95 L0 113", "M64 74 L37 52 L15 31 L0 22", "M64 74 L61 31 L57 0", "M64 74 L76 150 L84 210",
   "M75 54 L79 72 L76 88 L66 95 L54 91 L48 76 L52 60 L64 52 Z", "M85 41 L92 75 L85 104 L60 111 L38 97 L36 62 L60 37",
   "M59 118 L72 128 L88 106", "M31 95 L22 70 L37 52"].map(function (d, i) {
    return '<path d="' + d + '" pathLength="1" style="animation-delay:' + (0.18 + i * 0.035).toFixed(3) + 's"/>';
  }).join("") + "</svg>";

var FX = {
  ecran: { face: "front", t: "Écran cassé ou noir", s: "On remplace l'écran chez toi, tactile compris.",
    html: '<span class="fx-flash"></span><span class="fx-ink"></span>' + FELURE + '<span class="fx-glitch"></span>' },
  batterie: { face: "front", t: "Batterie à plat", s: "Batterie neuve : ton iPhone retient enfin la charge.",
    html: '<span class="fx-dim"></span><span class="fx-batt"><i></i></span><b class="fx-pc">100 %</b>' },
  connecteur: { face: "front", t: "Charge mal", s: "Le câble ne tient pas ? On change le connecteur.",
    html: '<span class="fx-dim"></span><span class="fx-bolt"><svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></span><b class="fx-txt">Pas de charge</b>' },
  vitre: { face: "back", t: "Vitre arrière cassée", s: "On remplace le dos en verre du téléphone.",
    html: '<span class="fx-flash"></span>' + FELURE.replace("fx-crack", "fx-crack fx-crack-dos") },
  chassis: { face: "back", t: "Châssis tordu ou cassé", s: "On remplace le cadre du téléphone.",
    html: '<span class="fx-coin"></span>' },
  boutons: { face: "back", t: "Boutons qui ne répondent plus", s: "Volume, veille ou silencieux : on les répare.",
    html: "" },
  redemarre: { face: "front", t: "Redémarre en boucle", s: "On commence par un diagnostic pour trouver la cause.",
    html: '<span class="fx-boot"><i></i></span>' },
  diagnostic: { face: "front", t: "Diagnostic", s: "On trouve la panne et on te dit ce qu'il en est.",
    html: '<span class="fx-dim soft"></span><span class="fx-scan"></span><b class="fx-txt">Analyse…</b>' },
  desoxydation: { face: "front", t: "Tombé dans l'eau", s: "Désoxydation, diagnostic compris. Résultat non garanti.",
    html: '<span class="fx-eau"><i></i><i></i><i></i><i></i><i></i><i></i></span>' },
  autre: { face: "front", t: "Autre problème", s: "Caméra, haut-parleur… Décris-le, on le chiffre.",
    html: '<span class="fx-dim"></span><span class="fx-q">?</span>' }
};

/* Catégories ajoutées dans WordPress : animation « Autre problème » avec leur nom. */
(window.SOSP_CATS || []).forEach(function (c) {
  if (!FX[c.id]) FX[c.id] = { face: "front", t: c.titre, s: c.detail || "On te propose la réparation adaptée.", html: FX.autre.html };
});

function sceneHtml(nom, cls) {
  var dos = PHOTOS[nom] ? '<img src="' + photoUrl(nom, "dos") + '" alt="" decoding="async">' : dessinTelephone(nom);
  var face = PHOTOS[nom] ? '<img src="' + photoUrl(nom, "face") + '" alt="" decoding="async">' : dessinTelephone(nom);
  return '<div class="scene ' + (cls || "") + '" data-face="back" data-p="" aria-hidden="true">' +
    '<div class="scene-ph"><div class="flip">' +
      '<div class="face f-dos">' + dos + '<div class="bk"></div><span class="sidebtn"></span></div>' +
      '<div class="face f-face">' + face + '<div class="scr"></div></div>' +
    '</div><span class="cable"></span></div></div>';
}

/* Plusieurs pannes à la fois : les effets se superposent. Si certaines
   sont côté écran et d'autres côté dos, le téléphone se retourne tout
   seul de temps en temps pour montrer les deux. */
var ORDRE_FX = ["redemarre", "autre", "diagnostic", "batterie", "connecteur", "desoxydation", "ecran", "vitre", "chassis", "boutons"];
function jouerPanne(sc, ids) {
  if (!sc) return;
  var touches = (ids == null ? [] : [].concat(ids)).filter(function (id) { return FX[id]; });
  var tri = touches.slice().sort(function (a, b) { return ORDRE_FX.indexOf(a) - ORDRE_FX.indexOf(b); });
  var avant = tri.filter(function (id) { return FX[id].face === "front"; });
  var dos = tri.filter(function (id) { return FX[id].face === "back"; });
  var scr = sc.querySelector(".scr"), bk = sc.querySelector(".bk");
  clearTimeout(sc._t); clearInterval(sc._c); clearInterval(sc._alt);
  sc.setAttribute("data-p", "");
  scr.innerHTML = ""; bk.innerHTML = "";
  sc.classList.toggle("duo", avant.indexOf("batterie") > -1 && avant.indexOf("connecteur") > -1);
  /* On montre d'abord le côté de la dernière panne touchée. */
  var derniere = touches[touches.length - 1];
  var face = derniere ? FX[derniere].face : "back";
  var tourne = sc.getAttribute("data-face") !== face;
  sc.setAttribute("data-face", face);
  void sc.offsetWidth;
  if (!touches.length) return;
  sc._t = setTimeout(function () {
    sc.setAttribute("data-p", tri.join(" "));
    scr.innerHTML = avant.map(function (id) { return FX[id].html; }).join("");
    bk.innerHTML = dos.map(function (id) { return FX[id].html; }).join("");
    if (avant.indexOf("batterie") > -1) {
      var pc = sc.querySelector(".fx-pc"), n = 100;
      sc._c = setInterval(function () {
        n = Math.max(1, n - 4); if (pc) pc.textContent = n + " %";
        if (n === 1) clearInterval(sc._c);
      }, 55);
    }
    if (avant.length && dos.length) {
      sc._alt = setInterval(function () {
        sc.setAttribute("data-face", sc.getAttribute("data-face") === "front" ? "back" : "front");
      }, 3200);
    }
  }, tourne ? 520 : 30);
}

function dessinTelephone(nom) {
  var v = VISUELS[nom] || VISUELS["Un autre modèle"];
  var type = v[0], col = v[1];

  /* Clair ou foncé : le module caméra s'éclaircit sur les teintes sombres. */
  var r = parseInt(col.slice(1, 3), 16), g = parseInt(col.slice(3, 5), 16), b = parseInt(col.slice(5, 7), 16);
  var fonce = (r * 299 + g * 587 + b * 114) / 1000 < 140;
  var module = fonce ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.45)";
  var trait = fonce ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.10)";

  function objectif(x, y, rr) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + rr + '" fill="#26262a" stroke="' + trait + '" stroke-width="1.2"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (rr * .58).toFixed(1) + '" fill="#0b0b0f"/>' +
      '<circle cx="' + (x - rr * .22).toFixed(1) + '" cy="' + (y - rr * .22).toFixed(1) + '" r="' + (rr * .18).toFixed(1) + '" fill="rgba(140,170,255,.45)"/>';
  }
  function point(x, y, rr, f) { return '<circle cx="' + x + '" cy="' + y + '" r="' + rr + '" fill="' + (f || "#f4efe2") + '" stroke="' + trait + '" stroke-width=".8"/>'; }
  function bloc(x, y, w, h, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + module + '" stroke="' + trait + '" stroke-width="1"/>'; }

  var cam = "";
  switch (type) {
    case "simple":    cam = objectif(27, 25, 8) + point(42, 19, 2.4); break;
    case "pilule":    cam = bloc(16, 11, 22, 46, 11) + objectif(27, 22, 7.5) + objectif(27, 45, 7.5) + point(44, 21, 2.4); break;
    case "diagonale": cam = bloc(14, 11, 40, 40, 11) + objectif(25, 22, 7.5) + objectif(43, 40, 7.5) + point(44, 21, 2.4); break;
    case "carre2":    cam = bloc(14, 11, 40, 40, 11) + objectif(25, 22, 7.5) + objectif(25, 40, 7.5) + point(43, 22, 3); break;
    case "pro3":      cam = bloc(12, 10, 46, 46, 13) + objectif(24, 22, 8.5) + objectif(24, 44, 8.5) + objectif(45, 33, 8.5) + point(45, 17, 2.4) + point(45, 49, 2.4, "#2a2a2e"); break;
    case "plateau":   cam = '<path d="M16 6h68a10 10 0 0 1 10 10v44H6V16a10 10 0 0 1 10-10z" fill="' + module + '" stroke="' + trait + '" stroke-width="1"/>' +
                        bloc(12, 10, 46, 46, 13) + objectif(24, 22, 8.5) + objectif(24, 44, 8.5) + objectif(45, 33, 8.5) + point(76, 20, 3) + point(76, 44, 3, "#2a2a2e"); break;
    case "air":       cam = bloc(12, 10, 76, 26, 13) + objectif(26, 23, 8) + point(43, 23, 2.6); break;
    default:          cam = bloc(38, 12, 24, 48, 12) + objectif(50, 24, 7.5) + objectif(50, 47, 7.5) + point(68, 18, 2.4);
  }

  return '<svg class="phone-img" viewBox="-2 -2 104 208" aria-hidden="true">' +
    '<ellipse cx="50" cy="201" rx="34" ry="3.5" fill="rgba(0,0,0,.10)"/>' +
    '<rect x="1" y="62" width="2" height="26" rx="1" fill="' + col + '" stroke="' + trait + '" stroke-width=".6"/>' +
    '<rect x="97" y="56" width="2" height="34" rx="1" fill="' + col + '" stroke="' + trait + '" stroke-width=".6"/>' +
    '<rect x="2" y="0" width="96" height="198" rx="17" fill="' + col + '" stroke="' + trait + '" stroke-width="1.2"/>' +
    cam + "</svg>";
}
/* ═══════════════════════════════════════════════════════════════
   SOS Phone — web app de devis
   Parcours : accueil → modèle → pannes (+ gammes / avertissements)
              → département → urgence → numéro → devis → RDV
   Données : data/prix.js   Réglages : config.js
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* Visuels : data/visuels.js (absent = pas d'image, rien ne casse). */
  var visuelTelephone = typeof window.visuelTelephone === "function" ? window.visuelTelephone : function () { return ""; };

  /* ── En-tête : réseaux sociaux + statut « disponible » qui se met à jour ── */
  var RS = {
    instagram: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
    snapchat: "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z",
    whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
  };
  var TEL_ICO = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
  var MAIL_ICO = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>';
  function icone(n) { return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="' + RS[n] + '"/></svg>'; }
  function enteteReseaux() {
    var el = document.getElementById("reseaux"); if (!el) return;
    var l = [];
    if (CONFIG.INSTAGRAM) l.push('<a href="https://www.instagram.com/' + encodeURIComponent(CONFIG.INSTAGRAM) + '/" target="_blank" rel="noopener" aria-label="Instagram">' + icone("instagram") + "</a>");
    if (CONFIG.SNAPCHAT) l.push('<a href="https://www.snapchat.com/add/' + encodeURIComponent(CONFIG.SNAPCHAT) + '" target="_blank" rel="noopener" aria-label="Snapchat">' + icone("snapchat") + "</a>");
    if (CONFIG.WHATSAPP) l.push('<a href="https://wa.me/' + encodeURIComponent(CONFIG.WHATSAPP) + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icone("whatsapp") + "</a>");
    if (CONFIG.EMAIL) l.push('<a href="mailto:' + encodeURIComponent(CONFIG.EMAIL).replace("%40", "@") + '?subject=' + encodeURIComponent("Réparation de téléphone") + '" aria-label="Nous écrire par e-mail">' + MAIL_ICO + "</a>");
    el.innerHTML = l.join("");
    piedReseaux();
  }
  /* Footer : mêmes réseaux que l'en-tête, avec leur nom. */
  function piedReseaux() {
    var el = document.getElementById("footReseaux"); if (!el) return;
    var l = [];
    if (CONFIG.WHATSAPP) l.push('<li><a href="https://wa.me/' + encodeURIComponent(CONFIG.WHATSAPP) + '" target="_blank" rel="noopener">' + icone("whatsapp") + "WhatsApp</a></li>");
    if (CONFIG.WHATSAPP) l.push('<li><button type="button" data-act="rappel">' + TEL_ICO + "Être rappelé</button></li>");
    if (CONFIG.INSTAGRAM) l.push('<li><a href="https://www.instagram.com/' + encodeURIComponent(CONFIG.INSTAGRAM) + '/" target="_blank" rel="noopener">' + icone("instagram") + "@" + esc(CONFIG.INSTAGRAM) + "</a></li>");
    if (CONFIG.SNAPCHAT) l.push('<li><a href="https://www.snapchat.com/add/' + encodeURIComponent(CONFIG.SNAPCHAT) + '" target="_blank" rel="noopener">' + icone("snapchat") + esc(CONFIG.SNAPCHAT) + "</a></li>");
    if (CONFIG.EMAIL) l.push('<li><a href="mailto:' + encodeURIComponent(CONFIG.EMAIL).replace("%40", "@") + '">' + MAIL_ICO + "E-mail</a></li>");
    el.innerHTML = l.join("");
  }
  function majStatut() {
    var el = document.getElementById("statut"); if (!el) return;
    var ouvert = enHeuresAppel();
    el.className = "statut" + (ouvert ? "" : " ferme");
    el.innerHTML = "<i></i>" + (ouvert ? "Disponible maintenant" : "Réponse dès " + CONFIG.HEURE_DEBUT_APPEL + " h");
  }

  /* Numéros : si le réglage WordPress est vide, on prend ceux de config.js. */
  if (!CONFIG.WHATSAPP) CONFIG.WHATSAPP = CONFIG.WHATSAPP_DEFAUT || "";
  if (!CONFIG.NUMERO_APPEL) CONFIG.NUMERO_APPEL = CONFIG.NUMERO_APPEL_DEFAUT || "";
  var $view = document.getElementById("view");
  var $back = document.getElementById("back");
  var $prog = document.getElementById("progress");
  var $foot = document.getElementById("foot");
  var $toast = document.getElementById("toast");

  /* ── État ─────────────────────────────────────────────────── */
  var S, hist;
  function reset() {
    S = {
      phones: [],        // téléphones validés : { m, items, desc, modelText }
      cur: null,         // téléphone en cours
      dep: null, horsZone: false, urgence: null,
      tel: null, pays: CONFIG.PAYS[0],
      promo: null, code: null, leadSent: false, serie: "tous"
    };
    hist = [];
  }
  function newPhone(m) {
    S.cur = { m: m, sel: [], queue: [], qi: 0, items: [], desc: "", modelText: "" };
  }

  /* ── Utilitaires ──────────────────────────────────────────── */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function eur(n) {
    var r = Math.round(n * 100) / 100;
    return (r % 1 ? r.toFixed(2).replace(".", ",") : String(r)) + " €";
  }
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); }
  function toast(msg) {
    $toast.textContent = msg; $toast.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { $toast.hidden = true; }, 2600);
  }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function heureParis() {
    try {
      return parseInt(new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "numeric", hourCycle: "h23" }).format(new Date()), 10);
    } catch (e) { return new Date().getHours(); }
  }
  function enHeuresAppel() { var h = heureParis(); return h >= CONFIG.HEURE_DEBUT_APPEL && h < CONFIG.HEURE_FIN_APPEL; }
  function garantieTxt(it) {
    if (it.garantie === 0) return MENTION_DESOX;
    if (it.garantie === -1) return MENTION_DIAGNOSTIC;
    return "Garantie " + it.garantie + " mois";
  }

  /* ── Navigation ───────────────────────────────────────────── */
  var SCREENS = {};
  var STEP = { marque: 1, modele: 1, pannes: 2, gamme: 2, conseil: 2, diag: 2, desox: 2, desc: 2, dep: 3, horszone: 3, urgence: 4, adresse: 3, tel: 4, devis: 5, done: 5, postal: 5 };

  function go(name, args, isBack) {
    if (!isBack) {
      hist.push({ name: name, args: args,
        itemsLen: S.cur ? S.cur.items.length : 0, qi: S.cur ? S.cur.qi : 0,
        phones: S.phones.length });
    }
    clearTimeout(heroT);
    var html = SCREENS[name](args || {});
    $view.innerHTML = '<section class="screen' + (isBack ? " back" : "") + '">' + html + "</section>";
    if (SCREENS[name].after) SCREENS[name].after(args || {});
    if (document.querySelector(".stage")) majStage(STAGE_PANNE);
    STAGE_PANNE = null;
    $back.hidden = name === "home" || name === "done" || name === "postal";
    $foot.hidden = false;
    document.body.classList.toggle("sosp-accueil", name === "home");
    var st = STEP[name] || 0;
    $prog.hidden = !st;
    Array.prototype.forEach.call($prog.children, function (el, i) {
      el.className = i + 1 < st ? "on" : i + 1 === st ? "cur" : "";
    });
    window.scrollTo(0, 0);
    $view.focus({ preventScroll: true });
  }
  function back() {
    if (hist.length < 2) { reset(); return go("home"); }
    hist.pop();
    var prev = hist[hist.length - 1];
    if (S.phones.length > prev.phones) {
      /* On revient avant la validation du téléphone en cours : on le reprend. */
      S.cur = S.phones.pop();
    }
    if (S.cur) { S.cur.items.length = prev.itemsLen; S.cur.qi = prev.qi; }
    go(prev.name, prev.args, true);
  }
  $back.addEventListener("click", back);
  document.getElementById("logo").addEventListener("click", function (e) {
    e.preventDefault(); reset(); go("home");
  });

  /* Délégation des clics : data-act="nom" data-v="valeur" */
  var ACTS = {};
  $view.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b || b.disabled) return;
    var fn = ACTS[b.getAttribute("data-act")];
    if (fn) fn(b.getAttribute("data-v"), b, e);
  });
  /* Le footer est hors de la vue : seuls ses boutons « rappel » passent par ici. */
  var $pied = document.getElementById("foot");
  if ($pied) $pied.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (b && ACTS[b.getAttribute("data-act")]) ACTS[b.getAttribute("data-act")](b.getAttribute("data-v"), b, e);
  });

  /* ═══ ÉCRANS ═══════════════════════════════════════════════ */

  /* ── Accueil ── */
  var HERO_MODELE = "iPhone 16 Pro";
  var HERO_CYCLE = ["ecran", "batterie", "desoxydation", "vitre"];
  var ACCUEIL_PANNES = ["ecran", "batterie", "connecteur", "vitre", "desoxydation", "autre"];
  SCREENS.home = function () {
    return '' +
      '<div class="sos-hero">' +
        '<div class="sos-txt">' +
          '<h1 class="sos-t">Téléphone cassé ?<br><span>On arrive.</span></h1>' +
          '<p class="sos-s">Un réparateur vient chez toi, partout en France, et répare sur place, 7j/7.</p>' +
        '</div>' +
        '<div class="sos-carte" id="sosCarte" aria-hidden="true">' + carteSvg() + '</div>' +
        '<div class="sos-visuel">' + sceneHtml(HERO_MODELE, "scene-hero") +
          '<p class="hero-cap" id="heroCap">&nbsp;</p></div>' +
        '<div class="sos-cta">' +
          '<button class="btn-sos" data-act="start"><span>Voir mon prix</span>' +
            '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' +
          '<p class="sos-cta-s">En 40 secondes · pièce et main d\'œuvre comprises · garantie jusqu\'à 6 mois</p>' +
          '<button class="rappel-lien" data-act="rappel">' + TEL_ICO + '<span>Je préfère être rappelé</span></button>' +
        '</div>' +
      '</div>';
  };
  /* ── Fausse carte : le logo SOS Phone roule jusqu'à « Chez toi » ──
     Deux compositions : portrait (mobile) et paysage (ordinateur). */
  function carteSvg() {
    var mob = window.innerWidth < 900;
    var W = mob ? 400 : 1600, H = mob ? 860 : 900;
    var V = mob ? [20, 110, 210, 300, 385] : [110, 330, 560, 700, 880, 1080, 1300, 1490];
    var Hz = mob ? [90, 250, 410, 560, 700, 820] : [110, 290, 430, 560, 700, 850];
    var route = mob ? [[300, 900], [300, 700], [20, 700], [20, 560], [70, 560]]
                    : [[330, 930], [330, 850], [1090, 850], [1090, 560], [1005, 560]];
    var B = route[route.length - 1], d = "M" + route.map(function (p) { return p.join(" "); }).join(" L");
    var DUR = 7, logo = PHOTOS_BASE.replace(/photos\/$/, "") + "logo.jpg";
    var anim = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    var h = '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><clipPath id="clipLogo"><circle r="25"/></clipPath>' +
      '<filter id="ombre" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity=".25"/></filter></defs>' +
      '<filter id="flou" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="' + (mob ? 1.6 : 2.4) + '"/></filter>' +
      '<rect width="' + W + '" height="' + H + '" fill="#eef0f3"/><g filter="url(#flou)">';
    /* îlots, parcs, eau */
    h += mob
      ? '<rect x="120" y="270" width="80" height="120" rx="14" fill="#dcefd9"/><rect x="225" y="580" width="60" height="100" rx="12" fill="#dcefd9"/>' +
        '<path d="M-20 180 C 120 150 220 230 420 190" stroke="#cfe2f7" stroke-width="38" fill="none"/>'
      : '<rect x="1110" y="590" width="170" height="90" rx="16" fill="#dcefd9"/><rect x="350" y="130" width="190" height="140" rx="18" fill="#dcefd9"/><rect x="900" y="300" width="160" height="110" rx="16" fill="#dcefd9"/>' +
        '<path d="M-40 400 C 300 330 520 470 820 380 S 1300 220 1650 300" stroke="#cfe2f7" stroke-width="64" fill="none"/>';
    /* rues : bordure grise puis chaussée blanche */
    function rues(sw, col) {
      return V.map(function (x, i) { return '<path d="M' + x + ' -20 L' + (x + (i % 2 ? 14 : -10)) + " " + (H + 20) + '"/>'; }).join("") +
        Hz.map(function (y, i) { return '<path d="M-20 ' + y + " L" + (W + 20) + " " + (y + (i % 2 ? -12 : 8)) + '"/>'; }).join("");
    }
    h += '<g stroke="#dde1e6" stroke-width="' + (mob ? 17 : 25) + '" fill="none">' + rues() + "</g>" +
      '<g stroke="#ffffff" stroke-width="' + (mob ? 12 : 18) + '" fill="none">' + rues() + "</g>" +
      (mob ? '<path d="M-20 40 L 420 520" stroke="#dde1e6" stroke-width="20" fill="none"/><path d="M-20 40 L 420 520" stroke="#fff6d6" stroke-width="14" fill="none"/>'
           : '<path d="M-20 980 C 400 760 900 900 1650 620" stroke="#dde1e6" stroke-width="32" fill="none"/><path d="M-20 980 C 400 760 900 900 1650 620" stroke="#fff6d6" stroke-width="26" fill="none"/>' +
             '<path d="M200 -20 L 1250 940" stroke="#dde1e6" stroke-width="24" fill="none"/><path d="M200 -20 L 1250 940" stroke="#ffffff" stroke-width="18" fill="none"/>');
    /* la tour Eiffel, comme un monument sur un plan (le logo dit Paris) */
    var TE = mob ? [345, 520, .62] : [1360, 470, 1.15];
    h += '<g transform="translate(' + TE[0] + " " + TE[1] + ") scale(" + TE[2] + ')">' +
      '<ellipse cx="0" cy="2" rx="34" ry="7" fill="rgba(0,0,0,.08)"/>' +
      '<g fill="#3d4450">' +
        '<path d="M-1.4 -112 h2.8 v14 h-2.8z"/>' +
        '<path d="M-4 -98 h8 l3 34 h-14z"/>' +
        '<path d="M-14 -66 h28 v5 h-28z"/>' +
        '<path d="M-10 -61 h20 l7 26 h-34z"/>' +
        '<path d="M-22 -37 h44 v5 h-44z"/>' +
        '<path d="M-18 -32 h36 l14 32 h-13 c-3 -12 -10 -18 -19 -18 s-16 6 -19 18 h-13z"/>' +
      "</g>" +
      '<g transform="translate(0 22)"><rect x="-44" y="-12" width="88" height="24" rx="12" fill="#fff" stroke="#dde1e6"/>' +
      '<text y="4" text-anchor="middle" font-family="Outfit, sans-serif" font-size="12" font-weight="600" fill="#3d4450">Tour Eiffel</text></g>' +
      "</g>";

    h += "</g>"; /* fin du plan flouté : l'itinéraire et le logo restent nets */
    /* itinéraire : liseré blanc + trait rouge qui se dessine */
    h += '<path d="' + d + '" stroke="#fff" stroke-width="' + (mob ? 14 : 18) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<path d="' + d + '" stroke="#e5172f" stroke-width="' + (mob ? 7 : 9) + '" fill="none" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + (anim ? 1 : 0) + '">' +
        (anim ? '<animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes="0;.78;1" dur="' + DUR + 's" repeatCount="indefinite"/>' : "") + "</path>";
    /* arrivée : épingle « Chez toi » */
    h += '<g transform="translate(' + B[0] + " " + B[1] + ')">' +
        '<circle r="16" fill="rgba(229,23,47,.18)">' + (anim ? '<animate attributeName="r" values="14;34;14" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite"/>' : "") + '</circle>' +
        '<g filter="url(#ombre)"><path d="M0 0 C -13 -16 -20 -26 -20 -36 a20 20 0 0 1 40 0 C 20 -26 13 -16 0 0z" fill="#e5172f"/>' +
        '<path d="M-8 -34 L0 -42 L8 -34 V-26 H-8z" fill="#fff"/></g>' +
        '<g transform="translate(' + (mob ? "0 -74" : "62 -30") + ')"><rect x="-40" y="-16" width="80" height="28" rx="14" fill="#111"/>' +
        '<text y="3" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="600" fill="#fff">Chez toi</text></g></g>';
    /* le logo SOS Phone qui roule */
    h += '<g filter="url(#ombre)">' +
        (anim ? '<animateMotion path="' + d + '" keyPoints="0;1;1" keyTimes="0;.78;1" calcMode="linear" dur="' + DUR + 's" repeatCount="indefinite"/>' : "") +
        '<g' + (anim ? "" : ' transform="translate(' + B[0] + " " + B[1] + ')"') + '>' +
        '<circle r="31" fill="#fff"/><circle r="31" fill="none" stroke="#e5172f" stroke-width="3"/><image href="' + logo + '" x="-25" y="-25" width="50" height="50" clip-path="url(#clipLogo)" preserveAspectRatio="xMidYMid slice"/>' +
        '<g transform="translate(0 -54)"><rect x="-48" y="-15" width="96" height="30" rx="15" fill="#e5172f"/>' +
        '<text y="4" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" font-weight="600" fill="#fff" letter-spacing=".5">J\'ARRIVE</text></g>' +
        "</g></g>";
    return h + "</svg>";
  }

  /* Démo du héros : le téléphone tombe en panne, puis il est réparé. */
  var heroT = null;
  SCREENS.home.after = function () {
    var sc = document.querySelector(".scene-hero"), cap = document.getElementById("heroCap"), k = 0;
    if (!sc) return;
    function etape() {
      var id = HERO_CYCLE[k++ % HERO_CYCLE.length];
      sc.classList.remove("repare");
      jouerPanne(sc, id);
      cap.innerHTML = esc(FX[id].t);
      cap.className = "hero-cap";
      heroT = setTimeout(function () {
        sc.classList.add("repare");
        cap.innerHTML = "Réparé chez toi <span class=\"ok\">✓</span>";
        cap.className = "hero-cap ok";
        heroT = setTimeout(function () {
          jouerPanne(sc, null); sc.classList.remove("repare");
          heroT = setTimeout(etape, 900);
        }, 1500);
      }, 2600);
    }
    heroT = setTimeout(etape, 700);
  };
  ACTS.startPanne = function (id) { reset(); S.pre = id; go("marque"); };
  ACTS.start = function () { reset(); go("marque"); };

  /* ── Étape 1 : la marque. iPhone = prix fixes ; les autres = on décrit la panne. ── */
  var MARQUES = [
    { id: "apple", nom: "iPhone", s: "Prix fixe tout de suite" },
    { id: "samsung", nom: "Samsung" }, { id: "google", nom: "Google Pixel" }, { id: "xiaomi", nom: "Xiaomi" },
    { id: "huawei", nom: "Huawei" }, { id: "oppo", nom: "Oppo" }, { id: "oneplus", nom: "OnePlus" },
    { id: "honor", nom: "Honor" }, { id: "motorola", nom: "Motorola" }, { id: "autre", nom: "Autre marque" }
  ];
  var MARQUES_BASE = PHOTOS_BASE.replace(/photos\/$/, "") + "marques/";
  SCREENS.marque = function () {
    var again = S.phones.length > 0;
    return '<p class="step">Étape 1 sur 4' + (again ? " · Téléphone " + (S.phones.length + 1) : "") + '</p>' +
      '<h1 class="h1">Quelle marque ?</h1>' +
      '<p class="sub">iPhone : ton prix tout de suite. Autres marques : décris la panne, on te chiffre vite.</p>' +
      '<div class="marques">' + MARQUES.map(function (b) {
        var logo = b.id === "autre"
          ? '<span class="marque-q">?</span>'
          : '<img src="' + MARQUES_BASE + b.id + '.svg" alt="" width="40" height="40">';
        if (b.id === "apple") {
          return '<button class="marque-iphone" data-act="marque" data-v="apple">' +
            '<span class="mi-txt"><span class="mi-logo"><img src="' + MARQUES_BASE + 'apple.svg" alt="" width="26" height="26">iPhone</span>' +
            '<span class="mi-t">Ton prix fixe,<br>tout de suite</span>' +
            '<span class="mi-go">Choisir mon iPhone <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span>' +
            '<span class="mi-photos" aria-hidden="true">' + ["15", "16", "17pro"].map(function (k) {
              return '<img src="' + PHOTOS_BASE + "dos/" + k + '.webp" alt="" loading="lazy">';
            }).join("") + "</span></button>";
        }
        return '<button class="marque" data-act="marque" data-v="' + b.id + '">' +
          '<span class="marque-logo">' + logo + '</span><span class="marque-n">' + esc(b.nom) + '</span>' +
          (b.s ? '<span class="marque-s">' + esc(b.s) + "</span>" : "") + "</button>";
      }).join("").replace('</button><button class="marque"', '</button><p class="marques-autres">Autres marques · sur devis</p><button class="marque"') + "</div>";
  };
  ACTS.marque = function (id) {
    if (id === "apple") return go("modele");
    var b = MARQUES.filter(function (x) { return x.id === id; })[0];
    var autre = MODELES[MODELES.length - 1];
    newPhone(autre);
    S.cur.marque = id === "autre" ? "" : b.nom;
    S.cur.modelText = S.cur.marque ? S.cur.marque + " " : "";
    S.cur.items = [{ id: "autre", famille: "Réparation", titre: "À chiffrer", prix: null, garantie: GARANTIES.defaut }];
    go("desc");
  };

  /* ── Étape 1 : modèle ── */
  SCREENS.modele = function () {
    var again = S.phones.length > 0, series = [];
    MODELES.forEach(function (m) { if (!m.devis && series.indexOf(m.serie) < 0) series.push(m.serie); });
    if (!S.serie) S.serie = "tous";
    return '<div class="mod-tete"><div><p class="step">Étape 1 sur 4' + (again ? " · Téléphone " + (S.phones.length + 1) : "") + '</p>' +
      '<h1 class="h1">Quel iPhone ?</h1>' +
      '<p class="sub">Pas sûr ? Réglages → Général → Informations.</p></div>' +
      '<label class="search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
      '<input id="q" type="search" placeholder="Rechercher : 13 Pro, 16e…" autocomplete="off" enterkeyhint="search" aria-label="Rechercher un modèle"></label></div>' +
      '<div class="series" role="tablist" aria-label="Série">' +
        '<button class="serie-b" role="tab" data-act="serie" data-v="tous">Tous</button>' +
        series.map(function (x) {
          return '<button class="serie-b" role="tab" data-act="serie" data-v="' + esc(x) + '">' + esc(x.replace(/^iPhone /, "").replace(" et plus ancien", " et avant")) + "</button>";
        }).join("") +
      "</div>" +
      '<div id="models" class="modeles"></div>';
  };
  function dessineModeles() {
    var q = document.getElementById("q"); if (!q) return;
    var v = norm(q.value), h = "", serie = null, n = 0, f = v ? "tous" : S.serie;
    Array.prototype.forEach.call(document.querySelectorAll(".serie-b"), function (b) { b.setAttribute("aria-selected", b.getAttribute("data-v") === f); });
    MODELES.forEach(function (m, i) {
      if (m.devis) return;
      if (f !== "tous" && m.serie !== f) return;
      var hay = norm(m.nom), words = v.split(" ");
      if (v && !words.every(function (w) { return hay.indexOf(w) > -1; })) return;
      serie = m.serie;
      h += '<button class="chip phone" data-act="model" data-v="' + i + '">' + visuelTelephone(m.nom) +
        '<span class="phone-n"><small>iPhone</small>' + esc(m.nom.replace(/^iPhone /, "")) + "</span></button>";
      n++;
    });
    if (!n && v) h += '<p class="empty">Pas trouvé ? Reviens en arrière et choisis « Autre marque » : on le chiffre à la main.</p>';
    document.getElementById("models").innerHTML = h;
  }
  SCREENS.modele.after = function () {
    document.getElementById("q").addEventListener("input", dessineModeles);
    dessineModeles();
  };
  ACTS.serie = function (v) {
    S.serie = v; var q = document.getElementById("q"); q.value = "";
    dessineModeles();
  };
  ACTS.model = function (i) {
    var m = MODELES[+i];
    newPhone(m);
    if (S.pre && !m.devis) { S.cur.sel = [S.pre]; S.pre = null; }
    if (m.devis) {
      S.cur.items = [{ id: "autre", famille: "Réparation", titre: "À chiffrer", prix: null, garantie: GARANTIES.defaut }];
      go("desc");
    } else go("pannes");
  };

  /* Remise (en %) à partir de N réparations, lue dans REMISES (modifiable dans WordPress). */
  function pct(n) {
    var r = REMISES.filter(function (x) { return x.aPartirDe === n; })[0];
    return r ? Math.round(r.taux * 100) : 0;
  }

  /* ── Scène en tête d'écran : le téléphone choisi + la panne en cours ── */
  function stage(nom, id, etape, collant) {
    return '<div class="stage' + (collant ? " collant" : "") + '">' + sceneHtml(nom) +
      '<div class="stage-txt"><p class="step">' + esc(etape) + " · " + esc(nom) + '</p>' +
      '<p class="stage-t" id="stageT"></p><p class="stage-s" id="stageS"></p></div></div>';
  }
  function majStage(ids) {
    var sc = document.querySelector(".stage .scene");
    if (!sc) return;
    ids = (ids == null ? [] : [].concat(ids)).filter(function (id) { return FX[id]; });
    jouerPanne(sc, ids);
    var t = document.getElementById("stageT"), st = document.getElementById("stageS");
    if (!ids.length) { t.textContent = "Qu'est-ce qui ne va pas ?"; st.textContent = "Touche une panne : ton téléphone te la montre."; return; }
    t.innerHTML = ids.map(function (id) { return '<span class="stage-p">' + esc(FX[id].t) + "</span>"; }).join('<span class="stage-plus">+</span>');
    st.textContent = ids.length === 1 ? FX[ids[0]].s
      : ids.length + " réparations en une seule visite · −" + pct(2) + " % sur la 2e, −" + pct(3) + " % sur les suivantes.";
  }
  /* Après chaque écran : si une scène est là, elle joue sa panne. */
  var STAGE_PANNE = null;

  /* ── Étape 2 : pannes (multi-choix) ── */
  SCREENS.pannes = function () {
    var c = S.cur;
    STAGE_PANNE = c.sel.slice();
    return stage(c.m.nom, c.sel[c.sel.length - 1], "Étape 2 sur 4", true) +
      '<h1 class="h1">Qu\'est-ce qu\'il faut réparer ?</h1>' +
      '<p class="sub">Coche tout ce qui ne va pas : ton téléphone te le montre.</p>' +
      '<p class="note">Tu peux en choisir plusieurs — <b>−' + pct(2) + ' %</b> sur ta 2<sup>e</sup> réparation, <b>−' + pct(3) + ' %</b> sur les suivantes.</p>' +
      '<div class="opts">' + PANNES.map(function (p) {
        var on = c.sel.indexOf(p.id) > -1;
        return '<button class="opt" data-act="panne" data-v="' + p.id + '" aria-pressed="' + on + '">' +
          '<span class="opt-ico">' + p.ico + '</span>' +
          '<span class="opt-txt"><span class="opt-t">' + esc(p.titre) + '</span><span class="opt-s">' + esc(p.detail) + '</span></span>' +
          '<span class="opt-check">✓</span></button>';
      }).join("") + "</div>" +
      '<div class="cta"><button class="btn btn-dark" id="goPannes" data-act="pannesOk"' + (c.sel.length ? "" : " disabled") + '>' + ctaPannes() + "</button></div>";
  };
  function ctaPannes() {
    var n = S.cur.sel.length;
    return n ? "Continuer (" + n + ") →" : "Choisis au moins une panne";
  }
  ACTS.panne = function (id, b) {
    var sel = S.cur.sel, k = sel.indexOf(id);
    if (k > -1) sel.splice(k, 1); else sel.push(id);
    b.setAttribute("aria-pressed", k < 0);
    /* On montre la panne qu'il vient de toucher, ou la dernière encore cochée. */
    majStage(sel.slice());
    var cta = document.getElementById("goPannes");
    cta.disabled = !sel.length; cta.textContent = ctaPannes();
  };
  ACTS.pannesOk = function () {
    var c = S.cur;
    /* Ordre stable : celui de la liste PANNES. */
    c.queue = PANNES.map(function (p) { return p.id; }).filter(function (id) { return c.sel.indexOf(id) > -1; });
    c.qi = 0; c.items = [];
    advance();
  };

  function famille(id) { for (var i = 0; i < PANNES.length; i++) if (PANNES[i].id === id) return PANNES[i].famille; return id; }
  function addItem(id, titre, prix, garantie, extra) {
    var it = { id: id, famille: famille(id), titre: titre, prix: prix == null ? null : prix,
      garantie: garantie == null ? (GARANTIES[id] != null ? GARANTIES[id] : GARANTIES.defaut) : garantie };
    if (extra) for (var k in extra) it[k] = extra[k];
    S.cur.items.push(it);
  }
  function devisItem(id) { addItem(id, "À chiffrer", null, GARANTIES.defaut); }

  /* Traite les pannes une par une ; s'arrête dès qu'un écran est nécessaire. */
  function advance() {
    var c = S.cur, m = c.m;
    while (c.qi < c.queue.length) {
      var id = c.queue[c.qi++];
      switch (id) {
        case "ecran":
          if (extras(id, m).length) return go("gamme", { type: id });
          if (!m.ecran) { devisItem(id); break; }
          if (m.ecran.unique) { addItem(id, "Écran", m.ecran.unique, GARANTIES.defaut); break; }
          return go("gamme", { type: "ecran" });
        case "batterie":
          if (typeof m.batterieFixe === "number" && !extras(id, m).length) { addItem(id, "Batterie", m.batterieFixe); break; }
          return go("gamme", { type: "batterie" });
        case "connecteur":
          return go("conseil");
        case "vitre":
          if (extras(id, m).length) return go("gamme", { type: id });
          if (m.vitre == null) { devisItem(id); break; }
          if (m.vitreSansLogo) return go("gamme", { type: "vitre" });
          addItem(id, "Vitre arrière d'origine", m.vitre); break;
        case "chassis":
        case "boutons":
          if (extras(id, m).length) return go("gamme", { type: id });
          if (m[id] == null) devisItem(id); else addItem(id, famille(id), m[id]);
          break;
        case "redemarre":
        case "diagnostic":
          if (c.items.some(function (x) { return x.id === "diagnostic"; })) break;
          return go("diag");
        case "desoxydation":
          return go("desox");
        default:
          /* « Autre problème » ou catégorie ajoutée dans WordPress */
          if (extras(id, m).length) return go("gamme", { type: id });
          devisItem(id);
      }
    }
    if (c.items.some(function (x) { return x.prix == null; })) return go("desc");
    finishPhone();
  }

  function finishPhone() {
    S.phones.push(S.cur); S.cur = null;
    if (S.adresse || S.horsZone) go("devis"); else go("adresse");
  }

  /* ── Prestations ajoutées dans WordPress (Prix SOS) pour cette catégorie et ce modèle ── */
  function extras(cat, m) {
    return (window.SOSP_EXTRAS || []).filter(function (x) {
      return x.cat === cat && x.prix && typeof x.prix[m.nom] === "number";
    }).map(function (x) {
      return { titre: x.titre, detail: x.detail || "", prix: x.prix[m.nom], gamme: x.titre, g: x.garantie != null ? x.garantie : GARANTIES.defaut, extra: true };
    });
  }

  /* ── Gammes : les options de base + les prestations ajoutées ── */
  function gammes(type, m) {
    var G = gammesBase(type, m);
    G.l = G.l.concat(extras(type, m));
    return G;
  }
  function gammesBase(type, m) {
    var fam = famille(type);
    if (type === "vitre" && m.vitre == null) return { t: "Quelle vitre arrière ?", s: "Choisis la pièce qui te convient.", l: [] };
    if (type === "vitre" && !m.vitreSansLogo) return { t: "Quelle vitre arrière ?", s: "Choisis la pièce qui te convient.",
      l: [{ titre: "Vitre arrière d'origine", detail: "La pièce d'origine, logo compris.", prix: m.vitre, gamme: "d'origine", best: true, g: GARANTIES.vitre }] };
    if (type === "batterie" && typeof m.batterieFixe === "number") return { t: "Quelle batterie ?", s: "Choisis la batterie qui te convient.",
      l: [{ titre: "Batterie", detail: "Batterie neuve, posée chez toi.", prix: m.batterieFixe, gamme: "standard", best: true, g: GARANTIES.batterie }] };
    if (type === "ecran" && !m.ecran) return { t: "Quel écran ?", s: "Choisis la pièce qui te convient.", l: [] };
    if (type === "ecran" && m.ecran.unique) return { t: "Quel écran ?", s: "Choisis la pièce qui te convient.",
      l: [{ titre: "Écran", detail: "Écran neuf, tactile compris.", prix: m.ecran.unique, gamme: "standard", best: true, g: GARANTIES.defaut }] };
    if (type !== "vitre" && type !== "batterie" && type !== "ecran") {
      var base = typeof m[type] === "number" ? [{ titre: fam, detail: "La réparation standard.", prix: m[type], gamme: "standard", best: true, g: GARANTIES[type] != null ? GARANTIES[type] : GARANTIES.defaut }] : [];
      return { t: fam + " : quelle option ?", s: "Choisis la prestation qui te convient.", l: base };
    }
    if (type === "vitre") return {
      t: "Quelle vitre arrière ?", s: "Deux fois la même pièce. Le logo gravé au dos fait la différence.",
      l: [
        { titre: "Vitre arrière d'origine", detail: "La pièce d'origine, logo compris.", prix: m.vitre, gamme: "d'origine", best: true, g: GARANTIES.vitre },
        { titre: "Vitre arrière sans logo", detail: "Même pièce, sans le logo gravé au dos.", prix: m.vitre - REMISE_SANS_LOGO, gamme: "sans logo", badge: "−" + REMISE_SANS_LOGO + " €", vert: true, g: GARANTIES.vitre }
      ]
    };
    if (type === "batterie") return {
      t: "Quelle batterie ?", s: "La différence se joue sur l'autonomie et la longévité.",
      l: BATTERIE.map(function (b) { return { titre: b.titre, detail: b.detail, prix: b.prix, gamme: b.gamme, best: b.best, g: GARANTIES.batterie }; })
    };
    var l = [];
    /* Noms des gammes validés par Wanis le 21/11/2026 : éco (InCell), premium (Soft OLED), originale (Apple). */
    if (m.ecran.premium != null) l.push({ titre: "Gamme éco", detail: GAMME_TXT.eco, prix: m.ecran.premium, gamme: "éco", best: true, badge: "Petit prix", g: GARANTIES.ecran_premium });
    l.push({ titre: "Gamme premium (" + m.ecran.nomOled + ")", detail: GAMME_TXT.premium, prix: m.ecran.oled, gamme: "premium (" + m.ecran.nomOled + ")", best: !l.length, badge: "Recommandé", vert: true, g: GARANTIES.ecran_oled });
    l.push({ titre: "Gamme originale", detail: GAMME_TXT.originale, prix: m.ecran.apple, gamme: "originale", g: GARANTIES.ecran_apple });
    return { t: "Quelle qualité d'écran ?", s: "Trois gammes, trois budgets. Toutes posées par un pro.", l: l };
  }
  var GAMME_TXT = {
    eco: "Technologie InCell. Bonne qualité d'affichage au meilleur prix, mais l'écran consomme un peu plus : la batterie peut chauffer davantage et se vider plus vite.",
    premium: "Technologie Soft OLED. Meilleur rendu (couleurs, contrastes, noirs profonds), plus proche de l'écran d'origine, avec une consommation maîtrisée et sans surchauffe.",
    originale: "Pièce d'origine Apple, strictement identique à l'écran de ton téléphone à sa sortie."
  };
  SCREENS.gamme = function (a) {
    var m = S.cur.m, G = gammes(a.type, m);
    STAGE_PANNE = a.type;
    return stage(m.nom, a.type, "Étape 2 sur 4") +
      '<h1 class="h1">' + esc(G.t) + '</h1><p class="sub">' + esc(G.s) + '</p>' +
      '<div class="opts">' + G.l.map(function (x, i) {
        return '<button class="opt' + (x.best ? " best" : "") + '" data-act="gammeOk" data-v="' + i + '">' +
          '<span class="opt-txt"><span class="opt-t">' + esc(x.titre) +
          (x.badge ? ' <span class="badge' + (x.vert ? " vert" : "") + '">' + esc(x.badge) + "</span>" : "") + "</span>" +
          '<span class="opt-s">' + esc(x.detail) + '</span>' +
          '<span class="opt-g">Garantie ' + x.g + ' mois</span></span>' +
          '<span class="opt-p">' + eur(x.prix) + "</span></button>";
      }).join("") + "</div>" +
      (a.type === "ecran" && m.ecran && !m.ecran.unique ? '<button class="link" data-act="diff" aria-expanded="false">C\'est quoi la différence ?</button><div id="diff" hidden>' + diffHtml(m) + "</div>" : "") +
      '<p class="mini">Prix comprenant la pièce et la main d\'œuvre.</p>';
  };
  ACTS.gammeOk = function (i) {
    var a = hist[hist.length - 1].args, x = gammes(a.type, S.cur.m).l[+i];
    addItem(a.type, x.titre, x.prix, x.g != null ? x.g : GARANTIES.defaut, { gamme: x.gamme, extra: !!x.extra });
    advance();
  };
  ACTS.diff = function (v, b) {
    var d = document.getElementById("diff"), open = d.hidden;
    d.hidden = !open; b.setAttribute("aria-expanded", open);
    b.textContent = open ? "Masquer la comparaison" : "C'est quoi la différence ?";
  };
  function diffHtml(m) {
    var a120 = /120\s*Hz/i.test(m.ecran.nomOled || "");
    var eco = [["Technologie", "InCell"], ["Qualité d'affichage", "Bonne"], ["Consommation", "Un peu plus élevée"], ["Batterie", "Peut chauffer davantage et se vider plus vite"], ["Prix", "Le plus bas"]];
    var pre = [["Technologie", "Soft OLED"], ["Qualité d'affichage", "Meilleur rendu : couleurs, contrastes, noirs profonds"], ["Consommation", "Maîtrisée"], ["Batterie", "Sans surchauffe"], ["Prix", "Intermédiaire"]];
    var ori = [["Technologie", "Pièce d'origine Apple"], ["Qualité d'affichage", "Identique à l'écran de ton téléphone à sa sortie"], ["Consommation", "Comme à l'origine"], ["Batterie", "Comme à l'origine"], ["Prix", "Le plus élevé"]];
    if (a120) { eco.splice(2, 0, ["120 Hz", "Non"]); pre.splice(2, 0, ["120 Hz", "Oui"]); ori.splice(2, 0, ["120 Hz", "Oui"]); }
    function tbl(r) { return "<table>" + r.map(function (x) { return "<tr><td>" + esc(x[0]) + "</td><td>" + esc(x[1]) + "</td></tr>"; }).join("") + "</table>"; }
    var h = '<div class="diff"><p>Les trois gammes, en clair :</p>';
    if (m.ecran.premium != null) h += "<b>Gamme éco</b><em>" + esc(GAMME_TXT.eco) + "</em>" + tbl(eco);
    h += "<b>Gamme premium (" + esc(m.ecran.nomOled) + ")</b><em>" + esc(GAMME_TXT.premium) + "</em>" + tbl(pre);
    h += "<b>Gamme originale</b><em>" + esc(GAMME_TXT.originale) + "</em>" + tbl(ori) + "</div>";
    return h;
  }

  /* ── Conseil port de charge ── */
  SCREENS.conseil = function () {
    STAGE_PANNE = "connecteur";
    return stage(S.cur.m.nom, "connecteur", "Étape 2 sur 4") + '<div class="card"><span class="card-k">Avant d\'aller plus loin</span>' +
      '<h2 class="h2">Essaie ça d\'abord, c\'est gratuit</h2>' +
      '<p>9 fois sur 10, un port de charge capricieux est juste bouché.</p>' +
      '<div class="tip"><b>Décrasse le port de charge</b>Éteins le téléphone, prends un cure-dent ou une épingle et gratte doucement l\'intérieur du port. De la peluche s\'y tasse avec le temps et empêche le câble de faire contact. Vas-y sans forcer.</div>' +
      '<button class="btn btn-dark" data-act="conseilOk">J\'ai déjà essayé, ça charge toujours mal</button>' +
      '<button class="btn btn-ghost" data-act="conseilTest">Je vais tester, je reviens après</button></div>';
  };
  ACTS.conseilOk = function () {
    var m = S.cur.m;
    if (extras("connecteur", m).length) return go("gamme", { type: "connecteur" });
    if (m.connecteur == null) devisItem("connecteur"); else addItem("connecteur", "Connecteur de charge", m.connecteur);
    advance();
  };
  ACTS.conseilTest = function () {
    var c = S.cur;
    if (c.queue.length > 1) {
      /* On retire juste le port de charge et on continue avec le reste. */
      toast("OK, on retire le port de charge de ton devis");
      advance();
    } else { toast("Bonne chance ! Ton prix t'attend ici 👋"); reset(); go("home"); }
  };

  /* ── Diagnostic ── */
  SCREENS.diag = function () {
    var c = S.cur;
    STAGE_PANNE = c.queue[c.qi - 1] === "redemarre" ? "redemarre" : "diagnostic";
    return stage(c.m.nom, STAGE_PANNE, "Étape 2 sur 4") + '<div class="card"><span class="card-k">Avant d\'aller plus loin</span>' +
      '<h2 class="h2">Diagnostic — ' + eur(DIAGNOSTIC) + '</h2>' +
      '<p>On ouvre le téléphone, on identifie la panne et on te dit exactement ce qu\'il en est.</p>' +
      '<div class="warn"><b>Les ' + DIAGNOSTIC + ' € sont dus dans tous les cas.</b>' +
      '<ul><li>Si le téléphone est réparable et que tu fais faire la réparation : les ' + DIAGNOSTIC + ' € sont <b style="display:inline;color:inherit">déduits</b> du prix de la réparation.</li>' +
      '<li>Si le téléphone n\'est pas réparable : les ' + DIAGNOSTIC + ' € restent acquis, ils paient le diagnostic.</li></ul></div>' +
      '<button class="btn btn-dark" data-act="diagOk">J\'ai compris, je continue</button>' +
      '<button class="btn btn-ghost" data-act="back">Retour</button></div>';
  };
  ACTS.diagOk = function () { addItem("diagnostic", "Diagnostic", DIAGNOSTIC, -1); advance(); };
  ACTS.back = back;

  /* ── Désoxydation ── */
  SCREENS.desox = function () {
    STAGE_PANNE = "desoxydation";
    return stage(S.cur.m.nom, "desoxydation", "Étape 2 sur 4") + '<div class="card"><span class="card-k">Avant d\'aller plus loin</span>' +
      '<h2 class="h2">Désoxydation — ' + eur(DESOXYDATION) + ', diagnostic compris</h2>' +
      '<p>On ouvre le téléphone, on le nettoie et on établit un diagnostic complet.</p>' +
      '<div class="warn"><b>À savoir avant de réserver</b><ul>' +
      '<li>Il peut rester des éléments à changer après l\'intervention</li>' +
      '<li>Le téléphone peut ne pas repartir immédiatement</li>' +
      '<li>Certains problèmes peuvent réapparaître plus tard</li></ul></div>' +
      '<p class="sub">C\'est la nature d\'un dégât des eaux : personne ne peut garantir le résultat à l\'avance. Le diagnostic, lui, te dira exactement où tu en es.</p>' +
      '<button class="btn btn-dark" data-act="desoxOk">J\'ai compris, je continue</button>' +
      '<button class="btn btn-ghost" data-act="back">Retour</button></div>';
  };
  ACTS.desoxOk = function () { addItem("desoxydation", "Désoxydation", DESOXYDATION, 0); advance(); };

  /* ── Description (devis à la main) ── */
  SCREENS.desc = function () {
    var c = S.cur, autre = !!c.m.devis;
    return '<p class="step">Étape 2 sur 4</p><h1 class="h1">Décris-nous le problème</h1>' +
      '<p class="sub">Pas de prix fixe sur ce cas : on te le chiffre à la main, rapidement.</p>' +
      (autre ? '<label class="label" for="mt">' + (c.marque ? "Quel " + esc(c.marque) + " ?" : "Quel téléphone ?") + '</label><div class="field"><input id="mt" placeholder="' + (c.marque === "Samsung" ? "Ex : Galaxy S23" : c.marque ? "Ex : le nom du modèle" : "Ex : Samsung Galaxy S23") + '" value="' + esc(c.modelText) + '" autocomplete="off"></div><div class="gap"></div>' : "") +
      '<label class="label" for="ds">Qu\'est-ce qui ne va pas ?</label>' +
      '<div class="field"><textarea id="ds" placeholder="Ex : la caméra arrière est floue depuis une chute">' + esc(c.desc) + "</textarea></div>" +
      '<div class="cta"><button class="btn btn-dark" id="descGo" data-act="descOk" disabled>Continuer →</button></div>';
  };
  SCREENS.desc.after = function () {
    var ds = document.getElementById("ds"), mt = document.getElementById("mt"), btn = document.getElementById("descGo");
    function chk() { btn.disabled = ds.value.trim().length < 3 || (mt && mt.value.trim().length < 2); }
    ds.addEventListener("input", chk); if (mt) mt.addEventListener("input", chk); chk();
    (mt || ds).focus();
  };
  ACTS.descOk = function () {
    var c = S.cur, mt = document.getElementById("mt");
    c.desc = document.getElementById("ds").value.trim();
    if (mt) c.modelText = mt.value.trim();
    finishPhone();
  };

  /* ── Étape 3 : département ── */
  SCREENS.dep = function () {
    return '<p class="step">Étape 3 sur 4</p><h1 class="h1">Tu es dans quel département ?</h1>' +
      '<p class="sub">Le réparateur se déplace chez toi.</p>' +
      '<div class="grid">' + DEPS.map(function (d) {
        return '<button class="chip dep" data-act="dep" data-v="' + d.c + '"><b>' + d.c + "</b><span>" + esc(d.n) + "</span></button>";
      }).join("") +
      '<button class="chip wide" data-act="horsZone">🚚 Je ne suis pas en Île-de-France</button></div>';
  };
  ACTS.dep = function (c) {
    S.horsZone = false;
    S.dep = DEPS.filter(function (d) { return d.c === c; })[0];
    go("urgence");
  };
  ACTS.horsZone = function () { go("horszone"); };

  SCREENS.horszone = function () {
    return '<p class="step">Étape 3 sur 4</p><h1 class="h1">On ne couvre que l\'Île-de-France</h1>' +
      '<p class="sub">Nos réparateurs se déplacent uniquement dans les 8 départements franciliens' + (S.adresse && S.adresse.ville ? ", et " + esc(S.adresse.ville) + " n'en fait pas partie" : "") + '. <button class="link" style="display:inline;margin:0" data-act="back">Corriger l\'adresse</button></p>' +
      '<div class="card"><span class="card-k">📦 Réparation par envoi postal</span>' +
      '<h2 class="h2">On ne se déplace pas chez toi, mais on peut réparer ton téléphone.</h2>' +
      '<p>Tu nous l\'envoies, on le répare, on te le renvoie.</p>' +
      '<div class="note"><b>Les frais d\'envoi, aller et retour, sont à ta charge.</b></div>' +
      telField("telHz") +
      '<div class="gap"></div><button class="btn btn-dark" id="telHzGo" data-act="hzOk" disabled>Être recontacté pour un envoi</button>' +
      "</div>";
  };
  SCREENS.horszone.after = function () { bindTel("telHz", "telHzGo"); };
  ACTS.hzOk = function () {
    S.horsZone = true; S.dep = null; S.urgence = null;
    sendLead("hors_zone");
    go("devis");
  };

  /* ── Étape 4 : le jour et l'heure ── */
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var NB_JOURS = 14, DELAI_H = 2;
  function maintenantParis() {
    try { return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" })); } catch (e) { return new Date(); }
  }
  /* Jours bloqués / fermés, réglés dans WordPress → Prix SOS (relus en direct). */
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function estBloque(d) {
    var D = window.SOSP_DISPO || {};
    return (D.bloques || []).indexOf(iso(d)) > -1 || (D.fermes || []).indexOf(d.getDay()) > -1;
  }
  function majDispo(cb) {
    if (!CONFIG.WEBHOOK || !window.fetch) return cb && cb(false);
    fetch(CONFIG.WEBHOOK.replace(/lead\/?$/, "dispo") + (CONFIG.WEBHOOK.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !Array.isArray(d.bloques)) return cb && cb(false);
        var avant = JSON.stringify(window.SOSP_DISPO || {});
        window.SOSP_DISPO = { bloques: d.bloques, fermes: d.fermes || [] };
        if (cb) cb(JSON.stringify(window.SOSP_DISPO) !== avant);
      }).catch(function () { if (cb) cb(false); });
  }
  var dispoT = null;

  function jours() {
    var n = maintenantParis(), l = [];
    for (var i = 0; i < NB_JOURS + 21; i++) {
      if (l.length >= NB_JOURS) break;
      var d = new Date(n.getFullYear(), n.getMonth(), n.getDate() + i);
      if (estBloque(d)) continue;
      var h = heures(d, i === 0 ? n : null);
      if (!h.length) continue;
      l.push({ d: d, i: i, h: h,
        court: i === 0 ? "Auj." : i === 1 ? "Demain" : JOURS[d.getDay()].slice(0, 3) + ".",
        num: d.getDate(), mois: MOIS[d.getMonth()],
        long: (i === 0 ? "aujourd'hui" : i === 1 ? "demain" : JOURS[d.getDay()]) + " " + d.getDate() + " " + MOIS[d.getMonth()] });
    }
    return l;
  }
  function heures(d, now) {
    var l = [];
    for (var h = CONFIG.HEURE_DEBUT_APPEL; h < CONFIG.HEURE_FIN_APPEL; h++) {
      if (now && h < now.getHours() + DELAI_H + (now.getMinutes() > 0 ? 1 : 0)) continue;
      l.push(h);
    }
    return l;
  }
  /* Étape 4 : « C'est pour quand ? » — 4 choix simples (plus de calendrier jour/heure).
     L'heure exacte se cale ensuite avec le client sur WhatsApp. */
  SCREENS.urgence = function () {
    var cur = S.urgence ? S.urgence.id : null;
    return '<p class="step">Étape 4 sur 4</p><h1 class="h1">C\'est pour quand ?</h1>' +
      '<p class="sub">Juste pour savoir si on te fait passer en priorité.</p>' +
      '<div class="opts">' + URGENCES.map(function (u) {
        return '<button class="opt opt-urg' + (u.id === "urgent" ? " best" : "") + '" data-act="urg" data-v="' + u.id + '" aria-pressed="' + (cur === u.id) + '">' +
          '<span class="opt-ico">' + u.ico + '</span>' +
          '<span class="opt-txt"><span class="opt-t">' + esc(u.titre) + '</span><span class="opt-s">' + esc(u.detail) + "</span></span>" +
          '<span class="choice-arrow">›</span></button>';
      }).join("") + "</div>";
  };
  SCREENS.urgence.after = function () { clearInterval(dispoT); };
  ACTS.jour = function (i) {
    S.rdv = { i: +i, h: null };
    Array.prototype.forEach.call(document.querySelectorAll(".jour"), function (b) { b.setAttribute("aria-selected", b.getAttribute("data-v") === i); });
    dessineHeures();
  };
  ACTS.heure = function (h) { S.rdv.h = +h; dessineHeures(); };
  ACTS.rdvOk = function (v, b) {
    /* Dernière vérification en direct avant de réserver */
    if (b) b.disabled = true;
    majDispo(function () {
      var j = jours().filter(function (x) { return x.i === S.rdv.i; })[0];
      if (!j || j.h.indexOf(S.rdv.h) < 0) { toast("Ce jour n'est plus disponible. Choisis-en un autre."); S.rdv = null; return rerender(); }
      rdvValide(j);
    });
  };
  function rdvValide(j) {
    S.rdv.texte = j.long + " à " + S.rdv.h + " h";
    S.urgence = { id: "rdv", titre: "RDV souhaité : " + S.rdv.texte, chaud: true };
    go("devis");
  }
  /* ── Adresse : saisie avec suggestions ──
     Les adresses viennent de la Base Adresse Nationale (api-adresse.data.gouv.fr),
     service public gratuit, sans clé. */
  var BAN = "https://api-adresse.data.gouv.fr/";
  /* Centre de chaque département : les suggestions proches passent en premier. */
  var CENTRES = { "75": [48.8566, 2.3522], "77": [48.62, 2.95], "78": [48.81, 1.95], "91": [48.52, 2.25],
    "92": [48.84, 2.24], "93": [48.91, 2.48], "94": [48.78, 2.47], "95": [49.06, 2.13] };
  SCREENS.adresse = function () {
    var a = S.adresse || {};
    return '<p class="step">Étape 3 sur 4</p>' +
      '<h1 class="h1">On vient où ?</h1>' +
      '<p class="sub">Ton adresse et ton numéro, pour que le réparateur arrive directement chez toi.</p>' +
      '<label class="label" for="adr">Adresse</label>' +
      '<div class="adr-wrap"><div class="field" id="adrF"><input id="adr" placeholder="Ex : 12 rue de la Paix, Paris" autocomplete="street-address" value="' + esc(a.label || "") + '"><span class="field-ok">✓</span></div>' +
      '<ul class="sugg" id="sugg" role="listbox" hidden></ul></div>' +
      '<div class="gap"></div>' +
      '<label class="label" for="adr2">Bâtiment, étage, code (facultatif)</label>' +
      '<div class="field"><input id="adr2" placeholder="Ex : bât. B, 3e étage, code 1234A" value="' + esc(a.complement || "") + '" autocomplete="address-line2"></div>' +
      '<div class="gap"></div>' + telField("telAdr") +
      '<div class="cta"><button class="btn btn-dark" id="adrGo" data-act="adrOk" disabled>Continuer →</button>' +
      '<p class="mini">Ton numéro sert uniquement au réparateur pour te joindre.</p></div>';
  };
  SCREENS.adresse.after = function () {
    var inp = document.getElementById("adr"), ul = document.getElementById("sugg"), t = null, res = [];
    function valide() {
      adrBtnMaj();
      document.getElementById("adrF").classList.toggle("ok", !!(S.adresse && S.adresse.label === inp.value && S.adresse.ok));
    }
    inp.addEventListener("input", function () {
      S.adresse = { label: inp.value, complement: (S.adresse || {}).complement || "" };
      valide();
      clearTimeout(t);
      var q = inp.value.trim();
      if (q.length < 4) { ul.hidden = true; return; }
      t = setTimeout(function () {
        var ctr = S.dep && CENTRES[S.dep.c] || CENTRES["75"];
        fetch(BAN + "search/?limit=5&autocomplete=1&lat=" + ctr[0] + "&lon=" + ctr[1] + "&q=" + encodeURIComponent(q))
          .then(function (r) { return r.json(); })
          .then(function (j) {
            res = (j.features || []);
            ul.innerHTML = res.map(function (f, i) {
              return '<li role="option"><button type="button" data-i="' + i + '"><b>' + esc(f.properties.name) + '</b><span>' + esc(f.properties.postcode + " " + f.properties.city) + "</span></button></li>";
            }).join("");
            ul.hidden = !res.length;
          }).catch(function () { ul.hidden = true; });
      }, 220);
    });
    ul.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-i]"); if (!b) return;
      choisirAdresse(res[+b.getAttribute("data-i")]);
      ul.hidden = true;
    });
    document.addEventListener("click", function cache(e) {
      if (!document.body.contains(ul)) return document.removeEventListener("click", cache);
      if (!e.target.closest(".adr-wrap")) ul.hidden = true;
    });
    bindTel("telAdr", null, adrBtnMaj);
    document.getElementById("adr2").addEventListener("input", function (e) { S.adresse = S.adresse || { label: inp.value }; S.adresse.complement = e.target.value; });
    valide();
  };
  /* Continuer : il faut une adresse ET un numéro valide. */
  function adrBtnMaj() {
    var b = document.getElementById("adrGo"), a = document.getElementById("adr"), t = document.getElementById("telAdr");
    if (!b || !a) return;
    var telOk = t ? !!checkTel(t.value, CONFIG.PAYS[+document.getElementById("telAdrP").value] || CONFIG.PAYS[0]) : true;
    b.disabled = !(a.value.trim().length >= 8 && telOk);
  }
  function choisirAdresse(f) {
    var p = f.properties, c = f.geometry && f.geometry.coordinates;
    var inp = document.getElementById("adr");
    S.adresse = { label: p.label, cp: p.postcode, ville: p.city, ok: true,
      lat: c ? c[1] : null, lon: c ? c[0] : null, complement: (S.adresse || {}).complement || "" };
    if (inp) { inp.value = p.label; inp.dispatchEvent(new Event("change")); }
    adrBtnMaj();
    document.getElementById("adrF").classList.add("ok");
  }
  ACTS.position = function (v, b) {
    var msg = document.getElementById("posMsg");
    if (!navigator.geolocation) { msg.textContent = "Ton téléphone ne permet pas d'envoyer ta position. Tape ton adresse."; return; }
    b.disabled = true; b.querySelector("span").textContent = "Recherche de ta position…"; msg.textContent = "";
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude, lon = pos.coords.longitude;
      fetch(BAN + "reverse/?lat=" + lat + "&lon=" + lon)
        .then(function (r) { return r.json(); })
        .then(function (j) {
          var f = (j.features || [])[0];
          if (f) { choisirAdresse(f); S.adresse.lat = lat; S.adresse.lon = lon; S.adresse.gps = true; }
          else {
            S.adresse = { label: "Position GPS (" + lat.toFixed(5) + ", " + lon.toFixed(5) + ")", lat: lat, lon: lon, gps: true, ok: true, complement: "" };
            document.getElementById("adr").value = S.adresse.label; document.getElementById("adrGo").disabled = false;
          }
          b.querySelector("span").textContent = "Position envoyée ✓"; b.classList.add("ok"); b.disabled = false;
          msg.textContent = "Vérifie l'adresse et ajoute l'étage ou le code si besoin.";
        })
        .catch(function () {
          b.disabled = false; b.querySelector("span").textContent = "Envoyer ma position";
          msg.textContent = "Impossible de trouver l'adresse. Tape-la à la main.";
        });
    }, function () {
      b.disabled = false; b.querySelector("span").textContent = "Envoyer ma position";
      msg.textContent = "Position refusée ou introuvable. Tape ton adresse à la main.";
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  };
  ACTS.adrOk = function () {
    var v = document.getElementById("adr").value.trim();
    if (!S.adresse || S.adresse.label !== v) S.adresse = { label: v, complement: (S.adresse || {}).complement || "" };
    S.adresse.complement = document.getElementById("adr2").value.trim();
    var tIn = document.getElementById("telAdr");
    if (tIn) {
      S.pays = CONFIG.PAYS[+document.getElementById("telAdrP").value] || CONFIG.PAYS[0];
      var tOk = checkTel(tIn.value, S.pays);
      if (!tOk) { tIn.focus(); return; }
      S.tel = tOk;
    }
    var cp = S.adresse.cp || ((S.adresse.label.match(/\b(\d{5})\b/) || [])[1]) || "";
    /* On se déplace partout : toutes les adresses sont acceptées. */
    var d2 = cp ? (/^97/.test(cp) ? cp.slice(0, 3) : cp.slice(0, 2)) : "";
    var idf = DEPS.filter(function (d) { return d.c === d2; })[0];
    S.dep = d2 ? { c: d2, n: idf ? idf.n : (S.adresse.ville || "") } : null;
    S.horsZone = false;
    go("urgence");
  };
  function adresseTexte() {
    if (!S.adresse || !S.adresse.label) return "";
    return S.adresse.label + (S.adresse.complement ? " (" + S.adresse.complement + ")" : "");
  }
  function carteUrl() {
    var a = S.adresse; if (!a) return "";
    return a.lat != null ? "https://maps.google.com/?q=" + a.lat + "," + a.lon : "https://maps.google.com/?q=" + encodeURIComponent(a.label);
  }

  ACTS.urg = function (id) {
    S.urgence = URGENCES.filter(function (u) { return u.id === id; })[0];
    S.rdv = null;
    go("devis");
  };
  function quandTexte() { return S.urgence && S.urgence.id !== "rdv" && S.urgence.chaud ? S.urgence.titre : ""; }

  /* ── Numéro, juste avant le devis ── */
  SCREENS.tel = function () {
    return '<p class="step">Dernière étape</p><h1 class="h1">Ton devis <span class="hl">arrive</span></h1>' +
      '<p class="sub">Laisse ton numéro, on t\'écrit sur WhatsApp dans les 5 minutes.</p>' +
      telField("telMain") +
      '<div class="cta"><button class="btn btn-dark" id="telGo" data-act="telOk" disabled>Voir mon devis →</button>' +
      '<p class="mini">Ton numéro sert uniquement à te recontacter pour ta réparation.</p></div>';
  };
  SCREENS.tel.after = function () { bindTel("telMain", "telGo"); document.getElementById("telMain").focus(); };
  ACTS.telOk = function () { sendLead("devis"); go("devis"); };

  function telField(id) {
    return '<label class="label" for="' + id + '">Ton numéro de téléphone</label>' +
      '<div class="field" id="' + id + 'F"><select id="' + id + 'P" aria-label="Indicatif pays">' +
      CONFIG.PAYS.map(function (p, i) {
        return '<option value="' + i + '"' + (p === S.pays ? " selected" : "") + ">" + p.drapeau + " +" + p.indicatif + "</option>";
      }).join("") + '</select>' +
      '<input id="' + id + '" type="tel" inputmode="tel" autocomplete="tel" placeholder="06 12 34 56 78" maxlength="20" enterkeyhint="go" value="' + esc(S.tel ? S.tel.saisie : "") + '">' +
      '<span class="field-ok">✓</span></div><p class="field-msg" id="' + id + 'M"></p>';
  }
  function checkTel(raw, pays) {
    var d = raw.replace(/[^\d+]/g, "");
    if (pays.indicatif === "33") {
      d = d.replace(/^\+?33/, "").replace(/^0/, "");
      if (!/^[67]\d{8}$/.test(d)) return null;
      return { e164: "+33" + d, affiche: "0" + d.replace(/(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5"), saisie: raw };
    }
    d = d.replace(new RegExp("^\\+?" + pays.indicatif), "").replace(/^0/, "");
    if (!/^\d{6,13}$/.test(d)) return null;
    return { e164: "+" + pays.indicatif + d, affiche: "+" + pays.indicatif + " " + d, saisie: raw };
  }
  function bindTel(id, btnId, onChk) {
    var inp = document.getElementById(id), sel = document.getElementById(id + "P"),
        f = document.getElementById(id + "F"), msg = document.getElementById(id + "M"), btn = document.getElementById(btnId);
    function chk(final) {
      S.pays = CONFIG.PAYS[+sel.value];
      var ok = checkTel(inp.value, S.pays);
      f.classList.toggle("ok", !!ok);
      var bad = !ok && final && inp.value.replace(/\D/g, "").length > 3;
      f.classList.toggle("err", bad);
      msg.textContent = bad ? (S.pays.indicatif === "33" ? "Un portable français commence par 06 ou 07." : "Ce numéro semble incomplet.") : "";
      if (btn) btn.disabled = !ok;
      if (ok) S.tel = ok;
      if (onChk) onChk();
    }
    inp.addEventListener("input", function () { chk(false); });
    inp.addEventListener("blur", function () { chk(true); });
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && btn && !btn.disabled) btn.click(); });
    sel.addEventListener("change", function () { chk(false); });
    chk(false);
  }

  /* ═══ CALCUL DU PRIX ═══════════════════════════════════════
     • La réparation la plus chère reste au prix plein ; 2 réparations
       → −20 % sur l'autre, 3 ou + → −30 % sur toutes les autres.
     • Diagnostic : hors remise, ne compte pas dans le nombre.
     • Châssis + vitre sur un même téléphone : la vitre passe au forfait
       CHASSIS_COMBINE (jamais plus cher que son prix réel), hors remise
       mais elle compte dans le nombre.
     • Aucune remise dès qu'une réparation part en devis.
     • Code promo : sur le total après remise, jamais sur un devis. */
  function compute() {
    var lines = [];
    S.phones.forEach(function (p, pi) {
      var hasCh = p.items.some(function (x) { return x.id === "chassis" && x.prix != null; });
      p.items.forEach(function (it) {
        var L = { it: it, pi: pi, base: it.prix, final: it.prix, fixed: false, note: "" };
        if (it.id === "vitre" && hasCh && it.prix != null) {
          var f = CHASSIS_COMBINE[p.m.serie] != null ? CHASSIS_COMBINE[p.m.serie] : CHASSIS_COMBINE.defaut;
          if (f < it.prix) { L.final = f; L.note = "Forfait avec le châssis"; }
          L.fixed = true;
        }
        if (it.id === "diagnostic") L.fixed = true;
        lines.push(L);
      });
    });
    var devis = lines.some(function (l) { return l.base == null; });
    var count = lines.filter(function (l) { return l.it.id !== "diagnostic" && l.it.id !== "deplacement"; }).length;
    var taux = 0;
    if (!devis) for (var i = 0; i < REMISES.length; i++) if (count >= REMISES[i].aPartirDe) { taux = REMISES[i].taux; break; }
    if (taux) {
      var pool = lines.filter(function (l) { return !l.fixed; }).sort(function (a, b) { return b.base - a.base; });
      pool.slice(1).forEach(function (l) { l.final = Math.round(l.base * (1 - taux) * 100) / 100; l.note = "−" + Math.round(taux * 100) + " %"; });
    }
    var full = 0, total = 0;
    lines.forEach(function (l) { if (l.base != null) { full += l.base; total += l.final; } });
    var promo = 0;
    if (S.promo && !devis) promo = Math.round(total * S.promo.taux * 100) / 100;
    var next = devis ? null : pct(count + 1 >= 3 ? 3 : 2) / 100;
    return { lines: lines, devis: devis, count: count, full: full, sub: total, promo: promo, total: total - promo, nextTaux: next };
  }

  /* ── Devis ── */
  SCREENS.devis = function () {
    var R = compute(), multi = S.phones.length > 1, h = "";
    if (!S.code) S.code = "SOS-" + Math.random().toString(36).slice(2, 6).toUpperCase();

    h += '<div class="quote"><span class="quote-k">' + (R.devis ? "Prix fixe pour ce qui est chiffré" : "Prix comprenant la pièce et la main d'œuvre") + "</span>";
    if (R.total > 0 || !R.devis) {
      h += '<div class="quote-total">' + eur(R.total).replace(" €", "<small>€</small>") +
        (R.full > R.total ? '<span class="quote-was">' + eur(R.full) + "</span>" : "") + "</div>";
      if (R.full > R.total) h += '<span class="quote-save">Tu économises ' + eur(R.full - R.total) + "</span>";
    } else {
      h += '<div class="quote-total" style="font-size:44px">Sur devis</div>';
    }
    if (R.devis) h += '<p class="quote-foot">+ ce qu\'on te chiffre à la main, rapidement. Pas de remise promise sur un montant qu\'on ne connaît pas encore.</p>';

    h += '<ul class="lines">';
    S.phones.forEach(function (p, pi) {
      var nom = p.m.devis ? (p.modelText || "Autre modèle") : p.m.nom;
      h += '<li class="phone-h">' + visuelTelephone(p.m.nom) + '<span class="phone-h-n">' + esc(nom) + "</span>" + (S.phones.length > 1 ? '<span>' + (pi + 1) + "/" + S.phones.length + "</span>" : "") + "</li>";
      R.lines.filter(function (l) { return l.pi === pi; }).forEach(function (l) {
        var it = l.it;
        var t = it.famille + (it.gamme ? " — " + it.gamme : "");
        if (it.id === "vitre" && it.gamme == null && it.titre.indexOf("origine") > -1) t = it.titre;
        h += '<li><span><span class="l-t">' + esc(t) + '</span><span class="l-s">' +
          esc(l.base == null ? (p.desc ? "« " + p.desc.slice(0, 60) + (p.desc.length > 60 ? "…" : "") + " »" : "Chiffré à la main") : garantieTxt(it) + (l.note ? " · " + l.note : "")) +
          '</span></span><span class="l-p">' +
          (l.base == null ? "Devis" : (l.final !== l.base ? "<s>" + eur(l.base) + "</s>" : "") + eur(l.final)) + "</span></li>";
      });
    });
    R.lines.filter(function (l) { return l.pi < 0; }).forEach(function (l) {
      h += '<li><span><span class="l-t">' + esc(l.it.titre) + '</span><span class="l-s">Selon ton département</span></span><span class="l-p">' + eur(l.final) + "</span></li>";
    });
    if (R.promo) h += '<li><span><span class="l-t">Code ' + esc(S.promo.code) + '</span><span class="l-s">−' + Math.round(S.promo.taux * 100) + ' % sur le total</span></span><span class="l-p">−' + eur(R.promo) + "</span></li>";
    h += "</ul>";
    var origine = S.phones.some(function (p) { return p.items.some(function (x) { return ORIGINE_UNIQUEMENT.indexOf(x.id) > -1; }); });
    if (origine && !S.horsZone) h += '<p class="quote-foot">' + esc(MENTION_ORIGINE) + "</p>";
    h += '<p class="quote-foot deplac">🚗 Frais de déplacement : on te les indique sur WhatsApp.</p>';
    h += "</div>";

    if (!S.horsZone || true) {
      h += '<button class="add-phone" data-act="addPhone"><span class="plus">＋</span>Ajouter un autre téléphone' +
        (R.nextTaux ? '<span class="badge">−' + Math.round(R.nextTaux * 100) + " %</span>" : "") + "</button>";
    }

    if (!R.devis) {
      h += S.promo
        ? '<p class="mini">Code <b>' + esc(S.promo.code) + '</b> appliqué · <button class="link" style="display:inline;margin:0" data-act="promoOff">retirer</button></p>'
        : '<button class="link" data-act="promoOpen" aria-expanded="false" aria-controls="promo">J\'ai un code promo</button>' +
          '<div id="promo" hidden><div class="promo-row"><div class="field"><input id="promoIn" placeholder="CODE" maxlength="20" autocomplete="off" style="text-transform:uppercase" aria-label="Ton code promo"></div>' +
          '<button class="btn btn-dark" data-act="promoOk">Appliquer</button></div><p class="field-msg" id="promoM"></p></div>';
    }

    h += '<div class="gap"></div>';
    if (S.horsZone) {
      h += '<div class="note">📦 <b>Réparation par envoi postal.</b> Tu nous envoies ton téléphone, on le répare et on te le renvoie. <b>Les frais d\'envoi, aller et retour, sont à ta charge.</b> On t\'écrit sur WhatsApp pour organiser l\'envoi.</div>' +
        '<div class="cta"><button class="btn btn-dark" data-act="confirm">Valider ma demande d\'envoi</button></div>';
    } else {
      var hot = !S.urgence || S.urgence.chaud;
      h += (S.rdv && S.rdv.texte
        ? '<div class="promise"><span class="dot"></span><span><b>Ton créneau : ' + esc(S.rdv.texte) + "</b><br>" + (adresseTexte() ? "📍 " + esc(adresseTexte()) + "<br>" : "") + "On te le confirme sur WhatsApp. " + '<button class="link" style="display:inline;margin:0" data-act="changerRdv">Changer</button></span></div>'
        : '<div class="promise"><span class="dot"></span><span><b>' +
        (quandTexte() ? "Quand : " + esc(quandTexte().charAt(0).toLowerCase() + quandTexte().slice(1)) : "Ton prix est prêt") +
        "</b><br>" + (adresseTexte() ? "📍 " + esc(adresseTexte()) + "<br>" : "") + "On cale l'heure exacte avec toi sur WhatsApp. " +
        '<button class="link" style="display:inline;margin:0" data-act="changerRdv">Changer</button></span></div>') +
        '<div class="cta"><p class="cta-info">🔒 Ton prix est bloqué 7 jours · code <b>' + esc(S.code) + "</b></p>" +
        '<button class="btn ' + (hot ? "btn-yellow" : "btn-dark") + ' btn-resa" data-act="confirm">' + WA_ICO + "<span>" + (hot ? "Réserver sur WhatsApp" : "Recevoir mon devis sur WhatsApp") + "</span></button>" +
        '<p class="mini">WhatsApp s\'ouvre avec ta demande déjà écrite : tu n\'as plus qu\'à l\'envoyer.</p>' +
        '<button class="rappel-lien" data-act="rappel">' + TEL_ICO + '<span>Je préfère être rappelé</span></button></div>';
    }
    return h;
  };
  ACTS.addPhone = function () { go("marque"); };
  ACTS.changerRdv = function () { go("urgence"); };
  ACTS.promoOpen = function (v, b) {
    var p = document.getElementById("promo"); p.hidden = false; b.hidden = true;
    var inp = document.getElementById("promoIn"); inp.focus();
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") ACTS.promoOk(); });
  };
  ACTS.promoOk = function () {
    var v = document.getElementById("promoIn").value.trim().toUpperCase(), mois = new Date().getMonth() + 1;
    var c = CONFIG.CODES_PROMO.filter(function (x) { return x.code === v && (!x.mois || x.mois === mois); })[0];
    if (!c) { document.getElementById("promoM").textContent = v ? "Ce code n'est pas valable." : "Entre ton code."; return; }
    S.promo = c; toast("Code " + c.code + " appliqué 🎉"); rerender();
  };
  ACTS.promoOff = function () { S.promo = null; rerender(); };
  function rerender() { var top = hist[hist.length - 1]; go(top.name, top.args, true); }

  ACTS.confirm = function () {
    sendLead(S.horsZone ? "envoi_postal" : (S.rdv ? "rdv" : "devis"));
    if (!S.horsZone && CONFIG.WHATSAPP) {
      var u = waUrl(), w = null;
      try { w = window.open(u, "_blank"); } catch (e) {}
      if (!w) { location.href = u; }
    }
    go(S.horsZone ? "postal" : "done");
  };

  /* ── Demande de rappel : enregistrée + message WhatsApp prêt à envoyer ── */
  function rappelTexte() {
    if (!S.code) S.code = "SOS-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    var l = ["Bonjour SOS Phone, pouvez-vous me rappeler sur ce numéro ? (" + S.code + ")"];
    S.phones.forEach(function (p) {
      var nom = p.m.devis ? (p.modelText || "Autre modèle") : p.m.nom;
      l.push("📱 " + nom + (p.items.length ? " : " + p.items.map(function (it) { return it.famille; }).join(", ") : ""));
    });
    if (S.phones.length) { var R = compute(); if (!R.devis && R.total) l.push("💶 Prix affiché : " + eur(R.total)); }
    if (adresseTexte()) l.push("📍 " + adresseTexte());
    if (S.tel) l.push("📞 " + S.tel.affiche);
    return l.join("\n");
  }
  function rappelUrl() { return "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent(rappelTexte()); }
  ACTS.rappel = function () {
    sendLead("rappel");
    if (CONFIG.WHATSAPP) {
      var u = rappelUrl(), w = null;
      try { w = window.open(u, "_blank"); } catch (e) {}
      if (!w) { location.href = u; }
    }
    go("rappel");
  };
  SCREENS.rappel = function () {
    return '<div class="done"><div class="done-ico wa">' + WA_ICO.replace('width="22" height="22"', 'width="46" height="46"') + '</div>' +
      '<h1 class="h1">Envoie le message, on te rappelle</h1>' +
      '<p class="sub">Ta demande de rappel est écrite dans WhatsApp. Appuie sur envoyer : on t\'appelle sur ce numéro' +
      (enHeuresAppel() ? " dès que possible." : ", dès " + CONFIG.HEURE_DEBUT_APPEL + " h.") + '</p>' +
      (CONFIG.WHATSAPP ? '<a class="btn btn-wa" href="' + esc(rappelUrl()) + '" target="_blank" rel="noopener">' + WA_ICO + " Rouvrir WhatsApp</a>" : "") +
      '<button class="btn btn-ghost" data-act="start">Retour à l\'accueil</button></div>';
  };

  /* ── Confirmations ── */
  var CHECK = '<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  SCREENS.done = function () {
    return '<div class="done"><div class="done-ico wa">' + WA_ICO.replace('width="22" height="22"', 'width="46" height="46"') + '</div>' +
      '<h1 class="h1">Envoie le message</h1>' +
      '<p class="sub">Ta demande est écrite dans WhatsApp' + (S.rdv && S.rdv.texte ? ", créneau <b>" + esc(S.rdv.texte) + "</b>" : quandTexte() ? " (<b>" + esc(quandTexte().toLowerCase()) + "</b>)" : "") + '. Appuie sur envoyer, on te répond vite.</p>' +
      waLink() +
      '<p class="sub" style="margin-top:18px">Ton code : <span class="code">' + esc(S.code) + "</span></p>" +
      '<button class="btn btn-ghost" data-act="start">Faire un autre devis</button></div>';
  };
  SCREENS.postal = function () {
    return '<div class="done"><div class="done-ico">' + CHECK + '</div>' +
      '<h1 class="h1">C\'est noté</h1><p class="sub">On te recontacte pour organiser l\'envoi de ton téléphone.</p>' +
      '<div class="note" style="text-align:left"><b>À prévoir</b><br>Les frais d\'envoi aller et retour restent à ta charge. On t\'expliquera comment emballer le téléphone et où l\'envoyer.</div>' +
      '<p class="sub">Ton code : <span class="code">' + esc(S.code || "") + "</span></p>" +
      '<button class="btn btn-ghost" data-act="start">Retour à l\'accueil</button></div>';
  };
  var IG_ICO = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>';
  function igUrl() { return "https://www.instagram.com/" + encodeURIComponent(CONFIG.INSTAGRAM) + "/"; }
  function igCard() {
    if (!CONFIG.INSTAGRAM) return "";
    return '<a class="ig" href="' + igUrl() + '" target="_blank" rel="noopener">' +
      '<span class="ig-ico">' + IG_ICO + '</span><span><span class="ig-k">Nos réparations en vidéo</span>' +
      '<span class="ig-t">@' + esc(CONFIG.INSTAGRAM) + '</span></span><span class="choice-arrow">→</span></a>';
  }
  function igLink() {
    if (!CONFIG.INSTAGRAM) return "";
    return '<a class="btn btn-ghost" href="' + igUrl() + '" target="_blank" rel="noopener">' + IG_ICO + ' Suis-nous sur Instagram</a>';
  }
  /* Message WhatsApp envoyé par le client (format validé par Wanis le 2026-11-21). */
  var DELAIS = { urgent: "le plus rapidement possible", semaine: "dans la semaine", souple: "pas pressé, quand ça arrange", info: "je regarde juste le prix pour l'instant" };
  function waTexte() {
    if (!S.code) S.code = "SOS-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    var R = compute(), l = ["Bonjour SOS Phone, voici ma demande :"];
    function cap(t) { t = String(t || ""); return t.charAt(0).toUpperCase() + t.slice(1); }
    S.phones.forEach(function (p, pi) {
      l.push("");
      l.push("📱 Modèle : " + (p.m.devis ? (p.modelText || "Autre modèle").trim() : p.m.nom));
      l.push("");
      l.push("🔧 Réparations souhaitées :");
      l.push("");
      R.lines.filter(function (x) { return x.pi === pi; }).forEach(function (x) {
        var it = x.it, nom = it.famille;
        var g = it.gamme && it.gamme !== "d'origine" ? (it.extra || (it.id !== "ecran" && it.id !== "batterie") ? it.gamme : "Gamme " + cap(it.gamme)) : "";
        if (g) nom += " : " + g + (x.base == null ? " — sur devis" : " — " + eur(x.final));
        else nom += " : " + (x.base == null ? "sur devis" : eur(x.final));
        l.push("• " + nom);
      });
      if (p.desc) { l.push(""); l.push("📝 Description : " + p.desc); }
    });
    l.push("");
    if (R.promo) l.push("🏷️ Code promo : " + S.promo.code + " (−" + Math.round(S.promo.taux * 100) + " %)");
    l.push("💰 Total estimé : " + (R.devis ? (R.total ? eur(R.total) + " + le reste à chiffrer" : "à chiffrer") : eur(R.total)));
    l.push("");
    if (adresseTexte()) { l.push("📍 Adresse : " + adresseTexte()); l.push(""); }
    if (S.tel) { l.push("📞 Téléphone : " + S.tel.affiche); l.push(""); }
    var delai = S.rdv && S.rdv.texte ? S.rdv.texte : (S.urgence && DELAIS[S.urgence.id]) || "";
    if (delai) { l.push("📅 Délai souhaité : " + delai); l.push(""); }
    l.push("Merci pour votre demande !");
    l.push("");
    l.push("⏳ Votre demande a bien été reçue. Un technicien SOS Phone vous contactera dans les plus brefs délais afin de confirmer votre réservation et les modalités de l’intervention.");
    l.push("");
    l.push("À très bientôt,");
    l.push("L’équipe SOS Phone");
    return l.join("\n");
  }
  function waUrl() { return "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent(waTexte()); }
  function waLink() {
    if (!CONFIG.WHATSAPP) return "";
    return '<a class="btn btn-wa" href="' + esc(waUrl()) + '" target="_blank" rel="noopener">' + WA_ICO + " Rouvrir WhatsApp</a>";
  }
  var WA_ICO = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';

  /* ═══ ENVOI DE LA DEMANDE ══════════════════════════════════ */
  function sendLead(etape) {
    if (!S.code) S.code = "SOS-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    var R = compute();
    var lead = {
      date: new Date().toISOString(), etape: etape, code: S.code,
      telephone: S.tel ? S.tel.e164 : "", departement: S.dep ? S.dep.c + " " + S.dep.n : (S.horsZone ? "Hors IDF (envoi postal)" : ""),
      urgence: S.urgence ? S.urgence.titre : "",
      adresse: adresseTexte(), carte: S.adresse ? carteUrl() : "",
      telephones: S.phones.map(function (p) {
        return { modele: p.m.devis ? p.modelText : p.m.nom, description: p.desc,
          reparations: p.items.map(function (it) { return { panne: it.famille, gamme: it.gamme || "", prix: it.prix }; }) };
      }),
      total: R.devis ? null : R.total, promo: S.promo ? S.promo.code : "",
      source: new URLSearchParams(location.search).get("src") || ""
    };
    var all = load("sos_leads") || []; all.push(lead); store("sos_leads", all.slice(-50));
    if (CONFIG.WEBHOOK) {
      try {
        fetch(CONFIG.WEBHOOK, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(lead), keepalive: true });
      } catch (e) {}
    }
  }

  /* ── Démarrage ── */
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !$back.hidden) back();
  });
  reset();
  enteteReseaux(); majStatut(); setInterval(majStatut, 60000);
  go("home");
})();
