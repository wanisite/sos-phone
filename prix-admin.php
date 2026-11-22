<?php
/**
 * SOS Phone — page « Prix SOS » dans l'admin WordPress.
 *
 * Les prix de base restent dans assets/prix.js. Ce qui est enregistré ici
 * (option « sosp_prix ») les remplace au chargement du devis : le gérant
 * change un prix, enregistre, et les clients voient le nouveau prix tout de suite.
 *
 * Champ vide = « sur devis » (pas de prix fixe), sauf mention contraire.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ══ Lecture / nettoyage ══════════════════════════════════════ */

function sosp_prix_get() {
	$p = json_decode( (string) get_option( 'sosp_prix', '' ), true );
	return is_array( $p ) ? $p : array();
}

function sosp_prix_num( $v ) {
	if ( null === $v || '' === $v || ! is_numeric( $v ) ) {
		return null;
	}
	$n = round( (float) $v, 2 );
	return ( $n < 0 || $n > 5000 ) ? null : $n;
}

function sosp_prix_nettoie( $r ) {
	$o = array( 'modeles' => array(), 'general' => array(), 'deplacement' => array(), 'extras' => array(), 'cats' => array(), 'promos' => array(), 'bloques' => array(), 'fermes' => array() );
	if ( ! is_array( $r ) ) {
		return $o;
	}
	foreach ( (array) ( $r['modeles'] ?? array() ) as $nom => $m ) {
		$nom = sanitize_text_field( $nom );
		if ( '' === $nom || ! is_array( $m ) ) {
			continue;
		}
		$c = array();
		foreach ( array( 'premium', 'oled', 'apple', 'unique', 'batterie', 'batN', 'batP', 'connecteur', 'vitre', 'chassis', 'boutons' ) as $k ) {
			if ( array_key_exists( $k, $m ) ) {
				$c[ $k ] = sosp_prix_num( $m[ $k ] );
			}
		}
		$o['modeles'][ $nom ] = $c;
	}
	foreach ( array( 'diagnostic', 'desoxydation', 'sansLogo', 'chassisCombine', 'batStandard', 'batPremium', 'remise2', 'remise3' ) as $k ) {
		$v = sosp_prix_num( $r['general'][ $k ] ?? null );
		if ( null !== $v ) {
			$o['general'][ $k ] = $v;
		}
	}
	foreach ( (array) ( $r['deplacement'] ?? array() ) as $d => $v ) {
		if ( preg_match( '/^\d{2}$/', (string) $d ) ) {
			$v                    = sosp_prix_num( $v );
			$o['deplacement'][ $d ] = null === $v ? 0 : $v;
		}
	}
	/* Catégories de pannes ajoutées par le gérant (ex : Caméra arrière) */
	foreach ( array_slice( (array) ( $r['cats'] ?? array() ), 0, 30 ) as $c ) {
		$id    = preg_replace( '/[^a-z0-9_]/', '', strtolower( (string) ( $c['id'] ?? '' ) ) );
		$titre = mb_substr( sanitize_text_field( (string) ( $c['titre'] ?? '' ) ), 0, 60 );
		if ( '' === $id || '' === $titre ) {
			continue;
		}
		$o['cats'][] = array(
			'id'     => 'c_' . preg_replace( '/^c_/', '', $id ),
			'titre'  => $titre,
			'detail' => mb_substr( sanitize_text_field( (string) ( $c['detail'] ?? '' ) ), 0, 140 ),
			'ico'    => mb_substr( sanitize_text_field( (string) ( $c['ico'] ?? '' ) ), 0, 8 ),
		);
	}
	/* Prestations en plus, rangées dans une catégorie, avec un prix par iPhone */
	foreach ( array_slice( (array) ( $r['extras'] ?? array() ), 0, 60 ) as $x ) {
		$id    = preg_replace( '/[^a-z0-9_]/', '', strtolower( (string) ( $x['id'] ?? '' ) ) );
		$cat   = preg_replace( '/[^a-z0-9_]/', '', strtolower( (string) ( $x['cat'] ?? '' ) ) );
		$titre = mb_substr( sanitize_text_field( (string) ( $x['titre'] ?? '' ) ), 0, 80 );
		if ( '' === $id || '' === $cat || '' === $titre ) {
			continue;
		}
		$prix = array();
		foreach ( (array) ( $x['prix'] ?? array() ) as $nom => $v ) {
			$v = sosp_prix_num( $v );
			if ( null !== $v ) {
				$prix[ sanitize_text_field( $nom ) ] = $v;
			}
		}
		$o['extras'][] = array(
			'id'       => $id,
			'cat'      => $cat,
			'titre'    => $titre,
			'detail'   => mb_substr( sanitize_text_field( (string) ( $x['detail'] ?? '' ) ), 0, 160 ),
			'garantie' => max( 0, min( 24, (int) ( $x['garantie'] ?? 3 ) ) ),
			'prix'     => $prix,
		);
	}
	/* Codes promo : CODE, % de remise, mois de validité (facultatif) */
	foreach ( array_slice( (array) ( $r['promos'] ?? array() ), 0, 40 ) as $c ) {
		$code = strtoupper( preg_replace( '/[^A-Za-z0-9_-]/', '', (string) ( $c['code'] ?? '' ) ) );
		$taux = sosp_prix_num( $c['taux'] ?? null );
		if ( '' === $code || null === $taux || $taux <= 0 || $taux > 90 ) {
			continue;
		}
		$mois = (int) ( $c['mois'] ?? 0 );
		$o['promos'][] = array( 'code' => mb_substr( $code, 0, 20 ), 'taux' => $taux, 'mois' => ( $mois >= 1 && $mois <= 12 ) ? $mois : 0 );
	}
	/* Jours bloqués (dates) : on garde seulement aujourd'hui et après */
	$auj = wp_date( 'Y-m-d' );
	foreach ( array_slice( (array) ( $r['bloques'] ?? array() ), 0, 400 ) as $d ) {
		$d = (string) $d;
		if ( preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $d, $x ) && checkdate( (int) $x[2], (int) $x[3], (int) $x[1] ) && $d >= $auj && ! in_array( $d, $o['bloques'], true ) ) {
			$o['bloques'][] = $d;
		}
	}
	sort( $o['bloques'] );
	/* Jours fermés chaque semaine : 0 = dimanche … 6 = samedi */
	foreach ( (array) ( $r['fermes'] ?? array() ) as $j ) {
		$j = (int) $j;
		if ( $j >= 0 && $j <= 6 && ! in_array( $j, $o['fermes'], true ) ) {
			$o['fermes'][] = $j;
		}
	}
	return $o;
}

/* Disponibilités lues en direct par le devis, au moment où le client choisit son créneau. */
add_action( 'rest_api_init', function () {
	register_rest_route( 'sos-phone/v1', '/dispo', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$p = sosp_prix_get();
			$r = new WP_REST_Response( array(
				'bloques' => array_values( (array) ( $p['bloques'] ?? array() ) ),
				'fermes'  => array_values( (array) ( $p['fermes'] ?? array() ) ),
			) );
			$r->header( 'Cache-Control', 'no-store, max-age=0' );
			return $r;
		},
	) );
} );

/* ══ Application des prix (même code côté site et côté admin) ══ */

function sosp_prix_js_applique() {
	return <<<'JS'
window.sospAppliquePrix = function (P) {
  if (!P || typeof MODELES === "undefined") return;
  var g = P.general || {};
  if (g.diagnostic != null) DIAGNOSTIC = g.diagnostic;
  if (g.desoxydation != null) DESOXYDATION = g.desoxydation;
  if (g.sansLogo != null) REMISE_SANS_LOGO = g.sansLogo;
  if (g.chassisCombine != null) CHASSIS_COMBINE.defaut = g.chassisCombine;
  if (g.batStandard != null && BATTERIE[0]) BATTERIE[0].prix = g.batStandard;
  if (g.batPremium != null && BATTERIE[1]) BATTERIE[1].prix = g.batPremium;
  REMISES.forEach(function (r) {
    if (r.aPartirDe === 2 && g.remise2 != null) r.taux = g.remise2 / 100;
    if (r.aPartirDe === 3 && g.remise3 != null) r.taux = g.remise3 / 100;
  });
  var M = P.modeles || {};
  MODELES.forEach(function (m) {
    var o = M[m.nom];
    if (!o || m.devis) return;
    if (m.ecran && m.ecran.unique != null) {
      if ("unique" in o) m.ecran = o.unique == null ? null : { unique: o.unique };
    } else if ("oled" in o || "apple" in o || "premium" in o) {
      if (o.oled == null && o.apple == null) m.ecran = null;
      else {
        var e = m.ecran || { nomOled: "Soft OLED" };
        e.premium = o.premium == null ? null : o.premium;
        if (o.oled != null) e.oled = o.oled;
        if (o.apple != null) e.apple = o.apple;
        if (e.oled == null) e.oled = e.apple;
        if (e.apple == null) e.apple = e.oled;
        m.ecran = e;
      }
    }
    if ("batterie" in o) m.batterieFixe = o.batterie == null ? null : o.batterie;
    /* Batteries par téléphone (normale / premium), réglées dans l'espace artisan ou l'admin */
    if ("batN" in o || "batP" in o) { m.batN = o.batN == null ? null : o.batN; m.batP = o.batP == null ? null : o.batP; m.batterieFixe = null; }
    ["connecteur", "vitre", "chassis", "boutons"].forEach(function (k) { if (k in o) m[k] = o[k]; });
  });
  /* Codes promo gérés dans WordPress : ils remplacent ceux de config.js */
  if (Array.isArray(P.promos) && typeof CONFIG === "object") {
    CONFIG.CODES_PROMO = P.promos.map(function (c) { return { code: c.code, taux: c.taux / 100, mois: c.mois || undefined }; });
  }
  window.SOSP_PROMOS = P.promos || null;
  window.SOSP_DISPO = { bloques: P.bloques || [], fermes: P.fermes || [] };
  /* Catégories ajoutées : rangées juste avant « Autre problème ». */
  window.SOSP_CATS = P.cats || [];
  window.SOSP_EXTRAS = P.extras || [];
  window.SOSP_CATS.forEach(function (c) {
    if (PANNES.some(function (p) { return p.id === c.id; })) return;
    var ids = PANNES.map(function (p) { return p.id; }), i = ids.indexOf("autre");
    PANNES.splice(i < 0 ? PANNES.length : i, 0, { id: c.id, ico: c.ico || "🛠️", famille: c.titre, titre: c.titre, detail: c.detail || "", perso: true });
  });
  if (P.deplacement && typeof DEPLACEMENT === "object") {
    Object.keys(P.deplacement).forEach(function (d) { DEPLACEMENT[d] = +P.deplacement[d] || 0; });
  }
};
JS;
}

/* Côté site : appliqué juste après prix.js, avant l'appli. */
function sosp_prix_inline_site() {
	$p = sosp_prix_get();
	wp_add_inline_script( 'sosp-prix', sosp_prix_js_applique() . "\nsospAppliquePrix(" . wp_json_encode( $p ) . ');' );
}

/* ══ Menu + enregistrement ════════════════════════════════════ */

add_action( 'admin_menu', function () {
	add_menu_page( 'Prix SOS Phone', 'Prix SOS', 'manage_options', 'sos-prix', 'sosp_prix_page', 'dashicons-tag', 26 );
} );

add_action( 'admin_post_sosp_prix', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'Accès refusé.' );
	}
	check_admin_referer( 'sosp_prix' );
	if ( ! empty( $_POST['sosp_reset'] ) ) {
		delete_option( 'sosp_prix' );
		wp_safe_redirect( admin_url( 'admin.php?page=sos-prix&reset=1' ) );
		exit;
	}
	$raw = json_decode( wp_unslash( (string) ( $_POST['sosp_prix_json'] ?? '' ) ), true );
	update_option( 'sosp_prix', wp_json_encode( sosp_prix_nettoie( $raw ) ), false );
	wp_safe_redirect( admin_url( 'admin.php?page=sos-prix&ok=1' ) );
	exit;
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( 'toplevel_page_sos-prix' !== $hook ) {
		return;
	}
	/* La grille de base, toujours la copie locale (même si le site lit GitHub). */
	wp_enqueue_script( 'sosp-config-base', SOSP_URL . 'assets/config.js', array(), sosp_ver( 'config.js' ), true );
	wp_enqueue_script( 'sosp-prix-base', SOSP_URL . 'assets/prix.js', array( 'sosp-config-base' ), sosp_ver( 'prix.js' ), true );
	wp_add_inline_script( 'sosp-prix-base', sosp_prix_js_applique() . "\nsospAppliquePrix(" . wp_json_encode( sosp_prix_get() ) . ');' );
} );

/* ══ La page ═══════════════════════════════════════════════════ */

function sosp_prix_page() {
	?>
	<div class="wrap sosp-prix">
		<h1>Prix SOS Phone</h1>
		<?php if ( isset( $_GET['ok'] ) ) : ?>
			<div class="notice notice-success is-dismissible"><p><strong>Prix enregistrés.</strong> Ils sont déjà en ligne dans le devis.</p></div>
		<?php elseif ( isset( $_GET['reset'] ) ) : ?>
			<div class="notice notice-warning is-dismissible"><p>Prix remis à ceux d'origine.</p></div>
		<?php endif; ?>
		<p class="sosp-aide">Tape un prix en euros, sans le signe €. <strong>Case vide = pas de prix fixe</strong> (le client décrit sa panne et tu le chiffres sur WhatsApp).
			Clique sur <strong>Enregistrer les prix</strong> en bas : le devis du site les utilise immédiatement.</p>
		<p class="description">Les frais de déplacement ne sont pas sur le site : le devis indique au client qu'ils lui sont donnés sur WhatsApp.</p>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" id="sospForm">
			<?php wp_nonce_field( 'sosp_prix' ); ?>
			<input type="hidden" name="action" value="sosp_prix">
			<input type="hidden" name="sosp_prix_json" id="sospJson">

			<h2>1. Prix généraux</h2>
			<div class="sosp-cartes" id="sospGeneral"></div>

			<h2>2. Catégories de pannes en plus</h2>
			<p class="description">Une nouvelle case dans la liste « Qu'est-ce qu'il faut réparer ? » (ex : Caméra arrière, Face ID, Haut-parleur). Ajoute ensuite ses prestations en dessous.</p>
			<div id="sospCats"></div>
			<button type="button" class="button" id="sospAddCat">+ Ajouter une catégorie</button>

			<h2>3. Prestations en plus</h2>
			<p class="description">Une option de plus dans une catégorie (ex : « Écran d'origine reconditionné » dans Écran, « Batterie d'origine Apple » dans Batterie). Chaque prestation devient une colonne dans le tableau : mets un prix pour chaque iPhone concerné, laisse vide si elle n'existe pas pour ce modèle.</p>
			<div id="sospExtras"></div>
			<button type="button" class="button" id="sospAddExtra">+ Ajouter une prestation</button>

			<h2>4. Codes promo</h2>
			<p class="description">Le client tape le code sur son devis. Remise en % sur le total. Mois : laisse « Toute l'année » ou choisis un mois où le code marche.</p>
			<div id="sospPromos"></div>
			<button type="button" class="button" id="sospAddPromo">+ Ajouter un code promo</button>

			<h2>5. Jours où tu n'es pas disponible</h2>
			<p class="description">Ces jours disparaissent du choix « On passe quand ? ». Le devis vérifie en direct au moment où le client choisit : pas besoin de recharger quoi que ce soit.</p>
			<div class="sosp-carte sosp-dispo">
				<label>Fermé chaque semaine le :</label>
				<div id="sospFermes" class="sosp-fermes"></div>
				<label style="margin-top:14px">Bloquer une date précise :</label>
				<div class="sosp-tous"><input type="date" id="sospDate"> <button type="button" class="button" id="sospBloquer">Bloquer ce jour</button></div>
				<div id="sospBloques" class="sosp-puces"></div>
			</div>

			<h2>6. Réparations par téléphone</h2>
			<p class="description">« Écran éco » vide = cette gamme n'est pas proposée. « Batterie normale » ou « Batterie premium » vide = cette batterie n'est pas proposée sur ce modèle. Les colonnes en violet sont tes prestations en plus.</p>
			<div class="sosp-table-wrap"><table class="widefat sosp-table" id="sospTable"></table></div>

			<div class="sosp-barre">
				<button type="submit" class="button button-primary button-hero">Enregistrer les prix</button>
				<button type="submit" name="sosp_reset" value="1" class="button-link sosp-reset" onclick="return confirm('Remettre tous les prix d\'origine ? Prestations et catégories ajoutées seront supprimées.');">Remettre les prix d'origine</button>
			</div>
		</form>
	</div>
	<style>
		.sosp-prix .sosp-aide { font-size: 14px; max-width: 820px; }
		.sosp-prix h2 { margin-top: 28px; }
		.sosp-cartes { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; max-width: 1100px; margin: 10px 0 14px; }
		.sosp-carte { background: #fff; border: 1px solid #dcdcde; border-radius: 8px; padding: 12px 14px; }
		.sosp-carte label { display: block; font-weight: 600; margin-bottom: 6px; }
		.sosp-carte small { display: block; color: #646970; margin-top: 4px; }
		.sosp-prix input.sosp-n { width: 90px; text-align: right; }
		.sosp-ligne { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 10px; background: #fff; border: 1px solid #dcdcde; border-left: 4px solid #8c5cff; border-radius: 6px; padding: 10px 12px; margin: 0 0 8px; max-width: 1100px; }
		.sosp-ligne label { display: flex; flex-direction: column; gap: 4px; font-weight: 600; font-size: 12px; }
		.sosp-ligne input[type=text] { min-width: 200px; }
		.sosp-ligne .sosp-ico { width: 56px; min-width: 0; text-align: center; font-size: 18px; }
		.sosp-ligne .sosp-court { width: 70px; min-width: 0; }
		.sosp-ligne .sosp-tous { display: flex; gap: 6px; align-items: center; }
		.sosp-suppr { color: #b32d2e !important; margin-left: auto !important; }
		.sosp-vide { color: #646970; font-style: italic; margin: 6px 0 10px; }
		.sosp-table-wrap { overflow-x: auto; max-width: 100%; }
		.sosp-table { min-width: 980px; }
		.sosp-table th { white-space: nowrap; vertical-align: bottom; }
		.sosp-table th.sosp-x { background: #f3eeff; color: #4b2aa6; }
		.sosp-table th.sosp-x small { display: block; font-weight: 400; color: #6b56b8; }
		.sosp-table td.sosp-x { background: #faf8ff; }
		.sosp-table td:first-child { font-weight: 600; white-space: nowrap; }
		.sosp-table tr.sosp-serie td { background: #f0f0f1; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: .04em; }
		.sosp-table input.sosp-n { width: 78px; }
		.sosp-table input.sosp-n:placeholder-shown { background: #fff8e5; }
		.sosp-table td.sosp-x input.sosp-n:placeholder-shown { background: #fff; }
		.sosp-dispo { max-width: 760px; }
		.sosp-fermes { display: flex; flex-wrap: wrap; gap: 6px 14px; }
		.sosp-fermes label { font-weight: 400; display: inline-flex; gap: 5px; align-items: center; }
		.sosp-puces { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
		.sosp-puce { display: inline-flex; align-items: center; gap: 6px; background: #fcf0f1; color: #8a1f22; border: 1px solid #f0c3c6; border-radius: 99px; padding: 4px 6px 4px 12px; font-weight: 600; }
		.sosp-puce button { border: 0; background: #fff; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; color: #b32d2e; }
		.sosp-barre { position: sticky; bottom: 0; background: #f0f0f1; padding: 14px 0; margin-top: 18px; border-top: 1px solid #dcdcde; display: flex; align-items: center; gap: 24px; z-index: 5; }
		.sosp-reset { color: #b32d2e !important; }
	</style>
	<script>
	document.addEventListener("DOMContentLoaded", function () {
		if (typeof MODELES === "undefined") { document.getElementById("sospTable").innerHTML = "<tr><td>Grille de prix introuvable.</td></tr>"; return; }
		var $ = function (id) { return document.getElementById(id); };
		function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
		function inp(id, v, ph) { return '<input class="sosp-n" type="number" min="0" step="0.5" inputmode="decimal" id="' + id + '" value="' + (v == null ? "" : v) + '" placeholder="' + (ph || "Sur devis") + '">'; }
		function val(id) { var e = $(id); if (!e) return null; var v = e.value.trim().replace(",", "."); return v === "" ? null : +v; }
		function txt(id) { var e = $(id); return e ? e.value.trim() : ""; }
		function uid(p) { return p + Math.random().toString(36).slice(2, 8); }
		var tel = MODELES.filter(function (m) { return !m.devis; });

		/* ── État de départ : ce qui est enregistré ── */
		var cats = (window.SOSP_CATS || []).map(function (c) { return { id: c.id, titre: c.titre, detail: c.detail || "", ico: c.ico || "" }; });
		var extras = (window.SOSP_EXTRAS || []).map(function (x) { return { id: x.id, cat: x.cat, titre: x.titre, detail: x.detail || "", garantie: x.garantie, prix: Object.assign({}, x.prix || {}) }; });

		/* Catégories proposées pour ranger une prestation */
		var BASE = PANNES.filter(function (p) { return !p.perso && ["redemarre", "diagnostic", "desoxydation"].indexOf(p.id) < 0; });
		function choixCats() { return BASE.map(function (p) { return { id: p.id, nom: p.famille }; }).concat(cats.filter(function (c) { return c.titre; }).map(function (c) { return { id: c.id, nom: c.titre + " (ajoutée)" }; })); }

		/* ── Prix généraux ── */
		var r2 = REMISES.filter(function (r) { return r.aPartirDe === 2; })[0], r3 = REMISES.filter(function (r) { return r.aPartirDe === 3; })[0];
		var G = [
			["diagnostic", "Diagnostic", DIAGNOSTIC, "€ — déduit si réparation"],
			["desoxydation", "Désoxydation", DESOXYDATION, "€ — tous modèles"],
			["batStandard", BATTERIE[0].titre, BATTERIE[0].prix, "€ — modèles sans prix batterie"],
			["batPremium", BATTERIE[1] ? BATTERIE[1].titre : "Batterie premium", BATTERIE[1] ? BATTERIE[1].prix : null, "€"],
			["sansLogo", "Vitre arrière sans logo", REMISE_SANS_LOGO, "€ de moins que la vitre d'origine"],
			["chassisCombine", "Vitre + châssis ensemble", CHASSIS_COMBINE.defaut, "€ — prix de la vitre si châssis aussi"],
			["remise2", "Remise 2e réparation", r2 ? Math.round(r2.taux * 100) : 20, "%"],
			["remise3", "Remise 3e réparation et +", r3 ? Math.round(r3.taux * 100) : 30, "%"]
		];
		$("sospGeneral").innerHTML = G.map(function (g) {
			return '<div class="sosp-carte"><label for="g_' + g[0] + '">' + g[1] + "</label>" + inp("g_" + g[0], g[2], "—") + "<small>" + g[3] + "</small></div>";
		}).join("");

		/* ── Codes promo ── */
		var MOIS = ["Toute l'année", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
		var promos = (window.SOSP_PROMOS || CONFIG_PROMOS_DEFAUT()).map(function (c) { return { id: uid("p"), code: c.code, taux: c.taux, mois: c.mois || 0 }; });
		function CONFIG_PROMOS_DEFAUT() {
			return (typeof CONFIG === "object" && CONFIG.CODES_PROMO || []).map(function (c) { return { code: c.code, taux: Math.round(c.taux * 100), mois: c.mois || 0 }; });
		}
		function dessinePromos() {
			$("sospPromos").innerHTML = promos.length ? promos.map(function (c) {
				return '<div class="sosp-ligne"><label>Code<input type="text" id="p_c_' + c.id + '" value="' + esc(c.code) + '" placeholder="Ex : NOEL15" style="text-transform:uppercase;min-width:140px"></label>' +
					'<label>Remise (%)<input type="number" min="1" max="90" class="sosp-court" id="p_t_' + c.id + '" value="' + (c.taux || "") + '"></label>' +
					'<label>Valable<select id="p_m_' + c.id + '">' + MOIS.map(function (m, i) { return '<option value="' + i + '"' + (i === +c.mois ? " selected" : "") + ">" + m + "</option>"; }).join("") + "</select></label>" +
					'<button type="button" class="button-link sosp-suppr" data-suppr-promo="' + c.id + '">Supprimer</button></div>';
			}).join("") : '<p class="sosp-vide">Aucun code promo.</p>';
		}
		function lirePromos() { promos.forEach(function (c) { if ($("p_c_" + c.id)) { c.code = txt("p_c_" + c.id).toUpperCase(); c.taux = val("p_t_" + c.id); c.mois = +$("p_m_" + c.id).value; } }); }
		dessinePromos();
		$("sospAddPromo").addEventListener("click", function () { lirePromos(); promos.push({ id: uid("p"), code: "", taux: 10, mois: 0 }); dessinePromos(); $("p_c_" + promos[promos.length - 1].id).focus(); });

		/* ── Jours fermés et jours bloqués ── */
		var D = window.SOSP_DISPO || { bloques: [], fermes: [] }, bloques = D.bloques.slice(), fermes = D.fermes.slice();
		var JS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"], JN = [1, 2, 3, 4, 5, 6, 0];
		$("sospFermes").innerHTML = JS.map(function (j, k) { return '<label><input type="checkbox" class="sosp-ferme" value="' + JN[k] + '"' + (fermes.indexOf(JN[k]) > -1 ? " checked" : "") + "> " + j + "</label>"; }).join("");
		function dessineBloques() {
			bloques.sort();
			$("sospBloques").innerHTML = bloques.length ? bloques.map(function (d) {
				var x = new Date(d + "T12:00:00");
				return '<span class="sosp-puce">' + x.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }) + '<button type="button" data-debloquer="' + d + '" aria-label="Débloquer">✕</button></span>';
			}).join("") : '<p class="sosp-vide">Aucun jour bloqué.</p>';
		}
		dessineBloques();
		$("sospDate").min = new Date().toISOString().slice(0, 10);
		$("sospBloquer").addEventListener("click", function () { var d = $("sospDate").value; if (d && bloques.indexOf(d) < 0) { bloques.push(d); dessineBloques(); } $("sospDate").value = ""; });

		/* ── Lecture de ce qui est à l'écran (avant chaque redessin et à l'envoi) ── */
		var prixModeles = {};
		function lire() {
			cats.forEach(function (c) { if ($("c_t_" + c.id)) { c.titre = txt("c_t_" + c.id); c.detail = txt("c_d_" + c.id); c.ico = txt("c_i_" + c.id); } });
			extras.forEach(function (x) {
				if (!$("x_t_" + x.id)) return;
				x.titre = txt("x_t_" + x.id); x.detail = txt("x_d_" + x.id); x.cat = $("x_c_" + x.id).value;
				var gar = val("x_g_" + x.id); x.garantie = gar == null ? 3 : gar;
				tel.forEach(function (m, i) { var e = $("xp_" + x.id + "_" + i); if (e) { var v = val("xp_" + x.id + "_" + i); if (v == null) delete x.prix[m.nom]; else x.prix[m.nom] = v; } });
			});
			tel.forEach(function (m, i) {
				if (!$("m" + i + "_batN")) return;
				var o = {};
				if ($("m" + i + "_unique")) o.unique = val("m" + i + "_unique");
				else { o.premium = val("m" + i + "_premium"); o.oled = val("m" + i + "_oled"); o.apple = val("m" + i + "_apple"); }
				o.batterie = null; o.batN = val("m" + i + "_batN"); o.batP = val("m" + i + "_batP");
				["connecteur", "vitre", "chassis", "boutons"].forEach(function (k) { o[k] = val("m" + i + "_" + k); });
				prixModeles[m.nom] = o;
			});
		}

		/* ── Dessin des catégories, prestations et du tableau ── */
		function dessine() {
			$("sospCats").innerHTML = cats.length ? cats.map(function (c) {
				return '<div class="sosp-ligne"><label>Emoji<input type="text" class="sosp-ico" id="c_i_' + c.id + '" value="' + esc(c.ico) + '" placeholder="📷"></label>' +
					'<label>Nom de la catégorie<input type="text" id="c_t_' + c.id + '" value="' + esc(c.titre) + '" placeholder="Ex : Caméra arrière"></label>' +
					'<label>Petite description<input type="text" id="c_d_' + c.id + '" value="' + esc(c.detail) + '" placeholder="Ex : Photos floues, caméra noire"></label>' +
					'<button type="button" class="button-link sosp-suppr" data-suppr-cat="' + c.id + '">Supprimer</button></div>';
			}).join("") : '<p class="sosp-vide">Aucune catégorie ajoutée.</p>';

			var C = choixCats();
			$("sospExtras").innerHTML = extras.length ? extras.map(function (x) {
				return '<div class="sosp-ligne"><label>Catégorie<select id="x_c_' + x.id + '">' + C.map(function (c) { return '<option value="' + c.id + '"' + (c.id === x.cat ? " selected" : "") + ">" + esc(c.nom) + "</option>"; }).join("") + "</select></label>" +
					'<label>Nom de la prestation<input type="text" id="x_t_' + x.id + '" value="' + esc(x.titre) + '" placeholder="Ex : Écran d\'origine reconditionné"></label>' +
					'<label>Ce que le client lit<input type="text" id="x_d_' + x.id + '" value="' + esc(x.detail) + '" placeholder="Ex : Pièce Apple reconditionnée"></label>' +
					'<label>Garantie (mois)<input type="number" min="0" max="24" class="sosp-court" id="x_g_' + x.id + '" value="' + (x.garantie == null ? 3 : x.garantie) + '"></label>' +
					'<label>Même prix pour tous<span class="sosp-tous"><input type="number" min="0" step="0.5" class="sosp-court" id="x_all_' + x.id + '" placeholder="€"><button type="button" class="button" data-tous="' + x.id + '">Remplir</button></span></label>' +
					'<button type="button" class="button-link sosp-suppr" data-suppr-extra="' + x.id + '">Supprimer</button></div>';
			}).join("") : '<p class="sosp-vide">Aucune prestation ajoutée.</p>';

			dessineTable();
		}
		function dessineTable() {
			var C = choixCats();
			var cols = [["premium", "Écran gamme éco"], ["oled", "Écran gamme premium (Soft OLED)"], ["apple", "Écran gamme originale"], ["batN", "Batterie normale"], ["batP", "Batterie premium"],
				["connecteur", "Connecteur"], ["vitre", "Vitre arrière"], ["chassis", "Châssis"], ["boutons", "Boutons"]];
			var nomCat = {}; C.forEach(function (c) { nomCat[c.id] = c.nom.replace(" (ajoutée)", ""); });
			var h = "<thead><tr><th>Téléphone</th>" + cols.map(function (c) { return "<th>" + c[1] + "</th>"; }).join("") +
				extras.map(function (x) { return '<th class="sosp-x">' + esc(x.titre || "Nouvelle prestation") + "<small>" + esc(nomCat[x.cat] || "") + "</small></th>"; }).join("") + "</tr></thead><tbody>", serie = null;
			tel.forEach(function (m, i) {
				if (m.serie !== serie) { serie = m.serie; h += '<tr class="sosp-serie"><td colspan="' + (cols.length + extras.length + 1) + '">' + serie + "</td></tr>"; }
				var o = prixModeles[m.nom], e = m.ecran, unique = e && e.unique != null;
				h += "<tr><td>" + m.nom + "</td>";
				if (unique) h += '<td colspan="3">' + inp("m" + i + "_unique", o ? o.unique : e.unique) + ' <span class="description">prix unique écran</span></td>';
				else h += "<td>" + inp("m" + i + "_premium", o ? o.premium : e ? e.premium : null, "Pas proposé") + "</td><td>" + inp("m" + i + "_oled", o ? o.oled : e ? e.oled : null) + "</td><td>" + inp("m" + i + "_apple", o ? o.apple : e ? e.apple : null) + "</td>";
				var bN, bP;
				if (o && ("batN" in o)) { bN = o.batN; bP = o.batP; }
				else if (m.batN !== undefined || m.batP !== undefined) { bN = m.batN; bP = m.batP; }
				else if (typeof m.batterieFixe === "number") { bN = m.batterieFixe; bP = null; }
				else { bN = BATTERIE[0].prix; bP = BATTERIE[1] ? BATTERIE[1].prix : null; }
				h += "<td>" + inp("m" + i + "_batN", bN, "Pas proposée") + "</td><td>" + inp("m" + i + "_batP", bP, "Pas proposée") + "</td>";
				["connecteur", "vitre", "chassis", "boutons"].forEach(function (k) { h += "<td>" + inp("m" + i + "_" + k, o ? o[k] : m[k]) + "</td>"; });
				extras.forEach(function (x) { h += '<td class="sosp-x">' + inp("xp_" + x.id + "_" + i, x.prix[m.nom], "—") + "</td>"; });
				h += "</tr>";
			});
			$("sospTable").innerHTML = h + "</tbody>";
		}
		dessine();

		/* ── Boutons ── */
		$("sospAddCat").addEventListener("click", function () { lire(); cats.push({ id: uid("c_"), titre: "", detail: "", ico: "" }); dessine(); $("c_t_" + cats[cats.length - 1].id).focus(); });
		$("sospAddExtra").addEventListener("click", function () { lire(); extras.push({ id: uid("x"), cat: "ecran", titre: "", detail: "", garantie: 3, prix: {} }); dessine(); $("x_t_" + extras[extras.length - 1].id).focus(); });
		document.querySelector(".sosp-prix").addEventListener("click", function (e) {
			var dp = e.target.closest("[data-suppr-promo]");
			if (dp) { lirePromos(); promos = promos.filter(function (c) { return c.id !== dp.dataset.supprPromo; }); dessinePromos(); return; }
			var db = e.target.closest("[data-debloquer]");
			if (db) { bloques = bloques.filter(function (d) { return d !== db.dataset.debloquer; }); dessineBloques(); return; }
			var b = e.target.closest("[data-suppr-cat],[data-suppr-extra],[data-tous]"); if (!b) return;
			lire();
			if (b.dataset.supprCat) {
				var id = b.dataset.supprCat;
				if (extras.some(function (x) { return x.cat === id; }) && !confirm("Des prestations sont rangées dans cette catégorie. Elles seront aussi supprimées. Continuer ?")) return;
				cats = cats.filter(function (c) { return c.id !== id; }); extras = extras.filter(function (x) { return x.cat !== id; });
			} else if (b.dataset.supprExtra) {
				extras = extras.filter(function (x) { return x.id !== b.dataset.supprExtra; });
			} else if (b.dataset.tous) {
				var v = val("x_all_" + b.dataset.tous); if (v == null) return;
				var x = extras.filter(function (y) { return y.id === b.dataset.tous; })[0];
				tel.forEach(function (m) { x.prix[m.nom] = v; });
			}
			dessine();
		});
		/* Le nom tapé met à jour les colonnes et les listes, sans toucher aux champs en cours de saisie */
		document.querySelector(".sosp-prix").addEventListener("change", function (e) {
			if (!/^(x_t_|x_c_|c_t_)/.test(e.target.id)) return;
			lire();
			if (/^c_t_/.test(e.target.id)) {
				var C = choixCats();
				extras.forEach(function (x) {
					var sel = $("x_c_" + x.id); if (!sel) return;
					sel.innerHTML = C.map(function (c) { return '<option value="' + c.id + '"' + (c.id === x.cat ? " selected" : "") + ">" + esc(c.nom) + "</option>"; }).join("");
				});
			}
			dessineTable();
		});

		/* ── Envoi : tout part en JSON ── */
		$("sospForm").addEventListener("submit", function (ev) {
			if (ev.submitter && ev.submitter.name === "sosp_reset") return;
			lire();
			var vides = extras.filter(function (x) { return !x.titre; }).length + cats.filter(function (c) { return !c.titre; }).length;
			if (vides && !confirm(vides + " ligne(s) sans nom seront ignorées. Enregistrer quand même ?")) { ev.preventDefault(); return; }
			lirePromos();
			var out = { general: {}, modeles: prixModeles, cats: cats.filter(function (c) { return c.titre; }), extras: extras.filter(function (x) { return x.titre; }),
				promos: promos.filter(function (c) { return c.code && c.taux; }).map(function (c) { return { code: c.code, taux: c.taux, mois: c.mois }; }),
				bloques: bloques, fermes: [].map.call(document.querySelectorAll(".sosp-ferme:checked"), function (x) { return +x.value; }) };
			G.forEach(function (g) { var v = val("g_" + g[0]); if (v != null) out.general[g[0]] = v; });
			$("sospJson").value = JSON.stringify(out);
		});
	});
	</script>
	<?php
}
