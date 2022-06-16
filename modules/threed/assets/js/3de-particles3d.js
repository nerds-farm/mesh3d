jQuery(window).on('elementor/frontend/init', () => {

    
    class WidgetThreedParticlesHandlerClass extends elementorModules.frontend.handlers.Base {
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
                $threedparticles: null
            };
        }

        bindEvents() {
 
            this.id_scope = this.elements.$id_scope;
            this.scope = this.elements.$scope;

            this.threedscene = null;
            this.threedparticles = null;
            // -------------------------------------------------------- PARTICLES (this.threedscene)
            let generateElement = () => {
                this.threedparticles = new e_threed_class_particles(this.threedscene,this.elements);
                this.threedparticles.add_particles(this.id_scope, this.getElementSettings());
             }
             //this.scope.data('PARTICLES3D',generateElement);
            
            // -------------------------------------------------------- SCENE (this.threedscene)
            // risalgo al contenitore e ne ricavo la scena che contiene l'istanza 3d
            let thescene = this.scope.closest('.elementor-element.elementor-section, .elementor-element.e-container').find('.elementor-widget-e-3d-scene');
            if(thescene.data('THREED')){
                this.threedscene = thescene.data('THREED');
                generateElement();
            }else{
                alert('Particles: Manca la scena!');
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
            
            if(this.threedparticles){
                this.threedparticles.delete_particles(this.id_scope);
            }
            
        }
        onElementChange(propertyName) {
            // scopeid, proprietà, settings, is multiple
            this.threedparticles.elementChange(this.id_scope, propertyName, this.getElementSettings(), true);
        }
    }

    const ThreedParticlesHandler = ($element) => {
        elementorFrontend.elementsHandler.addHandler(WidgetThreedParticlesHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-particles.default', ThreedParticlesHandler);
});