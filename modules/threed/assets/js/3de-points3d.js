
jQuery(window).on('elementor/frontend/init', () => {

    class WidgetThreedPointsHandlerClass extends elementorModules.frontend.handlers.Base {
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
            this.elementSettings = this.getElementSettings();
            this.threed = null;
            this.enablehplookattarget = Boolean(this.elementSettings.enable_hplookattarget);

            // risalgo al contenitore e ne ricavo la scena che contiene l'istanza 3d
            let thescene = this.scope.closest('.elementor-element.elementor-section, .elementor-element.e-container').find('.elementor-widget-e-3d-scene');

            this.elementsCount = this.elementSettings.threed_hotpoints.length;

            let generateElement = () => {
                this.threed.generate_points3d(this.id_scope, this.elementSettings);
                
            }
            this.scope.data('POINTS3D',generateElement);


            if(thescene.data('THREED')){
                this.threed = thescene.data('THREED');
                generateElement();
            }else{
                alert('Points: Manca la scena!');
            }
            
            // ---------------------- EDITOR CONTROL
            if (this.isEdit){
                
                
                elementor.channels.editor.on('threed:editor:lookat', (sectionName) => {
                    //this.threed.setHPposition(this.id_scope, this.activeItem);
                    this.threed.cameraToTween(this.id_scope,this.activeItem);
                });
                elementor.channels.editor.on('threed:editor:reset', (sectionName) => {
                    //this.threed.setHPposition(this.id_scope, this.activeItem);
                    this.threed.resetCamera(this.id_scope);
                });

                
                
                
                elementor.channels.editor.on('section:activated', (sectionName, editor) => {
                    var editedElement = editor.getOption('editedElementView');
                    var $elementhp = editor.$el.find( '.elementor-control-threed_hotpoints' );

                    //console.log(editor.activeSection);
                    //console.log(editor);
                    if ('e-3d-points' !== editedElement.model.get('widgetType')) {
                        return;
                    }

                    var selectedSection = -1 !== ['section_hotpoints'].indexOf(sectionName);
                    if (selectedSection && editedElement.model.id == this.getID()) {
                        //opeen
                        
                        //console.log('aperto '+$elementhp.find('.elementor-repeater-row-controls .elementor-slider').length);

                        $elementhp.find('.elementor-repeater-fields').each((i,el) => {
                            this.applytrigger_onslider(i,jQuery(el));
                        });

                        // clicco il bottone aggiungi 
                        $elementhp.on('mousedown', '.elementor-repeater-add',(e) => {
                                
                                this.threed.cleanHotpoints(this.id_scope);
                                setTimeout(()=>{
                                    //console.log('nuovo '+$elementhp.find('.elementor-repeater-fields').length);
                                    let i = $elementhp.find('.elementor-repeater-fields').length-1;
                                    let repel = $elementhp.find('.elementor-repeater-fields').eq(i);

                                    console.log('ho aggiunto: '+i);

                                    // aggiorno l'oggetto "this.hotpointsList" nel THREED ..
                                    //this.threed.addHP(this.id_scope, i, this.getElementSettings('threed_hotpoints'));
                                    //
                                    // 

                                    this.threed.setHPstatus(this.id_scope, i);
                                    this.applytrigger_onslider(i, repel, true);
                                    // $elementhp.find('.elementor-repeater-fields').each((i,el) => {
                                    //     this.applytrigger_onslider(i,jQuery(el));
                                    // });
                                    
                                },1000);
                               
                            
                        });
                        $elementhp.on('mousedown', '.elementor-repeater-row-tools .elementor-repeater-tool-remove',(e) => {

                            //let theindex = jQuery(e.currentTarget).closest('.elementor-repeater-fields').index();
                            
                            //threed_instance.removeHP(this.id_scope,theindex);
                            this.threed.cleanHotpoints(this.id_scope);
                        });
                        // $elementhp.on('mousedown', '.elementor-repeater-row-tools',(e) => {

                        // });
                        
                        
                    }
                    if (!selectedSection && editedElement.model.id == this.getID()) {
                        //closee
                        //console.log('chiuso');
                        //var $elementhp = editor.$el.find( '.elementor-control-threed_hotpoints' );
                        $elementhp.off('mousedown', '.elementor-repeater-row-tools');
                        $elementhp.off('mousedown', '.elementor-repeater-row-tools .elementor-repeater-tool-remove');
                        $elementhp.off('mousedown', '.elementor-repeater-add');
                        //$elementhp.find('.elementor-repeater-row-controls .elementor-slider')[0].noUiSlider.off('update');
                        this.activeItem = -1;
                        
                    }
                });




                // elementor.channels.editor.on('change',function( view ) {
                //     var changed = view.elementSettingsModel.changed;
                //     console.log( changed );
                //     alert('changed')
                // });
                
                // elementor.channels.editor.on('editor:destroy', (editor) => {
                //     alert('xxx');
                // });
            }
            // ---------------------- end EDITOR
            
        }

        applytrigger_onslider(i, el, newel = false){
            //$elementhp.find('.elementor-slider')[0].noUiSlider.off('.hotpoints');
            
                var repeater_index = i;
                var controls = el.find('.elementor-repeater-row-controls');
                var repeater_status = true; //!controls.hasClass('editable');
                
                // -------------------------- this.id_scope, repeater_index
                let applyEvents = ($id, $i) => {
                    let isLookAtTarget = this.enablehplookattarget ? false : true;
                    controls.find('.elementor-control-hp_x .elementor-slider')[0].noUiSlider.on('update.hotpoints',(values) => {
                        this.threed.setList_pointx($id, $i, values[0]);
                        /*if(this.enablehplookattarget)*/ this.threed.setHPposition($id, $i, isLookAtTarget);
                    });
                    controls.find('.elementor-control-hp_y .elementor-slider')[0].noUiSlider.on('update.hotpoints',(values) => {
                        this.threed.setList_pointy($id, $i,values[0]);
                        /*if(this.enablehplookattarget)*/ this.threed.setHPposition($id, $i, isLookAtTarget)
                    });
                    controls.find('.elementor-control-hp_z .elementor-slider')[0].noUiSlider.on('update.hotpoints',(values) => {
                        this.threed.setList_pointz($id, $i,values[0]);
                        /*if(this.enablehplookattarget)*/ this.threed.setHPposition($id, $i, isLookAtTarget)
                    });
                    controls.find('.elementor-control-hp_cam_x .elementor-slider')[0].noUiSlider.on('update.hotpoints',(values) => {
                        this.threed.setList_camx($id, $i,values[0]);
                        this.threed.setHPposition($id, $i);
                    });
                    controls.find('.elementor-control-hp_cam_y .elementor-slider')[0].noUiSlider.on('update.hotpoints',(values) => {
                        this.threed.setList_camy($id, $i,values[0]);
                        this.threed.setHPposition($id, $i);
                    });
                    controls.find('.elementor-control-hp_cam_z .elementor-slider')[0].noUiSlider.on('update.hotpoints',(values) => {
                        this.threed.setList_camz($id, $i,values[0]);
                        this.threed.setHPposition($id, $i);
                    });
                    // controls.find('.elementor-control-hp_cam_fov .elementor-slider')[0].noUiSlider.on('update.hotpoints',(values) => {
                    //     this.threed.setList_camfov($id, $i,values[0]);
                    //     //this.threed.setHPposition($id, $i);
                    // });
                    controls.find('.elementor-control-hp_cam_zoom .elementor-slider')[0].noUiSlider.on('update.hotpoints',(values) => {
                        this.threed.setList_camzoom($id, $i,values[0]);
                        this.threed.setHPposition($id, $i);
                    });
                }
                let noapplyEvents = () => {
                    if(controls && controls.find('.elementor-control-hp_x .elementor-slider').length) controls.find('.elementor-control-hp_x .elementor-slider')[0].noUiSlider.off('update.hotpoints');
                    if(controls && controls.find('.elementor-control-hp_y .elementor-slider').length) controls.find('.elementor-control-hp_y .elementor-slider')[0].noUiSlider.off('update.hotpoints',);
                    if(controls && controls.find('.elementor-control-hp_z .elementor-slider').length) controls.find('.elementor-control-hp_z .elementor-slider')[0].noUiSlider.off('update.hotpoints');
                    if(controls && controls.find('.elementor-control-hp_cam_x .elementor-slider').length) controls.find('.elementor-control-hp_cam_x .elementor-slider')[0].noUiSlider.off('update.hotpoints');
                    if(controls && controls.find('.elementor-control-hp_cam_y .elementor-slider').length) controls.find('.elementor-control-hp_cam_y .elementor-slider')[0].noUiSlider.off('update.hotpoints');
                    if(controls && controls.find('.elementor-control-hp_cam_z .elementor-slider').length) controls.find('.elementor-control-hp_cam_z .elementor-slider')[0].noUiSlider.off('update.hotpoints');
                    // if(controls && controls.find('.elementor-control-hp_cam_fov .elementor-slider').length) controls.find('.elementor-control-hp_cam_fov .elementor-slider')[0].noUiSlider.off('update.hotpoints');
                    if(controls && controls.find('.elementor-control-hp_cam_zoom .elementor-slider').length) controls.find('.elementor-control-hp_cam_zoom .elementor-slider')[0].noUiSlider.off('update.hotpoints');
                }
                // ----------------------------------------
                if(newel){
                    applyEvents(this.id_scope, i);
                }
                el.on('mousedown', '.elementor-repeater-row-tools',(e) => {
                    setTimeout(()=>{
                        let theindex = jQuery(e.currentTarget).parent().index();
                        
                        var repeater_status = jQuery(e.currentTarget).next('.elementor-repeater-row-controls').hasClass('editable');

                        if(!repeater_status){
                            //console.log(theindex+' '+repeater_status+'..c');
                        }
                        if(repeater_status){
                            //console.log(theindex+' '+repeater_status+'..o');
                        }
                       
                        if(repeater_status){
                            console.log('ho cliccato: '+theindex);
                            this.activeItem = theindex;
                            //selezionando l'item del repeater si posiziona 
                            //this.threed.setHPposition(theindex);
                            this.threed.setHPstatus(this.id_scope, theindex);
                            applyEvents(this.id_scope, theindex);
                            //che rottura di palle!!!!
                        }else{
                            this.threed.setHPstatus(this.id_scope, -1);
                            noapplyEvents();
                        }
                        
                    },200);
                    
                    
                });
        }


        onDestroy() {
            super.onDestroy();
            
            if(this.threed){
                // qui rimuovo tuttti i punti delete_points3d(this.id_scope); ....
                this.threed.delete_points3d(this.id_scope); 
            }
            
        }
        onElementChange(propertyName) {
            this.elementSettings = this.getElementSettings();
            // scopeid, proprietà, settings, is multiple
            this.threed.elementChange(this.elements.$id_scope, propertyName, this.elementSettings, false);

            if ('enable_hplookattarget' === propertyName) {
                this.enablehplookattarget = Boolean(this.elementSettings.enable_hplookattarget);
            }
            if ('hp_render_in' === propertyName || 'hp_render_in_id' === propertyName) {
                //alert(this.elementSettings.hp_render_in);
                this.threed.cleanHotpoints(this.id_scope); 
            }
            if ('threed_hotpoints' === propertyName) {
                //cazzo! con repeater non fa nulla
            }
        }
        onEditSettingsChange(propertyName) {
            //alert(propertyName)
            this.elementSettings = this.getElementSettings('threed_hotpoints');
            //alert('elements: '+this.elementsCount+' new: '+this.elementSettings.length);
            if(this.elementsCount != this.elementSettings.length){
                
            }
            if(propertyName == 'activeItemIndex'){
                
            }else{
                
            }
            
        }
    }

    const ThreedPointsHandler = ($element) => {
        
        elementorFrontend.elementsHandler.addHandler(WidgetThreedPointsHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-points.default', ThreedPointsHandler);
});