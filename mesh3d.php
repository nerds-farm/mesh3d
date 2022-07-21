<?php

/**
 *
 * @wordpress-plugin
 * Plugin Name:       Mesh3D
 * Plugin URI:        https://3deven.com/mesh3d-for-elementor/
 * Description:       Manage 3D object into your page with Elementor 
 * Version:           1.0
 * Author:            Nerds Farm
 * Author URI:        https://nerds.farm
 * Text Domain:       mesh3d
 * Domain Path:       /languages
 * License:           GPL-3.0
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Elementor tested up to: 3.7.0
 * Elementor PRO tested up to: 3.8.0
 *
 */
// If this file is called directly, abort.
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('MESH_3D_URL', plugins_url(DIRECTORY_SEPARATOR, __FILE__));
define('MESH_3D_PATH', plugin_dir_path(__FILE__));

/**
 * Load Elements
 *
 * Load the plugin after Elementor (and other plugins) are loaded.
 *
 * @since 0.1.0
 */
function elementor_mesh3d_load_plugin() {
    // Load localization file
    load_plugin_textdomain('mesh3d');
    // Notice if the Elementor is not active
    if (did_action('elementor/loaded')) {
        // Require the main plugin file
        require_once( __DIR__ . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'plugin.php' );
        $plugin = \Mesh3d\Plugin::instance();
        do_action('elementor/mesh3d/loaded');
    } else {
        add_action('admin_notices', function() {
            $message = esc_html__('You need to activate "Elementor Free" in order to use "Mesh 3D" plugin.', 'elementor');
            echo '<div class="notice notice-error"><p>' . $message . '</p></div>';
        });
        return;
    }
}
add_action('plugins_loaded', 'elementor_mesh3d_load_plugin');

