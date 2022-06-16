jQuery(window).on('elementor/frontend/init', () => {

    
    class WidgetThreedMeshHandlerClass extends elementorModules.frontend.handlers.Base {
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
            
            ////////////////////////////////////////////////////////////////////
            
            
            let THREED = new e_threed_base(this.elements,this.elementSettings);
            //this.elements.$threed = THREED;
            THREED.init(id_scope);

            this.scope.data('THREED',THREED);
            
            //@p queta è una geniata!!! ..ma la sospendo per ora..
            //e_threed_instance[id_scope] = THREED;
            //elementorFrontend.utils.ethreed = e_threed_instance;

            
            if (elementorFrontend.isEditMode()){
                elementor.channels.editor.on('reset:editor:controls', (sectionName) => {
                    THREED.updateParamsCamera();
                });
                elementor.channels.editor.on('threed:editor:lookat', (sectionName) => {
                    //THREED.setHPposition(this.activeItem);
                    THREED.cameraToTween(this.activeItem)
                });


            
                elementor.channels.editor.on('section:activated', (sectionName, editor) => {
                    var editedElement = editor.getOption('editedElementView');
                    var $elementhp = editor.$el.find( '.elementor-control-threed_hotpoints' );

                    //console.log(editor.activeSection);
                    //console.log(editor);
                    if ('e-3d-mesh' !== editedElement.model.get('widgetType')) {
                        return;
                    }

                    var selectedSection = -1 !== ['section_hotpoints'].indexOf(sectionName);
                    if (selectedSection && editedElement.model.id == this.getID()) {
                        //opeen
                        
                        //console.log('aperto '+$elementhp.find('.elementor-repeater-row-controls .elementor-slider').length);


                        $elementhp.find('.elementor-repeater-fields').each((i,el) => {
                            this.applytrigger_onslider(THREED,i,jQuery(el));
                        });

                        // clicco il bottone aggiungi 
                        $elementhp.on('mousedown', '.elementor-repeater-add',(e) => {
                            setTimeout(()=>{
                                //console.log('nuovo '+$elementhp.find('.elementor-repeater-fields').length);
                                let i = $elementhp.find('.elementor-repeater-fields').length-1;
                                let el = $elementhp.find('.elementor-repeater-fields').eq(i);

                                console.log('ho aggiunto: '+i);

                                // aggiorno l'oggetto "this.hotpointsList" nel THREED..
                                THREED.updateHotpointsList(this.getElementSettings('threed_hotpoints'),i);
                                
                                
                                this.applytrigger_onslider(THREED, i, el);
                            },200);
                        });
                        
                        // $elementhp.on('mousedown', '.elementor-repeater-row-tools',(e) => {

                        // });
                        
                        
                    }
                    if (!selectedSection && editedElement.model.id == this.getID()) {
                        //closee
                        //console.log('chiuso');
                        //var $elementhp = editor.$el.find( '.elementor-control-threed_hotpoints' );
                        $elementhp.off('mousedown', '.elementor-repeater-row-tools');
                        $elementhp.off('mousedown', '.elementor-repeater-add');
                        //$elementhp.find('.elementor-repeater-row-controls .elementor-slider')[0].noUiSlider.off('update');
                        this.activeItem = -1;
                        THREED.resetCamera();
                    }
                });
            }
        }
       
        applytrigger_onslider(threed_instance, i, el){
            //$elementhp.find('.elementor-slider')[0].noUiSlider.off('.hotpoints');
            
                var repeater_index = i;
                var controls = el.find('.elementor-repeater-row-controls');
                var repeater_status = true; //!controls.hasClass('editable');

                el.on('mousedown', '.elementor-repeater-row-tools',(e) => {
                    setTimeout(()=>{
                        var repeater_index = jQuery(e.currentTarget).parent().index();
                        var controls = jQuery(e.currentTarget).next('.elementor-repeater-row-controls');
                        var repeater_status = controls.hasClass('editable');

                        //alert(controls.find('.elementor-control-hp_x .elementor-slider').length);
                        if(!repeater_status){
                            //console.log(repeater_index+' '+repeater_status+'..c');
                        }
                        if(repeater_status){
                            //console.log(repeater_index+' '+repeater_status+'..o');
                        }
                        /*
                        controls.find('.elementor-control-hp_x input').change(function() {
                            console.log(jQuery(this).val());
                        });
                        */
                        
                        if(repeater_status){
                            console.log('ho cliccato: '+repeater_index);
                            this.activeItem = repeater_index;
                            //selezionando l'item del repeater si posiziona 
                            //threed_instance.setHPposition(repeater_index);
                            threed_instance.setHPstatus(repeater_index);
                        }else{
                            threed_instance.setHPstatus(-1);
                        }
                        
                    },200);
                    
                });

                /*
                jQuery(el).find('.elementor-slider')[0].noUiSlider.on('update.hotpoints',function(values) {
                    // console.log(this);//directionSlider.noUiSlider.get()
                    // values[0]
                    //threed_instance.controls.target.x = values[0];
                    //console.log(jQuery(this).closest('.elementor-repeater-fields').length);
                    console.log('change '+repeater_index+' '+repeater_status);

                    //threed_instance.setList_pointx(repeater_index,values[0])
                    //threed_instance.setHPposition(repeater_index);
                });
                */
                // --------------------------

                controls.find('.elementor-control-hp_x .elementor-slider')[0].noUiSlider.on('update.hotpoints',function(values) {
                    threed_instance.setList_pointx(repeater_index,values[0])
                    threed_instance.setHPposition(repeater_index,true)
                });
                controls.find('.elementor-control-hp_y .elementor-slider')[0].noUiSlider.on('update.hotpoints',function(values) {
                    threed_instance.setList_pointy(repeater_index,values[0])
                    threed_instance.setHPposition(repeater_index,true)
                });
                controls.find('.elementor-control-hp_z .elementor-slider')[0].noUiSlider.on('update.hotpoints',function(values) {
                    threed_instance.setList_pointz(repeater_index,values[0])
                    threed_instance.setHPposition(repeater_index,true)
                });
                controls.find('.elementor-control-hp_cam_x .elementor-slider')[0].noUiSlider.on('update.hotpoints',function(values) {
                    threed_instance.setList_camx(repeater_index,values[0])
                    threed_instance.setHPposition(repeater_index);
                });
                controls.find('.elementor-control-hp_cam_y .elementor-slider')[0].noUiSlider.on('update.hotpoints',function(values) {
                    threed_instance.setList_camy(repeater_index,values[0])
                    threed_instance.setHPposition(repeater_index);
                });
                controls.find('.elementor-control-hp_cam_z .elementor-slider')[0].noUiSlider.on('update.hotpoints',function(values) {
                    threed_instance.setList_camz(repeater_index,values[0])
                    threed_instance.setHPposition(repeater_index);
                });
                // controls.find('.elementor-control-hp_cam_fov .elementor-slider')[0].noUiSlider.on('update.hotpoints',function(values) {
                //     threed_instance.setList_camfov(repeater_index,values[0])
                //     threed_instance.setHPposition(repeater_index);
                // });
                controls.find('.elementor-control-hp_cam_zoom .elementor-slider')[0].noUiSlider.on('update.hotpoints',function(values) {
                    threed_instance.setList_camzoom(repeater_index,values[0])
                    threed_instance.setHPposition(repeater_index);
                });
            
        }
       
        onElementChange(propertyName) {
            this.scope.data('THREED').onElementChange(propertyName,this.getElementSettings());
        }
        onEditSettingsChange(propertyName) {
            //console.log(propertyName);

        }
    }

    const ThreedMeshHandler = ($element) => {
        
        elementorFrontend.elementsHandler.addHandler(WidgetThreedMeshHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-mesh.default', ThreedMeshHandler);
});