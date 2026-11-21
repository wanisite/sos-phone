<?php
/**
 * SOS Phone — Espace gérant.
 *
 * Une page du site (/espace) avec sa propre connexion, pour changer prix,
 * prestations, codes promo et jours de dispo sans passer par l'admin WordPress.
 * Les données sont les mêmes que la page admin « Prix SOS » (option sosp_prix) :
 * ce qui est enregistré ici est en ligne tout de suite dans le devis.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SOSP_CAP', 'sos_gerer' );

/* ══ Rôle « Gérant SOS » : ne voit que l'espace ══ */

function sosp_espace_roles() {
	if ( ! get_role( 'sos_gerant' ) ) {
		add_role( 'sos_gerant', 'Gérant SOS', array( 'read' => true, SOSP_CAP => true ) );
	}
	$admin = get_role( 'administrator' );
	if ( $admin && ! $admin->has_cap( SOSP_CAP ) ) {
		$admin->add_cap( SOSP_CAP );
	}
}
add_action( 'init', 'sosp_espace_roles' );

/* Page /espace créée automatiquement si elle n'existe pas. */
function sosp_espace_page_id() {
	$id = (int) get_option( 'sosp_espace_page' );
	if ( $id && 'page' === get_post_type( $id ) && 'trash' !== get_post_status( $id ) ) {
		return $id;
	}
	$id = wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'Espace gérant',
		'post_name'    => 'espace',
		'post_content' => '[sos_espace]',
	) );
	if ( $id && ! is_wp_error( $id ) ) {
		update_option( 'sosp_espace_page', $id );
		return (int) $id;
	}
	return 0;
}
add_action( 'init', function () {
	if ( is_admin() && current_user_can( 'manage_options' ) ) {
		sosp_espace_page_id();
	}
}, 20 );

function sosp_espace_url() {
	$id = (int) get_option( 'sosp_espace_page' );
	return $id ? get_permalink( $id ) : home_url( '/espace/' );
}

/* Le gérant n'a rien à faire dans l'admin WordPress ni dans la barre d'admin. */
add_action( 'admin_init', function () {
	if ( wp_doing_ajax() || ! is_user_logged_in() ) {
		return;
	}
	$u = wp_get_current_user();
	if ( in_array( 'sos_gerant', (array) $u->roles, true ) && ! current_user_can( 'edit_posts' ) ) {
		wp_safe_redirect( sosp_espace_url() );
		exit;
	}
} );
add_filter( 'show_admin_bar', function ( $show ) {
	return current_user_can( 'edit_posts' ) ? $show : false;
} );
add_filter( 'login_redirect', function ( $to, $req, $user ) {
	if ( $user instanceof WP_User && in_array( 'sos_gerant', (array) $user->roles, true ) ) {
		return sosp_espace_url();
	}
	return $to;
}, 10, 3 );

/* ══ Connexion / déconnexion depuis la page de l'espace ══ */

add_action( 'template_redirect', function () {
	$page = (int) get_option( 'sosp_espace_page' );
	if ( ! $page || ! is_page( $page ) ) {
		return;
	}
	nocache_headers();
	if ( isset( $_GET['sortir'] ) && is_user_logged_in() ) {
		check_admin_referer( 'sosp_sortir' );
		wp_logout();
		wp_safe_redirect( sosp_espace_url() );
		exit;
	}
	if ( 'POST' === ( $_SERVER['REQUEST_METHOD'] ?? '' ) && isset( $_POST['sosp_login'] ) ) {
		if ( ! wp_verify_nonce( $_POST['_sosp'] ?? '', 'sosp_login' ) ) {
			wp_safe_redirect( add_query_arg( 'erreur', 'session', sosp_espace_url() ) );
			exit;
		}
		$user = wp_signon( array(
			'user_login'    => sanitize_user( wp_unslash( $_POST['identifiant'] ?? '' ) ),
			'user_password' => (string) wp_unslash( $_POST['motdepasse'] ?? '' ),
			'remember'      => ! empty( $_POST['souvenir'] ),
		), is_ssl() );
		if ( is_wp_error( $user ) || ! user_can( $user, SOSP_CAP ) ) {
			if ( ! is_wp_error( $user ) ) {
				wp_logout();
			}
			wp_safe_redirect( add_query_arg( 'erreur', 'identifiants', sosp_espace_url() ) );
			exit;
		}
		wp_safe_redirect( sosp_espace_url() );
		exit;
	}
} );

/* La page de l'espace s'affiche seule, sans le thème. */
add_filter( 'template_include', function ( $tpl ) {
	$page = (int) get_option( 'sosp_espace_page' );
	if ( $page && is_page( $page ) ) {
		return SOSP_DIR . 'template-espace.php';
	}
	return $tpl;
}, 20 );

/* ══ API de l'espace (lecture / enregistrement), réservée au gérant ══ */

add_action( 'rest_api_init', function () {
	register_rest_route( 'sos-phone/v1', '/espace', array(
		array(
			'methods'             => 'GET',
			'permission_callback' => function () { return current_user_can( SOSP_CAP ); },
			'callback'            => function () {
				$r = new WP_REST_Response( array( 'prix' => sosp_prix_get(), 'maj' => (int) get_option( 'sosp_prix_maj' ) ) );
				$r->header( 'Cache-Control', 'no-store' );
				return $r;
			},
		),
		array(
			'methods'             => 'POST',
			'permission_callback' => function () { return current_user_can( SOSP_CAP ); },
			'callback'            => function ( WP_REST_Request $req ) {
				$raw = json_decode( $req->get_body(), true );
				if ( ! is_array( $raw ) ) {
					return new WP_REST_Response( array( 'ok' => false, 'message' => 'Données illisibles.' ), 400 );
				}
				$propre = sosp_prix_nettoie( $raw );
				update_option( 'sosp_prix', wp_json_encode( $propre ), false );
				update_option( 'sosp_prix_maj', time(), false );
				return new WP_REST_Response( array( 'ok' => true, 'prix' => $propre, 'maj' => time() ) );
			},
		),
	) );
} );

/* L'admin « Prix SOS » note aussi l'heure de mise à jour. */
add_action( 'update_option_sosp_prix', function () {
	update_option( 'sosp_prix_maj', time(), false );
} );

/* ══ Shortcode (rendu dans template-espace.php) ══ */

add_shortcode( 'sos_espace', function () {
	return '<div id="sosEspace"></div>';
} );

function sosp_espace_enqueue() {
	$u = SOSP_URL . 'assets/';
	wp_enqueue_style( 'sosp-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,400..500&family=Outfit:wght@200..600&family=Unbounded:wght@700;800&display=swap', array(), null );
	wp_enqueue_style( 'sosp-espace', $u . 'espace.css', array( 'sosp-fonts' ), sosp_ver( 'espace.css' ) );
	wp_enqueue_script( 'sosp-config', $u . 'config.js', array(), sosp_ver( 'config.js' ), true );
	wp_enqueue_script( 'sosp-prix', $u . 'prix.js', array( 'sosp-config' ), sosp_ver( 'prix.js' ), true );
	/* L'espace garde les prix d'origine intacts et applique lui-même les prix enregistrés (rechargeables à chaud). */
	wp_add_inline_script( 'sosp-prix', sosp_prix_js_applique() . "\nwindow.SOSP_PRIX_ENREG = " . wp_json_encode( sosp_prix_get() ) . ';' );
	wp_enqueue_script( 'sosp-espace', $u . 'espace.js', array( 'sosp-prix' ), sosp_ver( 'espace.js' ), true );
	$user = wp_get_current_user();
	wp_add_inline_script( 'sosp-espace', 'window.SOSP_ESPACE = ' . wp_json_encode( array(
		'api'    => esc_url_raw( rest_url( 'sos-phone/v1/espace' ) ),
		'nonce'  => wp_create_nonce( 'wp_rest' ),
		'prenom' => $user->display_name,
		'photos' => $u . 'photos/',
		'logo'   => $u . 'logo.jpg',
		'site'   => home_url( '/' ),
		'sortir' => wp_nonce_url( add_query_arg( 'sortir', 1, sosp_espace_url() ), 'sosp_sortir' ),
	) ) . ';', 'before' );
}

/* L'espace gérant ne doit jamais apparaître sur Google. */
add_filter( 'wp_robots', function ( $r ) {
	$page = (int) get_option( 'sosp_espace_page' );
	if ( $page && is_page( $page ) ) {
		return array( 'noindex' => true, 'nofollow' => true );
	}
	return $r;
}, 20 );
add_filter( 'wp_sitemaps_posts_query_args', function ( $args, $type ) {
	$page = (int) get_option( 'sosp_espace_page' );
	if ( 'page' === $type && $page ) {
		$args['post__not_in'] = array_merge( (array) ( $args['post__not_in'] ?? array() ), array( $page ) );
	}
	return $args;
}, 10, 2 );
