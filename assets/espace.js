/* ═══════════════════════════════════════════════════════════════
   SOS Phone — Espace gérant
   Prix, prestations, codes promo et jours de dispo, sans l'admin
   WordPress. Enregistre dans l'option « sosp_prix » via l'API
   /wp-json/sos-phone/v1/espace : le devis du site les utilise tout
   de suite (même format que la page admin « Prix SOS »).
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var E = window.SOSP_ESPACE || {}, $root = document.getElementById("sosEspace");
  if (!$root || typeof MODELES === "undefined") return;

  /* ── Prix d'origine (prix.js) gardés intacts pour pouvoir recharger à chaud ── */
  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };
  var ORIG = {
    MODELES: clone(MODELES), BATTERIE: clone(BATTERIE), REMISES: clone(REMISES), PANNES: clone(PANNES),
    DIAGNOSTIC: DIAGNOSTIC, DESOXYDATION: DESOXYDATION, REMISE_SANS_LOGO: REMISE_SANS_LOGO,
    CHASSIS: CHASSIS_COMBINE.defaut, PROMOS: clone(CONFIG.CODES_PROMO || [])
  };
  function restaurer() {
    MODELES.splice.apply(MODELES, [0, MODELES.length].concat(clone(ORIG.MODELES)));
    BATTERIE.splice.apply(BATTERIE, [0, BATTERIE.length].concat(clone(ORIG.BATTERIE)));
    REMISES.splice.apply(REMISES, [0, REMISES.length].concat(clone(ORIG.REMISES)));
    PANNES.splice.apply(PANNES, [0, PANNES.length].concat(clone(ORIG.PANNES)));
    DIAGNOSTIC = ORIG.DIAGNOSTIC; DESOXYDATION = ORIG.DESOXYDATION; REMISE_SANS_LOGO = ORIG.REMISE_SANS_LOGO;
    CHASSIS_COMBINE.defaut = ORIG.CHASSIS; CONFIG.CODES_PROMO = clone(ORIG.PROMOS);
  }

  var TEL = ORIG.MODELES.filter(function (m) { return !m.devis; }).map(function (m) { return m.nom; });
  var PHOTO = { "iPhone 17 Pro Max": "17promax", "iPhone 17 Pro": "17pro", "iPhone 17 Air": "17air", "iPhone 17": "17", "iPhone 17e": "17e",
    "iPhone 16 Pro Max": "16promax", "iPhone 16 Pro": "16pro", "iPhone 16 Plus": "16plus", "iPhone 16": "16", "iPhone 16e": "16e",
    "iPhone 15 Pro Max": "15promax", "iPhone 15 Pro": "15pro", "iPhone 15 Plus": "15plus", "iPhone 15": "15",
    "iPhone 14 Pro Max": "14promax", "iPhone 14 Pro": "14pro", "iPhone 14 Plus": "14plus", "iPhone 14": "14",
    "iPhone 13 Pro Max": "13promax", "iPhone 13 Pro": "13pro", "iPhone 13": "13", "iPhone 13 mini": "13mini",
    "iPhone 12 Pro Max": "12promax", "iPhone 12 Pro": "12pro", "iPhone 12": "12", "iPhone 12 mini": "12mini", "iPhone 11 Pro Max": "11promax", "iPhone 11 Pro": "11pro", "iPhone 11": "11",
  "iPhone XS Max": "xsmax", "iPhone XS": "xs", "iPhone XR": "xr", "iPhone X": "x", "iPhone SE (2020 / 2022)": "se",
  "iPhone 8 Plus": "8plus", "iPhone 8": "8", "iPhone 7 Plus": "7plus", "iPhone 7": "7" };
  var MOIS = ["Toute l'année", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  /* ── État : construit depuis les prix d'origine + ce qui est enregistré ── */
  var S, sale = false, onglet = "prix", modeleOuvert = null, prestaOuverte = null, filtre = "", serie = "tous";
  function construire(P) {
    restaurer();
    sospAppliquePrix(P || {});
    var r2 = REMISES.filter(function (r) { return r.aPartirDe === 2; })[0], r3 = REMISES.filter(function (r) { return r.aPartirDe === 3; })[0];
    var st = {
      general: { diagnostic: DIAGNOSTIC, desoxydation: DESOXYDATION, batStandard: BATTERIE[0].prix, batPremium: BATTERIE[1] ? BATTERIE[1].prix : null,
        sansLogo: REMISE_SANS_LOGO, chassisCombine: CHASSIS_COMBINE.defaut, remise2: r2 ? Math.round(r2.taux * 100) : 20, remise3: r3 ? Math.round(r3.taux * 100) : 30 },
      modeles: {}, cats: clone(window.SOSP_CATS || []), extras: clone(window.SOSP_EXTRAS || []),
      promos: (P && Array.isArray(P.promos) ? P.promos : (CONFIG.CODES_PROMO || []).map(function (c) { return { code: c.code, taux: Math.round(c.taux * 100), mois: c.mois || 0 }; })),
      bloques: clone((window.SOSP_DISPO || {}).bloques || []), fermes: clone((window.SOSP_DISPO || {}).fermes || [])
    };
    MODELES.forEach(function (m) {
      if (m.devis) return;
      var e = m.ecran, o = {};
      if (e && e.unique != null) o.unique = e.unique;
      else { o.premium = e ? e.premium : null; o.oled = e ? e.oled : null; o.apple = e ? e.apple : null; }
      /* Batteries de CE téléphone : normale + premium (anciens réglages repris tels quels) */
      if (m.batN !== undefined || m.batP !== undefined) { o.batN = m.batN == null ? null : m.batN; o.batP = m.batP == null ? null : m.batP; }
      else if (typeof m.batterieFixe === "number") { o.batN = m.batterieFixe; o.batP = null; }
      else { o.batN = BATTERIE[0].prix; o.batP = BATTERIE[1] ? BATTERIE[1].prix : null; }
      o.batterie = null;
      ["connecteur", "vitre", "chassis", "boutons"].forEach(function (k) { o[k] = m[k] == null ? null : m[k]; });
      st.modeles[m.nom] = o;
    });
    st.extras.forEach(function (x) { x.prix = x.prix || {}; });
    return st;
  }

  /* ── Outils ── */
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function num(v) { v = String(v == null ? "" : v).trim().replace(",", "."); if (v === "") return null; var n = +v; return isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null; }
  function eur(n) { return n == null ? "Sur devis" : (n % 1 ? n.toFixed(2).replace(".", ",") : n) + " €"; }
  function uid(p) { return p + Math.random().toString(36).slice(2, 8); }
  function toast(t, ok) {
    var el = document.getElementById("espToast");
    el.textContent = t; el.className = "esp-toast" + (ok === false ? " ko" : ""); el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 2800);
  }
  function salir(v) {
    sale = v;
    var b = document.getElementById("espBarre");
    if (b) b.hidden = !v;
    var st = document.getElementById("espEtat");
    if (st) { st.className = "esp-etat" + (v ? " sale" : ""); st.innerHTML = v ? "<i></i>Modifs pas encore en ligne" : "<i></i>Tout est en ligne"; }
  }
  function nomCat(id) {
    var p = PANNES.filter(function (x) { return x.id === id; })[0];
    if (p) return p.famille;
    var c = S.cats.filter(function (x) { return x.id === id; })[0];
    return c ? c.titre : id;
  }
  function choixCats() {
    return ORIG.PANNES.filter(function (p) { return ["redemarre", "diagnostic", "desoxydation"].indexOf(p.id) < 0; })
      .map(function (p) { return { id: p.id, nom: p.famille }; })
      .concat(S.cats.filter(function (c) { return c.titre; }).map(function (c) { return { id: c.id, nom: c.titre }; }));
  }
  function photo(nom) { return PHOTO[nom] ? '<img src="' + E.photos + "dos/" + PHOTO[nom] + '.webp" alt="" loading="lazy">' : ""; }
  function champ(cle, valeur, label, sous, devisPossible, ph, libCase) {
    var vide = valeur == null;
    return '<div class="esp-champ' + (vide && devisPossible ? " vide" : "") + '"><div class="esp-champ-t"><b>' + esc(label) + "</b>" + (sous ? "<small>" + esc(sous) + "</small>" : "") + "</div>" +
      '<div class="esp-champ-v"><span class="esp-eur"><input inputmode="decimal" data-k="' + cle + '" value="' + (vide ? "" : valeur) + '" placeholder="' + (ph || (devisPossible ? "Sur devis" : "—")) + '"' + (vide && devisPossible ? " disabled" : "") + "><em>€</em></span>" +
      (devisPossible ? '<label class="esp-devis"><input type="checkbox" data-devis="' + cle + '"' + (vide ? " checked" : "") + "> " + (libCase || "Sur devis") + "</label>" : "") + "</div></div>";
  }

  /* ── Lecture / écriture d'une valeur par son chemin « a.b.c » ── */
  function lireCle(cle) {
    var p = cle.split("|");
    if (p[0] === "g") return S.general[p[1]];
    if (p[0] === "m") return S.modeles[p[1]][p[2]];
    if (p[0] === "x") { var x = S.extras.filter(function (y) { return y.id === p[1]; })[0]; return x ? x.prix[p[2]] : null; }
  }
  function ecrireCle(cle, v) {
    var p = cle.split("|");
    if (p[0] === "g") S.general[p[1]] = v;
    else if (p[0] === "m") S.modeles[p[1]][p[2]] = v;
    else if (p[0] === "x") { var x = S.extras.filter(function (y) { return y.id === p[1]; })[0]; if (!x) return; if (v == null) delete x.prix[p[2]]; else x.prix[p[2]] = v; }
    salir(true);
  }

  /* ═══ Coquille ═══ */
  function coquille() {
    $root.innerHTML =
      '<header class="esp-top"><a class="esp-marque" href="' + esc(E.site) + '" target="_blank" rel="noopener"><img src="' + esc(E.logo) + '" alt="" width="36" height="36"><span><b><span class="esp-sos">SOS</span> Phone</b><small>Espace gérant</small></span></a>' +
      '<span class="esp-etat" id="espEtat"><i></i>Tout est en ligne</span>' +
      '<a class="esp-sortir" href="' + esc(E.sortir) + '">Se déconnecter</a></header>' +
      '<nav class="esp-onglets" id="espOnglets">' +
        [["prix", "💶", "Prix"], ["presta", "🧩", "Prestations"], ["promos", "🏷️", "Promos"], ["dispos", "📅", "Dispos"]].map(function (o) {
          return '<button data-onglet="' + o[0] + '"><span>' + o[1] + "</span>" + o[2] + "</button>";
        }).join("") + "</nav>" +
      '<main class="esp-main" id="espMain"></main>' +
      '<div class="esp-barre" id="espBarre" hidden><span>Tes changements ne sont pas encore en ligne.</span><button class="esp-btn" id="espSave">Enregistrer</button></div>' +
      '<div class="esp-toast" id="espToast" role="status" hidden></div>';
    document.getElementById("espSave").addEventListener("click", enregistrer);
  }

  function dessiner() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-onglet]"), function (b) { b.setAttribute("aria-current", b.getAttribute("data-onglet") === onglet ? "page" : "false"); });
    var h = onglet === "prix" ? vuePrix() : onglet === "presta" ? vuePresta() : onglet === "promos" ? vuePromos() : vueDispos();
    document.getElementById("espMain").innerHTML = h;
    if (onglet === "prix" && !modeleOuvert) { var q = document.getElementById("espQ"); if (q && filtre) { q.focus(); q.setSelectionRange(filtre.length, filtre.length); } }
  }

  /* ═══ Onglet Prix ═══ */
  function vuePrix() {
    if (modeleOuvert) return vueModele(modeleOuvert);
    var g = S.general, h = '<h1 class="esp-h1">Tes prix</h1><p class="esp-sub">Change un prix, puis appuie sur « Enregistrer » : c\'est en ligne tout de suite.</p>';
    h += '<section class="esp-carte"><h2>Pour tous les iPhone</h2>' +
      champ("g|diagnostic", g.diagnostic, "Diagnostic", "Déduit si le client fait la réparation") +
      champ("g|desoxydation", g.desoxydation, "Désoxydation", "Téléphone tombé dans l'eau") +
      champ("g|batStandard", g.batStandard, "Batterie normale (prix de départ)", "Utilisé seulement pour un iPhone qui n'a pas encore ses propres prix batterie") +
      champ("g|batPremium", g.batPremium, "Batterie premium (prix de départ)", "Pareil : chaque iPhone a ses propres prix dans sa fiche") +
      champ("g|sansLogo", g.sansLogo, "Vitre arrière sans logo", "€ de moins que la vitre d'origine") +
      champ("g|chassisCombine", g.chassisCombine, "Vitre + châssis ensemble", "Prix de la vitre si le châssis est fait aussi") +
      '<div class="esp-duo">' + champ("g|remise2", g.remise2, "Remise 2e réparation", "en %", false, "%") + champ("g|remise3", g.remise3, "Remise 3e et +", "en %", false, "%") + "</div></section>";
    var series = []; ORIG.MODELES.forEach(function (m) { if (!m.devis && series.indexOf(m.serie) < 0) series.push(m.serie); });
    h += '<h2 class="esp-h2">Prix par iPhone</h2>' +
      '<label class="esp-recherche"><span>🔎</span><input id="espQ" type="search" placeholder="Chercher : 13 Pro, 16e…" value="' + esc(filtre) + '"></label>' +
      '<div class="esp-puces">' + ["tous"].concat(series).map(function (s) { return '<button data-serie="' + esc(s) + '" aria-pressed="' + (serie === s) + '">' + (s === "tous" ? "Tous" : esc(s.replace("iPhone ", "").replace(" et plus ancien", " et avant"))) + "</button>"; }).join("") + "</div>" +
      '<div class="esp-liste">';
    ORIG.MODELES.forEach(function (m) {
      if (m.devis) return;
      if (serie !== "tous" && m.serie !== serie) return;
      if (filtre && m.nom.toLowerCase().indexOf(filtre.toLowerCase().trim()) < 0) return;
      var o = S.modeles[m.nom], ecr = o.unique != null ? o.unique : [o.premium, o.oled, o.apple].filter(function (v) { return v != null; }).sort(function (a, b) { return a - b; })[0];
      var nbX = S.extras.filter(function (x) { return x.prix[m.nom] != null; }).length;
      h += '<button class="esp-ligne" data-modele="' + esc(m.nom) + '">' + photo(m.nom) + '<span class="esp-ligne-t"><b>' + esc(m.nom) + "</b><small>Écran " + (ecr == null ? "sur devis" : "dès " + eur(ecr)) + " · Batterie " + (o.batN == null && o.batP == null ? "sur devis" : [o.batN, o.batP].filter(function (v) { return v != null; }).map(eur).join(" / ")) + (nbX ? " · +" + nbX + " prestation" + (nbX > 1 ? "s" : "") : "") + '</small></span><span class="esp-chev">›</span></button>';
    });
    return h + "</div>";
  }
  function vueModele(nom) {
    var o = S.modeles[nom], k = function (c) { return "m|" + nom + "|" + c; };
    var h = '<button class="esp-retour" data-fermer>‹ Tous les iPhone</button><div class="esp-fiche">' + photo(nom) + '<div><h1 class="esp-h1">' + esc(nom) + '</h1><p class="esp-sub">Coche « Sur devis » quand tu ne veux pas afficher de prix : le client décrit sa panne et tu le chiffres sur WhatsApp.</p></div></div>';
    h += '<section class="esp-carte"><h2>📱 Écran</h2>' + (o.unique !== undefined
      ? champ(k("unique"), o.unique, "Écran", "Prix unique", true)
      : champ(k("premium"), o.premium, "Écran gamme éco (InCell)", "Vide = gamme pas proposée", true) + champ(k("oled"), o.oled, "Écran gamme premium (Soft OLED)", "", true) + champ(k("apple"), o.apple, "Écran gamme originale", "", true)) + "</section>";
    h += '<section class="esp-carte"><h2>🔋 Batteries</h2>' +
      champ(k("batN"), o.batN, BATTERIE[0].titre, "Le client la voit avec ce prix. Coche « Pas proposée » si tu ne la fais pas sur ce modèle.", true, "Pas proposée", "Pas proposée") +
      champ(k("batP"), o.batP, BATTERIE[1] ? BATTERIE[1].titre : "Batterie premium", "Meilleure autonomie. Coche « Pas proposée » si tu ne la fais pas sur ce modèle.", true, "Pas proposée", "Pas proposée") +
      '<p class="esp-note">' + (o.batN == null && o.batP == null ? "Aucune batterie proposée : le client décrira sa panne et tu le chiffreras sur WhatsApp." : "Le client choisit entre les batteries proposées ici.") + "</p></section>";
    h += '<section class="esp-carte"><h2>🔧 Autres réparations</h2>' +
      champ(k("connecteur"), o.connecteur, "Connecteur de charge", "", true) +
      champ(k("vitre"), o.vitre, "Vitre arrière d'origine", "", true) +
      champ(k("chassis"), o.chassis, "Châssis", "", true) +
      champ(k("boutons"), o.boutons, "Boutons latéraux", "", true) + "</section>";
    if (S.extras.length) {
      h += '<section class="esp-carte"><h2>🧩 Tes prestations en plus</h2>' + S.extras.map(function (x) {
        return champ("x|" + x.id + "|" + nom, x.prix[nom] == null ? null : x.prix[nom], x.titre || "Sans nom", nomCat(x.cat) + " · décoche « Sur devis » pour la proposer sur ce modèle", true);
      }).join("") + "</section>";
    }
    return h;
  }

  /* ═══ Onglet Prestations ═══ */
  function vuePresta() {
    var C = choixCats();
    var h = '<h1 class="esp-h1">Prestations</h1><p class="esp-sub">Ajoute une option dans une catégorie (ex : « Écran d\'origine reconditionné » dans Écran) ou une nouvelle catégorie de panne (ex : Caméra arrière).</p>';
    h += '<section class="esp-carte"><h2>Catégories de pannes en plus</h2>' + (S.cats.length ? S.cats.map(function (c) {
      return '<div class="esp-bloc"><div class="esp-grille"><label class="esp-court">Emoji<input data-cat="' + c.id + '|ico" value="' + esc(c.ico) + '" placeholder="📷"></label>' +
        '<label>Nom<input data-cat="' + c.id + '|titre" value="' + esc(c.titre) + '" placeholder="Ex : Caméra arrière"></label>' +
        '<label class="esp-large">Ce que le client lit<input data-cat="' + c.id + '|detail" value="' + esc(c.detail) + '" placeholder="Ex : Photos floues, caméra noire"></label></div>' +
        '<button class="esp-suppr" data-suppr-cat="' + c.id + '">Supprimer la catégorie</button></div>';
    }).join("") : '<p class="esp-vide">Aucune catégorie en plus.</p>') + '<button class="esp-ajout" data-ajout="cat">＋ Nouvelle catégorie</button></section>';
    h += '<section class="esp-carte"><h2>Prestations en plus</h2>' + (S.extras.length ? S.extras.map(function (x) {
      var n = Object.keys(x.prix).length, ouvert = prestaOuverte === x.id;
      return '<div class="esp-bloc"><div class="esp-grille">' +
        '<label>Catégorie<select data-x="' + x.id + '|cat">' + C.map(function (c) { return '<option value="' + c.id + '"' + (c.id === x.cat ? " selected" : "") + ">" + esc(c.nom) + "</option>"; }).join("") + "</select></label>" +
        '<label>Nom<input data-x="' + x.id + '|titre" value="' + esc(x.titre) + '" placeholder="Ex : Écran d\'origine reconditionné"></label>' +
        '<label class="esp-large">Ce que le client lit<input data-x="' + x.id + '|detail" value="' + esc(x.detail) + '" placeholder="Ex : Pièce Apple reconditionnée"></label>' +
        '<label class="esp-court">Garantie (mois)<input inputmode="numeric" data-x="' + x.id + '|garantie" value="' + (x.garantie == null ? 3 : x.garantie) + '"></label></div>' +
        '<div class="esp-tous"><span>Même prix pour tous les iPhone</span><span class="esp-eur"><input inputmode="decimal" id="tous_' + x.id + '" placeholder="Prix"><em>€</em></span><button class="esp-btn petit" data-tous="' + x.id + '">Appliquer</button></div>' +
        '<button class="esp-lien" data-ouvrir-presta="' + x.id + '">' + (ouvert ? "▾" : "▸") + " Prix par iPhone · " + n + " modèle" + (n > 1 ? "s" : "") + " avec un prix</button>" +
        (ouvert ? '<div class="esp-sous">' + TEL.map(function (nom) { return champ("x|" + x.id + "|" + nom, x.prix[nom] == null ? null : x.prix[nom], nom, "", true); }).join("") + "</div>" : "") +
        '<button class="esp-suppr" data-suppr-x="' + x.id + '">Supprimer la prestation</button></div>';
    }).join("") : '<p class="esp-vide">Aucune prestation en plus.</p>') + '<button class="esp-ajout" data-ajout="x">＋ Nouvelle prestation</button></section>';
    return h;
  }

  /* ═══ Onglet Promos ═══ */
  function vuePromos() {
    return '<h1 class="esp-h1">Codes promo</h1><p class="esp-sub">Le client tape le code sur son devis : la remise s\'applique sur le total.</p>' +
      '<section class="esp-carte">' + (S.promos.length ? S.promos.map(function (c, i) {
        return '<div class="esp-bloc"><div class="esp-grille">' +
          '<label>Code<input data-p="' + i + '|code" value="' + esc(c.code) + '" placeholder="Ex : NOEL15" style="text-transform:uppercase"></label>' +
          '<label class="esp-court">Remise (%)<input inputmode="numeric" data-p="' + i + '|taux" value="' + (c.taux == null ? "" : c.taux) + '"></label>' +
          '<label>Valable<select data-p="' + i + '|mois">' + MOIS.map(function (m, k) { return '<option value="' + k + '"' + (k === +c.mois ? " selected" : "") + ">" + m + "</option>"; }).join("") + "</select></label></div>" +
          '<button class="esp-suppr" data-suppr-promo="' + i + '">Supprimer le code</button></div>';
      }).join("") : '<p class="esp-vide">Aucun code promo.</p>') + '<button class="esp-ajout" data-ajout="promo">＋ Nouveau code</button></section>';
  }

  /* ═══ Onglet Dispos ═══ */
  function vueDispos() {
    var J = [["Lun", 1], ["Mar", 2], ["Mer", 3], ["Jeu", 4], ["Ven", 5], ["Sam", 6], ["Dim", 0]];
    var h = '<h1 class="esp-h1">Tes jours de dispo</h1><p class="esp-sub">Touche un jour pour le bloquer (rouge) : il disparaît du choix du client. Le devis vérifie en direct.</p>';
    h += '<section class="esp-carte"><h2>Fermé chaque semaine le</h2><div class="esp-semaine">' + J.map(function (j) {
      return '<button data-ferme="' + j[1] + '" aria-pressed="' + (S.fermes.indexOf(j[1]) > -1) + '">' + j[0] + "</button>";
    }).join("") + "</div></section>";
    var auj = new Date(); auj.setHours(12, 0, 0, 0);
    for (var mo = 0; mo < 3; mo++) {
      var d0 = new Date(auj.getFullYear(), auj.getMonth() + mo, 1, 12), nb = new Date(d0.getFullYear(), d0.getMonth() + 1, 0).getDate();
      var dec = (d0.getDay() + 6) % 7;
      h += '<section class="esp-carte"><h2>' + MOIS[d0.getMonth() + 1] + " " + d0.getFullYear() + '</h2><div class="esp-cal"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>';
      for (var v = 0; v < dec; v++) h += "<i></i>";
      for (var j = 1; j <= nb; j++) {
        var d = new Date(d0.getFullYear(), d0.getMonth(), j, 12), iso = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + j).slice(-2);
        var passe = d < auj, bl = S.bloques.indexOf(iso) > -1, fe = S.fermes.indexOf(d.getDay()) > -1;
        h += '<button data-jour="' + iso + '"' + (passe ? " disabled" : "") + ' class="' + (bl ? "bloque" : fe ? "ferme" : "") + (iso === new Date().toISOString().slice(0, 10) ? " auj" : "") + '">' + j + "</button>";
      }
      h += "</div></section>";
    }
    return h + '<p class="esp-legende"><span class="lg bloque"></span> Bloqué · <span class="lg ferme"></span> Fermé chaque semaine</p>';
  }

  /* ═══ Interactions ═══ */
  $root.addEventListener("click", function (e) {
    var t = e.target.closest("button, [data-onglet]");
    if (!t || !$root.contains(t)) return;
    var d = t.dataset;
    if (d.onglet) { onglet = d.onglet; modeleOuvert = null; dessiner(); window.scrollTo(0, 0); return; }
    if (d.modele) { modeleOuvert = d.modele; dessiner(); window.scrollTo(0, 0); return; }
    if (t.hasAttribute("data-fermer")) { modeleOuvert = null; dessiner(); return; }
    if (d.serie) { serie = d.serie; dessiner(); return; }
    if (d.ajout === "cat") { S.cats.push({ id: "c_" + uid(""), titre: "", detail: "", ico: "" }); salir(true); dessiner(); return; }
    if (d.ajout === "x") { var nx = { id: uid("x"), cat: "ecran", titre: "", detail: "", garantie: 3, prix: {} }; S.extras.push(nx); prestaOuverte = null; salir(true); dessiner(); return; }
    if (d.ajout === "promo") { S.promos.push({ code: "", taux: 10, mois: 0 }); salir(true); dessiner(); return; }
    if (d.supprCat) {
      if (S.extras.some(function (x) { return x.cat === d.supprCat; }) && !confirm("Les prestations rangées dans cette catégorie seront aussi supprimées. Continuer ?")) return;
      S.cats = S.cats.filter(function (c) { return c.id !== d.supprCat; }); S.extras = S.extras.filter(function (x) { return x.cat !== d.supprCat; }); salir(true); dessiner(); return;
    }
    if (d.supprX) { if (!confirm("Supprimer cette prestation ?")) return; S.extras = S.extras.filter(function (x) { return x.id !== d.supprX; }); salir(true); dessiner(); return; }
    if (d.supprPromo != null) { S.promos.splice(+d.supprPromo, 1); salir(true); dessiner(); return; }
    if (d.ouvrirPresta) { prestaOuverte = prestaOuverte === d.ouvrirPresta ? null : d.ouvrirPresta; dessiner(); return; }
    if (d.tous) {
      var v = num(document.getElementById("tous_" + d.tous).value); if (v == null) return toast("Tape un prix d'abord.", false);
      var x = S.extras.filter(function (y) { return y.id === d.tous; })[0]; TEL.forEach(function (n) { x.prix[n] = v; });
      salir(true); dessiner(); toast("Prix appliqué aux " + TEL.length + " iPhone."); return;
    }
    if (d.ferme != null) { var f = +d.ferme, i = S.fermes.indexOf(f); if (i > -1) S.fermes.splice(i, 1); else S.fermes.push(f); salir(true); dessiner(); return; }
    if (d.jour) { var k = S.bloques.indexOf(d.jour); if (k > -1) S.bloques.splice(k, 1); else S.bloques.push(d.jour); salir(true); dessiner(); return; }
  });
  $root.addEventListener("input", function (e) {
    var t = e.target, d = t.dataset;
    if (t.id === "espQ") { filtre = t.value; dessiner(); return; }
    if (d.k) { ecrireCle(d.k, num(t.value)); return; }
    if (d.cat) { var p = d.cat.split("|"), c = S.cats.filter(function (x) { return x.id === p[0]; })[0]; if (c) { c[p[1]] = t.value; salir(true); } return; }
    if (d.x) { var q = d.x.split("|"), x = S.extras.filter(function (y) { return y.id === q[0]; })[0]; if (x) { x[q[1]] = q[1] === "garantie" ? (parseInt(t.value, 10) || 0) : t.value; salir(true); } return; }
    if (d.p) { var r = d.p.split("|"), pr = S.promos[+r[0]]; if (pr) { pr[r[1]] = r[1] === "code" ? t.value.toUpperCase() : (r[1] === "taux" ? num(t.value) : +t.value); salir(true); } }
  });
  $root.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset.devis) {
      var cle = t.dataset.devis, champI = $root.querySelector('[data-k="' + cle.replace(/"/g, '\\"') + '"]');
      if (t.checked) { ecrireCle(cle, null); champI.value = ""; champI.disabled = true; }
      else {
        champI.disabled = false;
        /* Batterie remise en service : on pré-remplit avec le prix de départ pour qu'elle soit tout de suite proposée */
        if (champI.value === "" && /\|bat[NP]$/.test(cle)) {
          var def = /batN$/.test(cle) ? S.general.batStandard : S.general.batPremium;
          if (def != null) { champI.value = def; ecrireCle(cle, def); }
        }
        champI.focus();
      }
      t.closest(".esp-champ").classList.toggle("vide", t.checked);
    }
    if (t.dataset.x && t.tagName === "SELECT") { var q = t.dataset.x.split("|"), x = S.extras.filter(function (y) { return y.id === q[0]; })[0]; if (x) { x.cat = t.value; salir(true); } }
    if (t.dataset.p && t.tagName === "SELECT") { var r = t.dataset.p.split("|"); S.promos[+r[0]].mois = +t.value; salir(true); }
  });

  /* ═══ Enregistrer (en ligne tout de suite) ═══ */
  function etatAEnvoyer() {
    return { general: S.general, modeles: S.modeles,
      cats: S.cats.filter(function (c) { return (c.titre || "").trim(); }),
      extras: S.extras.filter(function (x) { return (x.titre || "").trim(); }),
      promos: S.promos.filter(function (c) { return c.code && c.taux; }), bloques: S.bloques, fermes: S.fermes };
  }
  function enregistrer() {
    var b = document.getElementById("espSave"); b.disabled = true; b.textContent = "Enregistrement…";
    var vides = S.extras.filter(function (x) { return !(x.titre || "").trim(); }).length + S.cats.filter(function (c) { return !(c.titre || "").trim(); }).length;
    fetch(E.api, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", "X-WP-Nonce": E.nonce }, body: JSON.stringify(etatAEnvoyer()) })
      .then(function (r) { if (r.status === 401 || r.status === 403) throw new Error("connexion"); if (!r.ok) throw new Error("serveur"); return r.json(); })
      .then(function (res) {
        S = construire(res.prix); salir(false); dessiner();
        toast("Enregistré ✓ C'est en ligne." + (vides ? " (" + vides + " ligne(s) sans nom ignorée(s))" : ""));
      })
      .catch(function (err) {
        toast(err.message === "connexion" ? "Tu as été déconnecté. Recharge la page et reconnecte-toi." : "Pas enregistré : vérifie ta connexion et réessaie.", false);
      })
      .then(function () { b.disabled = false; b.textContent = "Enregistrer"; });
  }

  /* Temps réel : si quelqu'un change les prix ailleurs (admin, autre téléphone), on recharge quand rien n'est en cours. */
  var maj = 0;
  function verifier() {
    if (sale || document.hidden) return;
    fetch(E.api + (E.api.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now(), { credentials: "same-origin", headers: { "X-WP-Nonce": E.nonce }, cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (res) {
        if (!res || sale) return;
        if (maj && res.maj && res.maj !== maj) { S = construire(res.prix); dessiner(); toast("Mis à jour depuis un autre appareil."); }
        maj = res.maj || maj;
      }).catch(function () {});
  }
  setInterval(verifier, 20000);
  document.addEventListener("visibilitychange", verifier);
  window.addEventListener("beforeunload", function (e) { if (sale) { e.preventDefault(); e.returnValue = ""; } });

  /* ═══ Démarrage ═══ */
  S = construire(window.SOSP_PRIX_ENREG);
  coquille(); dessiner(); verifier();
})();
