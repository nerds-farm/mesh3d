<?php

namespace Mesh3d\Modules\Threed\Widgets;

use Elementor\Group_Control_Typography;
use Elementor\Controls_Manager;
use Mesh3d\Base\Base_Widget;
use Mesh3d\Core\Utils;

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Mesh 3D
 *
 * 3DEven widget for Elementor
 * Author: NERDS.FARM
 * 
 * */
class Mesh extends Base_Widget {

    use Traits\Ambient;
    use Traits\Animations;
    use Traits\Camera;
    use Traits\Interactivity;
    use Traits\Lightambient;
    use Traits\Lightshadow;
    use Traits\Material;
    use Traits\Options;
    use Traits\Primitive;
    use Traits\Renderer;
    use Traits\Sky;
    use Traits\Transform;
    use Traits\Viewport;

    public function get_name() {
        return 'e-3d-mesh';
    }

    public function get_title() {
        return __('Mesh 3D', 'mesh3d');
    }

    public function get_description() {
        return __('The widget Mesh 3D for Elementor, by NERDS.FARM', 'mesh3d');
    }

    public function get_pid() {
        return 948;
    }

    public function get_icon() {
        return 'mesh-3de';
    }

    public function get_categories() {
        return ['3d'];
    }

    public function get_style_depends() {
        return ['3de-frontend'];
    }

    public function get_script_depends() {
        // , 'threejs-EffectComposer', 'threejs-ShaderPass', 'threejs-SimplexNoise', 'threejs-CopyShader', 'threejs-SAOPass', 'threejs-SAOShader',
        // 
        return ['3de-jquery-mousewheel',
            'threejs-lib',
            'threejs-ProgressiveLightMap',
            'threejs-modifiers',
            'threejs-SVGLoader',
            'threejs-OBJLoader',
            'threejs-MTLLoader',
            'threejs-ColladaLoader',
            'threejs-GLTFLoader',
            'threejs-RGBELoader',
            'threejs-FBXLoader',
            'threejs-fflate',
            'threejs-orbitcontrol',
            'threejs-VertexNormalsHelper',
            'threejs-tween',
            '3de-gsap-lib',
            '3de-gsap-scrollTrigger-lib',
            'e_threed_base',
            '3de-mesh'];
    }

    protected function register_controls() {

        // --------------------------------------- PRIMITIVE OBJECTS
        $this->start_controls_section(
                'section_geometry_content', [
            'label' => __('Object', 'mesh3d')
                ]
        );

        $this->add_primitive_controls($this);

        $this->end_controls_section();

        // --------------------------------------- TRANSFORM
        $this->start_controls_section(
                'section_geometry_transform', [
            'label' => esc_html__('Transform', 'mesh3d'),
                ]
        );

        $this->add_transform_controls($this);

        $this->end_controls_section();

        // --------------------------------------- MATERIAL

        $this->start_controls_section(
                'section_geometry_material', [
            'label' => esc_html__('Material', 'mesh3d'),
            'conditions' => [
                'relation' => 'or',
                'terms' => [
                    [
                        'relation' => 'and',
                        'terms' => [
                            [
                                'name' => 'import_useCustomMaterial',
                                'operator' => '!=',
                                'value' => '',
                            ],
                            [
                                'name' => 'geometry_type',
                                'value' => 'import',
                            ],
                        ]
                    ],
                    [
                        'name' => 'geometry_type',
                        'operator' => '!=',
                        'value' => 'import',
                    ]
                ]
            ]
                ]
        );

        $this->add_material_controls($this);

        $this->end_controls_section();

        // --------------------------------------- LIGHT AND SHADOW

        $this->start_controls_section(
                'section_geometry_lightshadow', [
            'label' => __('Light and Shadow', 'mesh3d'),
            'condition' => [
            //'material_type!' => 'wireframeMaterial',
            ],
                ]
        );
        $this->add_lightambient_controls($this);
        $this->add_lightshadow_controls($this);

        $this->end_controls_section();
        // --------------------------------------- CAMERA

        $this->start_controls_section(
                'section_geometry_camera', [
            'label' => __('Camera', 'mesh3d')
                ]
        );

        $this->add_camera_controls($this);

        $this->end_controls_section();

        // --------------------------------------- SCENE

        $this->start_controls_section(
                'section_geometry_sky', [
            'label' => __('Sky', 'mesh3d')
                ]
        );

        $this->add_sky_controls($this);

        $this->end_controls_section();

        // --------------------------------------- AMBIENT

        $this->start_controls_section(
                'section_geometry_ambient', [
            'label' => __('Ambient', 'mesh3d')
                ]
        );

        $this->add_ambient_controls($this);

        $this->end_controls_section();

        // --------------------------------------- ANIMATIONS

        $this->start_controls_section(
                'section_geometry_animations', [
            'label' => __('Animations', 'mesh3d')
                ]
        );

        $this->add_animations_controls($this);

        $this->end_controls_section();

        // --------------------------------------- RENDERER

        $this->start_controls_section(
                'section_renderer', [
            'label' => __('Renderer', 'mesh3d')
                ]
        );

        $this->add_renderer_controls($this);

        $this->end_controls_section();
        // --------------------------------------- VIEWPORT

        $this->start_controls_section(
                'section_geometry_viewport', [
            'label' => __('Canvas Viewport', 'mesh3d')
                ]
        );

        $this->add_viewport_controls($this);

        $this->end_controls_section();

        // ---------------------------------------- INTERACTIVITY
        $this->start_controls_section(
                'section_interactivity', [
            'label' => __('Interactivity', 'mesh3d')
                ]
        );

        $this->add_interactivity_controls($this);

        $this->end_controls_section();

        // --------------------------------------- OPTIONS
        $this->start_controls_section(
                'section_options_3d', [
            'label' => __('Options', 'mesh3d')
                ]
        );

        $this->add_options_controls($this);

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        if (empty($settings))
            return;

        //
        $threejsPath = $this->get_module_url() . 'assets/lib/threejs/';
        //$threejsPath = 'e-addons/wp-content/plugins/e-addons-threed/modules/threed/assets/lib/threejs/';
        $classExtend = $settings['viewport_extend'] ? ' e3d-viewport-extend' : '';
        ?>
        <script>
            var threejsPath = '<?php echo $this->get_module_url(); ?>';
        </script>

        <div class="e-threed-container<?php echo $classExtend; ?>">
            <canvas id="threedgeometry-canvas-<?php echo $this->get_id(); ?>" class="threedgeometry-canvas threed-canvas"></canvas>
        </div>

        <div class="threed-data">
        <?php
        if ($settings['geometry_svg'])
            \Elementor\Icons_Manager::render_icon($settings['geometry_svg'], ['aria-hidden' => 'true']);
        ?>
            ?>
        </div>
        <div class="e-threed-loading"><div class="e-threed-loading-bar"><div class="e-threed-loading-progress"></div></div></div>
            <?php
        }

        protected function content_template() {
            ?>
        <#
        var classExtend = settings.viewport_extend ? ' e3d-viewport-extend' : '',
        geometrySvg = elementor.helpers.renderIcon( view, settings.geometry_svg, { 'aria-hidden': true }, 'i' , 'object' );
        #>

        <div class="e-threed-container{{classExtend}}">
            <canvas id="threedgeometry-canvas-{{id}}" class="threedgeometry-canvas threed-canvas"></canvas>
        </div>

        <div class="threed-data">
            {{{ geometrySvg.value }}}
        </div>
        <div class="e-threed-loading"><div class="e-threed-loading-bar"><div class="e-threed-loading-progress"></div></div></div>
        <?php
    }

}
