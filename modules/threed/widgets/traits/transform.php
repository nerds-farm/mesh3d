<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * transform
 *
 * @author poglie
 */
trait Transform {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_transform_controls($target, $suffix = '') {
        
       // POSITION
       $target->add_control(
            'heading_pos_mesh', [
                'label' => esc_html__('Position', 'mesh3d'),
                'type' => Controls_Manager::HEADING
            ]
        );
        $target->add_control(
            'geometry_mesh_posx',
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
                        'min' => -6,
                        'max' => 6,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'geometry_mesh_posy',
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
                
            ]
        );
        $target->add_control(
            'geometry_mesh_posz',
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
                        'min' => -6,
                        'max' => 6,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        // ROTATION
        $target->add_control(
            'heading_rot_mesh', [
                'label' => esc_html__('Rotation', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'geometry_animated' => '',
                ]
            ]
        );
        // rotazione non è disponibile se è abilitato ANIMATIONS che influenza le rotazioni, appunto.
        $target->add_control(
            'geometry_mesh_rotx',
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
                        'min' => -360,
                        'max' => 360,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_animated' => '',
                    //'geometry_animated_x!' => 'yes'
                ]
            ]
        );
        $target->add_control(
            'geometry_mesh_roty',
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
                        'min' => -360,
                        'max' => 360,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_animated' => '',
                    //'geometry_animated_y!' => 'yes'
                ]
            ]
        );
        $target->add_control(
            'geometry_mesh_rotz',
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
                        'min' => -360,
                        'max' => 360,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_animated' => '',
                    //'geometry_animated_z!' => 'yes'
                ]
            ]
        );
        // SCALE
        $target->add_control(
            'heading_scale_mesh', [
                'label' => esc_html__('Scale', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before'
            ]
        );
        $target->add_control(
            'geometry_mesh_scale',
            [
                'label' => esc_html__('Scale', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1.00,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.01,
                        'max' => 2,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
    
    }
}