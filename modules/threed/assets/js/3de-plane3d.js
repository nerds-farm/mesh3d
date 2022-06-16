jQuery(window).on('elementor/frontend/init', () => {

    
    class WidgetThreedPlaneHandlerClass extends elementorModules.frontend.handlers.Base {
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
                $threedplane: null
            };
        }

        bindEvents() {
 
            this.id_scope = this.elements.$id_scope;
            this.scope = this.elements.$scope;

            this.threedscene = null;
            this.threedplane = null;
            // -------------------------------------------------------- PLANE (this.threedscene)
            let generateElement = () => {
                this.threedplane = new e_threed_class_plane(this.threedscene,this.elements);
                this.threedplane.add_plane(this.id_scope, this.getElementSettings());
             }
             //this.scope.data('PLANE3D',generateElement);
            
            // -------------------------------------------------------- SCENE (this.threedscene)
            // risalgo al contenitore e ne ricavo la scena che contiene l'istanza 3d
            let thescene = this.scope.closest('.elementor-element.elementor-section, .elementor-element.e-container').find('.elementor-widget-e-3d-scene');
            if(thescene.data('THREED')){
                this.threedscene = thescene.data('THREED');
                generateElement();
            }else{
                alert('Plane: Manca la scena!');
            }
            // --------------------------------------------------------
            
            


            // if (this.isEdit()){
            // elementor.channels.editor.on('change',function( view ) {
            //     var changed = view.elementSettingsModel.changed;
            //     console.log( changed );
            // });
            
            
            
        }
        onDestroy() {
            super.onDestroy();
            
            if(this.threedplane){
                this.threedplane.delete_plane(this.id_scope);
            }
            
        }
        onElementChange(propertyName) {
            // scopeid, proprietà, settings, is multiple
            this.threedplane.elementChange(this.id_scope, propertyName, this.getElementSettings(), true);
        }
    }

    const ThreedPlaneHandler = ($element) => {
        elementorFrontend.elementsHandler.addHandler(WidgetThreedPlaneHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-plane.default', ThreedPlaneHandler);
});