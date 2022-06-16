<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * lightambient
 *
 * @author poglie
 */
trait Lightambient {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_lightambient_controls($target, $suffix = '') {
        
       // ------- ambient light ------
        $target->add_control(
            'ambientlight_color',
            [
                'label' => __('Color', 'elementor'),
                'type' => Controls_Manager::COLOR,
                'default' => '#FFFFFF',
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'ambientlight_intensity', [
                'label' => esc_html__('Intensity', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 20,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
    } 
}