<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * lightshadows
 *
 * @author poglie
 */
trait Lightshadows {

    public function add_lightshadows_controls($target, $suffix = '') {
        
       
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
                'label' => esc_html__('Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                'options' => [
                    'pointLight' => 'Point',
                    'directionalLight' => 'Directional',
                    'spotLight' => 'Spot',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'pointLight',
                
            ]
        );
        $target->add_control(
            'light_color',
            [
                'label' => __('Color', 'elementor'),
                'type' => Controls_Manager::COLOR,
                'default' => '#FFFFFF',
                'condition' => [
                    'light_type!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );

        $target->add_control(
            'light_intensity', [
                'label' => esc_html__('Intensity', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'separator' => 'after',
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
                
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );

        
        // ------- light options ------
        $target->add_control(
            'lightoptions_heading', [
                'label' => esc_html__('Options', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                
            ]
        );
        $target->add_control(
            'light_decay', [
                'label' => esc_html__('Decay', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 2,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'light_type' => ['pointLight','spotLight'],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'light_penumbra', [
                'label' => esc_html__('Penumbra', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0.5,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1,
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
            'light_angle', [
                'label' => esc_html__('Angle', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 3,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 1,
                        'max' => 36,
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
            'light_distance', [
                'label' => esc_html__('Distance', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
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
                    'light_type' => 'pointLight',
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
                    'light_type' => 'pointLight',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );



         // ------- light position ------
         $target->add_control(
            'lightpos_heading', [
                'label' => esc_html__('Position', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                
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
                        'min' => -1,
                        'max' => 10,
                        'step' => 0.01,
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
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.01,
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
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'condition' => [
                    'light_type!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        // ------- light Target ------
        $target->add_control(
            'lighttarget_heading', [
                'label' => esc_html__('Target', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'light_type' => ['directionalLight','spotLight'],
                ],
            ]
        );
        
        // x-y-z
        $target->add_control(
            'geometry_light_targetx',
            [
                'label' => esc_html__('X', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'condition' => [
                    'light_type' => ['directionalLight','spotLight'],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'geometry_light_targety',
            [
                'label' => esc_html__('Y', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'condition' => [
                    'light_type' => ['directionalLight','spotLight'],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'geometry_light_targetz',
            [
                'label' => esc_html__('Z', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'condition' => [
                    'light_type' => ['directionalLight','spotLight'],
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
        /*
        $target->add_control(
            'shadow_type', [
                'label' => esc_html__('Shadow Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                'options' => [
                    'PCFSoftShadowMap' => 'PCFSoft',
                    'BasicShadowMap' => 'Basic',
                    //'VSMShadowMap' => 'VSM', //..@p lo sospendo provvisoriamente
                ],
                'condition' => [
                    'enable_shadows!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'PCFSoftShadowMap',
                
            ]
        );
        */
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
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'geometry_shadow_focus',
            [
                'label' => esc_html__('Focus', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 6,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'enable_shadows!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
    
    }
}
