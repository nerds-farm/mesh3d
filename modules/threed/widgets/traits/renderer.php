<?php
namespace Mesh3d\Modules\Threed\Widgets\Traits;

use Elementor\Controls_Manager;


/**
 * renderer
 *
 * @author poglie
 */
trait Renderer {

    // ++++++++++++++++++++++ Close ++++++++++++++++++++++
    public function add_renderer_controls($target, $suffix = '') {
        
       
        // physicallyCorrectLights
        $target->add_control(
            'renderer_physicallyCorrectLights', [
                'label' => esc_html__('Physically Correct Lights', 'mesh3d'),
                'type' => Controls_Manager::SWITCHER,
                'frontend_available' => true,
                'render_type' => 'ui',
                
            ]
        );


        // outputEncoding
        /*
        THREE.LinearEncoding *default
        THREE.sRGBEncoding
        THREE.BasicDepthPacking
        THREE.RGBADepthPacking
        */
        $target->add_control(
            'renderer_outputEncoding', [
                'label' => esc_html__('Output Encoding', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    'LinearEncoding' => esc_html__('LinearEncoding', 'mesh3d'),
                    'sRGBEncoding' => esc_html__('sRGBEncoding', 'mesh3d'),
                    'BasicDepthPacking' => esc_html__('BasicDepthPacking', 'mesh3d'),
                    'RGBADepthPacking'   => esc_html__('RGBADepthPacking', 'mesh3d'),
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'LinearEncoding',
                
            ]
        );

        // toneMapping
        /*
        THREE.NoToneMapping
        THREE.LinearToneMapping *default
        THREE.ReinhardToneMapping
        THREE.CineonToneMapping
        THREE.ACESFilmicToneMapping
        */
        $target->add_control(
            'renderer_toneMapping', [
                'label' => esc_html__('Tone Mapping', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                
                'options' => [
                    'NoToneMapping' => esc_html__('NoToneMapping', 'mesh3d'),
                    'LinearToneMapping' => esc_html__('LinearToneMapping', 'mesh3d'),
                    'ReinhardToneMapping' => esc_html__('ReinhardToneMapping', 'mesh3d'),
                    'CineonToneMapping'   => esc_html__('CineonToneMapping', 'mesh3d'),
                    'ACESFilmicToneMapping'   => esc_html__('ACESFilmicToneMapping', 'mesh3d'),
                    
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'NoToneMapping',
                
            ]
        );
        /*
        $target->add_control(
            'shadow_type', [
                'label' => esc_html__('Shadow Type', 'mesh3d'),
                'type' => Controls_Manager::SELECT,
                'options' => [
                    'PCFSoftShadowMap' => 'PCFSoft',
                    'BasicShadowMap' => 'Basic',
                    //'VSMShadowMap' => 'VSM', //..@p lo sospendo provvisoriamente
                ],
                'frontend_available' => true,
                'render_type' => 'ui',
                'default' => 'PCFSoftShadowMap',
                
            ]
        );
        */
    }
}
