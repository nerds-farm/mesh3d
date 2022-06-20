<?php

namespace Mesh3d\Modules\Threed;

use Mesh3d\Base\Module_Base;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Threed extends Module_Base {

    public function __construct() {
        parent::__construct();
        add_action('elementor/editor/after_enqueue_scripts', [$this, 'enqueue_editor_assets']);        
        add_action('elementor/frontend/before_enqueue_styles', [$this, 'register_libs']);
        //add_filter('script_loader_tag', [$this,'add_type_attribute'] , 10, 3);
    }
    
    /**
     * Register libs in Frontend
     *
     * @access public
     */
    public function register_libs() {
        //THREEJS lib
        $this->register_script( 'threejs-lib', 'assets/lib/threejs/three.min.js', [], '1.2.3' );

        //Controls
        $this->register_script( 'threejs-orbitcontrol', 'assets/lib/threejs/js/controls/OrbitControls.js', ['threejs-lib'], '1.2.3' );
        
        //mmmmmm
        $this->register_script( 'threejs-ProgressiveLightMap', 'assets/lib/threejs/js/misc/ProgressiveLightMap.js', ['threejs-lib'], '1.2.3' );
        
        //imports
        $this->register_script( 'threejs-SVGLoader', 'assets/lib/threejs/js/loaders/SVGLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-OBJLoader', 'assets/lib/threejs/js/loaders/OBJLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-MTLLoader', 'assets/lib/threejs/js/loaders/MTLLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-ColladaLoader', 'assets/lib/threejs/js/loaders/ColladaLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-FBXLoader', 'assets/lib/threejs/js/loaders/FBXLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-GLTFLoader', 'assets/lib/threejs/js/loaders/GLTFLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-RGBELoader', 'assets/lib/threejs/js/loaders/RGBELoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-fflate', 'assets/lib/threejs/js/libs/fflate.min.js', ['threejs-lib'], '1.2.3' );
        //helpers
        $this->register_script( 'threejs-VertexNormalsHelper', 'assets/lib/threejs/js/helpers/VertexNormalsHelper.js', ['threejs-lib'], '1.2.3' );
        //utils
        $this->register_script( 'threejs-BufferGeometryUtils', 'assets/lib/threejs/js/utils/BufferGeometryUtils.js', ['threejs-lib'], '1.2.3' );
        
        //mousewheel
        $this->register_script( '3de-jquery-mousewheel', 'assets/lib/jquery.mousewheel.min.js', ['jquery'], '3.1.13' );
        //gsap
        $this->register_script( '3de-gsap-lib', 'assets/lib/greensock/gsap.min.js', [], '3.10.4' );
        $this->register_script( '3de-gsap-scrollTrigger-lib', 'assets/lib/greensock/ScrollTrigger.min.js', ['3de-gsap-lib'], '3.10.4' );
        
        
        
        //$this->register_style( 'xxx-lib', 'assets/lib/xxx/xxx.min.css' );
    }

    /**
     * Enqueue admin styles in Editor
     *
     * @access public
     */
    public function enqueue_editor_assets() {
        wp_enqueue_style('3de-editor');
        wp_enqueue_style('threedeven-icons');    

        //wp_enqueue_script('e3d-editor-xxx');
    }
    public function add_type_attribute($tag, $handle, $src) {
        // if not your script, do nothing and return original $tag
        if ( 'e3d-geometry' !== $handle && 'e3d-test' !== $handle ) {
            return $tag;
        }
        // change the script tag by adding type="module" and return it.
        $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
        return $tag;
    }
}
