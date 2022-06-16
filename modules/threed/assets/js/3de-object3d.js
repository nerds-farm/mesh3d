jQuery(window).on('elementor/frontend/init', () => {

    
    class WidgetThreedObjectHandlerClass extends elementorModules.frontend.handlers.Base {
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
                $threed: null
            };
        }

        bindEvents() {
 
            this.id_scope = this.elements.$id_scope;
            this.scope = this.elements.$scope;

            this.threed = null;

            // risalgo al contenitore e ne ricavo la scena che contiene l'istanza 3d
            let thescene = this.scope.closest('.elementor-element.elementor-section, .elementor-element.e-container').find('.elementor-widget-e-3d-scene');

            let generateElement = () => {
                this.threed.generate_object3d(this.id_scope, this.getElementSettings());
            }
            this.scope.data('OBJECT3D',generateElement);


            if(thescene.data('THREED')){
                this.threed = thescene.data('THREED');
                generateElement();
            }else{
                alert('Object: Manca la scena!');
            }
            
            


            // if (this.isEdit()){
            // elementor.channels.editor.on('change',function( view ) {
            //     var changed = view.elementSettingsModel.changed;
            //     console.log( changed );
            // });
            
            // elementor.channels.editor.on('editor:destroy', (editor) => {
            //     alert('xxx');
            // });
            // }
            
        }
        onDestroy() {
            super.onDestroy();
            
            if(this.threed){
                this.threed.delete_object3d(this.id_scope);
            }
            
        }
        onElementChange(propertyName) {
            // scopeid, proprietà, settings, is multiple
            this.threed.elementChange(this.id_scope,propertyName,this.getElementSettings(), true);
        }
    }

    const ThreedObjectHandler = ($element) => {
        
        elementorFrontend.elementsHandler.addHandler(WidgetThreedObjectHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-object.default', ThreedObjectHandler);
});