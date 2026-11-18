/* ═══════════════════════════════════════════════════════════════
   GRILLE DE PRIX — SOS Phone
   ───────────────────────────────────────────────────────────────
   Ce fichier ne contient QUE des tarifs et des libellés.
   Tu peux le modifier sans rien casser ailleurs.

   RÈGLES D'OR
   1. Un prix est toujours un nombre, sans € et sans espace : 120
   2. null  = « pas de prix pour ce cas »  → le site bascule
      automatiquement en devis. Ne JAMAIS inventer un prix.
   3. Garde toujours la virgule à la fin de chaque ligne.
   4. Après modification : enregistre, redéploie, c'est en ligne.

   MODIFIER UN PRIX
   Trouve la ligne du modèle, change le nombre. C'est tout.

   AJOUTER UN MODÈLE
   Copie-colle une ligne complète, change le nom et les prix.
   Place-la où tu veux dans la liste : l'ordre de la liste est
   l'ordre d'affichage à l'écran.
   ═══════════════════════════════════════════════════════════════ */


/* ── LES MODÈLES ───────────────────────────────────────────────
   nom          le texte affiché sur le bouton
   serie        le petit titre gris qui regroupe les modèles
   ecran        soit { premium, oled, apple, nomOled }  (3 gammes)
                soit { unique: 70 }                     (prix unique)
                soit null                               (→ devis)
                premium:null  = ce modèle n'a PAS de gamme premium,
                                elle est simplement masquée
   batterieFixe null   = les 2 gammes standard ci-dessous (75 / 90)
                nombre = prix unique, pas de choix de gamme
   connecteur   prix du port de charge, ou null → devis
   vitre        prix de la vitre arrière, ou null → devis
   chassis      prix du châssis, ou null → devis

   ⚠️ LE LIBELLÉ « 120Hz » — RÈGLE STRICTE
   Il ne s'écrit dans nomOled QUE sur les modèles qui ont vraiment
   ProMotion : les Pro et Pro Max à partir du 13, plus l'iPhone 17
   et le 17 Air. Partout ailleurs : « Soft OLED » tout court.
   Annoncer du 120 Hz sur une pièce qui n'en fait pas, c'est une
   réclamation garantie.

   ⚠️ TOUTES les gammes intermédiaires sont des SOFT OLED. Le libellé
   « OLED » tout court était inexact : ne le réintroduis pas.
─────────────────────────────────────────────────────────────── */
/* ⚠️ INVERSION VOULUE (04/10/2026, revue le 13/10/2026) — NE LA « CORRIGE » PAS.
   En gamme premium, l'iPhone 17 de base est plus cher que les deux Pro :
     premium   17 : 150 €   |   17 Pro : 130 €   |   17 Pro Max : 130 €
   Le 17 Pro et le 17 Pro Max sont au MÊME prix en premium : voulu aussi.
   C'est lié à la disponibilité des pièces, pas à une faute de frappe.
   Ne réordonne pas la grille pour la rendre croissante.

   En soft OLED, en revanche, il n'y a PLUS d'inversion depuis le
   13/10/2026 : 17 à 185 € < 17 Pro à 190 € < 17 Pro Max à 250 €.
   Ne rétablis pas l'ancien écart, il n'a plus lieu d'être. */
const MODELES = [

  { nom:"iPhone 17 Pro Max", serie:"iPhone 17",
    ecran:{ premium:130, oled:250, apple:380, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:120, vitre:190, chassis:310, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 17 Pro", serie:"iPhone 17",
    ecran:{ premium:130, oled:190, apple:370, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:120, vitre:190, chassis:280, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 17 Air", serie:"iPhone 17",
    ecran:{ premium:null, oled:200, apple:370, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:120, vitre:190, chassis:280, boutons:110 },

  { nom:"iPhone 17", serie:"iPhone 17",
    ecran:{ premium:150, oled:185, apple:350, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:120, vitre:170, chassis:250, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 17e", serie:"iPhone 17",
    ecran:{ premium:100, oled:150, apple:200, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:120, vitre:210, chassis:270, boutons:110 },

  { nom:"iPhone 16 Pro Max", serie:"iPhone 16",
    ecran:{ premium:120, oled:185, apple:310, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:120, vitre:210, chassis:230, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 16 Pro", serie:"iPhone 16",
    ecran:{ premium:110, oled:175, apple:295, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:120, vitre:170, chassis:200, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 16 Plus", serie:"iPhone 16",
    ecran:{ premium:120, oled:160, apple:215, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:120, vitre:190, chassis:null, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 16", serie:"iPhone 16",
    ecran:{ premium:100, oled:150, apple:250, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:120, vitre:150, chassis:170, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 16e", serie:"iPhone 16",
    ecran:{ premium:100, oled:150, apple:200, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:120, vitre:180, chassis:190, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 15 Pro Max", serie:"iPhone 15",
    ecran:{ premium:120, oled:170, apple:350, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:120, vitre:170, chassis:230, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 15 Pro", serie:"iPhone 15",
    ecran:{ premium:110, oled:150, apple:310, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:120, vitre:150, chassis:200, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 15 Plus", serie:"iPhone 15",
    ecran:{ premium:110, oled:180, apple:250, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:120, vitre:150, chassis:null, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 15", serie:"iPhone 15",
    ecran:{ premium:90, oled:145, apple:230, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:120, vitre:140, chassis:170, boutons:110, vitreSansLogo:true },

  { nom:"iPhone 14 Pro Max", serie:"iPhone 14",
    ecran:{ premium:95, oled:135, apple:235, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:105, vitre:null, chassis:195, boutons:95 },

  { nom:"iPhone 14 Pro", serie:"iPhone 14",
    ecran:{ premium:85, oled:130, apple:225, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:105, vitre:null, chassis:175, boutons:95 },

  { nom:"iPhone 14 Plus", serie:"iPhone 14",
    ecran:{ premium:80, oled:135, apple:185, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:105, vitre:null, chassis:155, boutons:95 },

  { nom:"iPhone 14", serie:"iPhone 14",
    ecran:{ premium:75, oled:120, apple:175, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:105, vitre:115, chassis:135, boutons:95, vitreSansLogo:true },

  { nom:"iPhone 13 Pro Max", serie:"iPhone 13",
    ecran:{ premium:85, oled:135, apple:235, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:105, vitre:null, chassis:195, boutons:75 },

  { nom:"iPhone 13 Pro", serie:"iPhone 13",
    ecran:{ premium:80, oled:135, apple:185, nomOled:"Soft OLED 120Hz" },
    batterieFixe:null, connecteur:105, vitre:null, chassis:175, boutons:75 },

  { nom:"iPhone 13", serie:"iPhone 13",
    ecran:{ premium:70, oled:115, apple:185, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:105, vitre:null, chassis:135, boutons:75 },

  { nom:"iPhone 13 mini", serie:"iPhone 13",
    ecran:{ premium:65, oled:105, apple:185, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:105, vitre:null, chassis:135, boutons:75 },

  { nom:"iPhone 12 Pro Max", serie:"iPhone 12",
    ecran:{ premium:80, oled:120, apple:200, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:90, vitre:null, chassis:210, boutons:90 },

  { nom:"iPhone 12 Pro", serie:"iPhone 12",
    ecran:{ premium:75, oled:110, apple:190, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:90, vitre:null, chassis:190, boutons:90 },

  { nom:"iPhone 12", serie:"iPhone 12",
    ecran:{ premium:75, oled:110, apple:190, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:90, vitre:null, chassis:150, boutons:90 },

  { nom:"iPhone 12 mini", serie:"iPhone 12",
    ecran:{ premium:75, oled:110, apple:190, nomOled:"Soft OLED" },
    batterieFixe:null, connecteur:90, vitre:null, chassis:150, boutons:90 },

  { nom:"iPhone 11 ou plus ancien", serie:"iPhone 11 et plus ancien",
    ecran:{ unique:70 },
    batterieFixe:70, connecteur:90, vitre:null, chassis:150, boutons:90 },


  /* Ce bouton envoie directement vers le devis. Laisse-le en dernier. */
  { nom:"Un autre modèle", serie:"Autre", devis:true }
];


/* ── LES 2 GAMMES DE BATTERIE ──────────────────────────────────
   Valables pour tous les modèles dont batterieFixe vaut null.
   « best: true » = la ligne mise en avant visuellement.
─────────────────────────────────────────────────────────────── */
const BATTERIE = [
  { titre:"Batterie normale", gamme:"standard", prix:75,
    detail:"Fonctionne parfaitement, tu retrouves une bonne autonomie." },

  /* ⚠️ Ne remets PAS le message d'alerte des réglages comme argument :
     sur le terrain il persiste parfois avec la premium. Le promettre
     absent, c'est une réclamation. La formulation ci-dessous est
     volontairement factuelle — ne la renforce pas. */
  /* Pas de badge : l'ancien disait « Sans alerte », ce qui était la
     mention à supprimer. Mettre autre chose à la place aurait été
     inventer un argument. La mise en avant visuelle suffit. */
  { titre:"Batterie premium", gamme:"premium", prix:90, best:true,
    detail:"Meilleure autonomie et meilleure longévité selon ton utilisation. Affiche l'état de la batterie dans les réglages." }
];


/* ── LES TYPES DE PANNE ────────────────────────────────────────
   Ne change que les textes. Les « id » sont utilisés par le code.
─────────────────────────────────────────────────────────────── */
const PANNES = [
  { id:"ecran",      ico:"📱", famille:"Écran",
    titre:"Écran cassé ou noir",  detail:"Vitre fêlée, tactile HS, affichage mort" },

  { id:"batterie",   ico:"🔋", famille:"Batterie",
    titre:"Batterie",             detail:"Se décharge vite, s'éteint tout seul" },

  { id:"connecteur", ico:"🔌", famille:"Connecteur de charge",
    titre:"Charge mal",           detail:"Le câble ne tient pas, charge lente" },

  { id:"vitre",      ico:"🪞", famille:"Vitre arrière",
    titre:"Vitre arrière cassée", detail:"Le dos du téléphone" },

  /* Châssis : aucune grille de tarif pour l'instant, tout part en
     devis. Le jour où tu auras des prix, ils viendront ici. */
  { id:"chassis",    ico:"🔩", famille:"Châssis",
    titre:"Châssis tordu ou cassé", detail:"Le cadre du téléphone" },

  { id:"boutons",    ico:"🔘", famille:"Boutons latéraux",
    titre:"Boutons latéraux",     detail:"Volume, veille, silencieux" },

  /* Mène DIRECTEMENT au parcours diagnostic : on ne peut pas donner
     un prix de réparation tant qu'on ne sait pas ce qui est en cause. */
  { id:"redemarre",  ico:"🔄", famille:"Diagnostic",
    titre:"Mon téléphone redémarre tout seul", detail:"Il s'éteint et se rallume en boucle" },

  { id:"diagnostic", ico:"🔎", famille:"Diagnostic",
    titre:"Diagnostic",           detail:"On identifie la panne et on te dit ce qu'il en est" },

  /* Prix unique, tous modèles : voir DESOXYDATION juste en dessous.
     Un écran d'avertissement s'affiche OBLIGATOIREMENT avant le prix. */
  { id:"desoxydation", ico:"💧", famille:"Désoxydation",
    titre:"Désoxydation",         detail:"Téléphone tombé dans l'eau" },

  /* « Eau » a quitté cette ligne le jour où la désoxydation est
     devenue une prestation à part entière : sinon le même problème
     avait deux portes, dont une qui partait en devis. */
  { id:"autre",      ico:"🛠️", famille:"Autre",
    titre:"Autre problème",       detail:"Caméra, haut-parleur, ne s'allume plus…" }
];


/* ── DIAGNOSTIC ────────────────────────────────────────────────
   Prix unique, tous modèles. Un écran d'explication OBLIGATOIRE le
   précède : les 50 € sont dus dans tous les cas, et déduits si la
   réparation est faite ensuite. Cette formulation évite les litiges,
   ne la raccourcis pas.

   ⚠️ Le diagnostic est HORS REMISE multi-réparations : il n'est pas
   remisé, et il ne compte pas dans le nombre de réparations.
─────────────────────────────────────────────────────────────── */
const DIAGNOSTIC = 50;
const MENTION_DIAGNOSTIC = "Déduit du prix si tu fais la réparation.";


/* ── VITRE ARRIÈRE SANS LOGO ───────────────────────────────────
   Même pièce, sans le logo gravé au dos : 50 € de moins. Proposée
   uniquement sur les modèles marqués « vitreSansLogo:true » —
   l'iPhone 17e et le 17 Air restent en origine uniquement.
─────────────────────────────────────────────────────────────── */
const REMISE_SANS_LOGO = 50;


/* ── CHÂSSIS AVEC UNE VITRE ARRIÈRE ────────────────────────────
   Quand le châssis et la vitre arrière du MÊME téléphone sont pris
   ensemble, le châssis passe à un forfait : la coque est déjà
   ouverte, le travail n'est pas fait deux fois.

   Ce tarif ne se cumule pas avec la remise multi-réparations (il
   remplace déjà une réduction), mais la réparation compte dans le
   nombre qui détermine le palier des autres.
─────────────────────────────────────────────────────────────── */
/* ⚠️ CE FORFAIT PORTE SUR LA VITRE ARRIÈRE, PAS SUR LE CHÂSSIS.
   Inversé le 07/11/2026. Avant, c'était le châssis qui tombait à un
   tarif réduit et la vitre restait au plein tarif ; c'est l'inverse
   désormais. Le nom de la constante n'a pas changé pour ne rien
   casser ailleurs, mais ne te fie pas à lui : lis cette ligne.

   Quand un même téléphone cumule châssis ET vitre arrière :
     le châssis garde son prix normal,
     la vitre arrière passe à 70 €, d'origine comme sans logo.

   Un seul montant pour tous les modèles (avant : 70 € sur les 17,
   60 € sur les 16, 50 € ailleurs). La structure par série est
   conservée au cas où tu veuilles différencier à nouveau : ajoute
   une clé « iPhone 16 » et elle sera prise à la place du défaut.

   ⚠️ Le forfait n'est JAMAIS appliqué s'il est plus cher que le prix
   réel de la vitre choisie. Cas concret depuis la baisse du 07/11 :
   la vitre sans logo d'un iPhone 14 vaut 65 €, donc moins que 70 €.
   Le garde-fou est dans appliquerChassisCombine(), ne le retire pas. */
const CHASSIS_COMBINE = { defaut: 70 };


/* ── DÉSOXYDATION ──────────────────────────────────────────────
   Prix unique, TOUS modèles, y compris « iPhone 11 ou plus ancien »
   et « Un autre modèle ». Le diagnostic est compris dedans.

   ⚠️ C'est la SEULE prestation sans garantie de résultat. Un dégât
   des eaux est imprévisible : le téléphone peut ne pas repartir, des
   pièces peuvent rester à changer, une panne peut réapparaître plus
   tard. L'écran d'avertissement qui précède le prix dit tout ça —
   il n'est pas décoratif, ne le retire pas.
─────────────────────────────────────────────────────────────── */
const DESOXYDATION = 70;


/* ── PIÈCES POSÉES EN ORIGINE UNIQUEMENT ───────────────────────
   Ces réparations ne se font qu'avec une pièce d'origine quand le
   réparateur se déplace. La mention s'affiche sur l'écran de prix.
─────────────────────────────────────────────────────────────── */
const ORIGINE_UNIQUEMENT = ["vitre", "chassis"];
const MENTION_ORIGINE =
  "En déplacement, la vitre arrière et le châssis sont posés en pièce d'origine uniquement.";


/* ── GARANTIES ─────────────────────────────────────────────────
   ⚠️ IL N'Y A PLUS DE GARANTIE UNIQUE. Elle dépend de la pièce.

   Sur les écrans, l'écart 1 / 3 / 6 mois est un ARGUMENT DE VENTE :
   il justifie l'écart de prix entre les trois gammes. C'est pour ça
   qu'elle s'affiche sur les cartes de gamme, avant le choix.

   Le nombre est un nombre de MOIS. 0 = aucune garantie de résultat,
   et cette valeur est réservée à la désoxydation.
─────────────────────────────────────────────────────────────── */
const GARANTIES = {
  ecran_premium: 1,      // LCD compatible
  ecran_oled:    3,      // Soft OLED
  ecran_apple:   6,      // pièce Apple d'origine
  batterie:      3,
  connecteur:    3,
  vitre:         3,
  chassis:       3,
  boutons:       3,
  desoxydation:  0,      // aucune garantie de résultat
  diagnostic:   -1,      // ni garantie ni promesse : voir MENTION_DIAGNOSTIC
  defaut:        3       // tout le reste, dont les devis
};

/* Ce qui s'affiche à la place de la garantie sur une désoxydation.
   Ne JAMAIS écrire « garanti » à côté d'une désoxydation : ce serait
   contredire l'avertissement, et un client pourrait s'en prévaloir. */
const MENTION_DESOX = "Diagnostic compris. Résultat non garanti.";


/* ── REMISES MULTI-RÉPARATIONS ─────────────────────────────────
   ⚠️ LA REMISE NE PORTE PAS SUR LE TOTAL.

   La réparation la PLUS CHÈRE reste toujours au prix plein.
   Seules les suivantes sont remisées.

     2 réparations      → −20 % sur la moins chère
     3 réparations ou + → −30 % sur toutes sauf la plus chère

   Exemples de contrôle :
     écran 100 + batterie 75              → 100 + 60      = 160 €
     écran 100 + connecteur 90 + bat. 75  → 100 + 63 + 52,50 = 215,50 €

   Appliquées uniquement quand TOUTES les réparations sont chiffrées.
   Dès qu'une part en devis, aucune remise n'est promise sur un
   total qu'on ne connaît pas encore.

   ⚠️ Ne jamais écrire « −20 % dès 2 réparations » côté client : ça
   laisse comprendre une remise sur le total, et le client se sent
   trompé en découvrant le montant.
─────────────────────────────────────────────────────────────── */
const REMISES = [
  { aPartirDe: 3, taux: 0.30 },   // 3 réparations ou plus : −30 % sur les suivantes
  { aPartirDe: 2, taux: 0.20 }    // 2 réparations         : −20 % sur la seconde
];


/* ── ZONE COUVERTE ─────────────────────────────────────────────
   Les 8 départements d'Île-de-France. Pour élargir la zone
   plus tard, ajoute une ligne { c:"60", n:"Oise" }.
─────────────────────────────────────────────────────────────── */
const DEPS = [
  { c:"75", n:"Paris" },
  { c:"77", n:"Seine-et-Marne" },
  { c:"78", n:"Yvelines" },
  { c:"91", n:"Essonne" },
  { c:"92", n:"Hauts-de-Seine" },
  { c:"93", n:"Seine-Saint-Denis" },
  { c:"94", n:"Val-de-Marne" },
  { c:"95", n:"Val-d'Oise" }
];


/* ── URGENCE ───────────────────────────────────────────────────
   chaud: true  → récap avec gros bouton WhatsApp
   chaud: false → récap « je regarde juste », bouton discret
─────────────────────────────────────────────────────────────── */
const URGENCES = [
  { id:"urgent",  ico:"🔥", titre:"Le plus vite possible",
    detail:"Aujourd'hui ou demain si c'est jouable", chaud:true },

  { id:"semaine", ico:"📅", titre:"Dans la semaine",
    detail:"Je m'adapte au créneau du réparateur", chaud:true },

  { id:"souple",  ico:"🙂", titre:"Pas pressé",
    detail:"Quand ça arrange tout le monde", chaud:true },

  { id:"info",    ico:"👀", titre:"Je regarde juste le prix",
    detail:"Je ne réserve pas maintenant", chaud:false }
];
