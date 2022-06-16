<?php

namespace Mesh3d\Base\Traits;

use Mesh3d\Core\Utils;

/**
 * @author francesco
 */
trait Base {

    public $base_url = 'https://nerds.farm';

    // the Post ID on site
    public function get_pid() {
        return 0;
    }

    // alias
    public function get_docs() {
        return $this->get_custom_help_url();
    }

    public function get_custom_help_url() {
        return $this->base_url . ($this->get_pid() ? '/?p=' . $this->get_pid() : '');
    }

    /**
     * Show in settings.
     *
     * Whether to show the base in the settings panel or not.
     *
     * @since 1.0.0
     * @access public
     *
     * @return bool Whether to show the base in the panel.
     */
    public function show_in_settings() {
        return true;
    }

    /**
     * @since 2.0.0
     * @access public
     */
    public function get_reflection() {
        if (property_exists($this, 'reflection')) {
            if ( null === $this->reflection ) {
                    $this->reflection = new \ReflectionClass( $this );
            }
            return $this->reflection;
        }
        return new \ReflectionClass($this);
    }

    /**
     * Get element icon.
     *
     * Retrieve the element icon.
     *
     * @since 1.0.0
     * @access public
     *
     * @return string Element icon.
     */
    public function get_icon() {
        /* if (method_exists($this, 'get_icon')) {
          return $this->get_icon();
          } */
        $icon = 'eadd-logo-e-add';
        return $icon;
    }

    /**
     * Get Name
     *
     * Get the name of the module
     *
     * @since  1.0.1
     * @return string
     */
    public function get_name() {
        $assets_name = get_class($this);
        $tmp = explode('\\', $assets_name);
        $module = end($tmp);
        $module = Utils::camel_to_slug($module);
        return $module;
    }

    public function get_title() {
        $assets_name = get_class($this);
        $tmp = explode('\\', $assets_name);
        $module = end($tmp);
        $module = str_replace('_', ' ', $module);
        return $module;
    }

    public function get_plugin_name() {
        $widget_class = get_class($this);
        $tmp = explode('\\', $widget_class);
        $plugin = reset($tmp);
        $plugin = Utils::camel_to_slug($plugin);
        return $plugin;
    }

    public function get_plugin_url() {
        return WP_PLUGIN_URL . '/' . $this->get_plugin_name() . '/';
    }

    public function get_plugin_path() {
        $wp_plugin_dir = Utils::get_wp_plugin_dir();
        return $wp_plugin_dir . DIRECTORY_SEPARATOR . $this->get_plugin_name() . '/';
    }

    public function get_module($slug = '') {
        if (!$slug) {
            $slug = $this->get_module_slug();
        }
        $module = \Mesh3d\Plugin::instance()->modules_manager->get_modules($slug);
        return $module;
    }

    public function get_module_url() {
        $widget_class = get_class($this);
        $tmp = explode('\\', $widget_class);
        array_pop($tmp);
        array_pop($tmp);
        $module_path = implode('/', $tmp);
        $module_path = Utils::camel_to_slug($module_path);
        $url = WP_PLUGIN_URL . '/' . $module_path . '/';
        $url = str_replace('/-', '/', $url);
        return $url;
    }

    public function get_module_path() {
        $wp_plugin_dir = Utils::get_wp_plugin_dir();
        $widget_class = get_class($this);
        $tmp = explode('\\', $widget_class);
        array_pop($tmp);
        array_pop($tmp);
        $module_path = implode(DIRECTORY_SEPARATOR, $tmp);
        $module_path = Utils::camel_to_slug($module_path);
        return $wp_plugin_dir . DIRECTORY_SEPARATOR . $module_path . DIRECTORY_SEPARATOR;
    }

    public function get_module_slug() {
        $widget_class = get_class($this);
        $tmp = explode('\\', $widget_class);
        array_pop($tmp);
        array_pop($tmp);
        $module_ns = array_pop($tmp);
        $module_slug = Utils::camel_to_slug($module_ns);
        return $module_slug;
    }

    /* ASSETS */

    public function _enqueue_scripts() {
        $scripts = $this->get_script_depends();
        if (!empty($scripts)) {
            foreach ($scripts as $script) {
                wp_enqueue_script($script);
            }
        }
    }

    public function _enqueue_styles() {
        $styles = $this->get_style_depends();
        if (!empty($styles)) {
            foreach ($styles as $style) {
                wp_enqueue_style($style);
            }
        }
    }

    public function _print_styles() {
        $styles = $this->get_style_depends();
        if (!empty($styles)) {
            foreach ($styles as $style) {
                wp_print_styles(array($style));
            }
        }
    }

    public function _print_scripts() {
        $scripts = $this->get_script_depends();
        if (!empty($scripts)) {
            foreach ($scripts as $script) {
                wp_print_scripts(array($script));
            }
        }
    }

    public function enqueue() {
        $this->_enqueue_styles();
        $this->_enqueue_scripts();
    }

    public function print_assets() {
        $this->_print_styles();
        $this->_print_scripts();
    }

    public function get_script_depends() {
        if (property_exists($this, 'depended_scripts')) {
            return $this->depended_scripts;
        }
        return [];
    }

    public function get_style_depends() {
        if (property_exists($this, 'depended_styles')) {
            return $this->depended_styles;
        }
        return [];
    }

    public function register_script($js_file, $deps = array()) {
        $js_name = pathinfo($js_file, PATHINFO_FILENAME);
        wp_deregister_script($js_name);

        $js_path = $this->get_module_url() . $js_file;
        $deps[] = 'elementor-frontend';
        return wp_register_script(
                $js_name, $js_path, $deps, null, true
        );
    }

    public function register_style($css_file, $deps = array()) {
        $css_name = pathinfo($css_file, PATHINFO_FILENAME);
        wp_deregister_style($css_name);

        $css_path = $this->get_module_url() . $css_file;
        return wp_register_style(
                $css_name, $css_path, $deps
        );
    }

    public function get_dynamic_settings($setting_key = null, $fields = array()) {
        $settings = parent::get_settings_for_display($setting_key);
        $settings = Utils::get_dynamic_data($settings, $fields);
        return $settings;
    }

    final public function update_setting($key, $value = null, $element = null) {
        if (!$element) {
            $element = $this;
        }
        $element_id = $element->get_id();
        //Utils::set_settings_by_element_id($element_id, $key, $value);
        $element->set_settings($key, $value);
    }

    /**
     * Get default child type.
     *
     * Retrieve the widget child type based on element data.
     *
     * @since 1.0.0
     * @access protected
     *
     * @param array $element_data Widget ID.
     *
     * @return array|false Child type or false if it's not a valid widget.
     */
    protected function _get_default_child_type(array $element_data) {
        return \Elementor\Plugin::$instance->elements_manager->get_element_types('section');
    }

    public function start_controls_e_section($widget, $tab = 'advanced', $label = '') {
        if (!$label) {
            $label = $this->get_label();
        }
        $widget->start_controls_section(
                'section_' . $this->get_name(),
                [
                    'label' => $label,
                    'tab' => $tab,
                ]
        );
    }

}
