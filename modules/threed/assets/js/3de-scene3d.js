jQuery(window).on('elementor/frontend/init', () => {

    
    class WidgetThreedSceneHandlerClass extends elementorModules.frontend.handlers.Base {
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

            // @p poi li rimuovo.....
            let id_scope = this.elements.$id_scope,
            threedgeometryElement = this.elements.$threedgeometry,
            container = this.elements.$threedcontainer;
            
            // THIS internal global items ... 
            this.scope = this.elements.$scope;
            this.elementSettings = this.getElementSettings(),
            this.canvas = threedgeometryElement[0];
            this.container = container[0];
            this.activeItem = -1;

            this.enablehplookattarget = Boolean(this.elementSettings.enable_hplookattarget);
            
            ////////////////////////////////////////////////////////////////////
            
            
            let THREED = new e_threed_class(this.elements);
            //this.elements.$threed = THREED;
            THREED.init(id_scope,this.elementSettings);
            
            this.scope.data('THREED',THREED);

            //@p queta è una geniata!!! ..ma la sospendo per ora..
            //e_threed_instance[id_scope] = THREED;
            //elementorFrontend.utils.ethreed = e_threed_instance;

            
            // ---------------------- EDITOR CONTROL
            if (this.isEdit){

                //il bottone in options
                elementor.channels.editor.on('reset:editor:controls', (sectionName) => {
                    THREED.updateParamsCamera();
                });

                //quando seleziono i widgets scene/objects3d/points3d/particles3d/postprocessing3d/plane3d/light3d ..
                //1 - attivo l'id attuale 
                //2 - attivo l'evidenziazione se possibile
                elementor.hooks.addAction( 'panel/open_editor/widget', function( panel, model, view ) {
                    // console.log(view.$el);
                    // console.log(model.attributes.elType);
                    // console.log(model.attributes.id);
                    let iam;
                    if ( 'widget' !== model.attributes.elType ) {
                        return;
                    }
                    
                    if(view.$el.hasClass( 'elementor-widget-e-3d-scene' )) iam = 'scene3d';
                    if(view.$el.hasClass( 'elementor-widget-e-3d-object' )) iam = 'object3d';
                    if(view.$el.hasClass( 'elementor-widget-e-3d-points' )) iam = 'points3d';
                    if(view.$el.hasClass( 'elementor-widget-e-3d-light' )) iam = 'light3d';
                    if(view.$el.hasClass( 'elementor-widget-e-3d-plane' )) iam = 'planet3d';
                    if(view.$el.hasClass( 'elementor-widget-e-3d-postprocessing' )) iam = 'postprocessing3d';
                    // alert(iam);
                    //1
                    THREED.setActiveId(model.attributes.id);
                    //2
                    if(iam == 'object3d'){
                        THREED.updateHelperMesh(model.attributes.id);

                        THREED.resetCamera(model.attributes.id);
                    }
                    

                    
                } );
            }
        }
       
        
       
        onElementChange(propertyName) {
            this.elementSettings = this.getElementSettings();
            // scopeid, proprietà, settings, is multiple
            if(this.scope.data('THREED')) this.scope.data('THREED').elementChange(this.elements.$id_scope, propertyName, this.elementSettings, false);
        }
        // onEditSettingsChange(propertyName) {
        //     //console.log(propertyName);

        // }
        
    }

    const ThreedSceneHandler = ($element) => {
        
        elementorFrontend.elementsHandler.addHandler(WidgetThreedSceneHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-scene.default', ThreedSceneHandler);
});