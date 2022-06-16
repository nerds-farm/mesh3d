<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * interactivity
 *
 * @author poglie
 */
trait Interactivity {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_interactivity_controls($target, $suffix = '') {
        
        $target->add_control(
            'interactivity_type', [
                'label' => esc_html__('Interactivity Type', 'mesh3d'),
                'type' => Controls_Manager::CHOOSE,
                'options' => [
                    'tilt' => [
                        'title' => esc_html__('Mouse position tilt', 'mesh3d'),
                        'icon' => 'eicon-cursor-move',
                    ],
                    'orbit' => [
                        'title' => esc_html__('Orbit Control', 'mesh3d'),
                        'icon' => 'eicon-click',
                    ],
                    'map' => [
                        'title' => esc_html__('Map Control', 'mesh3d'),
                        'icon' => 'eicon-drag-n-drop',
                    ],
                    'wheel' => [
                        'title' => esc_html__('Wheen Rotation', 'mesh3d'),
                        'icon' => 'eicon-scroll',
                    ],
                ],
                'default' => '',
                'frontend_available' => true,
                'render_type' => 'ui',
                'toggle' => true,
                
            ]
        );
        /*$target->add_control(
            'tilt_heading', [
                'label' => esc_html__('Tilt', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'condition' => [
                    'interactivity_type' => 'tilt'
                ],
            ]
        );
        $target->add_control(
            'enable_tilt', [
                'label' => esc_html__('Enable Mouse Tilt', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'interactivity_type' => 'tilt'
                ],
            ]
        );
        $target->add_control(
            'orbitcontrol_heading', [
                'label' => esc_html__('Orbit Control', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    //'enable_orbit!' => '',
                    'interactivity_type' => 'orbit'
                ],
            ]
        );
        $target->add_control(
            'enable_orbit', [
                'label' => esc_html__('Enable OrbitControl', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    //'enable_orbit!' => '',
                    'interactivity_type' => 'orbit'
                ],
            ]
        );*/
        $target->add_control(
            'tilt_amount',
            [
                'label' => esc_html__('Amount', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 2,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'interactivity_type' => 'tilt'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'tilt_speed',
            [
                'label' => esc_html__('Speed', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 5,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'interactivity_type' => 'tilt'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'orbit_panning', [
                'label' => esc_html__('Panning', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'interactivity_type' => 'map'
                ],
                'label_on' => 'Y',
                'label_off' => 'Z',
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'yes'
            ]
        );

        $target->add_control(
            'orbit_damping', [
                'label' => esc_html__('Damping', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'interactivity_type' => ['orbit','map']
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'orbit_damping_speed',
            [
                'label' => esc_html__('Speed', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0.05,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.01,
                        'max' => 1,
                        'step' => 0.01,
                    ],
                ],
                'condition' => [
                    'orbit_damping!' => '',
                    'interactivity_type' => 'orbit'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'orbit_autorotate', [
                'label' => esc_html__('AutoRotate', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'interactivity_type' => 'orbit'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'orbit_autorotate_speed',
            [
                'label' => esc_html__('Speed', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 2.5,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.5,
                        'max' => 5,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'orbit_autorotate!' => '',
                    'interactivity_type' => 'orbit'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'interactivity_dbclick', [
                'label' => esc_html__('DB Click', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                'separator' => 'before',
                'options' => [
                    '' => esc_html__('None', 'mesh3d'),
                    'reset' => esc_html__('Reset', 'mesh3d'),
                    'intersect' => esc_html__('Intersect', 'mesh3d'),
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'reset',
            ]
        );
    }
}
