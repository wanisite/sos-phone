<?php
/**
 * Plugin Name: SOS Phone — Devis réparation
 * Description: Web app de devis SOS Phone (modèle → panne → département → urgence → numéro → prix). Shortcode [sos_phone]. Les demandes arrivent dans « Demandes SOS ».
 * Version: 1.5.1
 * Author: SOS Phone
 * Text Domain: sos-phone
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SOSP_VERSION', '1.5.1' );
define( 'SOSP_URL', plugin_dir_url( __FILE__ ) );
define( 'SOSP_DIR', plugin_dir_path( __FILE__ ) );
require_once SOSP_DIR . 'prix-admin.php';
require_once SOSP_DIR . 'espace.php';

/* ══ Réglages ══════════════════════════════════════════════════ */

function sosp_defaults() {
	return array(
		'whatsapp'      => '33749015531',
		'numero_appel'  => '',
		'instagram'     => 'sosphoneparis75',
		'heure_debut'   => 9,
		'heure_fin'     => 21,
		'email_notif'   => '',
		'pleine_page'   => 1,
		'auto_maj'      => 1,
		'depot'         => 'wanisite/sos-phone',
	);
}

function sosp_opts() {
	return wp_parse_args( get_option( 'sosp_options', array() ), sosp_defaults() );
}

add_action( 'admin_menu', function () {
	add_options_page( 'SOS Phone', 'SOS Phone', 'manage_options', 'sos-phone', 'sosp_settings_page' );
} );

add_action( 'admin_init', function () {
	register_setting( 'sosp', 'sosp_options', array(
		'sanitize_callback' => function ( $in ) {
			$d = sosp_defaults();
			return array(
				'whatsapp'      => preg_replace( '/\D/', '', $in['whatsapp'] ?? '' ),
				'numero_appel'  => sanitize_text_field( $in['numero_appel'] ?? '' ),
				'instagram'     => preg_replace( '/[^A-Za-z0-9._]/', '', ltrim( $in['instagram'] ?? '', '@' ) ),
				'heure_debut'   => max( 0, min( 23, (int) ( $in['heure_debut'] ?? $d['heure_debut'] ) ) ),
				'heure_fin'     => max( 1, min( 24, (int) ( $in['heure_fin'] ?? $d['heure_fin'] ) ) ),
				'email_notif'   => sanitize_email( $in['email_notif'] ?? '' ),
				'pleine_page'   => empty( $in['pleine_page'] ) ? 0 : 1,
				'auto_maj'      => empty( $in['auto_maj'] ) ? 0 : 1,
				'depot'         => preg_replace( '#[^A-Za-z0-9._/-]#', '', $in['depot'] ?? $d['depot'] ),
			);
		},
	) );
} );

function sosp_settings_page() {
	$o = sosp_opts();
	?>
	<div class="wrap">
		<h1>SOS Phone — Réglages</h1>
		<p>Place le shortcode <code>[sos_phone]</code> sur une page. Une page « Devis » a été créée à l'activation.</p>
		<form method="post" action="options.php">
			<?php settings_fields( 'sosp' ); ?>
			<table class="form-table" role="presentation">
				<tr><th><label for="w">WhatsApp</label></th>
					<td><input id="w" class="regular-text" name="sosp_options[whatsapp]" value="<?php echo esc_attr( $o['whatsapp'] ); ?>" placeholder="33612345678">
					<p class="description">Indicatif + numéro, sans + ni espace. Vide = pas de bouton WhatsApp.</p></td></tr>
				<tr><th><label for="n">Numéro d'appel affiché</label></th>
					<td><input id="n" class="regular-text" name="sosp_options[numero_appel]" value="<?php echo esc_attr( $o['numero_appel'] ); ?>" placeholder="06 12 34 56 78">
					<p class="description">Affiché sur la confirmation : « L'appel viendra du … ».</p></td></tr>
				<tr><th><label for="ig">Instagram</label></th>
					<td>@<input id="ig" class="regular-text" name="sosp_options[instagram]" value="<?php echo esc_attr( $o['instagram'] ); ?>">
					<p class="description">Nom du compte, sans @. Vide = lien masqué.</p></td></tr>
				<tr><th>Heures d'appel (Paris)</th>
					<td><input type="number" min="0" max="23" name="sosp_options[heure_debut]" value="<?php echo (int) $o['heure_debut']; ?>" style="width:70px"> h à
						<input type="number" min="1" max="24" name="sosp_options[heure_fin]" value="<?php echo (int) $o['heure_fin']; ?>" style="width:70px"> h</td></tr>
				<tr><th><label for="e">Email de notification</label></th>
					<td><input id="e" class="regular-text" type="email" name="sosp_options[email_notif]" value="<?php echo esc_attr( $o['email_notif'] ); ?>">
					<p class="description">Reçoit un email à chaque nouvelle demande. Vide = pas d'email.</p></td></tr>
				<tr><th>Mises à jour auto</th>
					<td><label><input type="checkbox" name="sosp_options[auto_maj]" value="1" <?php checked( $o['auto_maj'] ); ?>> Charger le design, l'appli et les prix depuis GitHub</label>
					<p>Dépôt public : <input class="regular-text" name="sosp_options[depot]" value="<?php echo esc_attr( $o['depot'] ); ?>"></p>
					<p class="description">Chaque modification poussée sur ce dépôt arrive ici en 2 minutes environ. Si GitHub ne répond pas, la copie locale est utilisée.<?php $b = sosp_base(); echo $b ? ' <strong>Actif :</strong> <code>' . esc_html( $b ) . '</code>' : ' <strong>Copie locale utilisée.</strong>'; ?></p></td></tr>
				<tr><th>Affichage</th>
					<td><label><input type="checkbox" name="sosp_options[pleine_page]" value="1" <?php checked( $o['pleine_page'] ); ?>> Page plein écran (sans l'en-tête et le pied de page du thème)</label></td></tr>
			</table>
			<?php submit_button(); ?>
		</form>
		<p>Les prix se modifient dans <code>wp-content/plugins/sos-phone-devis/assets/prix.js</code> et les codes promo dans <code>assets/config.js</code>.</p>
	</div>
	<?php
}

/* ══ Demandes (type de contenu) ════════════════════════════════ */

add_action( 'init', function () {
	register_post_type( 'sos_demande', array(
		'labels'          => array(
			'name'          => 'Demandes SOS',
			'singular_name' => 'Demande SOS',
			'menu_name'     => 'Demandes SOS',
			'edit_item'     => 'Demande',
		),
		'public'          => false,
		'show_ui'         => true,
		'menu_icon'       => 'dashicons-smartphone',
		'menu_position'   => 25,
		'supports'        => array( 'title' ),
		'capability_type' => 'post',
		'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
		'map_meta_cap'    => true,
	) );
} );

add_filter( 'manage_sos_demande_posts_columns', function () {
	return array(
		'cb'     => '<input type="checkbox">',
		'title'  => 'Demande',
		'tel'    => 'Téléphone',
		'dep'    => 'Département',
		'urg'    => 'Créneau',
		'adr'    => 'Adresse',
		'total'  => 'Total',
		'etape'  => 'Étape',
		'date'   => 'Date',
	);
} );

add_action( 'manage_sos_demande_posts_custom_column', function ( $col, $id ) {
	$map = array( 'tel' => 'telephone', 'dep' => 'departement', 'urg' => 'urgence', 'etape' => 'etape', 'adr' => 'adresse' );
	if ( isset( $map[ $col ] ) ) {
		$v = get_post_meta( $id, '_sos_' . $map[ $col ], true );
		if ( 'adr' === $col && $v ) {
			$c = get_post_meta( $id, '_sos_carte', true );
			echo esc_html( $v ) . ( $c ? ' <a href="' . esc_url( $c ) . '" target="_blank" rel="noopener">Carte</a>' : '' );
		} elseif ( 'tel' === $col && $v ) {
			echo '<a href="tel:' . esc_attr( $v ) . '">' . esc_html( $v ) . '</a>';
		} else {
			echo esc_html( $v );
		}
	}
	if ( 'total' === $col ) {
		$t = get_post_meta( $id, '_sos_total', true );
		echo '' === $t ? 'Devis' : esc_html( number_format_i18n( (float) $t, 2 ) . ' €' );
	}
}, 10, 2 );

add_action( 'add_meta_boxes_sos_demande', function () {
	add_meta_box( 'sos_detail', 'Détail', function ( $post ) {
		$d = json_decode( get_post_meta( $post->ID, '_sos_json', true ), true );
		if ( ! $d ) {
			echo '<p>Aucun détail.</p>';
			return;
		}
		echo '<table class="widefat striped"><tbody>';
		foreach ( array( 'code' => 'Code', 'telephone' => 'Téléphone', 'departement' => 'Département', 'urgence' => 'Créneau', 'adresse' => 'Adresse', 'promo' => 'Code promo', 'source' => 'Source', 'etape' => 'Étape' ) as $k => $l ) {
			echo '<tr><th style="width:160px">' . esc_html( $l ) . '</th><td>' . esc_html( $d[ $k ] ?? '' ) . '</td></tr>';
		}
		if ( ! empty( $d['carte'] ) ) {
			echo '<tr><th>Carte</th><td><a href="' . esc_url( $d['carte'] ) . '" target="_blank" rel="noopener">Ouvrir dans Google Maps</a></td></tr>';
		}
		echo '</tbody></table>';
		foreach ( (array) ( $d['telephones'] ?? array() ) as $p ) {
			echo '<h3>' . esc_html( $p['modele'] ?? '' ) . '</h3>';
			if ( ! empty( $p['description'] ) ) {
				echo '<p><em>« ' . esc_html( $p['description'] ) . ' »</em></p>';
			}
			echo '<ul>';
			foreach ( (array) ( $p['reparations'] ?? array() ) as $r ) {
				$prix = null === ( $r['prix'] ?? null ) ? 'devis' : ( (float) $r['prix'] ) . ' €';
				echo '<li>' . esc_html( trim( ( $r['panne'] ?? '' ) . ' ' . ( $r['gamme'] ?? '' ) ) . ' — ' . $prix ) . '</li>';
			}
			echo '</ul>';
		}
		$t = $d['total'] ?? null;
		echo '<p><strong>Total : ' . esc_html( null === $t ? 'à chiffrer' : number_format_i18n( (float) $t, 2 ) . ' €' ) . '</strong></p>';
	}, 'sos_demande', 'normal', 'high' );
} );

/* ══ Réception des demandes (REST) ═════════════════════════════ */

add_action( 'rest_api_init', function () {
	register_rest_route( 'sos-phone/v1', '/lead', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => 'sosp_rest_lead',
	) );
} );

function sosp_clean( $v, $max = 300 ) {
	return mb_substr( sanitize_text_field( (string) $v ), 0, $max );
}

function sosp_rest_lead( WP_REST_Request $req ) {
	$d = json_decode( $req->get_body(), true );
	if ( ! is_array( $d ) || empty( $d['code'] ) ) {
		return new WP_REST_Response( array( 'ok' => false ), 400 );
	}

	/* Anti-abus léger : 30 envois / heure / IP. */
	$ip  = md5( $_SERVER['REMOTE_ADDR'] ?? '' );
	$key = 'sosp_rl_' . $ip;
	$n   = (int) get_transient( $key );
	if ( $n > 30 ) {
		return new WP_REST_Response( array( 'ok' => false ), 429 );
	}
	set_transient( $key, $n + 1, HOUR_IN_SECONDS );

	$lead = array(
		'code'        => sosp_clean( $d['code'], 20 ),
		'etape'       => sosp_clean( $d['etape'] ?? '', 30 ),
		'telephone'   => sosp_clean( $d['telephone'] ?? '', 25 ),
		'departement' => sosp_clean( $d['departement'] ?? '', 60 ),
		'urgence'     => sosp_clean( $d['urgence'] ?? '', 80 ),
		'adresse'     => sosp_clean( $d['adresse'] ?? '', 250 ),
		'carte'       => esc_url_raw( (string) ( $d['carte'] ?? '' ) ),
		'promo'       => sosp_clean( $d['promo'] ?? '', 20 ),
		'source'      => sosp_clean( $d['source'] ?? '', 60 ),
		'total'       => isset( $d['total'] ) && is_numeric( $d['total'] ) ? round( (float) $d['total'], 2 ) : null,
		'telephones'  => array(),
	);
	foreach ( array_slice( (array) ( $d['telephones'] ?? array() ), 0, 10 ) as $p ) {
		$reps = array();
		foreach ( array_slice( (array) ( $p['reparations'] ?? array() ), 0, 15 ) as $r ) {
			$reps[] = array(
				'panne' => sosp_clean( $r['panne'] ?? '', 60 ),
				'gamme' => sosp_clean( $r['gamme'] ?? '', 60 ),
				'prix'  => isset( $r['prix'] ) && is_numeric( $r['prix'] ) ? (float) $r['prix'] : null,
			);
		}
		$lead['telephones'][] = array(
			'modele'      => sosp_clean( $p['modele'] ?? '', 80 ),
			'description' => sosp_clean( $p['description'] ?? '', 1000 ),
			'reparations' => $reps,
		);
	}

	/* Une demande = un code : les étapes suivantes mettent à jour la même fiche. */
	$existing = get_posts( array(
		'post_type'   => 'sos_demande',
		'post_status' => 'any',
		'meta_key'    => '_sos_code',
		'meta_value'  => $lead['code'],
		'numberposts' => 1,
		'fields'      => 'ids',
	) );
	$modeles = implode( ' + ', wp_list_pluck( $lead['telephones'], 'modele' ) );
	$title   = $lead['code'] . ' · ' . ( 'rappel' === $lead['etape'] ? '📞 À rappeler' . ( $modeles ? ' · ' . $modeles : '' ) : ( $modeles ?: 'Demande' ) );
	$id      = $existing ? $existing[0] : 0;
	$id      = wp_insert_post( array(
		'ID'          => $id,
		'post_type'   => 'sos_demande',
		'post_status' => 'publish',
		'post_title'  => $title,
	) );
	if ( is_wp_error( $id ) || ! $id ) {
		return new WP_REST_Response( array( 'ok' => false ), 500 );
	}
	foreach ( array( 'code', 'etape', 'telephone', 'departement', 'urgence', 'adresse', 'carte' ) as $k ) {
		update_post_meta( $id, '_sos_' . $k, $lead[ $k ] );
	}
	update_post_meta( $id, '_sos_total', null === $lead['total'] ? '' : $lead['total'] );
	update_post_meta( $id, '_sos_json', wp_slash( wp_json_encode( $lead, JSON_UNESCAPED_UNICODE ) ) );

	$o = sosp_opts();
	if ( $o['email_notif'] && in_array( $lead['etape'], array( 'rdv', 'envoi_postal', 'hors_zone' ), true ) ) {
		$body  = "Nouvelle demande SOS Phone\n\n";
		$body .= "Code : {$lead['code']}\nTéléphone : {$lead['telephone']}\nDépartement : {$lead['departement']}\nCréneau : {$lead['urgence']}\nAdresse : {$lead['adresse']}\n" . ( $lead['carte'] ? "Carte : {$lead['carte']}\n" : '' );
		$body .= 'Total : ' . ( null === $lead['total'] ? 'à chiffrer' : $lead['total'] . ' €' ) . "\n\n";
		foreach ( $lead['telephones'] as $p ) {
			$body .= "— {$p['modele']}\n";
			foreach ( $p['reparations'] as $r ) {
				$body .= '   ' . trim( $r['panne'] . ' ' . $r['gamme'] ) . ' : ' . ( null === $r['prix'] ? 'devis' : $r['prix'] . ' €' ) . "\n";
			}
			if ( $p['description'] ) {
				$body .= "   « {$p['description']} »\n";
			}
		}
		$body .= "\n" . admin_url( 'post.php?post=' . $id . '&action=edit' );
		wp_mail( $o['email_notif'], '[SOS Phone] ' . $title, $body );
	}

	return new WP_REST_Response( array( 'ok' => true ), 200 );
}

/* ══ Affichage ═════════════════════════════════════════════════ */

/* Version des fichiers = date de modification : le navigateur recharge après chaque mise à jour. */
function sosp_ver( $f ) {
	$t = @filemtime( SOSP_DIR . 'assets/' . $f );
	return $t ? SOSP_VERSION . '.' . $t : SOSP_VERSION;
}

/* ══ Mises à jour automatiques ══
   Le dernier commit du dépôt public est lu sur GitHub (mis en cache 2 min),
   puis les fichiers sont servis par jsDelivr à ce commit précis. */
function sosp_base() {
	$o = sosp_opts();
	if ( empty( $o['auto_maj'] ) || ! preg_match( '#^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$#', $o['depot'] ) ) {
		return '';
	}
	$key = 'sosp_sha_' . md5( $o['depot'] );
	$sha = get_transient( $key );
	if ( false === $sha ) {
		$r   = wp_remote_get( 'https://api.github.com/repos/' . $o['depot'] . '/commits/main', array(
			'timeout' => 3,
			'headers' => array( 'Accept' => 'application/vnd.github.sha', 'User-Agent' => 'sos-phone-wp' ),
		) );
		$sha = ( ! is_wp_error( $r ) && 200 === wp_remote_retrieve_response_code( $r ) ) ? trim( wp_remote_retrieve_body( $r ) ) : '';
		if ( ! preg_match( '/^[0-9a-f]{40}$/', $sha ) ) {
			$sha = '';
		}
		set_transient( $key, $sha, $sha ? 2 * MINUTE_IN_SECONDS : 10 * MINUTE_IN_SECONDS );
	}
	return $sha ? 'https://cdn.jsdelivr.net/gh/' . $o['depot'] . '@' . $sha . '/assets/' : '';
}

function sosp_asset( $f ) {
	$b = sosp_base();
	return $b ? array( $b . $f, null ) : array( SOSP_URL . 'assets/' . $f, sosp_ver( $f ) );
}

function sosp_enqueue() {
	$o = sosp_opts();
	wp_enqueue_style( 'sosp-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,400..500&family=Outfit:wght@200..600&family=Unbounded:wght@700;800&display=swap', array(), null );
	wp_enqueue_style( 'sosp', sosp_asset( 'style.css' )[0], array( 'sosp-fonts' ), sosp_asset( 'style.css' )[1] );
	wp_enqueue_script( 'sosp-config', sosp_asset( 'config.js' )[0], array(), sosp_asset( 'config.js' )[1], true );
	wp_add_inline_script( 'sosp-config', 'Object.assign(CONFIG,' . wp_json_encode( array(
		'WHATSAPP'          => $o['whatsapp'],
		'NUMERO_APPEL'      => $o['numero_appel'],
		'INSTAGRAM'         => $o['instagram'],
		'HEURE_DEBUT_APPEL' => (int) $o['heure_debut'],
		'HEURE_FIN_APPEL'   => (int) $o['heure_fin'],
		'WEBHOOK'           => rest_url( 'sos-phone/v1/lead' ),
		'ACCUEIL_URL'       => home_url( '/' ),
	) ) . ');' );
	wp_enqueue_script( 'sosp-prix', sosp_asset( 'prix.js' )[0], array( 'sosp-config' ), sosp_asset( 'prix.js' )[1], true );
	sosp_prix_inline_site();
	wp_enqueue_script( 'sosp-app', sosp_asset( 'app.js' )[0], array( 'sosp-prix' ), sosp_asset( 'app.js' )[1], true );
}

function sosp_markup() {
	$privacy = get_privacy_policy_url();
	ob_start();
	?>
	<div class="sosp-root">
	<div class="app">
		<header class="top">
			<button class="top-back" id="back" type="button" aria-label="Retour" hidden>
				<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
			</button>
			<a class="logo" href="#" id="logo" aria-label="SOS Phone, accueil"><img class="logo-img" src="<?php echo esc_url( SOSP_URL . 'assets/logo.jpg' ); ?>" alt="" width="38" height="38"><span class="logo-txt"><span class="logo-phone"><span class="sos-alarme" aria-hidden="true"><span>SOS</span></span><span class="logo-suite">Phone</span></span><span class="statut" id="statut" aria-live="polite"><i></i>Disponible maintenant</span></span></a>
			<nav class="reseaux" id="reseaux" aria-label="Nos réseaux"></nav>
		</header>
		<div class="progress" id="progress" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
		<main id="view" class="view" tabindex="-1" aria-live="polite"></main>
		<footer class="foot" id="foot">
			<div class="foot-in">
				<div class="foot-marque">
					<p class="foot-logo"><img src="<?php echo esc_url( SOSP_URL . 'assets/logo.jpg' ); ?>" alt="" width="40" height="40" loading="lazy"><span><b>SOS</b> Phone</span></p>
					<p>Réparation de téléphone à domicile, 7j/7, partout en France.</p>
				</div>
				<div class="foot-col">
					<p class="foot-t">Nous joindre</p>
					<ul class="foot-liens" id="footReseaux"></ul>
				</div>
				<div class="foot-col">
					<p class="foot-t">Bon à savoir</p>
					<ul class="foot-infos">
						<li>Prix fixe, pièce et main d'œuvre comprises</li>
						<li>Garantie de 1 à 6 mois selon la pièce</li>
						<li>Déplacement annoncé sur WhatsApp avant de venir</li>
					</ul>
				</div>
			</div>
			<div class="foot-bas">
				<p>© <?php echo esc_html( wp_date( 'Y' ) ); ?> SOS Phone<?php if ( $privacy ) : ?> · <a href="<?php echo esc_url( $privacy ); ?>">Confidentialité</a><?php endif; ?></p>
				<a class="foot-artisan" href="<?php echo esc_url( sosp_espace_url() ); ?>" rel="nofollow"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>Espace artisan</a>
			</div>
			<p class="foot-wani"><a href="https://wanisitelab.com" target="_blank" rel="noopener"><img src="<?php echo esc_url( SOSP_URL . 'assets/wanisite.webp' ); ?>" alt="" width="37" height="24" loading="lazy"><span>Site créé et propulsé par <b>Wanisite</b></span><span class="foot-wani-d">wanisitelab.com</span></a></p>
		</footer>
	</div>
	<div class="toast" id="toast" role="status" hidden></div>
	</div>
	<?php
	return ob_get_clean();
}

add_shortcode( 'sos_phone', function () {
	static $done = false;
	if ( $done ) {
		return ''; // une seule app par page
	}
	$done = true;
	sosp_enqueue();
	return sosp_markup();
} );

/* Web app : icônes, manifeste, mode plein écran sur l'écran d'accueil iPhone. */
function sosp_tetes_webapp() {
	$u = SOSP_URL . 'assets/';
	echo '<link rel="icon" href="' . esc_url( $u . 'favicon.ico' ) . '" sizes="any">' . "\n";
	echo '<link rel="icon" type="image/png" href="' . esc_url( $u . 'favicon-32.png' ) . '" sizes="32x32">' . "\n";
	echo '<link rel="icon" type="image/png" href="' . esc_url( $u . 'favicon-48.png' ) . '" sizes="48x48">' . "\n";
	echo '<link rel="apple-touch-icon" href="' . esc_url( $u . 'icone-180.png' ) . '">' . "\n";
	echo '<link rel="manifest" href="' . esc_url( $u . 'manifest.json' ) . '">' . "\n";
	echo '<meta name="apple-mobile-web-app-capable" content="yes">' . "\n";
	echo '<meta name="mobile-web-app-capable" content="yes">' . "\n";
	echo '<meta name="apple-mobile-web-app-status-bar-style" content="default">' . "\n";
	echo '<meta name="apple-mobile-web-app-title" content="SOS Phone">' . "\n";
}

/* L'appli est en plein écran : pas de barre d'admin WordPress par-dessus (elle décalait l'en-tête). */
add_filter( 'show_admin_bar', function ( $show ) {
	if ( is_admin() || ! is_singular() ) {
		return $show;
	}
	$post = get_queried_object();
	if ( $post && isset( $post->post_content ) && ( has_shortcode( $post->post_content, 'sos_phone' ) || has_shortcode( $post->post_content, 'sos_espace' ) ) ) {
		return false;
	}
	return $show;
}, 20 );

/* Page plein écran : quand une page contient le shortcode, on remplace le gabarit du thème. */
add_filter( 'template_include', function ( $tpl ) {
	if ( ! is_singular() || ! sosp_opts()['pleine_page'] ) {
		return $tpl;
	}
	$post = get_queried_object();
	if ( $post && has_shortcode( $post->post_content, 'sos_phone' ) ) {
		return SOSP_DIR . 'template-plein-ecran.php';
	}
	return $tpl;
} );

/* ══ Activation : crée la page « Devis » et la met en page d'accueil si le site est vierge ══ */

register_activation_hook( __FILE__, function () {
	$existing = get_posts( array( 'post_type' => 'page', 'post_status' => 'any', 's' => '[sos_phone]', 'numberposts' => 1, 'fields' => 'ids' ) );
	if ( $existing ) {
		return;
	}
	$id = wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'Devis réparation',
		'post_name'    => 'devis',
		'post_content' => '[sos_phone]',
	) );
	if ( $id && ! is_wp_error( $id ) && 'posts' === get_option( 'show_on_front' ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $id );
	}
} );

add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), function ( $links ) {
	array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=sos-phone' ) ) . '">Réglages</a>' );
	return $links;
} );
