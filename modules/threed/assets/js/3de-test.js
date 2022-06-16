// https://threejs.org/examples/#webgl_points_sprites
// https://threejs.org/examples/#webgl_points_billboards
// https://threejs.org/examples/#webgl_materials_envmaps
// https://threejs.org/examples/#webgl_materials_lightmap
// https://threejs.org/examples/#webxr_vr_cubes
// https://threejs.org/examples/#webgl_geometry_convex

import * as THREE from 'https://unpkg.com/three@0.139.0/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.139.0/examples/jsm/controls/OrbitControls.js';

		
			
jQuery(window).on('elementor/frontend/init', () => {

    
    class WidgetThreedGeomeryHandlerClass extends elementorModules.frontend.handlers.Base {
        getDefaultSettings() {
            return {
                selectors: {
                    threedcontainer: '.e-threed-container',
                    threedgeometry: '.threedgeometry-canvas',
                },
            };
        }

        getDefaultElements() {
            const selectors = this.getSettings('selectors');
            return {
                $threedcontainer: this.$element.find(selectors.threedcontainer),
                $threedgeometry: this.$element.find(selectors.threedgeometry),
                $scope: this.$element,
				$id_scope: this.getID(),
            };
        }

        bindEvents() {
            let id_scope = this.elements.$id_scope,
            threedgeometryElement = this.elements.$threedgeometry,
            container = this.elements.$threedcontainer;
            // 
            const canvas = threedgeometryElement[0];
            
            ////////////////////////////////////////////////////////////////////
            
            let camera, controls, scene, renderer;

			init();
			//render(); // remove when using next line for animation loop (requestAnimationFrame)

			function init() {
                alert('init');

			}

            ////////////////////////////////////////////////////////////////////
            

        }
        
       
    }

    const ThreedGeomeryHandler = ($element) => {
        elementorFrontend.elementsHandler.addHandler(WidgetThreedGeomeryHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-geometry.default', ThreedGeomeryHandler);
});