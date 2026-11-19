<?php
/* Espace gérant SOS Phone : connexion, puis l'appli de gestion. Sans le thème. */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$sosp_connecte = is_user_logged_in() && current_user_can( SOSP_CAP );
if ( $sosp_connecte ) {
	sosp_espace_enqueue();
} else {
	wp_enqueue_style( 'sosp-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,400..500&family=Outfit:wght@200..600&family=Unbounded:wght@700;800&display=swap', array(), null );
	wp_enqueue_style( 'sosp-espace', SOSP_URL . 'assets/espace.css', array( 'sosp-fonts' ), sosp_ver( 'espace.css' ) );
}
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
$sosp_err = sanitize_key( $_GET['erreur'] ?? '' );
?><!doctype html>
<html lang="fr">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<meta name="theme-color" content="#d9122a">
	<meta name="robots" content="noindex, nofollow">
	<title>Espace gérant · SOS Phone</title>
	<?php sosp_tetes_webapp(); ?>
	<?php wp_head(); ?>
</head>
<body class="esp-body">
<?php if ( ! $sosp_connecte ) : ?>
	<main class="esp-login">
		<div class="esp-login-carte">
			<img class="esp-login-logo" src="<?php echo esc_url( SOSP_URL . 'assets/logo.jpg' ); ?>" alt="" width="84" height="84">
			<h1><span class="esp-sos">SOS</span> Phone</h1>
			<p class="esp-login-s">Espace gérant : tes prix, tes prestations, tes codes promo et tes jours de dispo.</p>
			<?php if ( 'identifiants' === $sosp_err ) : ?>
				<p class="esp-erreur">Identifiant ou mot de passe incorrect.</p>
			<?php elseif ( 'session' === $sosp_err ) : ?>
				<p class="esp-erreur">La page a expiré, réessaie.</p>
			<?php endif; ?>
			<form method="post" action="<?php echo esc_url( sosp_espace_url() ); ?>" class="esp-form">
				<?php wp_nonce_field( 'sosp_login', '_sosp' ); ?>
				<input type="hidden" name="sosp_login" value="1">
				<label>Identifiant<input name="identifiant" autocomplete="username" required autocapitalize="none"></label>
				<label>Mot de passe<input name="motdepasse" type="password" autocomplete="current-password" required></label>
				<label class="esp-souvenir"><input type="checkbox" name="souvenir" value="1" checked> Rester connecté</label>
				<button type="submit" class="esp-btn">Se connecter</button>
			</form>
			<a class="esp-oubli" href="<?php echo esc_url( wp_lostpassword_url( sosp_espace_url() ) ); ?>">Mot de passe oublié ?</a>
		</div>
	</main>
<?php else : ?>
	<?php echo do_shortcode( '[sos_espace]' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
<?php endif; ?>
<?php wp_footer(); ?>
</body>
</html>
