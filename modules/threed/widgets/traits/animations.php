<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * animations
 *
 * @author poglie
 */
trait Animations {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_animations_controls($target, $suffix = '') {
        
        $target->add_control(
            'geometry_animated', [
                'label' => esc_html__('Enable Animations', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => ''
            ]
        );
        $target->add_control(
            'geometry_animated_speed', [
                'label' => esc_html__('Speed', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 0.1,
                'max' => 5,
                'step' => 0.1,
                'default' => 1,
                'condition' => [
                    'geometry_animated!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'geometry_animated_x', [
                'label' => esc_html__('Rotate X', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_animated!' => ''
                ]
            ]
        );
        $target->add_control(
            'geometry_animated_y', [
                'label' => esc_html__('Rotate Y', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_animated!' => ''
                ]
            ]
        );
        $target->add_control(
            'geometry_animated_z', [
                'label' => esc_html__('Rotate Z', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_animated!' => ''
                ]
            ]
        );
    
    }
}
