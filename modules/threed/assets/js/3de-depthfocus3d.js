jQuery(window).on('elementor/frontend/init', () => {

    
    class WidgetThreedDepthfocusHandlerClass extends elementorModules.frontend.handlers.Base {
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
                $threeddepthfocus: null
            };
        }

        bindEvents() {
            this.id_scope = this.elements.$id_scope;
            this.scope = this.elements.$scope;

            this.threedscene = null;
            this.threeddepthfocus = null;
            // -------------------------------------------------------- DEPTHFOCUS (this.threedscene)
            let generateElement = () => {
                
                this.threeddepthfocus = new e_threed_class_depthfocus(this.threedscene,this.elements);
                this.threeddepthfocus.add_depthfocus(this.id_scope, this.getElementSettings());
             }
             //this.scope.data('DEPTHFOCUS3D',generateElement);
            
            // -------------------------------------------------------- SCENE (this.threedscene)
            // risalgo al contenitore e ne ricavo la scena che contiene l'istanza 3d
            let thescene = this.scope.closest('.elementor-element.elementor-section, .elementor-element.e-container').find('.elementor-widget-e-3d-scene');
            if(thescene.data('THREED')){
                this.threedscene = thescene.data('THREED');
                generateElement();
            }else{
                alert('Depthfocus: Manca la scena!');
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
            
            if(this.threeddepthfocus){
                this.threeddepthfocus.delete_depthfocus(this.id_scope);
            }
            
        }
        onElementChange(propertyName) {
            // scopeid, proprietà, settings, is multiple
            this.threeddepthfocus.elementChange(this.id_scope, propertyName, this.getElementSettings(), true);
        }
    }

    const ThreedDepthfocusHandler = ($element) => {
        elementorFrontend.elementsHandler.addHandler(WidgetThreedDepthfocusHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-depthfocus.default', ThreedDepthfocusHandler);
});