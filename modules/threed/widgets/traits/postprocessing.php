<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * postprocessing
 *
 * @author poglie
 */
trait Postprocessing {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_postprocessing_controls($target, $suffix = '') {
        // POSITION
        $target->add_control(
            'heading_postprocessing_bokeh', [
                'label' => esc_html__('Bokeh', 'mesh3d'),
                'type' => Controls_Manager::HEADING
            ]
        );
        $target->add_control(
            'postprocessing_type', [
                'label' => esc_html__('Geometry Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    
                    'dots' => esc_html__('Dots', 'mesh3d'),
                    'halftone' => esc_html__('Halftone', 'mesh3d'),
                    'pixelate'   => esc_html__('Pixel', 'mesh3d'),
                    'sobel'   => esc_html__('Sobel', 'mesh3d'),
                    'bloom'   => esc_html__('Bloom', 'mesh3d'),
                    'noise'   => esc_html__('Noise', 'mesh3d'),
                    'depthBlur' => esc_html__('Depth Blur', 'mesh3d'),
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'dots',
                
            ]
        );
        

        // --------------------------------- Dots
        /*
       uniforms: {
			'tDiffuse': {
				value: null
			},
			'tSize': {
				value: new THREE.Vector2( 256, 256 )
			},
			'center': {
				value: new THREE.Vector2( 0.5, 0.5 )
			},
			'angle': {
				value: 1.57
			},
			'scale': {
				value: 1.0
			}
		}
        */
        $target->add_control(
            'postprocessing_dotsize', [
                'label' => esc_html__('Dot Size', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 5,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 1,
                        'max' => 50,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'postprocessing_type' => 'dots'
                ]
            ]
        );
        // --------------------------------- Pixel
        /*
        uniforms: {
			'tDiffuse': {
				value: null
			},
			'resolution': {
				value: null
			},
			'pixelSize': {
				value: 1
			}
		}
        */
        $target->add_control(
            'postprocessing_pixelsize', [
                'label' => esc_html__('Pixel Size', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 5,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 1,
                        'max' => 50,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'postprocessing_type' => 'pixelate'
                ]
            ]
        );

        // --------------------------------- Halftone
        /*
        uniforms: {
			'tDiffuse': {
				value: null
			},
			'shape': {
				value: 1
			},
			'radius': {
				value: 4
			},
			'rotateR': {
				value: Math.PI / 12 * 1
			},
			'rotateG': {
				value: Math.PI / 12 * 2
			},
			'rotateB': {
				value: Math.PI / 12 * 3
			},
			'scatter': {
				value: 0
			},
			'width': {
				value: 1
			},
			'height': {
				value: 1
			},
			'blending': {
				value: 1
			},
			'blendingMode': {
				value: 1
			},
			'greyscale': {
				value: false
			},
			'disable': {
				value: false
			}
		}
        */
        $target->add_control(
            'postprocessing_halfRadius', [
                'label' => esc_html__('Half Radius', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 5,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 1,
                        'max' => 50,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'postprocessing_type' => 'halftone'
                ]
            ]
        );
        $target->add_control(
            'postprocessing_halfShape', [
                'label' => esc_html__('Half Shape', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    '1' => esc_html__('Dots', 'mesh3d'),
                    '2' => esc_html__('Ellipse', 'mesh3d'),
                    '3' => esc_html__('Line', 'mesh3d'),
                    '4'   => esc_html__('Square', 'mesh3d'),
                    
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => '1',
                'condition' => [
                    'postprocessing_type' => 'halftone'
                ]
            ]
        );
        // --------------------------------- Bloom
        /*
        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = params.bloomThreshold;
        bloomPass.strength = params.bloomStrength;
        bloomPass.radius = params.bloomRadius;
        */

        // --------------------------------- Noise




        // --------------------------------- Depth Blur
        $target->add_control(
            'postprocessing_focus',
            [
                'label' => esc_html__('Focus', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 3000,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'postprocessing_type' => 'depthBlur'
                ]
            ]
        );
        $target->add_control(
            'postprocessing_aperture',
            [
                'label' => esc_html__('Aperture', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 5,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 10,
                        'step' => 0.1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'postprocessing_type' => 'depthBlur'
                ]
            ]
        );
        $target->add_control(
            'postprocessing_maxblur',
            [
                'label' => esc_html__('MaxBlur', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0.01,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 0.025,
                        'step' => 0.001,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'postprocessing_type' => 'depthBlur'
                ]
            ]
        );
        // camera near far
        $target->add_control(
            'postprocessing_nearClip',
            [
                'label' => esc_html__('NearClip', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0.1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 3,
                        'step' => 0.1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'postprocessing_type' => 'depthBlur'
                ]
            ]
        );
        $target->add_control(
            'postprocessing_farClip',
            [
                'label' => esc_html__('FarClip', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1000,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 10,
                        'max' => 3000,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'postprocessing_type' => 'depthBlur'
                ]
            ]
        );
    
    }
}
