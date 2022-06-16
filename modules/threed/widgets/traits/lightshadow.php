<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * lightshadow
 *
 * @author poglie
 */
trait Lightshadow {

    public function add_lightshadow_controls($target, $suffix = '') {
        
       
        // ------- light ------
        $target->add_control(
            'light_heading', [
                'label' => esc_html__('Light', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before'
            ]
        );
        $target->add_control(
            'light_type', [
                'label' => esc_html__('Light Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                'options' => [
                    '' => 'None',
                    'directionalLight' => 'Directional',
                    'spotLight' => 'Spot',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => '',
                
            ]
        );
        $target->add_control(
            'light_spot_intensity', [
                'label' => esc_html__('Intensity', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 1,
                        'max' => 40,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'light_type' => 'spotLight',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'light_dir_intensity', [
                'label' => esc_html__('Intensity', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 1,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'light_type' => 'directionalLight'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );

        
        $target->add_control(
            'light_color',
            [
                'label' => __('Light Color', 'elementor'),
                'type' => Controls_Manager::COLOR,
                'default' => '#FFFFFF',
                'condition' => [
                    'light_type!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // x-y-z
        $target->add_control(
            'geometry_light_posx',
            [
                'label' => esc_html__('X', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => -3,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'light_type!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'geometry_light_posy',
            [
                'label' => esc_html__('Y', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 3,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'light_type!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'geometry_light_posz',
            [
                'label' => esc_html__('Z', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 2,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'light_type!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );


        // ------- shadow ------
        $target->add_control(
            'shadow_heading', [
                'label' => esc_html__('Shadow', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'light_type!' => '',
                ],
            ]
        );
        $target->add_control(
            'enable_shadows', [
                'label' => esc_html__('Enable Shadows', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'shadow_type', [
                'label' => esc_html__('Shadow Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                'options' => [
                    'PCFSoftShadowMap' => 'PCFSoft',
                    'BasicShadowMap' => 'Basic',
                    'VSMShadowMap' => 'VSM', //..@p lo sospendo provvisoriamente
                ],
                'condition' => [
                    'enable_shadows!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'PCFSoftShadowMap',
                
            ]
        );
        //radius 0-25
        $target->add_control(
            'geometry_shadow_radius',
            [
                'label' => esc_html__('Radius', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 4,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 100,
                        'step' => 1,
                    ],
                ],
                'condition' => [
                    'enable_shadows!' => '',
                    //'shadow_type' => 'VSMShadowMap'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        //blurSamples 1-25
        $target->add_control(
            'geometry_shadow_blurSamples',
            [
                'label' => esc_html__('Blur Samples', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 8,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 50,
                        'step' => 1,
                    ],
                ],
                'condition' => [
                    'enable_shadows!' => '',
                    //'shadow_type' => 'VSMShadowMap'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        // ------- light point ------
        $target->add_control(
            'lightpoint_heading', [
                'label' => esc_html__('Light Point', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before'
            ]
        );
        $target->add_control(
            'enable_lightpoint', [
                'label' => esc_html__('Enable Light Point', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'lightpoint_color',
            [
                'label' => __('LightPoint Color', 'mesh3d'),
                'type' => Controls_Manager::COLOR,
                'default' => '#FFFFFF',
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'enable_lightpoint!' => '',
                ],
            ]
        );
        $target->add_control(
            'lightpoint_intensity', [
                'label' => esc_html__('Intensity', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 3,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 1,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'enable_lightpoint!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'lightpoint_distance', [
                'label' => esc_html__('Distance', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 100,
                        'step' => 1,
                    ],
                ],
                'condition' => [
                    'enable_lightpoint!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'lightpoint_fly', [
                'label' => esc_html__('Flying Point', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'enable_lightpoint!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // x-y-z
        $target->add_control(
            'lightpoint_posx',
            [
                'label' => esc_html__('X', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'enable_lightpoint!' => '',
                    'lightpoint_fly' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'lightpoint_posy',
            [
                'label' => esc_html__('Y', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'enable_lightpoint!' => '',
                    'lightpoint_fly' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'lightpoint_posz',
            [
                'label' => esc_html__('Z', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'enable_lightpoint!' => '',
                    'lightpoint_fly' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
    
    }
}
