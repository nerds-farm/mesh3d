<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * camera
 *
 * @author poglie
 */
trait Camera {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_camera_controls($target, $suffix = '') {
        
        $target->add_control(
            'camera_type', [
                'label' => esc_html__('Camera Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    'perspective' => esc_html__('Perspective', 'mesh3d'),
                    'orthographic' => esc_html__('Orthographic', 'mesh3d'),
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'perspective',
                'separator' => 'before'
            ]
        );
        // fov ....
        $target->add_control(
            'camera_fov', [
                'label' => esc_html__('Fov', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 40,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 10,
                        'max' => 120,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'separator' => 'before'
            ]
        );
         // fov ....
         $target->add_control(
            'camera_zoom', [
                'label' => esc_html__('Zoom', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'camera_pos_heading', [
                'label' => esc_html__('Camera position', 'mesh3d'),
                'type' => Controls_Manager::HEADING
            ]
        );
        $target->add_control(
            'camera_posx',
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
                        'step' => 0.1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'camera_posy',
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
                        'step' => 0.1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'camera_posz',
            [
                'label' => esc_html__('Z', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 4,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'camera_target_heading', [
                'label' => esc_html__('Target camera', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'condition' => [
                    'camera_lookat' => ''
                ],
            ]
        );
        $target->add_control(
            'camera_targetx',
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
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'camera_lookat' => ''
                ],
            ]
        );
        $target->add_control(
            'camera_targety',
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
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'camera_lookat' => ''
                ],
            ]
        );
        $target->add_control(
            'camera_targetz',
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
                        'step' => 0.1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'camera_lookat' => ''
                ],
            ]
        );
        $target->add_control(
            'camera_lookat', [
                'label' => esc_html__('Lookat to center', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'separator' => 'before',
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
    
    }
}
