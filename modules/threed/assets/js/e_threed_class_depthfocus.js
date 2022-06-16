class e_threed_class_depthfocus {
    constructor(threed, e) {
        this.threed = threed;

        //
        // this.depthfocus = {};
        // //
        // this.composer = null;
        // this.renderPass = null;


        // Depthfocus params
        this.materialDepth;

        this.distance = 100;
        this.effectController;

        this.postprocessing = { enabled: true };

        this.shaderSettings = {
            rings: 3,
            samples: 4
        };

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.target = new THREE.Vector3( 0, 20, - 50 );

    }
    // ------------ DATA -------------
    //memorizzo i valori dei controls
    updateData3d_depthfocus($id, $settings){
       
       
       
        const depthShader = THREE.BokehDepthShader;

        this.materialDepth = new THREE.ShaderMaterial( {
            uniforms: depthShader.uniforms,
            vertexShader: depthShader.vertexShader,
            fragmentShader: depthShader.fragmentShader
        } );

        this.materialDepth.uniforms[ 'mNear' ].value = this.threed.camera.near;
        this.materialDepth.uniforms[ 'mFar' ].value = this.threed.camera.far;






        this.effectController = {

            enabled: true,
            jsDepthCalculation: false,
            shaderFocus: false,

            fstop: 2.2,
            maxblur: 1.0,

            showFocus: false,
            focalDepth: 2.8,
            manualdof: false,
            vignetting: false,
            depthblur: false,

            threshold: 0.5,
            gain: 2.0,
            bias: 0.5,
            fringe: 0.7,

            focalLength: this.threed.camera.fov,
            noise: true,
            pentagon: false,

            dithering: 0.0001

        };
        

        //tepthblur
        // this.ppfocus = $settings.depthfocus_focus ? $settings.depthfocus_focus.size : 500.0;
        // this.ppaperture = $settings.depthfocus_aperture ? $settings.depthfocus_aperture.size : 5;
        // this.ppmaxblur = $settings.depthfocus_maxblur ? $settings.depthfocus_maxblur.size : 0.01;

        // this.ppcamNear = $settings.depthfocus_nearClip ? $settings.depthfocus_nearClip.size : 0.1;
        // this.ppcamFar = $settings.depthfocus_nearClip ? $settings.depthfocus_nearClip.size : 3000;
        
        
     }  

     

    // ------------ ADD/REMOVE -------------
    //costuisco l'elemento
    add_depthfocus($id, $settings){
       
        this.updateData3d_depthfocus($id, $settings);
        this.depthfocusConstructor();

        //console.log(this.threed.luci);
        this.writeWidgetPanel($id);
     
    }
    //rimuovo l'elemento
    delete_depthfocus($id){
       
    }

    // ------------ GENERATE -------------
    
    //creo le depthfocus
    depthfocusConstructor(){
        // this.threed.camera.near = this.ppcamNear;
        // this.threed.camera.far = this.ppcamFar;

        // depthfocus
        // this.composer = new THREE.EffectComposer( this.threed.renderer );
        // this.renderPass = new THREE.RenderPass( this.threed.scene, this.threed.camera );
        // this.composer.addPass( this.renderPass );
        
        this.postprocessing.scene = this.threed.scene;

        this.postprocessing.camera = this.threed.camera; //new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 10000, 10000 );
        this.postprocessing.camera.position.z = 100;

        this.postprocessing.scene.add( this.postprocessing.camera );

        this.postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( this.threed.canvasW, this.threed.canvasH );
        this.postprocessing.rtTextureColor = new THREE.WebGLRenderTarget( this.threed.canvasW, this.threed.canvasH );

        //-------------------------------
        const bokeh_shader = THREE.BokehShader;
        console.log(bokeh_shader.uniforms)
        this.postprocessing.bokeh_uniforms = new THREE.UniformsUtils.clone( bokeh_shader.uniforms );
        console.log(bokeh_shader.uniforms)

        this.postprocessing.bokeh_uniforms[ 'tColor' ].value = this.postprocessing.rtTextureColor.texture;
        this.postprocessing.bokeh_uniforms[ 'tDepth' ].value = this.postprocessing.rtTextureDepth.texture;
        this.postprocessing.bokeh_uniforms[ 'textureWidth' ].value = this.threed.canvasW;
        this.postprocessing.bokeh_uniforms[ 'textureHeight' ].value = this.threed.canvasH;

        this.postprocessing.materialBokeh = new THREE.ShaderMaterial( {

            uniforms: this.postprocessing.bokeh_uniforms,
            vertexShader: bokeh_shader.vertexShader,
            fragmentShader: bokeh_shader.fragmentShader,
            defines: {
                RINGS: this.shaderSettings.rings,
                SAMPLES: this.shaderSettings.samples
            }

        } );

        // this.postprocessing.quad = new THREE.Mesh( new THREE.PlaneGeometry( this.threed.canvasW, this.threed.canvasH ), this.postprocessing.materialBokeh );
        // this.postprocessing.quad.position.z = - 500;
        // this.postprocessing.scene.add( this.postprocessing.quad );
        

        const matChanger = () => {

            for ( const e in this.effectController ) {
                

                if ( e in this.postprocessing.bokeh_uniforms ) {

                    this.postprocessing.bokeh_uniforms[ e ].value = this.effectController[ e ];
                    console.log(e+': '+this.effectController[ e ]);
                }

            }
            
            this.postprocessing.enabled = this.effectController.enabled;
            this.postprocessing.bokeh_uniforms[ 'znear' ].value = this.threed.camera.near;
            this.postprocessing.bokeh_uniforms[ 'zfar' ].value = this.threed.camera.far;
            this.threed.camera.setFocalLength( this.effectController.focalLength );

        };
        matChanger();



        
        //---------
        this.threed.on('render3d', () => {
            
                
                //this.depthfocus.composer.render( 0.1 );
                //this.composer.render();
                
                if ( this.effectController.jsDepthCalculation ) {

					this.raycaster.setFromCamera( this.mouse, this.threed.camera );

					const intersects = this.raycaster.intersectObjects( this.threed.scene.children, true );

					const targetDistance = ( intersects.length > 0 ) ? intersects[ 0 ].distance : 1000;

					this.distance += ( targetDistance - this.distance ) * 0.03;

					const sdistance = this.smoothstep( this.threed.camera.near, this.threed.camera.far, this.distance );

					const ldistance = this.linearize( 1 - sdistance );

					this.postprocessing.bokeh_uniforms[ 'focalDepth' ].value = ldistance;

					this.effectController[ 'focalDepth' ] = ldistance;

				}

                if ( this.postprocessing.enabled ) {

					this.threed.renderer.clear();

					// render scene into texture

					this.threed.renderer.setRenderTarget( this.postprocessing.rtTextureColor );
					this.threed.renderer.clear();
					this.threed.renderer.render( this.threed.scene, this.threed.camera );

					// render depth into texture

					this.threed.scene.overrideMaterial = this.materialDepth;
					this.threed.renderer.setRenderTarget( this.postprocessing.rtTextureDepth );
					this.threed.renderer.clear();
					this.threed.renderer.render( this.threed.scene, this.threed.camera );
					this.threed.scene.overrideMaterial = null;

					// render bokeh composite

					this.threed.renderer.setRenderTarget( null );
					this.threed.renderer.render( this.postprocessing.scene, this.postprocessing.camera );


				}
            
            
        });
        this.threed.on('resize3d', () => {
            // if(this.depthfocus && this.depthfocus.composer) this.depthfocus.composer.setSize( this.threed.canvasW, this.threed.canvasH );
            // this.composer.setSize( this.threed.canvasW, this.threed.canvasH );

            this.postprocessing.rtTextureDepth.setSize( this.threed.canvasW, this.threed.canvasH );
            this.postprocessing.rtTextureColor.setSize( this.threed.canvasW, this.threed.canvasH );

            this.postprocessing.bokeh_uniforms[ 'textureWidth' ].value = this.threed.canvasW;
            this.postprocessing.bokeh_uniforms[ 'textureHeight' ].value = this.threed.canvasH;
        });

    }
    updateParamsDepthfocus(){
        // this.depthfocus.bokeh.uniforms[ 'focus' ].value = this.ppfocus;
        // this.depthfocus.bokeh.uniforms[ 'aperture' ].value = this.ppaperture * 0.00001;
        // this.depthfocus.bokeh.uniforms[ 'maxblur' ].value = this.ppmaxblur;



    }
    //------------ METHODS ----------------
    shaderUpdate() {

        this.postprocessing.materialBokeh.defines.RINGS = this.shaderSettings.rings;
        this.postprocessing.materialBokeh.defines.SAMPLES = this.shaderSettings.samples;
        this.postprocessing.materialBokeh.needsUpdate = true;

    }
    linearize( depth ) {

        const zfar = this.threed.camera.far;
        const znear = this.threed.camera.near;
        return - zfar * znear / ( depth * ( zfar - znear ) - zfar );

    }

    smoothstep( near, far, depth ) {

        const x = this.saturate( ( depth - near ) / ( far - near ) );
        return x * x * ( 3 - 2 * x );

    }

    saturate( x ) {

        return Math.max( 0, Math.min( 1, x ) );

    }
    
    
    
    
    
    
    
    //------------ UPDATE ----------------
    //
    // ripulisco
    clean3DDepthfocus(){
       
        
        // this.composer.removePass( this.renderPass );
        // if(this.renderPass) this.renderPass = null;
        // if(this.depthfocus) this.depthfocus = {};

    }

    // aggiorno
    rigenerateDepthfocus(){
        this.clean3DDepthfocus();
        this.depthfocusConstructor();
    }
   

    
    // widget panel
    writeWidgetPanel($id){
        if(elementorFrontend.isEditMode() && this.depthfocus){
            
        }
        
    }

    // CHANGES
    elementChange($id, propertyName, settings, isMultiple) {
        
    }
}