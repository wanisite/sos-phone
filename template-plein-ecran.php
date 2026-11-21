<?php
/* Gabarit plein écran SOS Phone : uniquement la web app, sans le thème. */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$sosp_html = do_shortcode( '[sos_phone]' );
/* Les emojis restent ceux du téléphone : pas de remplacement par des images. */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<meta name="theme-color" content="#d9122a">
	<?php sosp_tetes_seo(); ?>
	<?php sosp_tetes_webapp(); ?>
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'sosp-plein-ecran' ); ?>>
<?php wp_body_open(); ?>
<?php echo $sosp_html; // phpcs:ignore WordPress.Security.EscapeOutput -- markup du plugin ?>
<?php wp_footer(); ?>
</body>
</html>
