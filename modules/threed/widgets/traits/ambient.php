<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * ambient
 *
 * @author poglie
 */
trait Ambient {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_ambient_controls($target, $suffix = '') {
        
        $target->add_control(
            'ambient_type', [
                'label' => esc_html__('Ambient Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    '' => 'None',
                    'floor' => 'Floor',
                    'wall' => 'Wall',
                    'room' => 'Room',
                    'sphere' => 'Sphere Panorama',
                    'horizon' => 'Horizon'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => '',
                
            ]
        );
        $target->add_control(
            'heading_ambient_position', [
                'label' => esc_html__('Position', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'ambient_type!' => '',
                    'ambient_wireframe_mode' => ''
                ],
                
            ]
        );
        $target->add_control(
            'ambient_posy',
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
                        'min' => -6,
                        'max' => 6,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'ambient_type!' => '',
                    'ambient_wireframe_mode' => ''
                ],
            ]
        );
        $target->add_control(
            'heading_ambient_texture', [
                'label' => esc_html__('Material', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'ambient_type!' => '',
                    'ambient_wireframe_mode' => ''
                ],
                
            ]
        );
        // ambient texture
        $target->add_control(
            'ambient_texture',[
                'label' => __( 'Texture Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'ambient_type!' => '',
                    'ambient_wireframe_mode' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'ambient_textureRepX', [
                'label' => esc_html__('Repetition X', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 0.1,
                'step' => 0.1,
                'default' => 1,
                'condition' => [
                    'ambient_type!' => '',
                    'ambient_texture[url]!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'ambient_textureRepY', [
                'label' => esc_html__('Repetition Y', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 0.1,
                'step' => 0.1,
                'default' => 1,
                'condition' => [
                    'ambient_type!' => '',
                    'ambient_texture[url]!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        

        // ambient color
        $target->add_control(
            'ambient_color',
            [
                'label' => __('Ambient Color', 'elementor'),
                'type' => Controls_Manager::COLOR,
                'default' => '#CCCCCC',
                'condition' => [
                    'ambient_type!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // ambient wireframe mode
        $target->add_control(
            'ambient_wireframe_mode', [
                'label' => esc_html__('Whireframe Mode', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'ambient_type!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        
        // ambient wireframe mode
        $target->add_control(
            'ambient_fog', [
                'label' => esc_html__('Enable Fog', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'separator' => 'before',
                'condition' => [
                    'ambient_type!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        //fog color ....
        $target->add_control(
            'fog_color',
            [
                'label' => __('Fog Color', 'elementor'),
                'type' => Controls_Manager::COLOR,
                'default' => '#000000',
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'ambient_type!' => '',
                    'ambient_fog!' => ''
                ],
            ]
        );
        
        //fog near
        $target->add_control(
            'ambient_fog_near', [
                'label' => esc_html__('Fog Near', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 2,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'ambient_type!' => '',
                    'ambient_fog!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        //fog far
        $target->add_control(
            'ambient_fog_far', [
                'label' => esc_html__('Fog Far', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 12,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 2,
                        'max' => 20,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'ambient_type!' => '',
                    'ambient_fog!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );   
    }
}
