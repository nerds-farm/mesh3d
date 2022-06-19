<?php

namespace Mesh3d\Base;

use Mesh3d\Core\Utils;
use Elementor\Core\Base\Module;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

abstract class Module_Base extends Module {

    public static $widgets = [];
    public static $actions = [];
    public static $fields = [];
    public static $items = [];
    public static $dynamic_tags = [];

    public function __construct() {

        if ($this->has_elements('controls') || $this->has_elements('controls' . DIRECTORY_SEPARATOR . 'groups')) {
            add_action('elementor/controls/controls_registered', [$this, 'init_controls']);
        }

        if ($this->has_elements('widgets')) {
            add_action('elementor/elements/categories_registered', [$this, 'init_categories']);
            add_action('elementor/widgets/widgets_registered', [$this, 'init_widgets']);
        }

        add_action('admin_enqueue_scripts', [$this, 'init_assets']);
        //add_action('init', [$this, 'init_assets']);

        add_action('elementor/frontend/before_enqueue_styles', [$this, 'init_assets']);
        add_action('elementor/editor/before_enqueue_scripts', [$this, 'init_assets']);
        add_action('elementor/preview/enqueue_styles', [$this, 'init_assets']);
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
        $assets_name = $this->get_reflection()->getNamespaceName();
        $tmp = explode('\\', $assets_name);
        $module = end($tmp);
        $module = Utils::camel_to_slug($module);
        return $module;
    }

    /**
     * Get Name
     *
     * Get the name of the module
     *
     * @since  1.0.1
     * @return string
     */
    public function get_label() {
        $assets_name = $this->get_reflection()->getNamespaceName();
        $tmp = explode('\\', $assets_name);
        $module = end($tmp);
        $module = Utils::camel_to_slug($module, ' ');
        return ucfirst($module);
    }

    public function get_plugin_textdomain() {
        $assets_name = $this->get_reflection()->getNamespaceName();
        $tmp = explode('\\', $assets_name);
        $plugin = reset($tmp);
        $plugin = Utils::camel_to_slug($plugin, '-');
        return $plugin;
    }

    public function get_plugin_path() {
        $wp_plugin_dir = Utils::get_wp_plugin_dir();
        return $wp_plugin_dir . DIRECTORY_SEPARATOR . $this->get_plugin_textdomain() . DIRECTORY_SEPARATOR;
    }

    public function has_elements($folder = 'widgets') {
        $module = $this->get_name();
        $class_name = $this->get_reflection()->getNamespaceName();
        $plugin_path = Utils::get_plugin_path($class_name);
        $path = $plugin_path . 'modules' . DIRECTORY_SEPARATOR . $module . DIRECTORY_SEPARATOR . $folder . DIRECTORY_SEPARATOR;
        if (is_dir($path)) {
            $files = glob($path . '*.php');
            return !empty($files);
        }
        return false;
    }

    public function get_elements($folder = 'widgets', $enabled = true) {
        $elements = array();
        $module = $this->get_name();
        $class_name = $this->get_reflection()->getNamespaceName();
        $plugin_path = Utils::get_plugin_path($class_name);
        $path = $plugin_path . 'modules' . DIRECTORY_SEPARATOR . $module . DIRECTORY_SEPARATOR . $folder . DIRECTORY_SEPARATOR;
        //if ($folder == 'triggers' && $module == 'display') { return $elements; }
        if (is_dir($path)) {

            $files = glob($path . '*.php');
            //$files = array_filter(glob(DIRECTORY_SEPARATOR."*"), 'is_file');

            foreach ($files as $ele) {
                $file = basename($ele);
                $name = pathinfo($file, PATHINFO_FILENAME);
                $elements[] = Utils::slug_to_camel($name, '_');
            }
        }
        return $elements;
    }

    public function init_controls() {
        $controls_manager = \Elementor\Plugin::$instance->controls_manager;
        foreach ($this->get_elements('controls') as $control) {
            $class_name = $this->get_reflection()->getNamespaceName() . '\Controls\\' . $control;
            $control_obj = new $class_name();
            $controls_manager->register($control_obj);
            //$controls_manager->register_control($control_obj->get_type(), $control_obj);
        }
        foreach ($this->get_elements('controls' . DIRECTORY_SEPARATOR . 'groups') as $group) {
            $class_name = $this->get_reflection()->getNamespaceName() . '\Controls\Groups\\' . $group;
            $control_obj = new $class_name();
            $controls_manager->add_group_control($control_obj->get_type(), $control_obj);
        }
    }

    public function init_widgets() {
        $widget_manager = \Elementor\Plugin::instance()->widgets_manager;
        $widgets = $this->get_elements('widgets');
        foreach ($widgets as $widget) {
            $class_name = $this->get_reflection()->getNamespaceName() . '\Widgets\\' . $widget;
            if (empty(self::$widgets[$class_name])) {
                self::$widgets[$class_name] = new $class_name();
            }
            $widget = self::$widgets[$class_name];
            $widget_manager->register_widget_type($widget);
        }
        //var_dump(array_keys($widget_manager->get_widget_types()));
    }

    public function init_categories($elements) {
        foreach ($this->get_elements('widgets') as $widget) {
            $class_name = $this->get_reflection()->getNamespaceName() . '\Widgets\\' . $widget;
            //var_dump($class_name);
            if (method_exists($class_name, 'get_categories_static')) {
                foreach ($class_name::get_categories_static() as $category) {
                    $title = ucwords($category);
                    $title = str_replace('-', ' ', $title);
                    $elements->add_category($category, array(
                        'title' => $title,
                    ));
                }
            }
            if (empty(self::$widgets[$class_name])) {
                self::$widgets[$class_name] = new $class_name();
            }
            $widget = self::$widgets[$class_name];
            foreach ($widget->get_categories() as $category) {
                $title = ucwords($category);
                $title = str_replace('-', ' ', $title);
                $elements->add_category($category, array(
                    'title' => ucfirst($title),
                ));
            }
        }
        //var_dump($elements->get_categories()); die();
    }

    public function init_assets() {
        $module = $this->get_name();

        $class_name = $this->get_reflection()->getNamespaceName();
        $plugin_path = Utils::get_plugin_path($class_name);
        $assets_path = $plugin_path . 'modules' . DIRECTORY_SEPARATOR . $module . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR;

        \Mesh3d\Core\Managers\Assets::register_assets($assets_path);
    }

    public function init_scripts() {
        $module = $this->get_name();

        $class_name = $this->get_reflection()->getNamespaceName();
        $plugin_path = Utils::get_plugin_path($class_name);
        $assets_path = $plugin_path . 'modules' . DIRECTORY_SEPARATOR . $module . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR;

        \Mesh3d\Core\Managers\Assets::register_assets($assets_path, 'js');
    }

    public function init_styles() {
        $module = $this->get_name();

        $class_name = $this->get_reflection()->getNamespaceName();
        $plugin_path = Utils::get_plugin_path($class_name);
        $assets_path = $plugin_path . 'modules' . DIRECTORY_SEPARATOR . $module . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR;

        \Mesh3d\Core\Managers\Assets::register_assets($assets_path, 'css');
    }

    public function register_script($hanlde, $path, $deps = [], $version = '', $footer = true) {
        $assets_name = $this->get_reflection()->getNamespaceName();
        $tmp = explode('\\', $assets_name);
        $module = implode('/', $tmp);
        $module = Utils::camel_to_slug($module);
        $url = WP_PLUGIN_URL . '/' . $module . '/' . $path;
        $url = str_replace('/-', '/', $url);
        wp_register_script($hanlde, $url, $deps, $version, $footer);
    }

    public function register_style($hanlde, $path, $deps = [], $version = '', $media = 'all') {
        $assets_name = $this->get_reflection()->getNamespaceName();
        //var_dump($assets_name);var_dump(get_class($this));
        $tmp = explode('\\', $assets_name);
        $module = implode('/', $tmp);
        $module = Utils::camel_to_slug($module);
        $url = WP_PLUGIN_URL . '/' . $module . '/' . $path;
        $url = str_replace('/-', '/', $url);
        wp_register_style($hanlde, $url, $deps, $version, $media);
    }

}
