<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * Primitive
 *
 * @author poglie
 */
trait Primitive {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_primitive_controls($target, $suffix = '') {
        
        $target->add_control(
            'geometry_type', [
                'label' => esc_html__('Geometry Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    'cube' => esc_html__('Cube', 'mesh3d'),
                    'sphere' => esc_html__('Sphere', 'mesh3d'),
                    'torus' => esc_html__('Torus', 'mesh3d'),
                    'octahedron'   => esc_html__('Octahedron', 'mesh3d'),
                    'dodecaedro'   => esc_html__('Dodecaedro', 'mesh3d'),
                    'cylinder'   => esc_html__('Cylinder', 'mesh3d'),
                    'cone'   => esc_html__('Cone', 'mesh3d'),
                    'piramid'   => esc_html__('Piramid', 'mesh3d'),
                    'tetrahedron'   => esc_html__('Tetrahedron', 'mesh3d'),
                    'plane'   => esc_html__('Plane', 'mesh3d'),
                    'icosahedro'   => esc_html__('Icosahedro', 'mesh3d'),
                    'svg'   => esc_html__('SVG', 'mesh3d'),
                    'import'   => esc_html__('Import', 'mesh3d'),
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'cube',
                
            ]
        );

        

        // OPTION PARAMS -----------------------------------------
        /*
        $target->add_control(
            'object_3d',[
                'label' => __( 'Upload object', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'geometry_type' => ['import']
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        */
        $target->add_control(
            'import_folder_path', [
                'label' => esc_html__('Folder URL', 'mesh3d'),
                'description' => esc_html__('Set the absolute URl to folder.  (ex: http://localhost:8888/threed/examples/models/obj/)', 'mesh3d'),
                'type' => Controls_Manager::TEXTAREA,
                'label_block' => true,
                'default' => '',
                'dynamic' => [
                    'active' => true,
                  ],
                'frontend_available' => true,
                'condition' => [
                    'geometry_type' => ['import']
                ],
            ]
        );
        /*
        $mime_types['stl']  = 'application/octet-stream';
	    $mime_types['wrl']  = 'model/vrml';
	    $mime_types['glb']  = 'model/gltf-binary';
	    $mime_types['gltf']  = 'model/gltf-json';
	    $mime_types['obj']  = 'text/plain';
	    $mime_types['zip']  = 'application/zip';
        */
        $target->add_control(
            'import_format_type', [
                'label' => esc_html__('Format Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    'obj' => esc_html__('OBJ', 'mesh3d'),
                    'gltf' => esc_html__('GLTF (gltf-json)', 'mesh3d'),
                    'glb' => esc_html__('GLB (gltf-binary)', 'mesh3d'),
                    'dae' => esc_html__('DAE (Collada)', 'mesh3d'),
                    'fbx' => esc_html__('FBX', 'mesh3d')

                    //'wrl'   => esc_html__('WRL (vrml)', 'mesh3d'),
                    //'zip'   => esc_html__('ZIP', 'mesh3d'),
                ],
                'frontend_available' => true,
                //'render_type' => 'ui',
                'default' => 'obj',
                'condition' => [
                    'geometry_type' => ['import']
                ],
            ]
        );
        
        /*$target->add_control(
            'object_3d',
            [
                'label' => esc_html__('Object 3D - DEPRECATO', 'mesh3d'),
                'type' => 'file',
                'placeholder' => esc_html__('Select Media', 'elementor'),
                
                'separator' => 'before',
                'condition' => [
                    'geometry_type' => ['import']
                ],
                'frontend_available' => true,

            ]
        );*/
        $target->add_control(
            'import_file_name', [
                'label' => esc_html__('File Name', 'mesh3d'),
                'description' => esc_html__('The name of file.', 'mesh3d'),
                'type' => Controls_Manager::TEXT,
                'label_block' => true,
                'default' => '',
                'dynamic' => [
                    'active' => true,
                  ],
                'condition' => [
                    'geometry_type' => ['import']
                ],
                'frontend_available' => true,
            ]
        );
        //import OPTIONS
        $target->add_control(
            'import_useCustomMaterial', [
                'label' => esc_html__('Use Custom Material', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'geometry_type' => ['import'],
                ],
                'frontend_available' => true,
                //'render_type' => 'ui',
            ]
        );
        
        $target->add_control(
            'import_mtl', [
                'label' => esc_html__('Apply .MTL', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'geometry_type' => ['import'],
                    'import_format_type' => 'obj',
                    'import_useCustomMaterial' => '' 
                ],
                'frontend_available' => true,
                //'render_type' => 'ui',
            ]
        );

        //ANIMATION MIXER
        $target->add_control(
            'import_animationMixer', [
                'label' => esc_html__('AnimationMixer', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'condition' => [
                    'geometry_type' => ['import'],
                    'import_format_type' => ['gltf','fbx','dae']
                ],
                'frontend_available' => true,
                //'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'index_animationMixer', [
                'label' => esc_html__('Index animations', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 0,
                'max' => 50,
                'default' => 0,
                'condition' => [
                    'import_animationMixer!' => '',
                    'import_format_type' => ['gltf','fbx','dae']
                ],
                'frontend_available' => true,
                //'render_type' => 'ui',
            ]
        );
        
        $target->add_control(
			'geometry_svg',
			[
				'label' => esc_html__( 'SVG', 'mesh3d' ),
                'description' => esc_html__('Set your svg on a 500x500 sheet', 'mesh3d'),
				'type' => \Elementor\Controls_Manager::ICONS,
				'default' => [
					'value' => '',
				],
                'skin' => 'inline',
                'exclude_inline_options' => [ 'icon' ],
                'condition' => [
                    'geometry_type' => ['svg']
                ]
			]
		);



        // PROPRIETA' 
        // ------- size ------
        $target->add_control(
            'size_heading', [
                'label' => esc_html__('Size', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'condition' => [
                    'geometry_type!' => ['import']
                ]
            ]
        );
        // x-width = 2,
        $target->add_control(
            'geometry_svg_depth',
            [
                'label' => esc_html__('SVG depth', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 16,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 200,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['svg']
                ],
                'condition' => [
                    'geometry_type' => ['svg']
                ]
            ]
        );

        // x-width = 2,
        $target->add_control(
            'geometry_width',
            [
                'label' => esc_html__('Width', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 2,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 3,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['cube','plane']
                ]
            ]
        );
        // y-height = 2,
        $target->add_control(
            'geometry_height',
            [
                'label' => esc_html__('Height', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 2,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 3,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['cube','cylinder','plane']
                ]
            ]
        );
        // z-depth = 2,
        $target->add_control(
            'geometry_depth',
            [
                'label' => esc_html__('Depth', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 2,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 3,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['cube']
                ]
            ]
        );
        // radius = 1,             // 0.1
        $target->add_control(
            'geometry_radius',
            [
                'label' => esc_html__('Radius', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 2,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['sphere','cone','piramid','torus','dodecaedro','octahedron','tetrahedron','icosahedro']
                ]
            ]
        );
        //cylinder(radiusTop,radiusBottom)
        $target->add_control(
            'geometry_cylinder_radiusTop',
            [
                'label' => esc_html__('Radius Top', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 3,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['cylinder']
                ]
            ]
        );
        $target->add_control(
            'geometry_cylinder_radiusBottom',
            [
                'label' => esc_html__('Radius Bottom', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 3,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['cylinder']
                ]
            ]
        );

        //cone
        //coneHeigh ...
        $target->add_control(
            'geometry_coneHeigh',
            [
                'label' => esc_html__('Cone Heigh', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 2,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 1,
                        'max' => 3,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['cone','piramid']
                ]
            ]
        );
        //torus
        $target->add_control(
            'geometry_tubeRadius',
            [
                'label' => esc_html__('Tube Radius', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0.5,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 2,
                        'step' => 0.01,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['torus']
                ]
            ]
        );
        

        // ------- detail ------
        $target->add_control(
            'detail_heading', [
                'label' => esc_html__('Detail', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'geometry_type' => ['octahedron','dodecaedro','tetrahedron','icosahedro']
                ]
            ]
        );
        $target->add_control(
            'geometry_detail',
            [
                'label' => esc_html__('Detail', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 5,
                        'step' => 1,
                    ],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'geometry_type' => ['octahedron','dodecaedro','tetrahedron','icosahedro']
                ]
            ]
        );

        // ------- segments ------
        $target->add_control(
            'segments_heading', [
                'label' => esc_html__('Segments', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'geometry_type' => ['cube','sphere','plane','cylinder','torus','cone','piramid']
                ],
            ]
        );
        // widthSegments = 4,       // 1/20  ...
        $target->add_control(
            'geometry_widthSegments', [
                'label' => esc_html__('Width Segments', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 1,
                'max' => 50,
                'default' => 4,
                'condition' => [
                    'geometry_type' => ['cube','sphere','plane']
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        
        // heightSegments = 4,      // 1/20  ...
        $target->add_control(
            'geometry_heightSegments', [
                'label' => esc_html__('Height Segments', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 1,
                'max' => 50,
                'default' => 4,
                'condition' => [
                    'geometry_type' => ['cube','sphere','plane','cylinder']
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        
        // depthSegments = 4,       // 1/20  ...
        $target->add_control(
            'geometry_depthSegments', [
                'label' => esc_html__('Depth Segments', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 1,
                'max' => 50,
                'default' => 4,
                'condition' => [
                    'geometry_type' => ['cube']
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        
        // radialSegments = 12,     // 3/50  ...
        $target->add_control(
            'geometry_radialSegments', [
                'label' => esc_html__('Radial Segments', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 3,
                'max' => 50,
                'default' => 10,
                'condition' => [
                    'geometry_type' => ['torus','cylinder','cone','piramid']
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        
        //torus
        $target->add_control(
            'geometry_tubularSegments', [
                'label' => esc_html__('Tubular Segments', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 3,
                'max' => 100,
                'default' => 10,
                'condition' => [
                    'geometry_type' => ['torus']
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
    
    }
}
