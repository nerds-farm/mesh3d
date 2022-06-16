<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * viewport
 *
 * @author poglie
 */
trait Viewport {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_viewport_controls($target, $suffix = '') {
        
       // viewport width --------
       $target->add_control(
            'viewport_width',
            [
                'label' => esc_html__('Width', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 100,
                    'unit' => '%',
                ],
                'size_units' => ['px','%','vw'],
                'range' => [
                    'px' => [
                        'min' => 100,
                        'max' => 1800,
                        'step' => 1,
                    ],
                ],
                'selectors' => [
                    '{{WRAPPER}} .e-threed-container' => 'width: {{SIZE}}{{UNIT}};'
                ],
                'frontend_available' => true,
                // 'condition' => [
                //     'viewport_extend' => '',
                // ]
            ]
        );
        // viewport height --------
        $target->add_control(
            'viewport_height',
            [
                'label' => esc_html__('Height', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 500,
                    'unit' => 'px',
                ],
                'size_units' => ['px','%','vh'],
                'range' => [
                    'px' => [
                        'min' => 100,
                        'max' => 1800,
                        'step' => 1,
                    ],
                ],
                'selectors' => [
                    '{{WRAPPER}} .e-threed-container' => 'height: {{SIZE}}{{UNIT}};'
                ],
                'frontend_available' => true,
                // 'condition' => [
                //     'viewport_extend' => '',
                // ]
            ]
        );
        $target->add_control(
            'viewport_extend', [
                'description' => esc_html__('Visible only in the front-end.', 'mesh3d'),

                'label' => esc_html__('Extend and fix', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,

                'frontend_available' => true,
                'render_type' => 'ui'
            ]
        );
    
    }
}