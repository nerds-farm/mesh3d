<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * sky
 *
 * @author poglie
 */
trait Sky {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_sky_controls($target, $suffix = '') {
        
       // ambient color
       $target->add_control(
            'sky_color',
            [
                'label' => __('Sky Color', 'elementor'),
                'type' => Controls_Manager::COLOR,
                'default' => '#FFFFFF',
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'sky_image',[
                'label' => __( 'Sky Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'sky_environment', [
                'label' => esc_html__('Environment', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'sky_image[url]!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'sky_hide', [
                'label' => esc_html__('Hide', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'sky_image[url]!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
    }
}
