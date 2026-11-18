/* ═══════════════════════════════════════════════════════════════
   SOS Phone — web app de devis
   Parcours : accueil → modèle → pannes (+ gammes / avertissements)
              → département → urgence → numéro → devis → RDV
   Données : data/prix.js   Réglages : config.js
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

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
    var html = SCREENS[name](args || {});
    $view.innerHTML = '<section class="screen' + (isBack ? " back" : "") + '">' + html + "</section>";
    if (SCREENS[name].after) SCREENS[name].after(args || {});
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
  SCREENS.home = function () {
    var formation = CONFIG.FORMATION_URL;
    return '' +
      '<div class="hero">' +
        '<h1 class="h1">Ton prix en <span class="hl">40 secondes</span></h1>' +
        '<p>Un réparateur vient chez toi en Île-de-France et répare ton téléphone sur place. Prix fixe annoncé avant de réserver.</p>' +
        '<button class="btn btn-yellow" data-act="start">Voir mon prix →</button>' +
      '</div>' +
      '<p class="step">Qu\'est-ce qui t\'amène ?</p>' +
      '<button class="choice" data-act="start">' +
        '<span class="choice-ico">🛠️</span>' +
        '<span><span class="choice-tag">Réparation à domicile</span>' +
        '<span class="choice-t">Réparer mon téléphone</span>' +
        '<span class="choice-s">Ton prix en 40 secondes, un réparateur chez toi.</span></span>' +
        '<span class="choice-arrow">→</span>' +
      '</button>' +
      (formation
        ? '<a class="choice alt" href="' + esc(formation) + '">'
        : '<button class="choice alt" data-act="soon">') +
        '<span class="choice-ico">🎓</span>' +
        '<span><span class="choice-tag">Formation' + (formation ? "" : ' · <span class="badge violet">Bientôt</span>') + '</span>' +
        '<span class="choice-t">Apprendre le métier</span>' +
        '<span class="choice-s">Devenir réparateur et en vivre, même en partant de zéro.</span></span>' +
        '<span class="choice-arrow">→</span>' +
      (formation ? "</a>" : "</button>") +
      '<ul class="trust"><li>Réparateur chez toi</li><li>Réparé sur place</li><li>Prix fixe annoncé</li><li>Garantie jusqu\'à 6 mois</li></ul>' +
      '<div class="how"><p class="step">Comment ça marche</p><ol>' +
        '<li><b>1</b><span>Choisis ton modèle et ta panne</span></li>' +
        '<li><b>2</b><span>Tu vois ton prix tout de suite, pièce et main d\'œuvre comprises</span></li>' +
        '<li><b>3</b><span>On t\'appelle pour caler le créneau, le réparateur vient chez toi</span></li>' +
      '</ol></div>' + igCard();
  };
  ACTS.start = function () { reset(); go("modele"); };
  ACTS.soon = function () { toast("La formation arrive bientôt 🎓"); };

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
        h += '<button class="chip" data-act="model" data-v="' + i + '">' + esc(m.nom.replace(/^iPhone /, "iPhone ")) + "</button>";
        n++;
      });
      if (open) h += "</div>";
      if (!n) h += '<p class="empty">Pas trouvé ? Pas de souci, on le chiffre à la main.</p>';
      var autre = MODELES.length - 1;
      h += '<p class="serie">Autre</p><div class="grid"><button class="chip wide" data-act="model" data-v="' + autre + '">📱 Un autre modèle (Samsung, Xiaomi…)</button></div>';
      document.getElementById("models").innerHTML = h;
    }
    q.addEventListener("input", draw);
    draw();
  };
  ACTS.model = function (i) {
    var m = MODELES[+i];
    newPhone(m);
    if (m.devis) {
      S.cur.items = [{ id: "autre", famille: "Réparation", titre: "À chiffrer", prix: null, garantie: GARANTIES.defaut }];
      go("desc");
    } else go("pannes");
  };

  /* ── Étape 2 : pannes (multi-choix) ── */
  SCREENS.pannes = function () {
    var c = S.cur;
    return '<p class="step">Étape 2 sur 4 · ' + esc(c.m.nom) + '</p>' +
      '<h1 class="h1">Qu\'est-ce qu\'il faut réparer ?</h1>' +
      '<p class="sub">Choisis ce qui correspond le mieux.</p>' +
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
    return '<p class="step">Étape 2 sur 4 · ' + esc(m.nom) + '</p>' +
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
    return '<div class="card"><span class="card-k">Avant d\'aller plus loin</span>' +
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
    return '<div class="card"><span class="card-k">Avant d\'aller plus loin</span>' +
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
    return '<div class="card"><span class="card-k">Avant d\'aller plus loin</span>' +
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
      (CONFIG.FORMATION_URL ? '<a class="link" href="' + esc(CONFIG.FORMATION_URL) + '?src=hors-zone">Ou apprends à le réparer toi-même →</a>' : "") +
      "</div>";
  };
  SCREENS.horszone.after = function () { bindTel("telHz", "telHzGo"); };
  ACTS.hzOk = function () {
    S.horsZone = true; S.dep = null; S.urgence = null;
    sendLead("hors_zone");
    go("devis");
  };

  /* ── Étape 4 : urgence ── */
  SCREENS.urgence = function () {
    return '<p class="step">Étape 4 sur 4</p><h1 class="h1">C\'est pour quand ?</h1>' +
      '<p class="sub">Juste pour savoir si on te fait passer en priorité.</p>' +
      '<div class="opts">' + URGENCES.map(function (u) {
        return '<button class="opt" data-act="urg" data-v="' + u.id + '"><span class="opt-ico">' + u.ico + '</span>' +
          '<span class="opt-txt"><span class="opt-t">' + esc(u.titre) + '</span><span class="opt-s">' + esc(u.detail) + "</span></span>" +
          '<span class="choice-arrow">→</span></button>';
      }).join("") + "</div>";
  };
  ACTS.urg = function (id) {
    S.urgence = URGENCES.filter(function (u) { return u.id === id; })[0];
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
      if (multi || true) h += '<li class="phone-h">' + esc(nom) + (S.phones.length > 1 ? '<span>' + (pi + 1) + "/" + S.phones.length + "</span>" : "") + "</li>";
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
      h += '<div class="promise"><span class="dot"></span><span><b>' +
        (enHeuresAppel() ? "Prise de RDV en moins de 10 min" : "Prise de RDV dès " + CONFIG.HEURE_DEBUT_APPEL + "h") +
        "</b><br>On t'appelle au " + esc(S.tel ? S.tel.affiche : "") + " pour caler ton créneau" + (S.dep ? " dans le " + S.dep.c : "") + ".</span></div>" +
        '<div class="cta"><p class="cta-info">🔒 Ton prix est bloqué 7 jours · code <b>' + esc(S.code) + "</b></p>" +
        '<button class="btn ' + (hot ? "btn-yellow" : "btn-dark") + '" data-act="confirm">' + (hot ? "Prendre mon RDV" : "Bloquer mon prix 7 jours") + "</button></div>";
    }
    return h;
  };
  ACTS.addPhone = function () { go("modele"); };
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
      '<h1 class="h1">C\'est noté</h1><p class="sub">On t\'appelle pour caler ton créneau.</p>' +
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
  function waLink() {
    if (!CONFIG.WHATSAPP) return "";
    return '<a class="btn btn-dark" href="https://api.whatsapp.com/send?phone=' + esc(CONFIG.WHATSAPP) +
      "&text=" + encodeURIComponent("Bonjour SOS Phone, mon code devis : " + S.code) + '" target="_blank" rel="noopener">Un souci ? Écris-nous sur WhatsApp</a>';
  }

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
