class e_threed_class_postprocessing {
    constructor(threed, e) {
        this.threed = threed;
        
        // LIGHTs
        this.postprocessing = {};
        //
        this.composer = null;
        this.renderPass = null;
    }
    // ------------ DATA -------------
    //memorizzo i valori dei controls
    updateData3d_postprocessing($id, $settings){

        this.ppType = $settings.postprocessing_type || '';

        //tepthblur
        this.ppfocus = $settings.postprocessing_focus ? $settings.postprocessing_focus.size : 500.0;
        this.ppaperture = $settings.postprocessing_aperture ? $settings.postprocessing_aperture.size : 5;
        this.ppmaxblur = $settings.postprocessing_maxblur ? $settings.postprocessing_maxblur.size : 0.01;

        this.ppcamNear = $settings.postprocessing_nearClip ? $settings.postprocessing_nearClip.size : 0.1;
        this.ppcamFar = $settings.postprocessing_nearClip ? $settings.postprocessing_nearClip.size : 3000;
        
        //dots
        this.ppdotSize = $settings.postprocessing_dotsize ? $settings.postprocessing_dotsize.size : 5;

        //pixel
        this.pppixelSize = $settings.postprocessing_pixelsize ? $settings.postprocessing_pixelsize.size : 5;

        //halfTone
        this.pphalfradius = $settings.postprocessing_halfRadius ? $settings.postprocessing_halfRadius.size : 20;
        this.pphalfshape = $settings.postprocessing_halfShape || 1;

        this.pixelPass = null;
        this.halftonePass = null;
        this.dotsEffect1 = null;
        this.dotsEffect2 = null;
        this.bokehPass = null;
        this.bloomPass = null;
     }  

    // ------------ ADD/REMOVE -------------
    //costuisco l'elemento
    add_postprocessing($id, $settings){
        
        this.updateData3d_postprocessing($id, $settings);
        this.postprocessingConstructor();

        //console.log(this.threed.luci);
        this.writeWidgetPanel($id);
     
    }
    //rimuovo l'elemento
    delete_postprocessing($id){
       this.clean3DPostprocessing();
    }

    // ------------ GENERATE -------------
    
    //creo le postprocessing
    postprocessingConstructor(){
        this.threed.camera.near = this.ppcamNear;
        this.threed.camera.far = this.ppcamFar;


        // postprocessing
        this.composer = new THREE.EffectComposer( this.threed.renderer );
        this.renderPass = new THREE.RenderPass( this.threed.scene, this.threed.camera );
        this.composer.addPass( this.renderPass );
        
        switch(this.ppType){
            case 'depthBlur':
                this.bokehPass = new THREE.BokehPass( this.threed.scene, this.threed.camera, {
                    focus: this.ppfocus,
                    aperture: this.ppaperture * 0.00001,
                    maxblur: this.ppmaxblur,
                    width: this.threed.canvasW,
                    height: this.threed.canvasH
                } );

                this.composer.addPass( this.bokehPass );
                this.postprocessing.composer = this.composer;
                this.postprocessing.bokeh = this.bokehPass;

            break;
            case 'dots':
                this.dotsEffect1 = new THREE.ShaderPass( THREE.DotScreenShader );
                this.dotsEffect1.uniforms[ 'scale' ].value = this.ppdotSize;
                this.composer.addPass( this.dotsEffect1 );

                this.dotsEffect2 = new THREE.ShaderPass( THREE.RGBShiftShader );
                this.dotsEffect2.uniforms[ 'amount' ].value = 0.0015;
                this.composer.addPass( this.dotsEffect2 );

            break;
            case 'halftone':
                const params = {
                    shape: this.pphalfshape,
                    radius: this.pphalfradius,
                    rotateR: Math.PI / 12,
                    rotateB: Math.PI / 12 * 2,
                    rotateG: Math.PI / 12 * 3,
                    scatter: 0,
                    blending: 1,
                    blendingMode: 1,
                    greyscale: false,
                    disable: false
                };
               //const halftonePass = new THREE.ShaderPass( THREE.HalftoneShader );
                this.halftonePass = new THREE.HalftonePass( this.threed.canvasW, this.threed.canvasH, params );
                //halftonePass.uniforms.params = params;
                this.composer.addPass( this.halftonePass );


            break;
            case 'pixelate':
                this.pixelPass = new THREE.ShaderPass( THREE.PixelShader );
                this.pixelPass.uniforms[ 'pixelSize' ].value = this.pppixelSize;
				this.pixelPass.uniforms[ 'resolution' ].value = new THREE.Vector2( this.threed.canvasW, this.threed.canvasH );
				//this.pixelPass.uniforms[ 'resolution' ].value.multiplyScalar( this.threed.ratio );
				this.composer.addPass( this.pixelPass );
                
            break;
            case 'bloom':
                this.bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( this.threed.canvasW, this.threed.canvasH  ), 1.5, 0.4, 0.85 );
				this.bloomPass.threshold = 0; //params.bloomThreshold;
				this.bloomPass.strength = 1.5; //params.bloomStrength;
				this.bloomPass.radius = 0; //params.bloomRadius;

                this.composer.addPass(this.bloomPass );
            break;
            case 'sobel':
                this.effectSobel = new THREE.ShaderPass( THREE.SobelOperatorShader );
				this.effectSobel.uniforms[ 'resolution' ].value.x = this.threed.canvasW * this.threed.ratio;
				this.effectSobel.uniforms[ 'resolution' ].value.y = this.threed.canvasH * this.threed.ratio;
				
                this.composer.addPass( this.effectSobel );
            break;
            case 'noise':
            
            break;
        }
        





    
        //---------
        this.threed.on('render3d', () => {
            if(this.postprocessing) {
                // const ballWorldPosition = new THREE.Vector3();
                // this.threed.scene.getWorldPosition(ballWorldPosition);
                // (this.bokehPass.uniforms as any).focus.value = this.threed.camera.position.distanceTo(ballWorldPosition);

                //this.postprocessing.composer.render( 0.1 );
                this.composer.render();
            }
            
        });
        this.threed.on('resize3d', () => {
            if(this.postprocessing && this.postprocessing.composer) this.postprocessing.composer.setSize( this.threed.canvasW, this.threed.canvasH );
            this.composer.setSize( this.threed.canvasW, this.threed.canvasH );
            this.pixelPass.uniforms[ 'resolution' ].value.set( window.innerWidth, window.innerHeight ).multiplyScalar( this.threed.ratio );
        });

    }
    updateParamsPostprocessing(){
        // this.postprocessing.bokeh.uniforms[ 'focus' ].value = effectController.focus;
        // this.postprocessing.bokeh.uniforms[ 'aperture' ].value = effectController.aperture * 0.00001;
        // this.postprocessing.bokeh.uniforms[ 'maxblur' ].value = effectController.maxblur;

        this.postprocessing.bokeh.uniforms[ 'focus' ].value = this.ppfocus;
        this.postprocessing.bokeh.uniforms[ 'aperture' ].value = this.ppaperture * 0.00001;
        this.postprocessing.bokeh.uniforms[ 'maxblur' ].value = this.ppmaxblur;
    }
    //------------ UPDATE ----------------
    //
    // ripulisco
    clean3DPostprocessing(){
        switch(this.ppType){
            case 'depthBlur':
                this.composer.removePass(  );
            break;
            case 'dots':
                this.composer.removePass(this.dotsEffect1);
                this.composer.removePass(this.dotsEffect2);
                this.dotsEffect1 = null;
                this.dotsEffect2 = null;
            break;
            case 'halftone':
                this.composer.removePass(this.halftonePass);
                this.halftonePass = null;
            break;
            case 'pixelate':
                this.composer.removePass(this.pixelPass);
                this.pixelPass = null;
            break;
            case 'bloom':
                this.composer.removePass(this.bloomPass);
                this.bloomPass = null;
            break;
            case 'sobel':
                this.composer.removePass(this.effectSobel);
                this.effectSobel = null;
            break;
            case 'noise':
                //this.composer.removePass(  );
            break;
            default:
                this.composer.removePass(  );
        }
        
        this.composer.removePass( this.renderPass );
        if(this.renderPass) this.renderPass = null;

        if(this.postprocessing) this.postprocessing = {};
        if(this.pixelPass) this.pixelPass = null;
    }

    // aggiorno
    rigeneratePostprocessing(){
        this.clean3DPostprocessing();
        this.postprocessingConstructor();
    }
   

    
    // widget panel
    writeWidgetPanel($id){
        if(elementorFrontend.isEditMode() && this.postprocessing){
            
        }
        
    }

    // CHANGES
    elementChange($id, propertyName, settings, isMultiple) {
        if ('postprocessing_type' === propertyName) {
            this.ppType = settings.postprocessing_type || '';
            this.clean3DPostprocessing();
            this.rigeneratePostprocessing();
            
        }


        // -------------------- depthBlur --------------------
        if ('postprocessing_focus' === propertyName) {
            this.ppfocus = settings.postprocessing_focus ?  settings.postprocessing_focus.size : 500.0;
            this.postprocessing.bokeh.uniforms[ 'focus' ].value = this.ppfocus;

            //this.threed.render();
        }
        if ('postprocessing_aperture' === propertyName) {
            this.ppaperture = settings.postprocessing_aperture ?  settings.postprocessing_aperture.size : 5;
            this.postprocessing.bokeh.uniforms[ 'aperture' ].value = this.ppaperture * 0.00001;

            //this.threed.render();
        }
        if ('postprocessing_maxblur' === propertyName) {
            this.ppmaxblur = settings.postprocessing_maxblur ?  settings.postprocessing_maxblur.size : 0.01;
            this.postprocessing.bokeh.uniforms[ 'maxblur' ].value = this.ppmaxblur;

            //this.threed.render();
        }
        
        
        if ('postprocessing_nearClip' === propertyName) {
            this.ppcamNear = settings.postprocessing_nearClip ? settings.postprocessing_nearClip.size : 0.1;
            this.threed.camera.near = this.ppcamNear;

            //this.threed.render();
        }
        if ('postprocessing_farClip' === propertyName) {
            this.ppcamFar = settings.postprocessing_farClip ? settings.postprocessing_farClip.size : 3000;
            this.threed.camera.far = this.ppcamFar;

            //this.threed.render();
        }


        // -------------------- dots --------------------
        if ('postprocessing_dotsize' === propertyName) {
            this.ppdotSize = settings.postprocessing_dotsize ? settings.postprocessing_dotsize.size : 5;
            this.dotsEffect1.uniforms.scale.value = this.ppdotSize;
        }

        // -------------------- pixel --------------------
        if ('postprocessing_pixelsize' === propertyName) {
            this.pppixelSize = settings.postprocessing_pixelsize ? settings.postprocessing_pixelsize.size : 5;
            this.pixelPass.uniforms.pixelSize.value = this.pppixelSize;
        }
        // -------------------- halfTone --------------------
        if ('postprocessing_halfRadius' === propertyName) {
            this.pphalfradius = settings.postprocessing_halfRadius ? settings.postprocessing_halfRadius.size : 20;
            this.halftonePass.uniforms.radius.value = this.pphalfradius;
        }
        if ('postprocessing_halfShape' === propertyName) {
            this.pphalfshape = settings.postprocessing_halfShape || 1;
            this.halftonePass.uniforms.shape.value = this.pphalfshape;
            //this.halftonePass.params.radius = this.pphalfradius;
        }
    }
}