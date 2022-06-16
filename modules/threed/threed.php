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
        add_filter('script_loader_tag', [$this,'add_type_attribute'] , 10, 3);
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
        $this->register_script( 'threejs-modifiers', 'assets/lib/threejs/modifiers.min.js', ['threejs-lib'], '1.2.3' );
        //imports
        $this->register_script( 'threejs-SVGLoader', 'assets/lib/threejs/js/loaders/SVGLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-OBJLoader', 'assets/lib/threejs/js/loaders/OBJLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-MTLLoader', 'assets/lib/threejs/js/loaders/MTLLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-ColladaLoader', 'assets/lib/threejs/js/loaders/ColladaLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-FBXLoader', 'assets/lib/threejs/js/loaders/FBXLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-GLTFLoader', 'assets/lib/threejs/js/loaders/GLTFLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-RGBELoader', 'assets/lib/threejs/js/loaders/RGBELoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-FBXLoader', 'assets/lib/threejs/js/loaders/FBXLoader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-fflate', 'assets/lib/threejs/js/libs/fflate.min.js', ['threejs-lib'], '1.2.3' );
        //helpers
        $this->register_script( 'threejs-VertexNormalsHelper', 'assets/lib/threejs/js/helpers/VertexNormalsHelper.js', ['threejs-lib'], '1.2.3' );
        //utils
        $this->register_script( 'threejs-BufferGeometryUtils', 'assets/lib/threejs/js/utils/BufferGeometryUtils.js', ['threejs-lib'], '1.2.3' );
        //tween (da rimuovere, o valutare)
        $this->register_script( 'threejs-tween', 'assets/lib/Tween.js', ['threejs-lib'], '3.1.13' );
        //mousewheel
        $this->register_script( '3de-jquery-mousewheel', 'assets/lib/jquery.mousewheel.min.js', ['jquery'], '3.1.13' );
        //gsap
        $this->register_script( '3de-gsap-lib', 'assets/lib/greensock/gsap.min.js', [], '3.10.4' );
        $this->register_script( '3de-gsap-scrollTrigger-lib', 'assets/lib/greensock/ScrollTrigger.min.js', ['3de-gsap-lib'], '3.10.4' );
        
        //postprocessing
        $this->register_script( 'threejs-EffectComposer', 'assets/lib/threejs/js/postprocessing/EffectComposer.js', ['threejs-lib'], '1.2.3' );

        $this->register_script( 'threejs-RenderPass', 'assets/lib/threejs/js/postprocessing/RenderPass.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-BokehPass', 'assets/lib/threejs/js/postprocessing/BokehPass.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-ShaderPass', 'assets/lib/threejs/js/postprocessing/ShaderPass.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-DotScreenPass', 'assets/lib/threejs/js/postprocessing/DotScreenPass.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-HalftonePass', 'assets/lib/threejs/js/postprocessing/HalftonePass.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-BloomPass', 'assets/lib/threejs/js/postprocessing/BloomPass.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-UnrealBloomPass', 'assets/lib/threejs/js/postprocessing/UnrealBloomPass.js', ['threejs-lib'], '1.2.3' );
        //GlitchPass ..

        $this->register_script( 'threejs-BokehShader', 'assets/lib/threejs/js/shaders/BokehShader.js', ['threejs-lib','threejs-BokehPass'], '1.2.3' );
        $this->register_script( 'threejs-BokehShader2', 'assets/lib/threejs/js/shaders/BokehShader2.js', ['threejs-lib','threejs-BokehPass'], '1.2.3' );
        $this->register_script( 'threejs-CopyShader', 'assets/lib/threejs/js/shaders/CopyShader.js', ['threejs-lib','threejs-BokehPass'], '1.2.3' );
        $this->register_script( 'threejs-RGBShiftShader', 'assets/lib/threejs/js/shaders/RGBShiftShader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-DotScreenShader', 'assets/lib/threejs/js/shaders/DotScreenShader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-HalftoneShader', 'assets/lib/threejs/js/shaders/HalftoneShader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-PixelShader', 'assets/lib/threejs/js/shaders/PixelShader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-ACESFilmicToneMappingShader', 'assets/lib/threejs/js/shaders/ACESFilmicToneMappingShader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-LuminosityHighPassShader', 'assets/lib/threejs/js/shaders/LuminosityHighPassShader.js', ['threejs-lib'], '1.2.3' );
        $this->register_script( 'threejs-SobelOperatorShader', 'assets/lib/threejs/js/shaders/SobelOperatorShader.js', ['threejs-lib'], '1.2.3' );
        
        // LuminosityShader ..

        //$this->register_script( 'threejs-SAOPass', 'assets/lib/threejs/js/postprocessing/SAOPass.js', ['threejs-lib'], '1.2.3' );
        //$this->register_script( 'threejs-SAOShader', 'assets/lib/threejs/js/shader/SAOShader.js', ['threejs-lib'], '1.2.3' );
        //$this->register_script( 'threejs-SimplexNoise', 'assets/lib/threejs/js/math/SimplexNoise.js', ['threejs-lib'], '1.2.3' );
        
        
        //$this->register_style( 'xxx-lib', 'assets/lib/xxx/xxx.min.css' );
        wp_enqueue_style('mesh3d-icons');        
    }

    /**
     * Enqueue admin styles in Editor
     *
     * @access public
     */
    public function enqueue_editor_assets() {
        wp_enqueue_style('3de-editor');
        

        //wp_enqueue_script('e-addons-editor-xxx');
    }
    public function add_type_attribute($tag, $handle, $src) {
        // if not your script, do nothing and return original $tag
        if ( 'e-addons-geometry' !== $handle && 'e-addons-test' !== $handle ) {
            return $tag;
        }
        // change the script tag by adding type="module" and return it.
        $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
        return $tag;
    }
}
