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
  "iPhone 11 ou plus ancien": ["carre2", "#d2c7e2"],// mauve
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
  "iPhone 11 ou plus ancien": "11"
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
      promo: null, code: null, leadSent: false
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
      return +new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "numeric", hourCycle: "h23" }).format(new Date());
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
  var STEP = { modele: 1, pannes: 2, gamme: 2, conseil: 2, diag: 2, desox: 2, desc: 2, dep: 3, horszone: 3, urgence: 4, tel: 4, devis: 5, done: 5, postal: 5 };

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
    $back.hidden = hist.length < 2 || name === "done" || name === "postal";
    $foot.hidden = name !== "home";
    var st = STEP[name] || 0;
    $prog.hidden = !st;
    Array.prototype.forEach.call($prog.children, function (el, i) {
      el.className = i + 1 < st ? "on" : i + 1 === st ? "cur" : "";
    });
    window.scrollTo(0, 0);
    $view.focus({ preventScroll: true });
  }
  function back() {
    if (hist.length < 2) return;
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

  /* ═══ ÉCRANS ═══════════════════════════════════════════════ */

  /* ── Accueil ── */
  var HERO_MODELE = "iPhone 16 Pro";
  var HERO_CYCLE = ["ecran", "batterie", "desoxydation", "vitre"];
  var ACCUEIL_PANNES = ["ecran", "batterie", "connecteur", "vitre", "desoxydation", "autre"];
  SCREENS.home = function () {
    return '' +
      '<div class="hero">' +
        '<h1 class="hero-t">Ton iPhone réparé<br>chez toi.</h1>' +
        '<p class="hero-s">Ton prix fixe en 40 secondes. Un réparateur vient chez toi en Île-de-France et répare sur place.</p>' +
        '<button class="btn btn-dark btn-pill" data-act="start">Voir mon prix</button>' +
        sceneHtml(HERO_MODELE, "scene-hero") +
        '<p class="hero-cap" id="heroCap">&nbsp;</p>' +
      '</div>' +
      '<ul class="trust"><li>Réparateur chez toi</li><li>Réparé sur place</li><li>Prix fixe annoncé</li><li>Garantie jusqu\'à 6 mois</li></ul>' +
      '<h2 class="sec-t">Qu\'est-ce qui ne va pas ?</h2>' +
      '<div class="liste">' + ACCUEIL_PANNES.map(function (id) {
        var p = PANNES.filter(function (x) { return x.id === id; })[0];
        return '<button class="liste-l" data-act="startPanne" data-v="' + id + '"><span class="liste-ico">' + p.ico + '</span>' +
          '<span class="liste-t">' + esc(FX[id].t) + '</span><span class="liste-chev">›</span></button>';
      }).join("") + '</div>' +
      '<h2 class="sec-t">Comment ça marche</h2>' +
      '<div class="how"><ol>' +
        '<li><b>1</b><span>Choisis ton modèle et ta panne</span></li>' +
        '<li><b>2</b><span>Tu vois ton prix tout de suite, pièce et main d\'œuvre comprises</span></li>' +
        '<li><b>3</b><span>On t\'appelle pour caler le créneau, le réparateur vient chez toi</span></li>' +
      '</ol></div>' +
      igCard() + (CONFIG.WHATSAPP ? '<a class="ig" href="https://wa.me/' + esc(CONFIG.WHATSAPP) + '" target="_blank" rel="noopener"><span class="ig-ico wa-ico">' + WA_ICO + '</span><span><span class="ig-k">Une question ? Écris-nous</span><span class="ig-t">WhatsApp 7j/7</span></span><span class="choice-arrow">→</span></a>' : "");
  };
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
  ACTS.startPanne = function (id) { reset(); S.pre = id; go("modele"); };
  ACTS.start = function () { reset(); go("modele"); };

  /* ── Étape 1 : modèle ── */
  SCREENS.modele = function () {
    var again = S.phones.length > 0;
    return '<p class="step">Étape 1 sur 4' + (again ? " · Téléphone " + (S.phones.length + 1) : "") + '</p>' +
      '<h1 class="h1">Quel modèle ?</h1>' +
      '<p class="sub">Réglages → Général → Informations si tu n\'es pas sûr.</p>' +
      '<label class="search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
      '<input id="q" type="search" placeholder="Rechercher : 13 Pro, 16e…" autocomplete="off" enterkeyhint="search" aria-label="Rechercher un modèle"></label>' +
      '<div id="models"></div>';
  };
  SCREENS.modele.after = function () {
    var q = document.getElementById("q");
    function draw() {
      var v = norm(q.value), h = "", serie = null, open = false, n = 0;
      MODELES.forEach(function (m, i) {
        if (m.devis) return;
        var hay = norm(m.nom), words = v.split(" ");
        if (v && !words.every(function (w) { return hay.indexOf(w) > -1; })) return;
        if (m.serie !== serie) {
          if (open) h += "</div>";
          h += '<p class="serie">' + esc(m.serie) + '</p><div class="grid">'; serie = m.serie; open = true;
        }
        h += '<button class="chip phone" data-act="model" data-v="' + i + '">' + visuelTelephone(m.nom) +
          '<span class="phone-n"><small>iPhone</small>' + esc(m.nom.replace(/^iPhone /, "")) + "</span></button>";
        n++;
      });
      if (open) h += "</div>";
      if (!n) h += '<p class="empty">Pas trouvé ? Pas de souci, on le chiffre à la main.</p>';
      var autre = MODELES.length - 1;
      h += '<p class="serie">Autre</p><div class="grid"><button class="chip wide phone-row" data-act="model" data-v="' + autre + '">' + visuelTelephone("Un autre modèle") +
        '<span><b>Un autre modèle</b><small>Samsung, Xiaomi, Google Pixel…</small></span></button></div>';
      document.getElementById("models").innerHTML = h;
    }
    q.addEventListener("input", draw);
    draw();
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
    if (!ids.length) { t.textContent = "Qu'est-ce qui ne va pas ?"; st.textContent = "Touche une panne : ton téléphone te la montre."; return; }
    t.innerHTML = ids.map(function (id) { return '<span class="stage-p">' + esc(FX[id].t) + "</span>"; }).join('<span class="stage-plus">+</span>');
    st.textContent = ids.length === 1 ? FX[ids[0]].s
      : ids.length + " réparations en une seule visite · −20 % sur la 2e, −30 % sur les suivantes.";
  }
  /* Après chaque écran : si une scène est là, elle joue sa panne. */
  var STAGE_PANNE = null;

  /* ── Étape 2 : pannes (multi-choix) ── */
  SCREENS.pannes = function () {
    var c = S.cur;
    STAGE_PANNE = c.sel.slice();
    return stage(c.m.nom, c.sel[c.sel.length - 1], "Étape 2 sur 4", true) +
      '<h1 class="h1">Qu\'est-ce qu\'il faut réparer ?</h1>' +
      '<p class="sub">Coche tout ce qui ne va pas : ton téléphone te le montre.</p>' +
      '<p class="note">Tu peux en choisir plusieurs — <b>−20 %</b> sur ta 2<sup>e</sup> réparation, <b>−30 %</b> sur les suivantes.</p>' +
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
          if (!m.ecran) { devisItem(id); break; }
          if (m.ecran.unique) { addItem(id, "Écran", m.ecran.unique, GARANTIES.defaut); break; }
          return go("gamme", { type: "ecran" });
        case "batterie":
          if (typeof m.batterieFixe === "number") { addItem(id, "Batterie", m.batterieFixe); break; }
          return go("gamme", { type: "batterie" });
        case "connecteur":
          return go("conseil");
        case "vitre":
          if (m.vitre == null) { devisItem(id); break; }
          if (m.vitreSansLogo) return go("gamme", { type: "vitre" });
          addItem(id, "Vitre arrière d'origine", m.vitre); break;
        case "chassis":
        case "boutons":
          if (m[id] == null) devisItem(id); else addItem(id, famille(id), m[id]);
          break;
        case "redemarre":
        case "diagnostic":
          if (c.items.some(function (x) { return x.id === "diagnostic"; })) break;
          return go("diag");
        case "desoxydation":
          return go("desox");
        default:
          devisItem(id);
      }
    }
    if (c.items.some(function (x) { return x.prix == null; })) return go("desc");
    finishPhone();
  }

  function finishPhone() {
    S.phones.push(S.cur); S.cur = null;
    if (S.dep || S.horsZone) go("devis"); else go("dep");
  }

  /* ── Gammes (écran / batterie / vitre) ── */
  function gammes(type, m) {
    if (type === "vitre") return {
      t: "Quelle vitre arrière ?", s: "Deux fois la même pièce. Le logo gravé au dos fait la différence.",
      l: [
        { titre: "Vitre arrière d'origine", detail: "La pièce d'origine, logo compris.", prix: m.vitre, gamme: "d'origine", best: true, g: GARANTIES.vitre },
        { titre: "Vitre arrière sans logo", detail: "Même pièce, sans le logo gravé au dos.", prix: m.vitre - REMISE_SANS_LOGO, gamme: "sans logo", badge: "−" + REMISE_SANS_LOGO + " €", vert: true, g: GARANTIES.vitre }
      ]
    };
    if (type === "batterie") return {
      t: "Quelle batterie ?", s: "La différence se joue sur l'autonomie et la longévité.",
      l: BATTERIE.map(function (b) { return { titre: b.titre, detail: b.detail, prix: b.prix, gamme: b.gamme, best: b.best, g: GARANTIES.batterie }; })
    };
    var l = [];
    if (m.ecran.premium != null) l.push({ titre: "Écran premium", detail: "Entrée de gamme. Le choix de la majorité.", prix: m.ecran.premium, gamme: "premium", best: true, badge: "Populaire", g: GARANTIES.ecran_premium });
    l.push({ titre: "Écran " + m.ecran.nomOled, detail: "Le meilleur rapport qualité-prix. Le plus proche de l'original.", prix: m.ecran.oled, gamme: m.ecran.nomOled, best: !l.length, badge: "Recommandé", vert: true, g: GARANTIES.ecran_oled });
    l.push({ titre: "Écran original Apple", detail: "Pièce Apple d'origine. Rendu identique au neuf.", prix: m.ecran.apple, gamme: "original Apple", g: GARANTIES.ecran_apple });
    return { t: "Quelle qualité d'écran ?", s: "Trois gammes, trois budgets. Toutes posées par un pro.", l: l };
  }
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
      (a.type === "ecran" ? '<button class="link" data-act="diff" aria-expanded="false">C\'est quoi la différence ?</button><div id="diff" hidden>' + diffHtml(m) + "</div>" : "") +
      '<p class="mini">Prix comprenant la pièce et la main d\'œuvre.</p>';
  };
  ACTS.gammeOk = function (i) {
    var a = hist[hist.length - 1].args, x = gammes(a.type, S.cur.m).l[+i];
    addItem(a.type, x.titre, x.prix, x.g, { gamme: x.gamme });
    advance();
  };
  ACTS.diff = function (v, b) {
    var d = document.getElementById("diff"), open = d.hidden;
    d.hidden = !open; b.setAttribute("aria-expanded", open);
    b.textContent = open ? "Masquer la comparaison" : "C'est quoi la différence ?";
  };
  function diffHtml(m) {
    var a120 = /120\s*Hz/i.test(m.ecran.nomOled || "");
    var premium = [["Épaisseur", "Plus épais"], ["Robustesse", "Plus fragile"]];
    var oled = [["Épaisseur", "Identique à l'origine"], ["Robustesse", "Plus fragile, mais meilleure que le LCD"]];
    if (a120) { premium.push(["120 Hz", "Non"]); oled.push(["120 Hz", "Oui"]); }
    premium.push(["Couleurs", "Légères différences"], ["Bordures noires", "Plus épaisses"], ["Consommation batterie", "++"]);
    oled.push(["Couleurs", "Très légères différences"], ["Bordures noires", "Identiques à l'origine"], ["Consommation batterie", "+"]);
    function tbl(r) { return "<table>" + r.map(function (x) { return "<tr><td>" + esc(x[0]) + "</td><td>" + esc(x[1]) + "</td></tr>"; }).join("") + "</table>"; }
    var h = '<div class="diff"><p>Comparaison avec l\'écran d\'origine Apple.</p>';
    if (m.ecran.premium != null) h += "<b>Écran Premium (LCD compatible)</b><em>Entrée de gamme. Le choix de la majorité.</em>" + tbl(premium);
    h += "<b>Écran " + esc(m.ecran.nomOled) + "</b><em>Le meilleur rapport qualité-prix. Le plus proche de l'original.</em>" + tbl(oled);
    h += "<b>Écran original Apple</b><em>Pièce Apple d'origine. Rendu identique au neuf.</em></div>";
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
      (autre ? '<label class="label" for="mt">Quel téléphone ?</label><div class="field"><input id="mt" placeholder="Ex : Samsung Galaxy S23" value="' + esc(c.modelText) + '" autocomplete="off"></div><div class="gap"></div>' : "") +
      '<label class="label" for="ds">Qu\'est-ce qui ne va pas ?</label>' +
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
    return '<p class="step">Étape 3 sur 4</p><h1 class="h1">Tu es dans quel département ?</h1>' +
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
      '<p class="sub">Nos réparateurs se déplacent uniquement dans les 8 départements franciliens.</p>' +
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
  function jours() {
    var n = maintenantParis(), l = [];
    for (var i = 0; i < NB_JOURS; i++) {
      var d = new Date(n.getFullYear(), n.getMonth(), n.getDate() + i);
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
  SCREENS.urgence = function () {
    var J = jours();
    if (!S.rdv || !J.some(function (j) { return j.i === S.rdv.i; })) S.rdv = { i: J.length ? J[0].i : 0, h: null };
    return '<p class="step">Étape 4 sur 4</p><h1 class="h1">On passe quand ?</h1>' +
      '<p class="sub">Choisis ton jour et ton heure. On te confirme le créneau sur WhatsApp.</p>' +
      '<div class="jours" role="listbox" aria-label="Jour">' + J.map(function (j) {
        return '<button class="jour" role="option" data-act="jour" data-v="' + j.i + '" aria-selected="' + (S.rdv.i === j.i) + '">' +
          '<span class="jour-k">' + esc(j.court) + '</span><span class="jour-n">' + j.num + '</span><span class="jour-m">' + esc(j.mois) + "</span></button>";
      }).join("") + "</div>" +
      '<p class="label">Heure d\'arrivée du réparateur</p><div class="heures" id="heures"></div>' +
      '<div class="cta"><button class="btn btn-dark" id="rdvGo" data-act="rdvOk" disabled>Choisis une heure</button>' +
      '<button class="link" data-act="urg" data-v="info">Je regarde juste le prix</button></div>';
  };
  SCREENS.urgence.after = function () { dessineHeures(); };
  function dessineHeures() {
    var j = jours().filter(function (x) { return x.i === S.rdv.i; })[0];
    document.getElementById("heures").innerHTML = (j ? j.h : []).map(function (h) {
      return '<button class="heure" data-act="heure" data-v="' + h + '" aria-pressed="' + (S.rdv.h === h) + '">' + h + " h</button>";
    }).join("");
    var go = document.getElementById("rdvGo");
    go.disabled = S.rdv.h == null;
    go.textContent = S.rdv.h == null ? "Choisis une heure" : "Réserver " + j.long + " à " + S.rdv.h + " h →";
  }
  ACTS.jour = function (i) {
    S.rdv = { i: +i, h: null };
    Array.prototype.forEach.call(document.querySelectorAll(".jour"), function (b) { b.setAttribute("aria-selected", b.getAttribute("data-v") === i); });
    dessineHeures();
  };
  ACTS.heure = function (h) { S.rdv.h = +h; dessineHeures(); };
  ACTS.rdvOk = function () {
    var j = jours().filter(function (x) { return x.i === S.rdv.i; })[0];
    S.rdv.texte = j.long + " à " + S.rdv.h + " h";
    S.urgence = { id: "rdv", titre: "RDV souhaité : " + S.rdv.texte, chaud: true };
    if (S.tel) go("devis"); else go("tel");
  };
  ACTS.urg = function (id) {
    S.urgence = URGENCES.filter(function (u) { return u.id === id; })[0];
    S.rdv = null;
    if (S.tel) go("devis"); else go("tel");
  };

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
  function bindTel(id, btnId) {
    var inp = document.getElementById(id), sel = document.getElementById(id + "P"),
        f = document.getElementById(id + "F"), msg = document.getElementById(id + "M"), btn = document.getElementById(btnId);
    function chk(final) {
      S.pays = CONFIG.PAYS[+sel.value];
      var ok = checkTel(inp.value, S.pays);
      f.classList.toggle("ok", !!ok);
      var bad = !ok && final && inp.value.replace(/\D/g, "").length > 3;
      f.classList.toggle("err", bad);
      msg.textContent = bad ? (S.pays.indicatif === "33" ? "Un portable français commence par 06 ou 07." : "Ce numéro semble incomplet.") : "";
      btn.disabled = !ok;
      if (ok) S.tel = ok;
    }
    inp.addEventListener("input", function () { chk(false); });
    inp.addEventListener("blur", function () { chk(true); });
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && !btn.disabled) btn.click(); });
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
    var count = lines.filter(function (l) { return l.it.id !== "diagnostic"; }).length;
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
    var next = devis ? null : (count + 1 >= 3 ? 0.30 : 0.20);
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
    if (R.promo) h += '<li><span><span class="l-t">Code ' + esc(S.promo.code) + '</span><span class="l-s">−' + Math.round(S.promo.taux * 100) + ' % sur le total</span></span><span class="l-p">−' + eur(R.promo) + "</span></li>";
    h += "</ul>";
    var origine = S.phones.some(function (p) { return p.items.some(function (x) { return ORIGINE_UNIQUEMENT.indexOf(x.id) > -1; }); });
    if (origine && !S.horsZone) h += '<p class="quote-foot">' + esc(MENTION_ORIGINE) + "</p>";
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
        ? '<div class="promise"><span class="dot"></span><span><b>Ton créneau : ' + esc(S.rdv.texte) + "</b><br>On te le confirme sur WhatsApp au " + esc(S.tel ? S.tel.affiche : "") + (S.dep ? ", réparateur dans le " + S.dep.c : "") + '. <button class="link" style="display:inline;margin:0" data-act="changerRdv">Changer</button></span></div>'
        : '<div class="promise"><span class="dot"></span><span><b>' +
        (enHeuresAppel() ? "Prise de RDV en moins de 10 min" : "Prise de RDV dès " + CONFIG.HEURE_DEBUT_APPEL + "h") +
        "</b><br>On t'appelle au " + esc(S.tel ? S.tel.affiche : "") + " pour caler ton créneau" + (S.dep ? " dans le " + S.dep.c : "") + ".</span></div>") +
        '<div class="cta"><p class="cta-info">🔒 Ton prix est bloqué 7 jours · code <b>' + esc(S.code) + "</b></p>" +
        '<button class="btn ' + (hot ? "btn-yellow" : "btn-dark") + '" data-act="confirm">' + (hot ? (S.rdv && S.rdv.texte ? "Réserver " + S.rdv.texte : "Prendre mon RDV") : "Bloquer mon prix 7 jours") + "</button></div>";
    }
    return h;
  };
  ACTS.addPhone = function () { go("modele"); };
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
    sendLead(S.horsZone ? "envoi_postal" : "rdv");
    go(S.horsZone ? "postal" : "done");
  };

  /* ── Confirmations ── */
  var CHECK = '<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  SCREENS.done = function () {
    return '<div class="done"><div class="done-ico">' + CHECK + '</div>' +
      '<h1 class="h1">C\'est noté</h1>' +
      (S.rdv && S.rdv.texte
        ? '<p class="sub">Créneau demandé : <b>' + esc(S.rdv.texte) + '</b>. On te le confirme sur WhatsApp.</p>'
        : '<p class="sub">On t\'appelle pour caler ton créneau.</p>') +
      (CONFIG.NUMERO_APPEL ? '<p class="step">L\'appel viendra du</p><div class="callnum">' + esc(CONFIG.NUMERO_APPEL) + '</div><p><b>Décroche, c\'est nous !</b></p>' : "") +
      '<p class="sub">Garde ton code : <span class="code">' + esc(S.code) + "</span></p>" +
      '<p class="sub">Ton prix ne bouge pas : pièce et main d\'œuvre comprises, valable 7 jours.</p>' +
      waLink() + igLink() +
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
  function waTexte() {
    var R = compute(), l = ["Bonjour SOS Phone, voici ma demande (" + S.code + ") :"];
    S.phones.forEach(function (p) {
      l.push("📱 " + (p.m.devis ? (p.modelText || "Autre modèle") : p.m.nom) + " : " +
        p.items.map(function (it) { return it.famille + (it.gamme ? " " + it.gamme : ""); }).join(", "));
      if (p.desc) l.push("   « " + p.desc + " »");
    });
    l.push("💶 " + (R.devis ? "À chiffrer" + (R.total ? " (+ " + eur(R.total) + " déjà chiffrés)" : "") : eur(R.total)));
    if (S.rdv && S.rdv.texte) l.push("📅 " + S.rdv.texte.charAt(0).toUpperCase() + S.rdv.texte.slice(1));
    if (S.dep) l.push("📍 " + S.dep.c + " " + S.dep.n);
    return l.join("\n");
  }
  function waLink() {
    if (!CONFIG.WHATSAPP) return "";
    return '<a class="btn btn-wa" href="https://wa.me/' + esc(CONFIG.WHATSAPP) +
      "?text=" + encodeURIComponent(waTexte()) + '" target="_blank" rel="noopener">' + WA_ICO + " Confirmer sur WhatsApp</a>";
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
  go("home");
})();
