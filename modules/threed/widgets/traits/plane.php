<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * plane
 *
 * @author poglie
 */
trait Plane {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_plane_controls($target, $suffix = '') {
        $target->add_control(
            'uc_message',
            [
                'type' => Controls_Manager::RAW_HTML,
                'show_label' => false,
                'raw' => esc_html__('This widget in under construction.', 'mesh3d'),
                'separator' => 'before',
            ]
        );
    
    }
}
