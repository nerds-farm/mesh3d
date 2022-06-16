<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * depthfocus
 *
 * @author poglie
 */
trait Depthfocus {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_depthfocus_controls($target, $suffix = '') {
        // POSITION
        $target->add_control(
            'heading_depthfocus_bokeh', [
                'label' => esc_html__('DepthFocus', 'mesh3d'),
                'type' => Controls_Manager::HEADING
            ]
        );
        
    
    }
}
