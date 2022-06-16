class e_threed_class_light {
    constructor(threed, e) {
        this.threed = threed;
        
        // LIGHTs
        this.light = null;
        this.luce = {}; //luce è l'oggetto che viene consegnato all'istanza di scena

        this.lightTarget = new THREE.Object3D();
    }
    //memorizzo i valori dei controls
    updateData3d_light($id, $settings){
        this.lightType = $settings.light_type || 'pointlight';
        
        
        // light color
        this.lightColor = $settings.light_color || 0xffffff;
        // light_intensity
        this.lightIntensity = $settings.light_intensity ?  $settings.light_intensity.size : 1;
        // light_distance
        this.lightDistance = $settings.light_distance ?  $settings.light_distance.size : 1;
        // light_angle
        this.lightAngle = $settings.light_angle ?  $settings.light_angle.size : 3;
        // light_penumbra
        this.lightPenumbra = $settings.light_penumbra ?  $settings.light_penumbra.size : 0.5;
        // light_decay
        this.lightDecay = $settings.ight_decay ?  $settings.ight_decay.size : 1;

        // pos X
        this.lightPosX = $settings.geometry_light_posx ? $settings.geometry_light_posx.size :-3;
        // pos Y
        this.lightPosY = $settings.geometry_light_posy ? $settings.geometry_light_posy.size : 3;
        // pos Z
        this.lightPosZ = $settings.geometry_light_posz ? $settings.geometry_light_posz.size : 2;

        // target X
        this.lightTargetX = $settings.geometry_light_targetx ? $settings.geometry_light_targetx.size : 0;
        // target Y
        this.lightTargetY = $settings.geometry_light_targety ? $settings.geometry_light_targety.size : 0;
        // target Z
        this.lightTargetZ = $settings.geometry_light_targetz ? $settings.geometry_light_targetz.size : 0;
        
        this.lightTarget.position.set(this.lightTargetX,this.lightTargetY,this.lightTargetZ);
        

        // SHADOWS
        this.isShadows = Boolean($settings.enable_shadows);
        this.shadowRadius = $settings.geometry_shadow_radius ? $settings.geometry_shadow_radius.size : 4;
        this.shadowBlurSamples = $settings.geometry_shadow_blurSamples ? $settings.geometry_shadow_blurSamples.size : 8;
        this.shadowFocus = $settings.geometry_shadow_focus ? $settings.geometry_shadow_focus.size : 5;
        
        
        // HELPERS
        this.frontendHelpers = Boolean($settings.frontend_helpers);
        this.lightHelper = null;
    }
    //costuisco l'elemento
    add_light($id, $settings){
        this.scope_id = $id;
        this.threed.lids.push($id);
        this.luce = {};

        this.updateData3d_light($id, $settings);

        this.luce.type = 'light';
        
        this.luce.settings = {
            type: this.lightType,
            
            target: this.lightTarget,
            
            intensity: this.lightIntensity,
            color: this.lightColor,
            
            posx: this.lightPosX,
            posy: this.lightPosY,
            posz: this.lightPosZ,
            targetx: this.lightTargetX,
            targety: this.lightTargetY,
            targetz: this.lightTargetZ,

            angle: this.lightAngle,
            penumbra: this.lightPenumbra,
            decay: this.lightDecay,
        };

        this.luce.shadow ={
            // SHADOWS
            enable: this.isShadows,
            radius: this.shadowRadius,
            blurSamples: this.shadowBlurSamples,
            focus: this.shadowFocus
        }
        
       this.lightConstructor();

        this.luce.light = this.light;
        this.luce.helper = this.lightHelper;


        // ----------------------------------
        this.threed.luci[$id] = this.luce;
        // ----------------------------------

        //console.log(this.threed.luci);
        this.writeWidgetPanel($id);
     
    }
    //rimuovo l'elemento
    delete_light($id){
        // clean
        this.clean3DLight();

        const index_ob = this.threed.luci.indexOf($id);
        if (index_ob > -1) {
            this.threed.luci.splice(index_ob, 1);
        }

        const index_id = this.threed.lids.indexOf($id);
        if (index_id > -1) {
            this.threed.lids.splice(index_id, 1);
        }
    }
    // -----------------------------------------------
    //creo le luci
    lightConstructor(){
        
        switch(this.lightType){
            case 'pointLight':
                this.light = new THREE.PointLight( this.lightColor, this.lightIntensity, this.lightDistance );
                this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );

                //voglio rendere visibile il punto di luce per individuarne la posizione..
                //const spherelight = new THREE.SphereGeometry( 0.05, 16, 8 );
                //this.light.add( new THREE.Mesh( spherelight, new THREE.MeshBasicMaterial( { color: this.lightColor } ) ) );
    
                
                //SHADOW
                this.updateShadowsLight();
                

                //HELPER
                if(this.threed.frontendHelpers || elementorFrontend.isEditMode()){
                    this.lightHelper = new THREE.PointLightHelper( this.light, 0.1 );
                    this.threed.scene.add( this.lightHelper );
                }
            break;
            case 'directionalLight':
                this.light = new THREE.DirectionalLight( this.lightColor );
                this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );
                this.light.intensity = this.lightIntensity;
                
                //TARGET
                this.light.target = this.lightTarget;
                this.threed.scene.add( this.lightTarget );
                this.updateTarget();

                
                //SHADOWS
                this.updateShadowsLight();
                

                //HELPER
                if(this.threed.frontendHelpers || elementorFrontend.isEditMode()){
                    this.lightHelper = new THREE.DirectionalLightHelper( this.light, 1 );
                    this.threed.scene.add( this.lightHelper );
                }
            break;
            case 'spotLight':

                /*
                this.light = new THREE.SpotLight( this.lightColor, this.lightIntensity );
                this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );

                this.light.angle = Math.PI / this.lightAngle;
                this.light.penumbra = this.lightPenumbra;
                this.light.decay = this.lightDecay;
                this.light.distance = 1000;
                this.light.intensity = this.lightIntensity;
                */

                this.light = new THREE.SpotLight( this.lightColor, this.lightIntensity );
                this.light.angle = Math.PI / this.lightAngle;
                this.light.penumbra = this.lightPenumbra;
				this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );

				

                //TARGET
                this.light.target = this.lightTarget;
                this.threed.scene.add( this.lightTarget );
                this.updateTarget();

                //SHADOWS
                this.updateShadowsLight();

                 //HELPER
                 if(this.threed.frontendHelpers || elementorFrontend.isEditMode()){
                    this.lightHelper = new THREE.SpotLightHelper( this.light );
                    this.threed.scene.add( this.lightHelper );
                }
            break;
        }

        if(this.isShadows){
            this.threed.updateShadowsRenderer(this.shadowType);
        }


        this.threed.scene.add( this.light );
    }
    //aggiorno le proprietà (vediamo se serve...)
    update_params_light(){

    }
    //------------ SHADOWS ----------------
    updateShadowsLight(){
        //SHADOW /**/
    
            this.light.castShadow = this.isShadows;
            
            // this.light.shadow.camera.near = 0.1;
            // this.light.shadow.camera.far = 100;

            this.light.shadow.camera.right = 17;
            this.light.shadow.camera.left = - 17;
            this.light.shadow.camera.top	= 17;
            this.light.shadow.camera.bottom = - 17;


            // this.light.shadow.mapSize.width = 512;
            // this.light.shadow.mapSize.height = 512;
            this.light.shadow.bias = 0.0001;

            this.light.shadow.radius = this.shadowRadius;
            this.light.shadow.focus = this.shadowFocus;
            this.light.shadow.blurSamples = this.shadowBlurSamples;
        
    };
    

    //------------ UPDATE ----------------
    //
    // ripulisco
    clean3DLight(){
        if(this.light){
            
            if(this.lightHelper) this.threed.scene.remove( this.lightHelper );

            this.threed.scene.remove(this.light);
            this.light.dispose();
            //
            this.light = null;
        }
    }

    // aggiorno
    rigenerateLight(){
        this.clean3DLight();
        this.lightConstructor();
    }
    // aggiorno le caratteristiche del target-luce (spot e directional)
    updateTarget(){

        this.lightTarget.position.set(this.lightTargetX,this.lightTargetY,this.lightTargetZ);
        if(this.light) this.light.lookAt(new THREE.Vector3(this.lightTargetX,this.lightTargetY,this.lightTargetZ));

    }

    updateParamsShadows(){
        this.updateShadowsLight();

       
        this.threed.clean3DRenderer();
        this.threed.generateRenderer();
        //
        this.threed.updateShadowsRenderer(this.shadowType);
    }
    // widget panel
    writeWidgetPanel($id){
        if(elementorFrontend.isEditMode() && this.light){
            
            var lightdata = this.light.position;
            console.log($id+' '+lightdata.x+' '+jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .e-threed-widget-boxx .e-threed-widget-value').length)
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .e-threed-widget-color .e-threed-widget-value').text(this.lightColor);
            // object
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .e-threed-widget-boxx .e-threed-widget-value').text(lightdata.x.toFixed(2));
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .e-threed-widget-boxy .e-threed-widget-value').text(lightdata.y.toFixed(2));
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .e-threed-widget-boxz .e-threed-widget-value').text(lightdata.z.toFixed(2));
        }
        
    }

    // CHANGES
    elementChange($id, propertyName, settings, isMultiple) {
        //
        // LIGHT --------------------------------------
        if ('light_type' === propertyName) {
            this.lightType = settings['light_type'] || 'pointlight';
            if(this.lightType == ''){
                this.clean3DLight();
            }else{
                this.rigenerateLight();
            }
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .e-threed-widget-label').text( this.lightType );
        }
        // light color
        if ('light_color' === propertyName) {
            this.lightColor = settings['light_color'] || 0xff8888;
            this.light.color = new THREE.Color(this.lightColor);
            if(this.lightHelper){
                this.lightHelper.color = new THREE.Color(this.lightColor);
                this.lightHelper.update();
            }
            this.writeWidgetPanel($id);
            this.threed.render();
        }
        // light intensity
        if ('light_intensity' === propertyName) {
            this.lightIntensity = settings.light_intensity ?  settings.light_intensity.size : 1;
            this.light.intensity = this.lightIntensity;

            // aggiorno 3Dclass scene ////////
            //this.threed.luci[$id].light.intensity = this.light.intensity;

            this.threed.render();
        }


        // light_angle
        if ('light_angle' === propertyName) {
            this.lightAngle = settings.light_angle ?  settings.light_angle.size : 3;
            this.light.angle = Math.PI / this.lightAngle;

            // aggiorno 3Dclass scene ////////
            //this.threed.luci[$id].light.intensity = this.light.intensity;

            this.threed.render();
        }
        // light_penumbra
        if ('light_penumbra' === propertyName) {
            this.lightPenumbra = settings.light_penumbra ?  settings.light_penumbra.size : 0.5;
            this.light.penumbra = this.lightPenumbra;

            // aggiorno 3Dclass scene ////////
            //this.threed.luci[$id].light.intensity = this.light.intensity;

            this.threed.render();
        }
        // light_decay
        if ('light_decay' === propertyName) {
            this.lightDecay = settings.light_decay ?  settings.light_decay.size : 1;
            this.light.decay = this.lightDecay;

            // aggiorno 3Dclass scene ////////
            //this.threed.luci[$id].light.intensity = this.light.intensity;

            this.threed.render();
        }




        // POSITION ------------------------------------------
        // pos X
        if ('geometry_light_posx' === propertyName) {
            this.lightPosX = settings.geometry_light_posx ? settings.geometry_light_posx.size :-3;
            this.light.position.x = this.lightPosX;
            
            this.updateTarget();
            this.writeWidgetPanel($id);

            this.threed.render();
        }
        // pos Y
        if ('geometry_light_posy' === propertyName) {
            this.lightPosY = settings.geometry_light_posy ? settings.geometry_light_posy.size : 3;
            this.light.position.y = this.lightPosY;
            
            this.updateTarget();
            this.writeWidgetPanel($id);

            this.threed.render();
        }
        // pos Z
        if ('geometry_light_posz' === propertyName) {
            this.lightPosZ = settings.geometry_light_posz ? settings.geometry_light_posz.size : 2;
            this.light.position.z = this.lightPosZ;

            this.updateTarget();
            this.writeWidgetPanel($id);

            this.threed.render();
        }


        // TARGET ------------------------------------------
        // target X
        if ('geometry_light_targetx' === propertyName) {
            this.lightTargetX = settings.geometry_light_targetx ? settings.geometry_light_targetx.size :-3;
            
            this.updateTarget();
            
            this.threed.render();
        }
        // target Y
        if ('geometry_light_targety' === propertyName) {
            this.lightTargetY = settings.geometry_light_targety ? settings.geometry_light_targety.size : 3;
            
            this.updateTarget();

            this.threed.render();
        }
        // target Z
        if ('geometry_light_targetz' === propertyName) {
            this.lightTargetZ = settings.geometry_light_targetz ? settings.geometry_light_targetz.size : 2;

            this.updateTarget();

            this.threed.render();
        }


        if ('light_distance' === propertyName) {
            this.lightDistance = settings.light_distance ? settings.light_distance.size : 0;
            this.light.distance = this.lightDistance;

            // aggiorno 3Dclass scene ////////
            this.threed.luci[$id].light.distance = this.light.distance;

            this.threed.render();
        }    
        if ('lightpoint_fly' === propertyName) {
            this.flyLightsPoints = Boolean(settings.lightpoint_fly);
            

            this.updatePointsLight();
        }
        
        
        

        
        // SHADOW --------------------------------------
        if ('enable_shadows' === propertyName) {
            this.isShadows = Boolean(settings.enable_shadows);
            if(this.light) this.light.castShadow = this.isShadows;

            this.updateParamsShadows();

            /*
            this.updateData3d();
            
            if(this.renderer) this.renderer.shadowMap.enabled = this.isShadows;
            
            if(this.primitive_mesh) this.primitive_mesh.castShadow = this.isShadows;
            if(this.primitive_mesh) this.primitive_mesh.receiveShadow = this.isShadows;
            if(this.lights[ 0 ]) this.lights[ 0 ].castShadow = this.isShadows;
            if(this.ambientMesh) this.ambientMesh.receiveShadow = this.isShadows;
            if(this.primitive_mesh) this.primitive_mesh.traverse( ( child ) => {
                if ( child.isMesh ){
                    if(this.isShadows){
                                                        
                        child.castShadow = this.isShadows;
                        child.receiveShadow = this.isShadows;
                        //alert('shadow ambient')
                        //
                    }
                }
            } );
            */
            
            
        }
        
        
        
        if ('geometry_shadow_radius' === propertyName) {
            this.shadowRadius = settings.geometry_shadow_radius ? settings.geometry_shadow_radius.size : 4;
            this.light.shadow.radius = this.shadowRadius;

            this.updateParamsShadows();

            this.threed.render();
        }
        if ('geometry_shadow_blurSamples' === propertyName) {
            this.shadowBlurSamples = settings.geometry_shadow_blurSamples ? settings.geometry_shadow_blurSamples.size : 8;
            this.light.shadow.blurSamples = this.shadowBlurSamples;

            this.updateParamsShadows();

            this.threed.render();
        }
        if ('geometry_shadow_focus' === propertyName) {
            this.shadowFocus = settings.geometry_shadow_focus ? settings.geometry_shadow_focus.size : 8;
            this.light.shadow.focus = this.shadowFocus;

            this.updateParamsShadows();

            this.threed.render();
        }
    }
}