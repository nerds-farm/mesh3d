<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * material
 *
 * @author poglie
 */
trait Material {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_material_controls($target, $suffix = '') {
        
        $target->add_control(
            'material_type', [
                'label' => esc_html__('Material Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    'wireframeMaterial' => 'Wireframe',
                    'basicMaterial' => 'Basic',
                    'phongMaterial' => 'Phong',
                    'standardMaterial' => 'Standard',
                    'toonMaterial' => 'Toon',
                    'normalMaterial' => 'Normals',
                    //'LambertMaterial' => 'Lambert',
                    
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'wireframeMaterial',
                
            ]
        );
        // material color
        $target->add_control(
            'material_color',
            [
                'label' => __('Mat Color', 'elementor'),
                'type' => Controls_Manager::COLOR,
                'default' => '#CCCCCC',
                'condition' => [
                    'material_type' => ['basicMaterial','phongMaterial','wireframeMaterial','toonMaterial','standardMaterial']
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'enable_transparent', [
                'label' => esc_html__('Transparent', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'separator' => 'before',
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'material_opacity', [
                'label' => esc_html__('Opacity', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1,
                        'step' => 0.01,
                    ],
                ],
                'condition' => [
                    'enable_transparent!' => '',
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // this.textureAlphaPath
        // ALPHA ---------------------------------- 
        $target->add_control(
            'material_alpha_map',[
                'label' => __( '<b>Alpha</b> Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'enable_transparent!' => '',
                    //'material_type' => ['phongMaterial','standardMaterial'],
                    //'material_texture_type' => 'alpha'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );



        // MATERIAL OPTIONS
        $target->add_control(
            'heading_material_textures_options', [
                'label' => esc_html__('Material Options', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
            ]
        );
        // shininess (phong)
        $target->add_control(
            'material_shininess', [
                'label' => esc_html__('Shininess', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 30,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1000,
                        'step' => 1,
                    ],
                ],
                'condition' => [
                    'material_type' => ['phongMaterial'],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'material_reflectivity', [
                'label' => esc_html__('Reflectivity', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1,
                        'step' => 0.001,
                    ],
                ],
                'condition' => [
                    'material_type' => ['phongMaterial'],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // roughness (standard)
        $target->add_control(
            'material_roughness', [
                'label' => esc_html__('Roughness', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1,
                        'step' => 0.001,
                    ],
                ],
                'condition' => [
                    'material_type' => ['standardMaterial'],
                    //'material_texture_type' => 'roughness'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // metalness (standard)
        $target->add_control(
            'material_metalness', [
                'label' => esc_html__('Metalness', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0.5,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1,
                        'step' => 0.001,
                    ],
                ],
                'condition' => [
                    'material_type' => ['standardMaterial'],
                    //'material_texture_type' => 'metalness'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // bump
        $target->add_control(
            'material_bumpscale', [
                'label' => esc_html__('Bump Scale', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0.02,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1,
                        'step' => 0.001,
                    ],
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    'material_bump_map[url]!' => '',
                    //'material_texture_type' => 'bump'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',

            ]
        );
        // displacement
        $target->add_control(
            'material_displacementscale', [
                'label' => esc_html__('Displacement Scale', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 3,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    'material_displacement_map[url]!' => '',
                    //'material_texture_type' => 'displacement'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'material_displacementbias', [
                'label' => esc_html__('Displacement Bias', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -1,
                        'max' => 1,
                        'step' => 0.001,
                    ],
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    'material_displacement_map[url]!' => '',
                    //'material_texture_type' => 'displacement'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // ao intensity
        $target->add_control(
            'material_aointensity', [
                'label' => esc_html__('AO Intensity', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 1,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => 0.1,
                        'max' => 2,
                        'step' => 0.1,
                    ],
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    'material_ao_map[url]!' => ''
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'material_texture_type' => 'ao'
            ]
        );





        // wireframe mode
        $target->add_control(
            'material_wireframe_mode', [
                'label' => esc_html__('Whireframe Mode', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'separator' => 'before',
                'condition' => [
                    'material_type!' => 'wireframeMaterial'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );

        // 
        //reflectivity
        // ENVMAP
        $target->add_control(
            'heading_material_env', [
                'label' => esc_html__('Environment Map from sky', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    'sky_image[url]!' => ''
                ],
                
            ]
        );
        $target->add_control(
            'enable_envmap', [
                'label' => esc_html__('Enable EnvMap', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    'sky_image[url]!' => ''
                ],
            ]
        );




        // TEXTURE
        $target->add_control(
            'heading_material_textures', [
                'label' => esc_html__('Textures', 'mesh3d'),
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'material_type!' => 'wireframeMaterial'
                ],
            ]
        );
        /*$target->add_control(
            'material_texture_type', [
                'label' => esc_html__('Map Type', 'mesh3d'),
                'description' => esc_html__('', 'mesh3d'),
                'type' => Controls_Manager::SELECT2,
                'multiple' => true,
                'label_block' => true,
                'options' => [
                    'texture' => esc_html__('Texture', 'mesh3d'),
                    'bump' => esc_html__('Bump', 'mesh3d'),
                    'alpha' => esc_html__('Alpha', 'mesh3d'),
                    'roughness' => esc_html__('Roughness', 'mesh3d'),
                    'metalness' => esc_html__('Metalness', 'mesh3d'),
                    'normal' => esc_html__('Normal', 'mesh3d'),
                    'env' => esc_html__('Env', 'mesh3d'),
                    'displacement' => esc_html__('Displacement', 'mesh3d'),
                    'ao' => esc_html__('AmbientOcclusion AO', 'mesh3d'),
                    //'light' => esc_html__('', 'mesh3d'),
                    //'emissive' => esc_html__('', 'mesh3d'),
                ],
                'default' => ['texture'],
                'frontend_available' => true,
                

            ]
        );*/

        
        // MAP-TEXTURE -------------------------------------
        $target->add_control(
            'material_texture',[
                'label' => __( '<b>Texture</b> Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'material_type' => ['basicMaterial','phongMaterial','toonMaterial','standardMaterial'],
                    //'material_texture_type' => 'texture'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
         
        // BUMP ---------------------------------- 
        $target->add_control(
            'material_bump_map',[
                'label' => __( '<b>Bump</b> Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    //'material_texture_type' => 'bump'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );

        // this.textureLightPath

        
        // ROUGHNESS -----------------------------------------
        // this.textureRughnessPath
        $target->add_control(
            'material_roughness_map',[
                'label' => __( '<b>Rougness</b> Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    //'material_texture_type' => 'roughness'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // this.textureMetalnessPath
        // METALNESS ---------------------------------- 
        $target->add_control(
            'material_metalness_map',[
                'label' => __( '<b>Metalness</b> Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    //'material_texture_type' => 'metalness'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // this.textureNormalPath
        // NORMAL ---------------------------------- 
        $target->add_control(
            'material_normal_map',[
                'label' => __( '<b>Normal</b> Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    //'material_texture_type' => 'normal'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // this.textureEnvPath
        // ENV ---------------------------------- 
        $target->add_control(
            'material_env_map',[
                'label' => __( '<b>Env</b> Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    //'material_texture_type' => 'env'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // DISPLACEMENT ---------------------------------- 
        $target->add_control(
            'material_displacement_map',[
                'label' => __( '<b>Displacement</b> Image', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    //'material_texture_type' => 'displacement'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        // this.textureAOPath
        // AO ---------------------------------- 
        $target->add_control(
            'material_ao_map',[
                'label' => __( '<b>AmbientOcclusion</b> Image (AO)', 'mesh3d' ),
                'type' => Controls_Manager::MEDIA,
                'dynamic' => [
                    'active' => true,
                ],
                'default' => [
                    'url' => '',
                ],
                'condition' => [
                    'material_type' => ['phongMaterial','standardMaterial'],
                    //'material_texture_type' => 'ao'
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        










        // OPTIONS TEXTURE -----------------------------------
        // texture position x-y (offset)
        $target->add_control(
            'material_texture_offsetx',
            [
                'label' => esc_html__('Offset X', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -2,
                        'max' => 2,
                        'step' => 0.001,
                    ],
                ],
                'condition' => [
                    'material_type!' => ['wireframematerial','normalMaterial'],
                    //'material_texture_type' => ['texture','bump'/*,'alpha','roughness','metalness','normal','env','displacement','ao','light','emissive'*/]
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        $target->add_control(
            'material_texture_offsety',
            [
                'label' => esc_html__('Offset Y', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -2,
                        'max' => 2,
                        'step' => 0.001,
                    ],
                ],
                'condition' => [
                    'material_type!' => ['wireframematerial','normalMaterial'],
                    //'material_texture_type' => ['texture','bump'/*,'alpha','roughness','metalness','normal','env','displacement','ao','light','emissive'*/]
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        // texture center x-y
        /*
        $target->add_control(
            'material_texture_centerx',
            [
                'label' => esc_html__('center X', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -2,
                        'max' => 2,
                        'step' => 0.001,
                    ],
                ],
                'condition' => [
                    'material_type!' => ['wireframematerial','normalMaterial'],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        */
        /*
        $target->add_control(
            'material_texture_centery',
            [
                'label' => esc_html__('center Y', 'mesh3d'),
                'type' => Controls_Manager::SLIDER,
                'label_block' => false,
                'default' => [
                    'size' => 0,
                    'unit' => 'px',
                ],
                'range' => [
                    'px' => [
                        'min' => -2,
                        'max' => 2,
                        'step' => 0.001,
                    ],
                ],
                'condition' => [
                    'material_type!' => ['wireframematerial','normalMaterial'],
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        */
        //TEXTURE repetition
        $target->add_control(
            'material_textureRepX', [
                'label' => esc_html__('Repetition X', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 0.1,
                'max' => 10,
                'step' => 0.1,
                'default' => 1,
                'condition' => [
                    'material_type!' => ['wireframematerial','normalMaterial'],
                    //'material_texture_type' => ['texture','bump'/*,'alpha','roughness','metalness','normal','env','displacement','ao','light','emissive'*/]
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
            ]
        );
        $target->add_control(
            'material_textureRepY', [
                'label' => esc_html__('Repetition Y', 'mesh3d'),
                'type' => Controls_Manager::NUMBER,
                'min' => 0.1,
                'max' => 10,
                'step' => 0.1,
                'default' => 1,
                'condition' => [
                    'material_type!' => ['wireframematerial','normalMaterial'],
                    //'material_texture_type' => ['texture','bump'/*,'alpha','roughness','metalness','normal','env','displacement','ao','light','emissive'*/]
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );
        // texture dimension scale
    
    }
}
