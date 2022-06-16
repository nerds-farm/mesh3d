<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * options
 *
 * @author poglie
 */
trait Options {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_options_controls($target, $suffix = '') {
        
        $target->add_control(
            'frontend_helpers', [
                'label' => esc_html__('Frontend Helpers', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        
        $target->add_control(
            'reset_lookat_coontrol',
            [
                'label' => '<i class="fa-solid fa-circle-o"></i> ' . esc_html__('Reset Lookat Control', 'mesh3d'),
                'type' => \Elementor\Controls_Manager::BUTTON,
                'button_type' => 'default green',
                'show_label' => false,
                'text' => '<i class="fas fa-bullseye"></i> ' . esc_html__('Reset camera', 'mesh3d'),
                'event' => 'reset:editor:controls',
                
            ]
        );
    
    }
}
