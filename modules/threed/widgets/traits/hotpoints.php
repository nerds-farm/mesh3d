<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;
use Elementor\Group_Control_Typography;
use Elementor\Repeater;

/**
 * hotpoints
 *
 * @author poglie
 */
trait Hotpoints {

    public function add_hotpoints_controls($target, $suffix = '') {
        $module_url = $this->get_module_url();
        $target->add_control(
            'hp_render_in', [
                'label' => esc_html__('Render In', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                'options' => [
                    'scene' => esc_html__('Scene', 'mesh3d'),
                    'object' => esc_html__('Object', 'mesh3d'),
                ],
                'frontend_available' => true,
                //'render_type' => 'ui',
                'default' => 'scene',
            ]
        );
        $target->add_control(
            'hp_render_in_id',
            [
                'label' => esc_html__('Object ID', 'mesh3d'),
                'type' => Controls_Manager::TEXT,
                'description' => esc_html__('Scrivi l\'id che vedi scritto nel blocco Object3d.', 'mesh3d'),
                'options' => false,
                'frontend_available' => true,
                //'render_type' => 'ui',
                'condition' => [
                    'hp_render_in' => 'object',
                ],
            ]
        );
        $target->add_control(
            'hp_trigggers', [
                'label' => esc_html__('Triggers', 'mesh3d'),
                'type' => Controls_Manager::SELECT2,
                'multiple' => true,
                'label_block' => true,
                'separator' => 'before',
                'options' => [
                    'click' => esc_html__('Click to marker', 'mesh3d'),
                    'linkid' => esc_html__('Link ID', 'mesh3d'),
                    'sectionid' => esc_html__('Scroll by ID', 'mesh3d'),
                    'scroll' => esc_html__('Scroll Body', 'mesh3d'),
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => ['click'],
                
            ]
        );
        $target->add_control(
            'hp_on_liknkid', [
                'label' => esc_html__('On link-id', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                'label_block' => true,
                'options' => [
                    'click' => esc_html__('Click', 'mesh3d'),
                    'mouseover' => esc_html__('Hover', 'mesh3d'),
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'click',
                'condition' => [
                    'hp_trigggers' => 'linkid',
                ],
            ]
        );







        //enable target lookat
        // questo è utile per vedere il risultato in tempo reale
        $target->add_control(
            'enable_hplookattarget', [
                'label' => esc_html__('Enable Lookat to target', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $repeater = new Repeater();
        $repeater->add_control(
            'hp_text', [
                'label' => esc_html__('Label', 'mesh3d'),
                //'description' => esc_html__('Text in tooltip', 'mesh3d'),
                'type' => Controls_Manager::TEXTAREA,
                'default' => '',
                'render_type' => 'ui',
            ]
        );
        
        $repeater->add_control(
            'hp_anchorid',
            [
                'label' => esc_html__('Anchor ID', 'mesh3d'),
                'type' => Controls_Manager::TEXT,
                'description' => esc_html__('Scrivi l\'id anchora che hai assegnato al click di un bottone (senza #) oppure l\'id della section per attivare le hopoints durante lo scroll.', 'mesh3d'),
                'options' => false,
                'separator' => 'before',
                'render_type' => 'ui',
            ]
        );
        $repeater->add_control(
            'heading_hp_target', [
                'label' => esc_html__('Target Position', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
            ]
        );
        $repeater->add_control(
            'hp_x',
            [
                'label' => esc_html__( 'X', 'mesh3d' ),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0,
                ],
                'range' => [
                    'px' => [
                        'min' => -5,
                        'max' => 5,
                        'step' => 0.01,
                    ],
                ],
                'render_type' => 'ui',
            ]
        );
        $repeater->add_control(
            'hp_y',
            [
                'label' => esc_html__( 'Y', 'mesh3d' ),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0,
                ],
                'range' => [
                    'px' => [
                        'min' => -5,
                        'max' => 5,
                        'step' => 0.01,
                    ],
                ],
                'render_type' => 'ui',
            ]
        );
        $repeater->add_control(
            'hp_z',
            [
                'label' => esc_html__( 'Z', 'mesh3d' ),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0,
                ],
                'range' => [
                    'px' => [
                        'min' => -5,
                        'max' => 5,
                        'step' => 0.01,
                    ],
                ],
                'render_type' => 'ui',
            ]
        );
        
        
        
        $repeater->add_control(
            'hotpoint_lookat',
            [
                'label' => esc_html__('Lookat', 'mesh3d'),
                'type' => \Elementor\Controls_Manager::BUTTON,
                'button_type' => 'default green',
                'show_label' => false,
                'text' => '<i class="fas fa-bullseye"></i> ' . esc_html__('Lookat', 'mesh3d'),
                'event' => 'threed:editor:lookat',
                
            ]
        );
        $repeater->add_control(
            'hotpoint_reset',
            [
                'label' => esc_html__('Reset', 'mesh3d'),
                'type' => \Elementor\Controls_Manager::BUTTON,
                'button_type' => 'default green',
                'show_label' => false,
                'text' => '<i class="fas fa-bullseye"></i> ' . esc_html__('Reset', 'mesh3d'),
                'event' => 'threed:editor:reset',
                
            ]
        );
        
        $repeater->add_control(
            'heading_cam_position', [
                'label' => esc_html__('Camera', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before'
            ]
        );
        $repeater->add_control(
            'hp_cam_fov',
            [
                'label' => esc_html__( 'Camera Fov', 'mesh3d' ),
                'type' => Controls_Manager::HIDDEN,
                'default' => [
                    'size' => 40,
                ],
                'range' => [
                    'px' => [
                        'min' => 10,
                        'max' => 120,
                        'step' => 1,
                    ],
                ],
                'render_type' => 'ui',
            ]
        );
        
        $repeater->add_control(
            'hp_cam_x',
            [
                'label' => esc_html__( 'Camera X', 'mesh3d' ),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0,
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'render_type' => 'ui',
            ]
        );
        $repeater->add_control(
            'hp_cam_y',
            [
                'label' => esc_html__( 'Camera Y', 'mesh3d' ),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0,
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'render_type' => 'ui',
            ]
        );
        $repeater->add_control(
            'hp_cam_z',
            [
                'label' => esc_html__( 'Camera Z', 'mesh3d' ),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 4,
                ],
                'range' => [
                    'px' => [
                        'min' => -10,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'render_type' => 'ui',
            ]
        );
        $repeater->add_control(
            'hp_cam_zoom',
            [
                'label' => esc_html__( 'Camera Zoom', 'mesh3d' ),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 1,
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 10,
                        'step' => 0.01,
                    ],
                ],
                'render_type' => 'ui',
            ]
        );
        
        
        //
        $target->add_control(
            'threed_hotpoints', [
                'label' => esc_html__('HotPoints', 'mesh3d'),
                'type' => Controls_Manager::REPEATER,
                'prevent_empty' => false,
                'item_actions' => [
                    'add' => true,
                    'duplicate' => true,
                    'remove' => true,
                    'sort' => true,
                ],
                /*'default' => [
					[
						'hp_text' => '',
                        'hp_x' => ['size' => 0],
                        'hp_y' => ['size' => 0],
                        'hp_z' => ['size' => 0],
                        //'hp_cam_fov' => ['size' => 40],
                        'hp_cam_x' => ['size' => 0],
                        'hp_cam_y' => ['size' => 0],
                        'hp_cam_z' => ['size' => 4],
                        'hp_cam_zoom' => ['size' => 1]
					]
				],*/
                'frontend_available' => true,

                'fields' => $repeater->get_controls(),
                'title_field' => '{{{ hp_text }}}',
                
            ]
        );
        $target->add_control(
            'hp_actions', [
                'label' => esc_html__('Actions (todo)', 'mesh3d'),
                'type' => Controls_Manager::SELECT2,
                'multiple' => true,
                'label_block' => true,
                'separator' => 'before',
                'options' => [
                    'cam_position' => esc_html__('Camera Position', 'mesh3d'),
                    'mixer_animation' => esc_html__('Mixer Animation Index', 'mesh3d'),
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'cam_position',
            ]
        );

        $target->add_control(
            'marker_type', [
                'label' => esc_html__('Marker Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                'options' => [
                    'none' => 'none',
                    'default' => 'Shape',
                    //'image' => 'Custom Image (todo)',
                    
                ],
                'frontend_available' => true,
                'separator' => 'before',
                'render_type' => 'ui',
                'default' => 'default',
                'description' => esc_html__('NOTE: if "none" it will still be seen in the editor to allow the work, but it will be hidden in frontend.', 'mesh3d'),
                
            ]
        );
        $this->add_control(
            'marker_sahpe_style', [
                'label' => esc_html__('Shape Style', 'mesh3d'),
                'type' => 'ui_selector',
                'toggle' => false,
                'type_selector' => 'image',
                'columns_grid' => 5,
                'label_block' => true,
                'options' => [
                    'M75,0c41.4,0,75,33.6,75,75s-33.6,75-75,75S0,116.4,0,75S33.6,0,75,0z' => [
                        'title' => esc_html__('Path 1', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path1.svg',
                    ],
                    'M75,12.9c-17.2-17.1-45-17.1-62.1,0s-17.2,45,0,62.1l0,0L75,137.1L137,75.1c0,0,0.1-0.1,0.1-0.1c17.2-17.2,17.2-45,0-62.1S92.2-4.3,75,12.9L75,12.9L75,12.9z' => [
                        'title' => esc_html__('Path 2', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path2.svg',
                    ],
                    'M45,6.5h75l37.5,65l-37.5,65H45l-37.5-65L45,6.5z' => [
                        'title' => esc_html__('Path 3', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path3.svg',
                    ],
                    'M75,0l75,54.5l-28.6,88.2H28.6L0,54.5L75,0z' => [
                        'title' => esc_html__('Path 4', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path4.svg',
                    ],
                    'M75,0l75,129.9H0L75,0z' => [
                        'title' => esc_html__('Path 5', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path5.svg',
                    ],
                    'M75,0l23.2,47l51.8,7.5L112.5,91l8.9,51.6L75,118.3l-46.4,24.4L37.5,91L0,54.5L51.8,47L75,0z' => [
                        'title' => esc_html__('Path 6', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path6.svg',
                    ],
                    'M75,0l75,75l-75,75L0,75L75,0z' => [
                        'title' => esc_html__('Path 7', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path7.svg',
                    ],
                    'M65,0l65,37.5v75L65,150L0,112.5v-75L65,0z' => [
                        'title' => esc_html__('Path 8', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path8.svg',
                    ],
                    'M73.7,31.7c59.6-66,108-17.6,42,42c66,59.6,17.6,108-42,42c-59.6,66-108,17.6-42-42C-34.3,14.1,14.1-34.3,73.7,31.7z' => [
                        'title' => esc_html__('Path 9', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path9.svg',
                    ],
                    'M0,0h150L75,129.9L0,0z' => [
                        'title' => esc_html__('Path 10', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path10.svg',
                    ],
                    'M52.2,4c0,0,48.2,33.6,48.2,75s-48.2,75-48.2,75S4,120.4,4,79S52.2,4,52.2,4' => [
                        'title' => esc_html__('Path 11', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path11.svg',
                    ],
                    'M154,56.5c0,29-33.6,52.5-75,52.5S4,85.5,4,56.5S37.6,4,79,4S154,27.5,154,56.5z' => [
                        'title' => esc_html__('Path 11', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path12.svg',
                    ],
                    'M87.9,50.6l19.3-34.7l-0.7,39.7l34.1-20.4l-20.4,34.1l39.7-0.7l-34.7,19.3l34.7,19.3l-39.7-0.7l20.4,34.1
                        l-34.1-20.4l0.7,39.7l-19.3-34.7l-19.3,34.7l0.7-39.7l-34.1,20.4l20.4-34.1l-39.7,0.7l34.7-19.3L15.9,68.6l39.7,0.7L35.2,35.2
                        l34.1,20.4l-0.7-39.7L87.9,50.6z' => [
                        'title' => esc_html__('Path 11', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path13.svg',
                    ],
                    'M111.2,117.1l8.4,16l-21.8,11.4L89,127.8c-3.9,0.9-7.9,1.3-12.1,1.3c-3.7,0-7.3-0.4-10.8-1.1L59,144.6
                        l-22.6-9.7l7.3-17.1c-6.2-4.7-11.4-10.8-15.1-17.7L11.7,105L4.9,81.3l17.2-4.9c0-0.7-0.1-1.4-0.1-2.1c0-7.6,1.5-14.8,4.3-21.4
                        l-13.8-9.6l14.1-20.2L40.9,33c7.1-6.2,15.8-10.6,25.5-12.5V4H91v17.4c8,2.1,15.2,6,21.3,11.2l13.1-10.7L141,40.9l-13.9,11.3
                        c3,6.8,4.6,14.2,4.6,22.1c0,0.3,0,0.7,0,1l17.2,3.5l-5,24.1l-18.2-3.7C122.2,106.2,117.2,112.3,111.2,117.1z' => [
                        'title' => esc_html__('Path 11', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path14.svg',
                    ],
                    'custom' => [
                        'title' => esc_html__('Path 11', 'mesh3d'),
                        'return_val' => 'val',
                        'image' => $module_url . 'assets/img/shapes/path15.svg',
                    ],
                ],
                'condition' => [
                    'marker_type' => 'default',
                ],
                'default' => 'M75,0c41.4,0,75,33.6,75,75s-33.6,75-75,75S0,116.4,0,75S33.6,0,75,0z',
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $this->add_control(
                'marker_sahpe_custom',
                [
                    'label' => 'Path',
                    'description' => esc_html__('Enter your coordinates path in the base size 150x150px.', 'mesh3d'),
                    'type' => Controls_Manager::TEXTAREA,
                    'dynamic' => [
                        'active' => true,
                    ],
                    'default' => 'M140.8,140.8H0V0h140.8V140.8z',
                    'placeholder' => esc_html__('Enter your coordinates path', 'mesh3d'),
                    'rows' => 10,
                    'separator' => 'none',
                    'condition' => [
                        'marker_type' => 'default',
                        'marker_sahpe_style' => 'custom'
                    ],
                    'frontend_available' => true,
                    'render_type' => 'ui',
                ]
        );
        $target->add_control(
            'marker_color',
            [
                'label' => __('Color', 'elementor'),
                'type' => Controls_Manager::COLOR,
                'default' => '#FF0000',
                'condition' => [
                    'marker_type' => 'default',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'marker_size',
            [
                'label' => esc_html__( 'Size', 'mesh3d' ),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 1,
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 2,
                        'step' => 0.1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'marker_custom_image',[
                'label' => __( 'Marker Image (todo)', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'marker_type' => 'image',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        //TOOLTIP
        $target->add_control(
            'enable_tt', [
                'label' => esc_html__('Enable Tooltip', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'separator' => 'before',                
            ]
        );

        $target->add_control(
            'tt_color_panel',
            [
                'label' => __('Panel Color', 'mesh3d'),
                'type' => Controls_Manager::COLOR,
                'default' => '',
                'condition' => [
                    'enable_tt!' => '',
                ],
                'selectors' => [
                    '{{WRAPPER}} .e-3d-tooltip{{CURRENT_ITEM}} span.e-3d-tt' => 'background-color: {{VALUE}};'
                ]
            ]
        );

        $target->add_control(
            'tt_color_text',
            [
                'label' => __('Text Color', 'mesh3d'),
                'type' => Controls_Manager::COLOR,
                'default' => '',
                'condition' => [
                    'enable_tt!' => '',
                ],
                'selectors' => [
                    '{{WRAPPER}} .e-3d-tooltip{{CURRENT_ITEM}} span.e-3d-tt' => 'color: {{VALUE}};'
                ]
            ]
        );
        $target->add_group_control(
            Group_Control_Typography::get_type(), [
                'name' => 'tt_typography',
                'label' => esc_html__('Typography', 'mesh3d'),
                'selector' => '{{WRAPPER}} .e-3d-tooltip{{CURRENT_ITEM}} span.e-3d-tt',
                'separator' => 'before',
                'condition' => [
                    'enable_tt!' => '',
                ]
            ]
        );

        $target->add_control(
            'tt_padding_panel',
            [
                'label' => __('Panel Padding', 'elementor'),
                'type' => Controls_Manager::DIMENSIONS,
                //'size_units' => ['px', 'em', '%'],
                'selectors' => [
                    '{{WRAPPER}} .e-3d-tooltip{{CURRENT_ITEM}} span.e-3d-tt' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};'
                ],
                'condition' => [
                    'enable_tt!' => '',
                ]
            ]
        );
        $target->add_control(
            'tt_radius_panel',
            [
                'label' => esc_html__( 'Panel Radius', 'mesh3d' ),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => '',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 30,
                        'step' => 1,
                    ],
                ],
                'selectors' => [
                    '{{WRAPPER}} .e-3d-tooltip{{CURRENT_ITEM}} span.e-3d-tt' => 'border-radius: {{SIZE}}{{UNIT}};'
                ],
                'condition' => [
                    'enable_tt!' => '',
                ]
            ]
        );
    }
}
