<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * modifiers
 *
 * @author poglie
 */
trait Modifiers {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_modifiers_controls($target, $suffix = '') {
        
        $target->add_control(
            'modifier_type', [
                'label' => esc_html__('Modifier Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    '' => 'None',
                    'bend'  =>  'Bend',
                    'skew'  =>  'Skew',
                    'twist' =>  'Twist',
                    'cloth' =>  'Cloth'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => '',
                'condition' => [
                    'material_type!' => 'wireframeMaterial',
                ],
            ]
        );


        // --------- bend
        //this.bend.constraint = ModConstant.LEFT; // RIGHT
        //this.bend.force = 0;
        //this.bend.offset = 0.5;
        //this.bend.angle = 0;

        // --------- skew
        //this.twist.angle = Math.PI / 12;

        // --------- twist
        $target->add_control(
            'heading_modifier_twist', [
                'label' => esc_html__('Twist', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'modifier_type' => 'twist',
                ],
            ]
        );
        //this.skew.angle = 0.1;
        $target->add_control(
            'modifier_twist_angle',
            [
                'label' => esc_html__('Twist', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0.2,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -2,
                        'max' => 2,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'modifier_type' => 'twist',
                ]
            ]
        );
        // --------- cloth
        //this.rigidity = 1;
        //this.friction = 0;

    
    }
}
