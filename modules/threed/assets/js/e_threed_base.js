var e_threed_instance = [];
class e_threed_base {

    constructor(e,s) {
        this.containere = e.$threedcontainer;

        ////////////////////////////////////////////////
        this.id_scope = e.$id_scope;
        this.scope = e.$scope;
        this.threedgeometryElement = e.$threedgeometry;   
        ////////////////////////////////////////////////


        // THIS internal global items ... 
        this.elementSettings = s;
        this.canvas = this.threedgeometryElement[0];
        this.container = this.containere[0];
       
        this.oggetti = Array();
        this.luci = Array();


        //L'OGGETTO 3D E LE CARATTERISTICHE DELLE PRIMITIVE
        this.scene = null; 
        this.camera = null;
        this.renderer = null;


        this.geometry = null;
        this.primitive_mesh = null;

        this.material = null;
        this.primitive_map_texture = null;
        this.primitive_bump_texture = null;
        this.primitive_light_texture = null; // ..
        this.primitive_emissive_texture = null; // ..
        this.primitive_alpha_texture = null;
        this.primitive_roughness_texture = null;
        this.primitive_metalness_texture = null;
        this.primitive_normal_texture = null;
        this.primitive_env_texture = null;
        this.primitive_displacement_texture = null;
        this.primitive_ao_texture = null;


        //AMBIENT
        this.ambient_texture = null;
        this.ambientMesh;
        this.ambientGeometry;
        this.ambientMaterial;
        

        //CONTROLS
        this.controls = null;

        //SKY
        this.sky_texture = null;
        
        //COMPOSER shader
        this.composer = null;

        // ANIMATIONN-FRAME
        this.myReq = null;

        // LIGHTs
        this.ambientLight = null;
        this.light = null;
        this.lights = [];

        //MODIFIER
        this.modifier = null;
        this.bend;
        this.twist;
        this.skew;

        //mouse
        this.mouseX = 0;
        this.mouseY = 0;
        this.wheelnum = 0;

        // MOUSEMOVE of viewport CANVAS
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.intersects;

        // HOTPOINTS
        this.hpstatus = false;
        this.hpindex = -1;
        
        this.radius;
        this.phi;
        this.theta;
        this.lon;
        this.lat;

        this.helpernormal;

        // HOTPOINTS (Disabled)
        this.hotpointsList = []; //questo array raccoglie le sprite object


        //window ratio
        this.ratio = 0; //let ratio = this.canvasW / this.canvasH;
    }
    /************************* DATA ************************ */
    updateData3d_oggetto(){
        this.geometryType = this.elementSettings.geometry_type || 'cube';

        // OBJECT PARAMETERS
        this.geometryWidth = this.elementSettings.geometry_width ? this.elementSettings.geometry_width.size : 2,
        this.geometryHeight = this.elementSettings.geometry_height ? this.elementSettings.geometry_height.size : 2,
        this.geometryDepth = this.elementSettings.geometry_depth ? this.elementSettings.geometry_depth.size : 2;
        
        this.geometryRadius = this.elementSettings.geometry_radius ? this.elementSettings.geometry_radius.size : 1;
        
        //SVG
        this.svgDepth = this.elementSettings.geometry_svg_depth ? this.elementSettings.geometry_svg_depth.size : 16;
        //this.enableBelve = Boolean(this.elementSettings.enable_svg_belve) || false;
        
        //segments
        this.geometryWidthSegments = this.elementSettings.geometry_widthSegments || 4;
        this.geometryHeightSegments = this.elementSettings.geometry_heightSegments || 4;
        this.geometryDepthSegments = this.elementSettings.geometry_depthSegments || 4;
        
        this.geometryRadialSegments = this.elementSettings.geometry_radialSegments || 8;
        
        //torus
        this.geometryTubularSegments = this.elementSettings.geometry_tubularSegments || 10;
        this.geometryTubeRadius = this.elementSettings.geometry_tubeRadius ? this.elementSettings.geometry_tubeRadius.size : 0.5;

        //cylinder
        this.geometryRadiusTop = this.elementSettings.geometry_cylinder_radiusTop ? this.elementSettings.geometry_cylinder_radiusTop.size : 1;
        this.geometryRadiusBottom = this.elementSettings.geometry_cylinder_radiusBottom ? this.elementSettings.geometry_cylinder_radiusBottom.size : 1;

        //cone
        this.geometryConeHeigh = this.elementSettings.geometry_coneHeigh ? this.elementSettings.geometry_coneHeigh.size : 1;

        //detail
        this.geometryDetail = this.elementSettings.geometry_detail ? this.elementSettings.geometry_detail.size : 2;


        //IMPORT MODEL
        this.object3did = this.elementSettings.object_3d; //deprecato!!
        
        this.import_folder_path = this.elementSettings.import_folder_path;
        this.import_format_type = this.elementSettings.import_format_type;
        this.import_file_name = this.elementSettings.import_file_name;

        //il gruppo che contiene l'import
        this.themodel = new THREE.Group();
        //CUSTOM MATERIAL
        this.useCustomMaterial = Boolean(this.elementSettings.import_useCustomMaterial);

        //IMPORT - ojb/mtl
        this.import_mtl = Boolean(this.elementSettings.import_mtl);
        //IMPORT - ColladaDAE
        this.mixer;
        this.clock;
        this.importAnimationMixer = Boolean(this.elementSettings.import_animationMixer);
        this.indexAnimationMixer = this.elementSettings.index_animationMixer || 0;


        // TRANSFORM PRIMITIVA
        // pos X
        this.geometryMeshPosX = this.elementSettings.geometry_mesh_posx ? this.elementSettings.geometry_mesh_posx.size : 0;
        // pos Y
        this.geometryMeshPosY = this.elementSettings.geometry_mesh_posy ? this.elementSettings.geometry_mesh_posy.size : 0;
        // pos Z
        this.geometryMeshPosZ = this.elementSettings.geometry_mesh_posz ? this.elementSettings.geometry_mesh_posz.size : 0;
        // rot X
        this.geometryMeshRotX = this.elementSettings.geometry_mesh_rotx ? this.elementSettings.geometry_mesh_rotx.size : 0;
        // rot Y
        this.geometryMeshRotY = this.elementSettings.geometry_mesh_roty ? this.elementSettings.geometry_mesh_roty.size : 0;
        // rot Z
        this.geometryMeshRotZ = this.elementSettings.geometry_mesh_rotz ? this.elementSettings.geometry_mesh_rotz.size : 0;
        // scale
        this.geometryMeshScale = this.elementSettings.geometry_mesh_scale ? this.elementSettings.geometry_mesh_scale.size : 1;

        // ANIMATIONS
        // rotation axis: loop random - x - y - z
        this.animated = Boolean(this.elementSettings.geometry_animated) || false;
        this.animatedX = Boolean(this.elementSettings.geometry_animated_x) || false;
        this.animatedY = Boolean(this.elementSettings.geometry_animated_y) || false;
        this.animatedZ = Boolean(this.elementSettings.geometry_animated_z) || false;
        this.animatedSpeed = this.elementSettings.geometry_animated_speed || 1;
    }
    updateData3d_material(){
        this.materialType = this.elementSettings.material_type || 'wireframeMaterial';

        // MATERIAL
        this.materialColor = this.elementSettings.material_color ? this.elementSettings.material_color : 0xCCCCCC;
        this.materialShininess = this.elementSettings.material_shininess ? this.elementSettings.material_shininess.size : 50;
        this.materialReflectivity = this.elementSettings.material_reflectivity ? this.elementSettings.material_reflectivity.size : 1;
        
        this.isTransparent = Boolean(this.elementSettings.enable_transparent);
        this.materialOpacity = this.elementSettings.material_opacity ? this.elementSettings.material_opacity.size : 1;
      
        this.materialWireframeMode = Boolean(this.elementSettings.material_wireframe_mode);
        
        //material options
        this.materialRoughness = this.elementSettings.material_roughness ? this.elementSettings.material_roughness.size : 0;
        this.materialMetalness = this.elementSettings.material_metalness ? this.elementSettings.material_metalness.size : 0.5;
        this.materialBumpScale = this.elementSettings.material_bumpscale ? this.elementSettings.material_bumpscale.size : 0.02;
        this.materialDisplacementScale = this.elementSettings.material_displacementscale ? this.elementSettings.material_displacementscale.size : 1;
        this.materialDisplacementBias = this.elementSettings.material_displacementbias ? this.elementSettings.material_displacementbias.size : 0;
        this.materialAOIntensity = this.elementSettings.material_aointensity ? this.elementSettings.material_aointensity.size : 1;

        this.materialNormalScale = new THREE.Vector2( 1, 1 ); //this.elementSettings.material_normalscale ? this.elementSettings.material_normalscale.size : 0.02;
        

        //TEXTURE of primitive
        this.textureMapPath = this.elementSettings.material_texture ? this.elementSettings.material_texture.url : '';
        this.textureBumpPath = this.elementSettings.material_bump_map ? this.elementSettings.material_bump_map.url : '';
        this.textureRoughnessPath = this.elementSettings.material_roughness_map ? this.elementSettings.material_roughness_map.url : '';
        this.textureNormalPath = this.elementSettings.material_normal_map ? this.elementSettings.material_normal_map.url : '';
        this.textureEnvPath = this.elementSettings.material_env_map ? this.elementSettings.material_env_map.url : '';
        this.textureAlphaPath = this.elementSettings.material_alpha_map ? this.elementSettings.material_alpha_map.url : '';
        this.textureMetalnessPath = this.elementSettings.material_metalness_map ? this.elementSettings.material_metalness_map.url : '';
        this.textureDisplacementPath = this.elementSettings.material_displacement_map ? this.elementSettings.material_displacement_map.url : '';
        this.textureAOPath = this.elementSettings.material_ao_map ? this.elementSettings.material_ao_map.url : '';

        //TEXTURE position & ripetition
        this.textureOffsetx = this.elementSettings.material_texture_offsetx ? this.elementSettings.material_texture_offsetx.size : 0;
        this.textureOffsety = this.elementSettings.material_texture_offsety ? this.elementSettings.material_texture_offsety.size : 0;
        this.textureRepx = this.elementSettings.material_textureRepX ? this.elementSettings.material_textureRepX : 1;
        this.textureRepy = this.elementSettings.material_textureRepY ? this.elementSettings.material_textureRepY : 1;
        this.textureCenterx = this.elementSettings.material_texture_centerx ? this.elementSettings.material_texture_centerx.size : 0;
        this.textureCentery = this.elementSettings.material_texture_centery ? this.elementSettings.material_texture_centery.size : 0;
        
    }
    updateData3d_hotpoints(){
        
        this.repeaterMarkers = this.elementSettings.threed_hotpoints;
        this.hpTrigggers = this.elementSettings.hp_trigggers || ['click'];
        this.hpOnLiknkid = this.elementSettings.hp_on_liknkid || 'click';
        this.markerType = this.elementSettings.marker_type || 'defalut';
        this.markerImage = this.elementSettings.marker_custom_image ? this.elementSettings.marker_custom_image.url : '';
        this.tlmaster = gsap.timeline({ 
            force3D:true, 
            onStart: () => {} 
            
        });
        /*
        if(this.repeaterMarkers.length > 0){
            this.repeaterMarkers.forEach((element, index, array) => { 

                

            });
        }
        */
        this.scaleMarker = 0.03;

    }
    updateData3d_viewport(){
        this.viewportExtend = this.elementSettings.viewport_extend || '';
        
        if(this.viewportExtend && !elementorFrontend.isEditMode()){
            this.canvasW = window.innerWidth; 
            this.canvasH = window.innerHeight;
        }else{
            // le dimensioni del viewport
            //this.canvasW = this.threedgeometryElement.width(); 
            //this.canvasH = this.threedgeometryElement.height();
            this.canvasW = this.containere.width(); 
            this.canvasH = this.containere.height();
            //this.canvasW = this.elementSettings.viewport_width.size;
            //this.canvasH = this.elementSettings.viewport_height.size; 
        }
        //console.log(this.canvasW + ' ' + this.canvasH);

        this.windowHalfX = this.canvasW / 2;
        this.windowHalfY = this.canvasH / 2;
        // this.windowHalfX = window.innerWidth / 2;
        // this.windowHalfY = window.innerHeight / 2;
        //
    }
    updateData3d(){
        
        this.updateData3d_viewport();
        
        
        //
        this.updateData3d_oggetto();
        this.updateData3d_material();

        this.updateData3d_hotpoints();
        //
        
        

        //RENDERER
        this.physicallyCorrectLights = Boolean(this.elementSettings.renderer_physicallyCorrectLights) || false;
        this.outputEncoding = this.elementSettings.renderer_outputEncoding || 'LinearEncoding';
        this.toneMapping = this.elementSettings.renderer_toneMapping || 'NoToneMapping';
        this.toneMappingExposure = this.elementSettings.renderer_toneMapping_exposure ? this.elementSettings.renderer_toneMapping_exposure.size : 0.68;
        
        //CONTROL
        this.interactivityType = this.elementSettings.interactivity_type || '';

        this.orbitAutorotate = Boolean(this.elementSettings.orbit_autorotate) || false;
        this.autorotateSpeed = this.elementSettings.orbit_autorotate_speed ? this.elementSettings.orbit_autorotate_speed.size : 2.5;
        
        this.orbitDamping = Boolean(this.elementSettings.orbit_damping) || false;
        this.orbitDampingSpeed = this.elementSettings.orbit_damping_speed ? this.elementSettings.orbit_damping_speed.size : 0.05;
        
        //CAMERA
        this.cameraType = this.elementSettings.camera_type || 'perspective';

        this.cameraFov = this.elementSettings.camera_fov && Boolean(this.elementSettings.camera_fov.size)  ? this.elementSettings.camera_fov.size : 40;
        this.cameraZoom = this.elementSettings.camera_zoom && Boolean(this.elementSettings.camera_zoom.size)  ? this.elementSettings.camera_zoom.size : 1;
        this.cameraLookat = Boolean(this.elementSettings.camera_lookat);
        this.frustumSize = 3;

        // pos X
        this.cameraPosX = this.elementSettings.camera_posx ? this.elementSettings.camera_posx.size : 0;
        // pos Y
        this.cameraPosY = this.elementSettings.camera_posy ? this.elementSettings.camera_posy.size : 0;
        // pos Z
        this.cameraPosZ = this.elementSettings.camera_posz ? this.elementSettings.camera_posz.size : 4;
        // target X
        this.cameraTargetX = this.elementSettings.camera_targetx ? this.elementSettings.camera_targetx.size : 0;
        // target Y
        this.cameraTargetY = this.elementSettings.camera_targety ? this.elementSettings.camera_targety.size : 0;
        // target Z
        this.cameraTargetZ = this.elementSettings.camera_targetz ? this.elementSettings.camera_targetz.size : 4;
        

        
        //ENVMAP of primitive from sky
        this.isEnvMap = Boolean(this.elementSettings.enable_envmap) || false;
        


        
        // L'AMBIENT
        // ambient TYPE: wall, floor, room, spheres
        this.ambientType = this.elementSettings.ambient_type || '';

        //(added.)
        this.ambientPosY = this.elementSettings.ambient_posy ? this.elementSettings.ambient_posy.size : 0;
        
        this.ambientPath = this.elementSettings.ambient_texture ? this.elementSettings.ambient_texture.url : '';
        this.ambientColor = this.elementSettings.ambient_color || 0xFFFFFF;
        
        this.ambientWireframeMode = Boolean(this.elementSettings.ambient_wireframe_mode) || false;
        this.ambientSkyColor = this.elementSettings.sky_color || 0xFFFFFF;
        this.ambientSkyPath = this.elementSettings.sky_image ? this.elementSettings.sky_image.url : '';
        
        // materials
        // image
        // color
        //TEXTURE options
        this.ambient_textureRep = true;
        this.ambient_textureRepX = this.elementSettings.ambient_textureRepX ? this.elementSettings.ambient_textureRepX : 1;
        this.ambient_textureRepY = this.elementSettings.ambient_textureRepY ? this.elementSettings.ambient_textureRepY : 1;
        

        //FOG
        this.fogAmbient = Boolean(this.elementSettings.ambient_fog) || false;
        this.fogColor = this.elementSettings.fog_color || 0x000000;
        this.fogAmbientNear = this.elementSettings.ambient_fog_near ? this.elementSettings.ambient_fog_near.size : 2;
        this.fogAmbientFar = this.elementSettings.ambient_fog_far ? this.elementSettings.ambient_fog_far.size : 12;

        
        


        

        
        
        

        
        // LIGHTs
        //

        this.ambientlightColor = this.elementSettings.ambientlight_color || 0xFFFFFF;
        this.ambientlightIntensity = this.elementSettings.ambientlight_intensity ? this.elementSettings.ambientlight_intensity.size : 1;
        
        this.lightsPoints = Boolean(this.elementSettings.enable_lightpoint);
        this.flyLightsPoints = Boolean(this.elementSettings.lightpoint_fly);
        this.lightPointColor = this.elementSettings.lightpoint_color || 0xFFFFFF;
        this.lightPointIntensity = this.elementSettings.lightpoint_intensity ? this.elementSettings.lightpoint_intensity.size : 3;
        this.lightPointDistance = this.elementSettings.lightpoint_distance ? this.elementSettings.lightpoint_distance.size : 0;

        // pos X
        this.lightsPointsPosX = this.elementSettings.lightpoint_posx ? this.elementSettings.lightpoint_posx.size : 1;
        // pos Y
        this.lightsPointsPosY = this.elementSettings.lightpoint_posy ? this.elementSettings.lightpoint_posy.size : 1;
        // pos Z
        this.lightsPointsPosZ = this.elementSettings.lightpoint_posz ? this.elementSettings.lightpoint_posz.size : 1;
        
        
        
        
        // ----------------------------
        this.lightType = this.elementSettings.light_type || '';
        // light color
        this.lightColor = this.elementSettings.light_color || 0xffffff;
        // light_intensity
        this.lightSpotIntensity = this.elementSettings.light_spot_intensity ?  this.elementSettings.light_spot_intensity.size : 1;
        this.lightDirIntensity = this.elementSettings.light_dir_intensity ? this.elementSettings.light_dir_intensity.size : 2;
        // pos X
        this.lightPosX = this.elementSettings.geometry_light_posx ? this.elementSettings.geometry_light_posx.size :-3;
        // pos Y
        this.lightPosY = this.elementSettings.geometry_light_posy ? this.elementSettings.geometry_light_posy.size : 3;
        // pos Z
        this.lightPosZ = this.elementSettings.geometry_light_posz ? this.elementSettings.geometry_light_posz.size : 2;
        
        // SHADOWS
        this.isShadows = Boolean(this.elementSettings.enable_shadows);
        this.shadowType = this.elementSettings.shadow_type || 'PCFSoftShadowMap';
        this.shadowRadius = this.elementSettings.geometry_shadow_radius ? this.elementSettings.geometry_shadow_radius.size : 4;
        this.shadowBlurSamples = this.elementSettings.geometry_shadow_blurSamples ? this.elementSettings.geometry_shadow_blurSamples.size : 8;
        



        // HELPERS
        this.frontendHelpers = Boolean(this.elementSettings.frontend_helpers);
        this.cameraPerspectiveHelper;
        this.cameraOrthoHelper;
        this.axesHelper;
        this.dirlightHelper;
        this.pointlightHelper;
        this.spotlightHelper;

        //MODIFIER
        this.modifierType = this.elementSettings.modifier_type || '';
        this.modifierTwistAngle = this.elementSettings.modifier_twist_angle ? this.elementSettings.modifier_twist_angle.size : 0.2;

        //point-test (prova)
        this.mypoint;

        

    }
     // INIT +++++++++++++++++++++++++
     init($id){
        
        // ------------------------------------------------

        this.updateData3d();
        
        // ----> SCENE ........
        this.generateScene();
        
        this.clock = new THREE.Clock();

        // ----> RENDERER ........
        this.generateRenderer();
        
        // ----> CAMERA ........
        this.generateCamera();

        //... ++
        if(this.materialType != 'wireframeMaterial')
        this.material = this.generateMaterial(this.materialType);
        
        //
        // ----> LIGHT .........
        this.generatePointsLight();
        this.generateLight();
        this.generateAmbientLight();
        
        //... ++
        //@p genero la forma primitiva
        this.meshConstructor();

        //---- AMBIENT ++
        // genero l'ambiente se diverso da none
        if(this.ambientType != ''){
            
            this.generateAmbient();
            this.generateAmbientTexture();
        }
        
        // ----> RENDER ........
        this.generateRender()
        
        // ----> UTILITY ..........
        if(this.frontendHelpers || elementorFrontend.isEditMode()){
           this.updateHelpers('axes'); 
        }
        

        
        // ----> CONTROLS ........
        if(this.interactivityType == 'orbit' || this.interactivityType == 'wheel' || this.interactivityType == 'map')
        this.generateControls();

       
        // -----------------------------------------
        
        // EVENTS 
        this.canvas.addEventListener('dblclick', (e) => {
            this.resetCamera();
        });
        
        
        //this.pointTest();


        
        

        
        this.threedgeometryElement.on('mousewheel', (event) => {
            //console.log(event.deltaX, event.deltaY, event.deltaFactor);
            //console.log(event.deltaFactor*event.deltaY);
            this.wheelnum += (event.deltaFactor * event.deltaY) * 0.01;
            
            /*
            if(event.deltaY > 0){
                console.log('indietro');
                prevPage( tabsStylePrev );
                return false;
            }else if(event.deltaY < 0){
                console.log('avanti');
                nextPage( tabsStyleNext );
                return false;
            }
            */
        });
        
        // --------------------------------------------------
        // MOUSEMOVE of viewport CANVAS
        

        //this.container.onmousemove = (e)=>{
        this.canvas.addEventListener( 'mousemove', (event) => {
            //
            //this.mouseX = (( (event.clientX) - this.windowHalfX ) / 2) * 0.01;
            //this.mouseY = (( event.clientY - this.windowHalfY ) / 4) * 0.01;
            this.mouseX = (( (event.offsetX) - this.windowHalfX ) / 2) * 0.01;
            this.mouseY = (( event.offsetY - this.windowHalfY ) / 4) * 0.01;
            //
            
           
        } );
        
        // RESIZE of viewport CANVAS
        window.addEventListener( 'resize', () => {
            this.windowResize();
            console.log('r');
        });
    }






    
    /************************ METHODS *********************** */
    
    windowResize(){
        this.updateData3d_viewport();
        
        this.ratio = this.canvasW / this.canvasH;
        
        switch(this.cameraType){
            case 'perspective':
                this.camera.aspect = this.ratio;
            break;
            case 'orthographic':
                this.camera.aspect = this.ratio;
                
                this.camera.left = - this.frustumSize * this.ratio / 2;
                this.camera.right = this.frustumSize * this.ratio / 2;
                this.camera.top = this.frustumSize / 2;
                this.camera.bottom = - this.frustumSize / 2;
            break;
        }
        this.camera.updateProjectionMatrix();
        
        
        this.renderer.setSize( this.canvasW, this.canvasH );

        
    }


    //
    generateHotpoints(){
        
        if(this.repeaterMarkers.length > 0){
            let countMarker = 0;
            this.repeaterMarkers.forEach((element, index, array) => { 
                //alert(element._id)                
                // element sono i dati del ripetitore
                this.loadMarker(element, (sprm) => {
                    
                    this.updateDataMarker(index, element, sprm);
                    this.calcSpriteSize();
                    console.log(this.hotpointsList);
                    
                    //alert('nuovo marker '+this.hotpointsList.length);

                    //alert(index+' '+this.hotpointsList[index].anchorid);
                    if(element.hp_anchorid == this.hotpointsList[index].anchorid){
                        //alert(e.index+' '+element.hp_anchorid+'-'+e.anchorid);
                        
                        if(this.hpTrigggers.includes("sectionid") && !this.hpTrigggers.includes("scroll")){
                            if(element.hp_anchorid){
                                let element_anchor = jQuery(document).find('*#'+element.hp_anchorid);
                                //alert(element.hp_anchorid+' - '+element_anchor.length);
                                if(element_anchor.length){
                                    ScrollTrigger.create({
                                        trigger: "#"+this.hotpointsList[index].anchorid,
                                        //start: "top top",
                                        //endTrigger: "#otherID",
                                        //end: "bottom 50%+=100px",
                                        onToggle: self => {
                                            //console.log("toggled, isActive:", self.isActive)
                                            if(self.isActive){
                                                //console.log(this.hotpointsList[index].anchorid);
                                                this.cameraToTween(index);
                                            }else{

                                                
                                            }
                                        },
                                        onLeaveBack: ({progress, direction, isActive}) => {
                                            console.log(progress, direction, isActive);
                                            if(index == 0){
                                                this.cameraToTween();
                                            }
                                        }
                                        // onUpdate: self => {
                                        //   console.log("progress:", self.progress.toFixed(3), "direction:", self.direction, "velocity", self.getVelocity());
                                        // },
                                        // onEnter: self => {
                                        //     alert(jQuery(ob.anchorid));    
                                        // }
                                    });
                                }
                            }
                        }
                    }
                    
                    
                    // 'click'
                    // 'linkid'
                    // 'sectionid'
                    // 'scroll'
                    if(this.hpTrigggers.includes("linkid")){
                        if(element.hp_anchorid){
                            let button_a = jQuery(document).find('a[href=#'+element.hp_anchorid+']');
                            //alert(element.hp_anchorid+' - '+button_a.length);
                            if(button_a.length){
                                button_a.on(this.hpOnLiknkid,() => {
                                    this.hotpointsList.forEach((e, i) => { 
                                        if(element.hp_anchorid == e.anchorid){
                                            //alert(e.index+' '+element.hp_anchorid+'-'+e.anchorid);
                                            this.cameraToTween(i);
                                        }
                                    });
                                });
                                if(this.hpOnLiknkid == 'mouseover'){
                                    button_a.on('mouseleave',() => {
                                        this.cameraToTween();
                                    });
                                }
                            }
                        }
                    }
                    //--------------------------------
                    if(this.markerType != 'none' || elementorFrontend.isEditMode())
                    this.primitive_mesh.add( sprm );

                    //@P questo è un'esperimento... per ora chi se ne ciava
                    //this.helpernormal = new THREE.VertexNormalsHelper( sprm, 2, 0x00ff00, 1 );
                    //this.scene.add( helpernormal );
                    countMarker ++;
                    if(array.length-1 == countMarker){
                        setTimeout(()=>{
                            this.anableScrollBody();
                        },400)
                        
                    }

                }); // END load
            }); // END foreach
            
        }
        
        if(this.hpTrigggers.includes("click")){
            let onDocumentMouseDown = (event) => {
                event.preventDefault();
            
                this.pointer.x = ( event.offsetX / this.canvasW ) * 2 - 1;
                this.pointer.y = - ( event.offsetY / this.canvasH ) * 2 + 1;

                //console.log(this.pointer.x);
                this.raycaster.setFromCamera( this.pointer, this.camera );

                this.hotpointsList.forEach((element, index, array) => { 
                    
                    this.intersects = this.raycaster.intersectObject( this.hotpointsList[index].point );
                    
                    if ( this.intersects.length > 0 ) {
                        //this.cameraToMarker(element.point,element.point);
                        this.cameraToTween(index);
                    }
                });
            }
            this.canvas.addEventListener('mousedown', onDocumentMouseDown, false); 
        }
    }
    anableScrollBody(){
        if(this.hpTrigggers.includes("scroll")){
                
            this.repeaterMarkers.forEach((element, index, array) => { 
                if(this.hpTrigggers.includes("scroll")){
                    this.cameraToTween(index);

                    
                }
            });
            
            setTimeout(()=>{
                ScrollTrigger.create({
                    trigger: 'html, body',
                    start: 0,
                    end: "bottom bottom",
                    
                    scrub: 1,
                    animation: this.tlmaster,
                    // onUpdate: self => {
                    //   console.log("progress:", self.progress.toFixed(3), "direction:", self.direction, "velocity", self.getVelocity());
                    //  },
                    // onEnter: self => {
                    //     alert(jQuery(ob.anchorid));    
                    // }
                });
            },200)
            
        }
    }
    //
    meshConstructor(){
        
        if(this.geometryType == 'import'){


            this.importModel(this.import_format_type,(ob) => {
                if(!ob) return;

            
                this.primitive_mesh = ob;
            
                this.positionMesh();
                this.updateShadowsMesh();

                
                // .....
                //@p aggiungo la forma alla scena
                this.scene.add( ob );

                console.log(this.scene)
                
                
                
            });
            

        }else{

            this.geometry = this.generatePrimitive(this.geometryType);
            //

            //
            
                // +++++++++++++++++++++++++++++++++++++
                // MATERIAL
                //@p applico alla mesh il materiale definito
                this.primitive_mesh = this.applyMesh();
                //console.log(this.primitive_mesh);
            
            this.positionMesh();
            this.updateShadowsMesh();

            // .....
            //@p aggiungo la forma alla scena                
            this.scene.add( this.primitive_mesh );

        }  
    }
    positionMesh(){
        //@p la posizioni se ho definito transform
        this.primitive_mesh.position.x = this.geometryMeshPosX;
        this.primitive_mesh.position.y = this.geometryMeshPosY;
        this.primitive_mesh.position.z = this.geometryMeshPosZ;
        //const degrees = THREE.MathUtils.degToRad ( degrees : Float ) : Float
        this.primitive_mesh.rotation.x = THREE.MathUtils.degToRad (this.geometryMeshRotX);
        this.primitive_mesh.rotation.y = THREE.MathUtils.degToRad (this.geometryMeshRotY);
        this.primitive_mesh.rotation.z = THREE.MathUtils.degToRad (this.geometryMeshRotZ);
        
        this.primitive_mesh.scale.set(this.geometryMeshScale,this.geometryMeshScale,this.geometryMeshScale);

        // per capovolgere .... @p non capisco!
        // if(this.geometryType == 'svg'){
        //     this.primitive_mesh.rotation.x = THREE.MathUtils.degToRad (this.geometryMeshRotX+180);
        // }
    }
    updateShadowsMesh(){
        //SHADOW /**/
        if(this.isShadows){
            this.primitive_mesh.castShadow = this.isShadows;
            this.primitive_mesh.receiveShadow = this.isShadows;
            //alert('shadow primitive')
        }
    }
    
    importSVG(){
        // ********************************* 
            // EXTRUSION SVG
            // resouce: https://muffinman.io/blog/three-js-extrude-svg-path/

            const svgElement = this.scope.find('svg')[0];

            const svgMarkup = svgElement ? svgElement.outerHTML : '';
            //console.log(svgMarkup);
            // SVG Loader is not a part of the main three.js bundle 
            // We need to load it separately, it is included in this pen's Settings > JavaScript
            // https://threejs.org/docs/#examples/en/loaders/SVGLoader
            const loader = new THREE.SVGLoader();
            const svgData = loader.parse(svgMarkup);

            
            // Group we'll use for all SVG paths
            const svgGroup = new THREE.Group();
            const svgPrimitive = new THREE.Group();
            // When importing SVGs paths are inverted on Y axis
            // it happens in the process of mapping from 2d to 3d coordinate system
            //svgGroup.scale.y *= -1;
            

            // Loop through all of the parsed paths
            svgData.paths.forEach((path, i) => {
                const shapes = path.toShapes(true);

                // Each path has array of shapes
                
                shapes.forEach((shape, j) => {
                    const extrudeSettings = {
                        steps: 10,
                        depth: this.svgDepth,
                        bevelEnabled: false,
                        bevelThickness: 1,
                        bevelSize: 1,
                        bevelOffset: 0,
                        bevelSegments: 1
                    };
                    // Finally we can take each shape and extrude it
                    const geometryExtrude = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    
                    //geometry = geometryExtrude;
                    
                    // Create a mesh and add it to the group
                    
                    let meshExtruded;
                    if(this.materialType == 'wireframeMaterial'){
                        meshExtruded = this.meshWireframe(geometryExtrude);
                    }else{
                        meshExtruded = new THREE.Mesh(geometryExtrude, this.material);
                    }
                    
                    const yOffset = -250;
                    const xOffset = -250;
                    meshExtruded.position.x = xOffset;
                    meshExtruded.position.y = yOffset;
                    
                    

                    //primitive = this.meshWireframe(geometry);


                    // this.updateShadowsMeshExtrude();
                    //SHADOW /**/
                    if(this.isShadows){
                                                        
                        meshExtruded.castShadow = this.isShadows;
                        meshExtruded.receiveShadow = this.isShadows;
                        //alert('shadow ambient')
                    }
                   
                    svgGroup.add(meshExtruded);
                });
                svgPrimitive.add(svgGroup);
                /*
                shapes.forEach((shape) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(shape, {
                    depth: 20,
                    bevelEnabled: false,
                    });
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                    const mesh = new THREE.Mesh(meshGeometry, fillMaterial);
                    const lines = new THREE.LineSegments(linesGeometry, stokeMaterial);
            
                    updateMap.push({ shape, mesh, lines });
                    svgGroup.add(mesh, lines);
                });
                */
            });


            
            // Meshes we got are all relative to themselves
            // meaning they have position set to (0, 0, 0)
            // which makes centering them in the group easy

            // Get group's size
            // const box = new THREE.Box3().setFromObject(svgGroup);
            // const size = new THREE.Vector3();
            // box.getSize(size);
            

            //const yOffset = size.y / -2;
            //const xOffset = size.x / -2;
            //const yOffset = svgElement.offsetHeight / -2;
            //const xOffset = svgElement.offsetWidth / -2;
            

            //@p riduco la dimensione in caso di svg (svg width 500)
            // svgGroup.scale.x = 0.01;
            // svgGroup.scale.y = 0.01;
            // svgGroup.scale.z = 0.01;
            this.scaleModel(svgGroup,3);

            //@p questa è una correzione alla texture in caso di svg .. è migliorabile 
            //if(this.material.map) this.material.map.repeat.set( 0.005, 0.005 );

            // Finally we add svg group to the scene
            //@p l'SVG estruso diventa la mesh...
            return svgPrimitive;
    }
    applyMesh(){
        let primitive;

        if(this.geometryType == 'svg'){
             
            primitive = this.importSVG();
           
        }else{
            // +++++++++++++++++++++++++++++++++++++
            // MATERIAL
            //console.log(this.material);
            
            //@p applico alla mesh il materiale definito
            this.geometry.attributes.uv2 = this.geometry.attributes.uv;

            if(this.materialType == 'wireframeMaterial'){
                primitive = this.meshWireframe(this.geometry);
            }else{
                primitive = new THREE.Mesh(this.geometry, this.material);
            }
        }
        
        return primitive;
    }
    updateShadowsMeshExtrude(){
        
    }
    meshWireframe($geom){
        $geom = new THREE.WireframeGeometry( $geom ); // or EdgesGeometry
        // LINE material
        this.material = new THREE.LineBasicMaterial( 
            {
                color: this.materialColor,
                //linewidth: 4,
                //linecap: 'round', //ignored by WebGLRenderer
                //linejoin:  'round' //ignored by WebGLRenderer
            }
        );
        const lines = new THREE.LineSegments( $geom, this.material);
        
        return lines;
    }

    // ENVMAP PRIMITIVE +++++++++++++++++++++++++
    generateEnvMap($mat){
        if(this.isEnvMap && this.sky_texture != ''){
            //..se in generateScene() ho gestito l'immagine texture in this.generateSkyImage(): this.scene.background = this.sky_texture;
            $mat.envMap = this.sky_texture;
            $mat.needsUpdate = true;
            /*
            $mat.reflection = true,
            $mat.refractio = true,
            $mat.refractionRatio = 1;
            $mat.reflectivity = 1;
            */
            
            //$mat.refraction = refractionCube;
        }else{
            $mat.envMap = null;
        }
    }
    generateTexture_map($mat){
        if(!$mat) return;

        this.textureMapPath = this.elementSettings.material_texture ? this.elementSettings.material_texture.url : '';

        if(this.textureMapPath != ''){
            this.primitive_map_texture = new THREE.TextureLoader().load( this.textureMapPath, ( texture ) => {
                
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened.' );
            });
            
            
            //MAP texture OPTIONS
            this.primitive_map_texture.wrapS = THREE.RepeatWrapping;
            this.primitive_map_texture.wrapT = THREE.RepeatWrapping;
            this.primitive_map_texture.repeat.set(this.textureRepx, this.textureRepy);
            this.primitive_map_texture.offset.set( this.textureOffsetx, this.textureOffsety );
            this.primitive_map_texture.center.set( this.textureCenterx, this.textureCentery );
            
            this.primitive_map_texture.needsUpdate = true;
            this.primitive_map_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
           
            // 
            $mat.map = this.primitive_map_texture;

        }else{
            this.primitive_map_texture = null;
            if($mat) $mat.map = null; 
            if($mat) $mat.needsUpdate = true; // needsUpdate required
        }
    }
    /*
    const baseColorMap = await textureLoader.load("m134_handheld_m134_BaseColor.png");
    const heightMap = await textureLoader.load("m134_handheld_m134_Height.png");
    const metallicMap = await textureLoader.load("m134_handheld_m134_Metallic.png");
    const normalMap = await textureLoader.load("m134_handheld_m134_Normal.png");
    const roughnessMap = await textureLoader.load("m134_handheld_m134_Roughness.png");
    const minigunMaterial = new THREE.MeshStandardMaterial({
        map: baseColorMap, 
        displacementMap: heightMap,
        metalnessMap: metallicMap,
        normalMap: normalMap,
        roughnessMap: roughnessMap
    });
    .alphaMap

    .aoMap
    .aoMapIntensity : Float

    .bumpMap
    .bumpScale : Float ..bumpScale: 12

    .displacementMap
    .displacementScale : Float

    .emissiveMap
    .emissiveIntensity : Float

    .envMap
    .envMapIntensity : Float

    .metalnessMap
    .metalness : Float

    .normalMap
    .normalMapType : Integer
    .normalScale : Vector2 .... (1,1)

    .roughnessMap
    .normalScale : Vector2

    .envMap
    .envMapIntensity : Float

    */
    generateTexture_displacement($mat){
        if(!$mat) return;

        this.textureDisplacementPath = this.elementSettings.material_displacement_map ? this.elementSettings.material_displacement_map.url : '';

        if(this.textureDisplacementPath != ''){
            this.primitive_displacement_texture = new THREE.TextureLoader().load( this.textureDisplacementPath, ( texture ) => {
                
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened.' );
            });
            
            //MAP texture OPTIONS
            this.primitive_displacement_texture.wrapS = THREE.RepeatWrapping;
            this.primitive_displacement_texture.wrapT = THREE.RepeatWrapping;
            this.primitive_displacement_texture.repeat.set(this.textureRepx, this.textureRepy);
            this.primitive_displacement_texture.offset.set( this.textureOffsetx, this.textureOffsety );
            this.primitive_displacement_texture.center.set( this.textureCenterx, this.textureCentery );
            
            this.primitive_displacement_texture.needsUpdate = true;
            this.primitive_displacement_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

            $mat.displacementScale = this.materialDisplacementScale; //1
            $mat.displacementBias = this.materialDisplacementBias;  //0
            // 
            $mat.displacementMap = this.primitive_displacement_texture;

        }else{
            this.primitive_displacement_texture = null;
            if($mat) $mat.displacementMap = null; 
        }
    }
    
    generateTexture_normal($mat){
        if(!$mat) return;

        this.textureNormalPath = this.elementSettings.material_normal_map ? this.elementSettings.material_normal_map.url : '';

        if(this.textureNormalPath != ''){
            this.primitive_normal_texture = new THREE.TextureLoader().load( this.textureNormalPath, ( texture ) => {
                
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened.' );
            });
            
            //MAP texture OPTIONS
            this.primitive_normal_texture.wrapS = THREE.RepeatWrapping;
            this.primitive_normal_texture.wrapT = THREE.RepeatWrapping;
            this.primitive_normal_texture.repeat.set(this.textureRepx, this.textureRepy);
            this.primitive_normal_texture.offset.set( this.textureOffsetx, this.textureOffsety );
            this.primitive_normal_texture.center.set( this.textureCenterx, this.textureCentery );
            
            this.primitive_normal_texture.needsUpdate = true;
            this.primitive_normal_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

            $mat.normalScale = this.materialNormalScale;
            // 
            $mat.normalMap = this.primitive_normal_texture;

        }else{
            this.primitive_normal_texture = null;
            if($mat) $mat.normalMap = null; 
        }
    }
    generateTexture_roughness($mat){
        if(!$mat) return;

        this.textureRoughnessPath = this.elementSettings.material_roughness_map ? this.elementSettings.material_roughness_map.url : '';

        if(this.textureRoughnessPath != ''){
            this.primitive_roughness_texture = new THREE.TextureLoader().load( this.textureRoughnessPath, ( texture ) => {
                
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened.' );
            });
            
            
            //MAP texture OPTIONS
            this.primitive_roughness_texture.wrapS = THREE.RepeatWrapping;
            this.primitive_roughness_texture.wrapT = THREE.RepeatWrapping;
            this.primitive_roughness_texture.repeat.set(this.textureRepx, this.textureRepy);
            this.primitive_roughness_texture.offset.set( this.textureOffsetx, this.textureOffsety );
            this.primitive_roughness_texture.center.set( this.textureCenterx, this.textureCentery );
            
            this.primitive_roughness_texture.needsUpdate = true;
            this.primitive_roughness_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

            $mat.roughness = this.materialRoughness;
            // 
            $mat.roughnessMap = this.primitive_roughness_texture;

           
        }else{
            this.primitive_roughness_texture = null;
            if($mat) $mat.roughnessMap = null; 
        }
    }
    generateTexture_env($mat){
        if(!$mat) return;

        this.textureEnvPath = this.elementSettings.material_env_map ? this.elementSettings.material_env_map.url : '';
        
        if(this.textureEnvPath != ''){
            this.primitive_env_texture = new THREE.TextureLoader().load( this.textureEnvPath, ( texture ) => {
                //alert(this.textureEnvPath);
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened.' );
            });
            
            
            //MAP texture OPTIONS
            this.primitive_env_texture.wrapS = THREE.RepeatWrapping;
            this.primitive_env_texture.wrapT = THREE.RepeatWrapping;
            this.primitive_env_texture.repeat.set(this.textureRepx, this.textureRepy);
            this.primitive_env_texture.offset.set( this.textureOffsetx, this.textureOffsety );
            this.primitive_env_texture.center.set( this.textureCenterx, this.textureCentery );
            
            this.primitive_env_texture.needsUpdate = true;
            this.primitive_env_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

            this.primitive_env_texture.mapping = THREE.EquirectangularReflectionMapping;


            //$mat.envMapIntensity = this.materialEnvIntensity; uso default
            //
            //$mat.needsUpdate = true;
            $mat.envMap = this.primitive_env_texture;

           
        }else{
            this.primitive_env_texture = null;
            if($mat) $mat.envMap = null; 
        }
    }
    generateTexture_alpha($mat){
        if(!$mat) return;

        this.textureAlphaPath = this.elementSettings.material_alpha_map ? this.elementSettings.material_alpha_map.url : '';

        if(this.textureAlphaPath != '' && this.isTransparent){
            this.primitive_alpha_texture = new THREE.TextureLoader().load( this.textureAlphaPath, ( texture ) => {
                
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened.' );
            });
            
            
            //MAP texture OPTIONS
            this.primitive_alpha_texture.wrapS = THREE.RepeatWrapping;
            this.primitive_alpha_texture.wrapT = THREE.RepeatWrapping;
            this.primitive_alpha_texture.repeat.set(this.textureRepx, this.textureRepy);
            this.primitive_alpha_texture.offset.set( this.textureOffsetx, this.textureOffsety );
            this.primitive_alpha_texture.center.set( this.textureCenterx, this.textureCentery );
            
            this.primitive_alpha_texture.needsUpdate = true;
            this.primitive_alpha_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();


            //
            
            $mat.side = THREE.DoubleSide;
            //$mat.opacity = 0.5;
            $mat.alphaTest = 0;
            $mat.alphaMap = this.primitive_alpha_texture;

           
        }else{
            this.primitive_alpha_texture = null;
            if($mat) $mat.alphaMap = null; 
        }
    }
    generateTexture_metalness($mat){
        if(!$mat) return;

        this.textureMetalnessPath = this.elementSettings.material_metalness_map ? this.elementSettings.material_metalness_map.url : '';

        if(this.textureMetalnessPath != ''){
            this.primitive_metalness_texture = new THREE.TextureLoader().load( this.textureMetalnessPath, ( texture ) => {
                
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened.' );
            });
            
            
            //MAP texture OPTIONS
            this.primitive_metalness_texture.wrapS = THREE.RepeatWrapping;
            this.primitive_metalness_texture.wrapT = THREE.RepeatWrapping;
            this.primitive_metalness_texture.repeat.set(this.textureRepx, this.textureRepy);
            this.primitive_metalness_texture.offset.set( this.textureOffsetx, this.textureOffsety );
            this.primitive_metalness_texture.center.set( this.textureCenterx, this.textureCentery );
            
            this.primitive_metalness_texture.needsUpdate = true;
            this.primitive_metalness_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

            //$mat.metalness = this.materialMetalness;
            // 
            $mat.metalnessMap = this.primitive_metalness_texture;

           
        }else{
            this.primitive_metalness_texture = null;
            if($mat) $mat.metalnessMap = null; 
        }
    }
    generateTexture_bump($mat){
        if(!$mat) return;

        this.textureBumpPath = this.elementSettings.material_bump_map ? this.elementSettings.material_bump_map.url : '';

        if(this.textureBumpPath != ''){
            this.primitive_bump_texture = new THREE.TextureLoader().load( this.textureBumpPath, ( texture ) => {
                
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened.' );
            });
            
            
            //MAP texture OPTIONS
            this.primitive_bump_texture.wrapS = THREE.RepeatWrapping;
            this.primitive_bump_texture.wrapT = THREE.RepeatWrapping;
            this.primitive_bump_texture.repeat.set(this.textureRepx, this.textureRepy);
            this.primitive_bump_texture.offset.set( this.textureOffsetx, this.textureOffsety );
            this.primitive_bump_texture.center.set( this.textureCenterx, this.textureCentery );
            
            this.primitive_bump_texture.needsUpdate = true;
            this.primitive_bump_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

            $mat.bumpScale = this.materialBumpScale;
            // 
            $mat.bumpMap = this.primitive_bump_texture;
           
        }else{
            this.primitive_bump_texture = null;
            if($mat) $mat.bumpMap = null; 
        }
    }
    generateTexture_ao($mat){
        if(!$mat) return;

        this.textureAOPath = this.elementSettings.material_ao_map ? this.elementSettings.material_ao_map.url : '';

        if(this.textureAOPath != ''){
            this.primitive_ao_texture = new THREE.TextureLoader().load( this.textureAOPath, ( texture ) => {
                
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened.' );
            });
            
            
            //MAP texture OPTIONS
            this.primitive_ao_texture.wrapS = THREE.RepeatWrapping;
            this.primitive_ao_texture.wrapT = THREE.RepeatWrapping;
            this.primitive_ao_texture.repeat.set(this.textureRepx, this.textureRepy);
            this.primitive_ao_texture.offset.set( this.textureOffsetx, this.textureOffsety );
            this.primitive_ao_texture.center.set( this.textureCenterx, this.textureCentery );
            
            this.primitive_ao_texture.needsUpdate = true;
            this.primitive_ao_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

            $mat.aoMapIntensity = this.materialAOIntensity
            // 
            $mat.aoMap = this.primitive_ao_texture;
           
        }else{
            this.primitive_ao_texture = null;
            if($mat) $mat.aoMap = null; 
        }
    }






    updateParamsTexture(){
        this.primitive_map_texture.offset.set( this.textureOffsetx, this.textureOffsety );
        this.primitive_map_texture.repeat.set(this.textureRepx, this.textureRepy);
        this.primitive_map_texture.center.set( this.textureCenterx, this.textureCentery );

    }










    // CONTROLS 
    generateControls(){
        
        //if(elementorFrontend.isEditMode()){
            
            this.container.onmousedown = this.container.onmousemove = (e)=>{
                e.stopImmediatePropagation();
                e.stopPropagation();
                return false;
            };
            this.container.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                return false;
            }, false);
            
            // orbit control
            if(this.interactivityType == 'map'){
                this.controls = new THREE.MapControls( this.camera, this.renderer.domElement );
            }else{
                this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            }
            
            //@p lo processo nel render
            // this.controls.addEventListener( 'change', () => {
            //     this.calcSpriteSize();
            // } );

            // @p lo processo nel render
            this.controls.addEventListener( 'change', () => {
                //console.log(this.controls.target.z);
            } );

            switch(this.ambientType){
                case 'wall':
                    this.controls.maxPolarAngle = 1.2 * Math.PI / 2;
                    this.controls.minAzimuthAngle = -Math.PI / 2
                    this.controls.maxAzimuthAngle = Math.PI / 2
                    
                break;
                case 'floor':
                    this.controls.maxPolarAngle = 1.2 * Math.PI / 2;
                break;
                case 'horizon':
                    this.controls.maxPolarAngle = 1.2 * Math.PI / 2;
                    // la texture è x 10

                    
                break;
                case 'room':
                   
                break;
                case 'sphere':
                    
                    
                break;
            }
            this.controls.enableZoom = false;
            this.controls.panSpeed = 1;
            this.controls.rotateSpeed = 0.3;
            this.controls.minDistance = 1;
            this.controls.maxDistance = 10;

            this.controls.screenSpacePanning = this.orbitPanning;

            this.controls.autoRotate = this.orbitAutorotate;
            this.controls.autoRotateSpeed = this.autorotateSpeed;
            
            this.controls.enableDamping = this.orbitDamping; // an animation loop is required when either damping or auto-rotation are enabled
            this.controls.dampingFactor = this.orbitDampingSpeed;
            //this.controls.screenSpacePanning = false;

            // BESTEMMIE
            //this.updateParamsControls();
            this.updateCamTarget();
            

            //this.controls.maxPolarAngle = Math.PI / 2;

            
            
            this.controls.update();
        //}
        
    }
    updateParamsControls(){
        
        if(!this.cameraLookat){
            // CUSTOM TARGET
            this.controls.target = this.cameraTarget.position;
        }else{
            // CENTER OF SCENE
            this.controls.target = this.scene.position;
        }
    }


    generateLight(){
        // -------------------------
        // LIGHT: directional e spot
        
        /*
        if(this.lightType){
            
                const color = 0xFFFFFF;
                const intensity = 1;
                
                const light = new THREE.DirectionalLight(color, intensity);
                light.position.set(-1, 2, 0);
                //light.position.set( 0, 1, 0 ); //default; light shining from top

                light.castShadow = true; // default false
                light.shadow.radius = 4;
                light.shadow.blurSamples = 8;

                const helperDirl = new THREE.DirectionalLightHelper( light, 1 );
                this.scene.add( helperDirl );

                this.scene.add(light);

                //Set up shadow properties for the light
                
                // light.shadow.mapSize.width = 512; // default
                // light.shadow.mapSize.height = 512; // default
                // light.shadow.camera.near = 0.5; // default
                // light.shadow.camera.far = 500; // default
                
            
        }*/
        

        switch(this.lightType){
            case 'directionalLight':
                this.light = new THREE.DirectionalLight( this.lightColor );
                this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );
                this.light.intensity = this.lightDirIntensity;

                /*const targetObject = new THREE.Object3D();
                scene.add(targetObject);

                light.target = targetObject;
                this.light.target = this.primitive_mesh;*/
                //this.light.target.position.set(0, 0, 0);

                if(this.primitive_mesh) this.light.lookAt(this.primitive_mesh);
                
                //SHADOWS
                this.updateShadowsLight();
                
                //HELPER
                if(this.frontendHelpers || elementorFrontend.isEditMode()){
                    this.updateHelpers('directional');
                }
                

                this.scene.add(this.light);
            
            break;
            case 'spotLight':
                this.light = new THREE.SpotLight( this.lightColor, this.lightSpotIntensity );
                this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );
                this.light.angle = Math.PI / 4;
                this.light.penumbra = 0.1;
                //this.light.decay = 10;
                this.light.distance = 1000;
                this.light.intensity = this.lightSpotIntensity;

                if(this.primitive_mesh) this.light.lookAt(this.primitive_mesh);

                //SHADOWS
                this.updateShadowsLight();

                //HELPER
                if(this.frontendHelpers || elementorFrontend.isEditMode()){
                    this.updateHelpers('spot');
                }
                
                
                this.scene.add( this.light );
                /*
                this.light = new THREE.SpotLight( this.lightColor, 20, 200 );
                this.light.angle = Math.PI / 4;
                this.light.penumbra = 0.4;
                this.light.decay = 2;
                this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );
                this.light.castShadow = true;
                
                this.light.shadow.camera.near = 8;
                this.light.shadow.camera.far = 200;
                this.light.shadow.mapSize.width = 256;
                this.light.shadow.mapSize.height = 256;
                //this.light.shadow.bias = - 0.002;
                this.light.shadow.focus = 1;
                this.light.shadow.radius = 4;
                this.light.shadow.blurSamples = 8;
                
                this.scene.add( this.light );        

                //HELPER
                this.scene.add( new THREE.SpotLightHelper( this.light ) );
                this.scene.add( new THREE.CameraHelper( this.light.shadow.camera ) )
            */
            break;

        }

        
        
        //HELPER
        //this.scene.add( new THREE.PointLightHelper( ambient, 15 ) );

        // let hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
        // this.scene.add( hemiLight );


        //LIGHT - spot
        /*
        light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 5, 0.3 );
        light.position.set( 0, 1500, 1000 );
        light.target.position.set( 0, 0, 0 );

        light.castShadow = true;
        light.shadow.camera.near = 1200;
        light.shadow.camera.far = 2500;
        light.shadow.bias = 0.0001;

        light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

        scene.add( light );
        */
    }
    updateShadowsLight(){
        //SHADOW /**/
        if(this.isShadows && this.light){
            this.light.castShadow = this.isShadows;
            
            // this.light.shadow.camera.near = 0.1;
            // this.light.shadow.camera.far = 500;
            // this.light.shadow.camera.right = 50;
            // this.light.shadow.camera.left = - 50;
            // this.light.shadow.camera.top	= 50;
            // this.light.shadow.camera.bottom = - 50;

            // this.light.decay = 8;

            this.light.shadow.mapSize.width = 1024;
            this.light.shadow.mapSize.height = 1024;

            //this.light.shadow.focus = 1;

            //this.light.shadow.bias = - 0.0005;

            this.light.shadow.radius = this.shadowRadius;
            this.light.shadow.blurSamples = this.shadowBlurSamples;
            
        }
        
    };
    updateParamsLight(){
        
    }
    generatePointsLight(){
        if(this.lightsPoints){

            this.lights[ 0 ] = new THREE.PointLight( this.lightPointColor, this.lightPointIntensity, this.lightPointDistance );
            //voglio rendere visibile il punto di luce
            //const spherelight = new THREE.SphereGeometry( 0.05, 16, 8 );
            //this.lights[ 0 ].add( new THREE.Mesh( spherelight, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
            
            //lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
            //lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

            this.lights[ 0 ].position.set( this.lightsPointsPosX, this.lightsPointsPosY, this.lightsPointsPosZ );
            //lights[ 1 ].position.set( 2, 2, 1 );
            //lights[ 2 ].position.set( - 1, - 2, - 1 );

            //SHADOW
            this.updateShadowsLightPoint();
            
            this.scene.add( this.lights[ 0 ] );
            //this.scene.add( lights[ 1 ] );
            //this.scene.add( lights[ 2 ] );
            
            //HELPER
            if(this.frontendHelpers || elementorFrontend.isEditMode()){
                this.updateHelpers('point');
            }
            

            //this.scene.add( new THREE.PointLightHelper( lights[ 1 ], 15 ) );
            //this.scene.add( new THREE.PointLightHelper( lights[ 2 ], 15 ) );
        }
    }
    updateShadowsLightPoint(){
        //SHADOW 
        /*
        if(this.isShadows && this.lights[ 0 ]){
            
            // this.lights[ 0 ].penumbra = 2;
            // this.lights[ 0 ].decay = 100;
            this.lights[ 0 ].receiveShadow = true
            // this.lights[ 0 ].shadow.mapSize.width = 2000;
            // this.lights[ 0 ].shadow.mapSize.height = 2000;
            // this.lights[ 0 ].shadow.camera.far = 100;
            // this.lights[ 0 ].shadow.camera.fov = 50;

            // this.lights[ 0 ].shadow.camera.right = 100;
            // this.lights[ 0 ].shadow.camera.left = - 100;
            // this.lights[ 0 ].shadow.camera.top	= 100;
            // this.lights[ 0 ].shadow.camera.bottom = - 100;

            this.lights[ 0 ].castShadow = this.isShadows;
            this.lights[ 0 ].shadow.blurSamples = this.shadowBlurSamples;
            this.lights[ 0 ].shadow.radius = this.shadowRadius;
            // this.lights[ 0 ].shadow.distance = 1000;
            // this.lights[ 0 ].shadow.power = 0;

            console.log(this.lights[ 0 ]);
        }*/
        if(this.isShadows && this.lights[ 0 ]){
            this.lights[ 0 ].penumbra = 0.1;
            this.lights[ 0 ].castShadow = this.isShadows;
            this.lights[ 0 ].shadow.blurSamples = 30;
            this.lights[ 0 ].shadow.radius = 20;
        }
    }
    generateAmbientLight(){
        //LIGHT - ambiente
        this.ambientLight = new THREE.AmbientLight( this.ambientlightColor, this.ambientlightIntensity );
        
        this.scene.add(this.ambientLight);
    }
    generateRenderer(){
        // -------------------------
        // RENDER MODE
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });

        //
        //const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        //pmremGenerator.compileEquirectangularShader();
        //
        
        
        
        this.renderer.setSize( this.canvasW, this.canvasH );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        
        
        
        //
        // renderer Options 
        if(this.physicallyCorrectLights) this.renderer.physicallyCorrectLights = this.physicallyCorrectLights;
        
        this.updateToneMapping();
        this.renderer.toneMappingExposure = this.toneMappingExposure;

        this.updateOutputEncoding();
        
        
        //
        this.updateShadowsRenderer();
        //
    }
    updateToneMapping(){
        if(this.toneMapping){   
            switch(this.toneMapping){
                case 'NoToneMapping':
                    this.renderer.toneMapping = THREE.NoToneMapping;
                break;
                case 'LinearToneMapping':
                    this.renderer.toneMapping = THREE.LinearToneMapping;
                break;
                case 'ReinhardToneMapping':
                    this.renderer.toneMapping = THREE.ReinhardToneMapping;
                break;
                case 'CineonToneMapping':
                    this.renderer.toneMapping = THREE.CineonToneMapping;
                break;
                case 'ACESFilmicToneMapping':
                    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                break;
            }
        }
    }
    updateOutputEncoding(){
        if(this.outputEncoding){   
            switch(this.outputEncoding){
                case 'LinearEncoding':
                    this.renderer.outputEncoding = THREE.LinearEncoding;
                break;
                case 'sRGBEncoding':
                    this.renderer.outputEncoding = THREE.sRGBEncoding;
                break;
                case 'BasicDepthPacking':
                    this.renderer.outputEncoding = THREE.BasicDepthPacking;
                break;
                case 'RGBADepthPacking':
                    this.renderer.outputEncoding = THREE.RGBADepthPacking;
                break;
            }
        }
    }
    updateShadowsRenderer(){
        this.renderer.shadowMap.enabled = this.isShadows;
       
        //SHADOW /**/
        if(this.isShadows){
            let exposure = 0.68;
            //this.renderer.toneMappingExposure = Math.pow( exposure, 5.0 ); // to allow for very bright scenes.
            

            switch(this.shadowType){
                case 'BasicShadowMap':
                    this.renderer.shadowMap.type = THREE.BasicShadowMap;
                break;
                case 'PCFSoftShadowMap':
                    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                    //this.renderer.outputEncoding = THREE.sRGBEncoding;
                break;
                case 'VSMShadowMap':
                    this.renderer.shadowMap.type = THREE.VSMShadowMap;

                break;
            }
        }else{
            this.renderer.shadowMap.type = THREE.PCFShadowMap; 
        }
    }
    updateParamsRenderer(){
        
    }
    generateCamera(){
        // -------------------------
        // CAMERA
        // fov, aspect, near, far
        // X - Y - Z

        let ratio = this.canvasW / this.canvasH;
        this.camera = new THREE.PerspectiveCamera(this.cameraFov, ratio, 1, 10000);
        // da perfezionere NEAR-FAR .....
        this.camera.zoom = this.cameraZoom;
        this.camera.position.set( this.cameraPosX, this.cameraPosY, this.cameraPosZ );

        // if(this.cameraLookat && this.primitive_mesh)
        // this.camera.lookAt(this.primitive_mesh);
        
        if(this.cameraLookat){
            this.camera.lookAt( this.scene.position );
         }else{
             this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
         }

        /*
        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
    
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.z = 2;
        */
        if(this.frontendHelpers || elementorFrontend.isEditMode()){
           this.updateHelpers('camera');     
        }
        
        // lo spot da camera per creare una luce base (added.)
        const pointLight = new THREE.PointLight( 0xffffff, 0.4 );
        this.camera.add( pointLight );
        this.scene.add( this.camera );

    }
    updateCamera(){
        // -------------------------
        // CAMERA
        // fov, aspect, near, far
        // X - Y - Z
        // console.log(this.camera);
        this.ratio = this.canvasW / this.canvasH;
        switch(this.cameraType){
            case 'perspective':
                this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.ratio, 0.1, 1000);
            break;
            case 'orthographic':
                this.camera = new THREE.OrthographicCamera( this.frustumSize * this.ratio / - 2, this.frustumSize * this.ratio / 2, this.frustumSize / 2, this.frustumSize / - 2, 0.1, 1000 );
            break;
        }
        this.updateParamsCamera();
    }
    updateParamsCamera(){
        this.camera.fov = this.cameraFov;
        this.camera.zoom = this.cameraZoom;
        if(this.cameraLookat){
            this.camera.lookAt( this.scene.position );
        }else{
            this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
        }
        
        // this.camera.position.set( this.cameraPosX, this.cameraPosY, this.cameraPosZ );
    }



    resetCamera(){
        this.cameraToTween();
    }
    updateDataMarker(index, element, sprm){
        let cam = {};
        let marker_posx = element.hp_x.size || 0,
            marker_posy = element.hp_y.size || 0,
            marker_posz = element.hp_z.size || 0,
            cam_fov = element.hp_cam_fov.size || 40,
            cam_zoom = element.hp_cam_zoom.size || 1,
            cam_posx = element.hp_cam_x.size || 0,
            cam_posy = element.hp_cam_y.size || 0,
            cam_posz = element.hp_cam_z.size || 3,
            anchor_id = element.hp_anchorid || ''
        //
        sprm.center.set( 0, 0 ); //mah!
        //this.scaleModel(sprm,0.15);

        sprm.position.set( marker_posx, marker_posy, marker_posz );
        cam.position = {x: cam_posx, y: cam_posy, z: cam_posz};
        cam.fov = cam_fov;
        cam.zoom = cam_zoom;
        this.hotpointsList[index] = {
            elem: sprm,
            point: sprm,
            cam: cam,
            index: index,
            anchorid: anchor_id
        };
    }

    //SET REPEATER PARAMS
    //qui ripopolo l'array del repeater e lo rigenero
    updateHotpointsList(val,i){
        this.hotpointsList = [];

        this.repeaterMarkers = val;
        console.log(val[i]);

        this.generateHotpoints();

        setTimeout(()=>{
            this.setHPposition(i);
            //alert(val+' '+this.hotpointsList.length);
        },300)
        
        
    }
    setList_anchorid(i,val){
        if(this.hotpointsList[i]) this.hotpointsList[i].anchorid = val;
    }
    setList_pointx(i,val){
        //console.log(this.hotpointsList.length);
        console.log('---> '+i);
        if(this.hotpointsList[i]) this.hotpointsList[i].point.position.x = val;
        console.log('x: '+this.hotpointsList[i].point.position.x);
    }
    setList_pointy(i,val){
        if(this.hotpointsList[i]) this.hotpointsList[i].point.position.y = val;
    }
    setList_pointz(i,val){
        if(this.hotpointsList[i]) this.hotpointsList[i].point.position.z = val;
    }
    setList_camx(i,val){
        if(this.hotpointsList[i]) this.hotpointsList[i].cam.position.x = val;
    }
    setList_camy(i,val){
        if(this.hotpointsList[i]) this.hotpointsList[i].cam.position.y = val;
    }
    setList_camz(i,val){
        if(this.hotpointsList[i]) this.hotpointsList[i].cam.position.z = val;
    }
    setList_camfov(i,val){
        if(this.hotpointsList[i]) this.hotpointsList[i].cam.fov = val;
    }
    setList_camzoom(i,val){
        if(this.hotpointsList[i]) this.hotpointsList[i].cam.zoom = val;
    }

    calcSpriteSize(){
        this.hotpointsList.forEach((element, index, array) => { 
            //
            /*
            var scale = spriteMarker.position.distanceTo(this.camera.position) / 100;
            scale = Math.min(0.03, Math.max(0.03, scale));
            spriteMarker.scale.set(scale, scale, scale);
            */
            let scale = this.scaleMarker / this.camera.zoom;
            element.elem.scale.set(scale,scale,scale);
        });
    }
    setHPstatus(i){
        this.hotpointsList.forEach((element, index, array) => { 
            if(i == index){
                element.point.material.opacity = 0.4;
            }else{
                element.point.material.opacity = 1;
            }
        });
    }

    loadMarker(el,$cb = null){
        //el è l'oggetto e .... 
        let createMarker = (texture) => {
            const spritematerial = new THREE.SpriteMaterial( { map: texture, sizeAttenuation: false, transparent: true } );
            spritematerial.map.minFilter = THREE.NearestFilter;
            let spriteMarker = new THREE.Sprite( spritematerial );
            
            
            
            if($cb) $cb(spriteMarker);
            // ***************
            // https://threejs.org/docs/#api/en/core/Raycaster

        }

        const textureLoader = new THREE.TextureLoader();
        //this.markerfile = 'http://localhost:8888/e-addons/wp-content/uploads/2022/05/sprite0.png'
        textureLoader.load( threejsPath+'assets/img/marker.png', createMarker );
        
    }
    setHPposition(index, markeronly = false) {
        this.hpindex = index;
        let marker = this.hotpointsList[index].point.position,
            campos = this.hotpointsList[index].cam.position, 
            camfov = this.hotpointsList[index].cam.fov, 
            camzoom = this.hotpointsList[index].cam.zoom;
        markeronly = false;
        if(markeronly){
            marker.set( marker.x, marker.y, marker.z );
            this.controls.target.set(0,0,0);
        }else{
            if(this.controls){
                this.controls.target.set(marker.x,marker.y,marker.z);
                console.log('control '+marker.x);
                this.controls.update();
            }else{
                console.log('cam-lookat: '+marker.x)
                this.camera.lookAt(marker.x,marker.y,marker.z);
                
            }
        
            this.camera.position.set(campos.x,campos.y,campos.z);
            this.camera.zoom = camzoom;
        }
        //
        this.calcSpriteSize();
        this.camera.updateProjectionMatrix();
        this.render(); //@p da qui..
        
        
    }
    cameraToTween(index,play=true) {
        let ob = this.hotpointsList[index]
        let marker,campos,camfov,camzoom;
        if(!ob){
            marker = {x: 0, y: 0, z: 0};
            campos = {x: this.cameraPosX, y: this.cameraPosY, z: this.cameraPosZ}; 
            camfov = this.cameraFov; 
            camzoom = this.cameraZoom;

            if(!this.cameraLookat){
                marker = {x: this.cameraTargetX, y: this.cameraTargetY, z: this.cameraTargetZ};
            }else{
                marker = {x: 0, y: 0, z: 0};
            }

        }else{
           //e.point.position, e.cam.position, e.cam.fov, e.cam.zoom
            marker = ob.point.position;
            campos = ob.cam.position; 
            camfov = ob.cam.fov; 
            camzoom = ob.cam.zoom; 
        }
        
        // this.controls.target.x = marker.position.x;
        // this.controls.target.y = marker.position.y;

        // this.camera.position.x = marker.position.x;
        // this.camera.position.y = marker.position.y;
        
        let tweenease = "expo.inOut";
        let tweenduration = 1;
        let tl = gsap.timeline({paused:true,
            force3D:true, 
            onStart: () => {},
            // scrollTrigger: {
            //     trigger: "#"+ob.anchorid,
            //     toggleActions: 'play none play none',
            //     onEnter: () => {
                   
            //     }
            // } 
        });
        /**/
        
        if(this.controls){
            tl.to(this.controls.target, {duration: tweenduration, 
            x: marker.x,
            y: marker.y,
            z: marker.z,
            ease:tweenease},0);
        }else{
            tl.to({}, {duration: tweenduration, 
            onUpdate: () => {
                this.camera.lookAt(marker.x,marker.y,marker.z);
            },
            ease:tweenease},0);

        }
        
        tl.to(this.camera.position, {duration: tweenduration, 
            x: campos.x,
            y: campos.y,
            z: campos.z,
            ease:tweenease},0);
        tl.to(this.camera, {duration: tweenduration, 
            //fov: camfov,
            zoom: camzoom,
            onUpdate : (self) => {
                this.calcSpriteSize();
                this.camera.updateProjectionMatrix();
               
            },
            ease:tweenease
            
        },0)
        if(play)
        tl.play();
        //

        if(this.hpTrigggers.includes("scroll")){
            this.tlmaster.add(tl);
        }
        



        /*new TWEEN.Tween(this.controls.target)
        .to(
            {
            x: marker.x,
            y: marker.y,
            z: marker.z,
            }, 500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
            
        })
        .start();

        new TWEEN.Tween(this.camera.position)
            .to({
            x: campos.x,
            y: campos.y,
            z: campos.y,
        })
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            //this.camera.lookAt(campos);
        })
        .onComplete(() => {
            
        })
        .start();

        new TWEEN.Tween(this.camera.fov)
            .to(
            camfov
            )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            
        })
        .start();
        */
    }
    
   
    generateScene(){
        // -------------------------
        // SCENE   
        this.scene = new THREE.Scene();
        // this.scene.translateX(this.cameraTargetX);
        // this.scene.translateY(this.cameraTargetY);
        // this.scene.translateZ(this.cameraTargetZ);
        
        
        //(added)  
        this.scene.background = new THREE.Color(this.ambientSkyColor);
        
        if(this.ambientSkyPath){
            this.generateSkyImage();
            
            if(!this.elementSettings.sky_hide){
                this.scene.background = this.sky_texture;
            }else{
                this.scene.background = new THREE.Color(this.ambientSkyColor);
            }
            if(this.elementSettings.sky_environment) this.scene.environment = this.sky_texture;
        }
       
        
        // ADDING BACKGROUND AND FOG
        // this.scene.background = fogColor; // Setting fogColor as the background color also
        
        //FOG
        this.updateParamsSceneFog();
        
        
    }
    updateParamsSceneFog(){
        if(this.fogAmbient){
            this.scene.fog = new THREE.Fog(new THREE.Color(this.fogColor), this.fogAmbientNear, this.fogAmbientFar);
            this.scene.fog.isFog = this.fogAmbient;
        }else{
            this.scene.fog = null;
        }
    }
    updateParamsScene(){
        
    }
    generateRender(){
        // RENDER
        let render = (time) => {
            if(this.animated){
                time *= this.animatedSpeed/1000;  // convert time to seconds
            
                // ruoto ....
                if(this.animatedX) this.primitive_mesh.rotation.x = time;
                if(this.animatedY)this.primitive_mesh.rotation.y = time;
                if(this.animatedZ)this.primitive_mesh.rotation.z = time;
            }
            if(this.flyLightsPoints && this.lights[0]){
                const time2 = Date.now() * 0.005;
                this.lights[0].position.x = Math.sin( time2 * 0.3 ) * 1.5;
                this.lights[0].position.y = Math.cos( time2 * 0.3 ) * 1.5;
                this.lights[0].position.z = Math.cos( time2 * 0.3 ) * 1.5;
            }


            //@p gira attorno TODO......
            /*
            const time3 = this.mouseX * 2; //Date.now() * 0.005;
            //console.log(this.mouseX);
            this.camera.position.x = Math.sin( time3 * 0.7 ) * 2;
            //this.camera.position.y = Math.cos( time3 * 0.7 ) * 2;
            this.camera.position.z = Math.cos( time3 * 0.7 ) * 2;
            */

            //this.mypoint.position.x = Math.sin( this.wheelnum * 0.7 ) * 2;
            //this.mypoint.position.z = Math.cos( this.wheelnum * 0.7 ) * 2;


            //ruoto attornno al centro della scena rotellando
            if(this.interactivityType == 'wheel'){
                this.camera.position.x = Math.sin( this.wheelnum * 0.7 ) * this.cameraPosZ;
                this.camera.position.z = Math.cos( this.wheelnum * 0.7 ) * this.cameraPosZ;
                
            }


            //@p muove la camera al mause
            if(this.interactivityType == 'tilt'){
                this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;
                this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * .05;
            }
            

            if(this.cameraLookat){
                this.camera.lookAt( this.scene.position );
             }else{
                 this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
             }
            

            //CONTROLS (orbit controls) 
            if(this.controls) this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

            //MODIFIER
            // this.modifier.apply
            this.modifier && this.modifier.apply();
            
           
            //ANIMATIONS ColladaDAE
            const delta = this.clock.getDelta();
            if ( this.mixer !== undefined && this.importAnimationMixer ) {
                this.mixer.update( delta );
            }

            // FONDAMENTALE
            if(this.renderer) this.renderer.render(this.scene, this.camera);

            /*
            if(this.hpstatus){
                this.updateDataMarker(this.repeaterMarkers[this.hpindex], this.hotpointsList[this.hpindex].elem ,this.hpindex);

                this.setHPposition(
                    this.hotpointsList[this.hpindex].point.position, 
                    this.hotpointsList[this.hpindex].cam.position, 
                    this.hotpointsList[this.hpindex].cam.fov,
                    this.hotpointsList[this.hpindex].cam.zoom
                    );
            }*/
            
            
            this.myReq = requestAnimationFrame(render);
        }
        this.myReq = requestAnimationFrame(render);
    }
    //...non dovrebbe servire...
    updateParamsRender(){
        
    }
    generateMaterial($material){            
        let mymaterial = null; //un materiale base
        //
        switch($material){
            case 'basicMaterial':
                mymaterial = new THREE.MeshBasicMaterial({color: this.materialColor });
                
                break;
            case 'standardMaterial':
                    mymaterial = new THREE.MeshStandardMaterial({
                        color: this.materialColor,
                        //roughness: this.roughness, //le riflessioni 
                        //metalness: this.metalness    //metallo
                    });
                    
                    break;
            case 'phongMaterial':
                mymaterial = new THREE.MeshPhongMaterial({color: this.materialColor});
                
                break;
            
            case 'wireframeMaterial':

                break;
            
            case 'toonMaterial':
                mymaterial = new THREE.MeshToonMaterial({color: this.materialColor});

                break;
            
            case 'normalMaterial':
                // NORMAL (per normal no si intende normale, ma relativo alle normali!)
                mymaterial = new THREE.MeshNormalMaterial();

                break;
            
            case 'LambertMaterial':
                //to do
                mymaterial = new THREE.MeshLambertMaterial( { envMap: this.primitive_map_texture } );
                break;
            default:
                mymaterial = new THREE.MeshBasicMaterial({color: this.materialColor });
        }
        
        // options
        if(this.materialWireframeMode){
            mymaterial.wireframe = this.materialWireframeMode;
            mymaterial.wireframeLinewidth = 4;
        }
        
        //
        //mymaterial.flatShading = true;
        
        //mymaterial.specular = 0x222222;
        //mymaterial.emissive = 0xffffee;
        //mymaterial.emissiveIntensity = 1;
        
        
        if($material == 'standardMaterial'){
            mymaterial.roughness = this.materialRoughness;
            mymaterial.metalness = this.materialMetalness;
        }
        if($material == 'phongMaterial'){
            mymaterial.shininess = this.materialShininess;
            mymaterial.reflectivity = this.materialReflectivity;
        }
        if($material == 'phongMaterial' || $material == 'standardMaterial'){
            mymaterial.bumpScale = this.materialBumpScale;
        }
        if(this.isTransparent){
            mymaterial.transparent = this.isTransparent;
            mymaterial.opacity = this.materialOpacity;
        }
        
        
        if(this.geometryType == 'plane'){
           if(mymaterial) mymaterial.side = THREE.DoubleSide;
        }

        // ----> TEXTURE MAP .........
        if(mymaterial){
            this.generateTexture_map(mymaterial);
            this.generateTexture_bump(mymaterial);
            this.generateTexture_roughness(mymaterial);
            this.generateTexture_normal(mymaterial);
            this.generateTexture_displacement(mymaterial);
            this.generateTexture_env(mymaterial);
            this.generateTexture_alpha(mymaterial);
            this.generateTexture_metalness(mymaterial);
        }
        // ----> ALPHAMAP 

        // ----> EMISSIVEMAP .........

        // ----> ROUGHNESSMAP 

        // ----> METALNESSMAP 

        // ----> NORMALMAP 

        // ----> LIGHTMAP .........

        // ----> AOMAP 

        // ----> BUMPMAP 

        // ----> DISPLACEMENTMAP 

        // ----> ENVMAP
        if(mymaterial && this.isEnvMap) this.generateEnvMap(mymaterial);
        
        // ----> FOG .........
        if(mymaterial) this.updateParamsMaterialFog(mymaterial);
        
        return mymaterial;
    }
    updateParamsMaterialFog($mat){
        if(this.fogAmbient){
            $mat.fog = new THREE.Fog(new THREE.Color(this.fogColor), this.fogAmbientNear, this.fogAmbientFar);
            $mat.fog.isFog = this.fogAmbient;
        }else{
            if($mat) $mat.fog = null;
        }
    }
    updateParamsMaterial(){
        this.material.shininess = this.materialShininess;
        this.material.reflectivity = this.materialReflectivity
        this.material.transparent = this.isTransparent;
        this.material.opacity = this.materialOpacity;

        if(this.materialWireframeMode){
            this.material.wireframe = this.materialWireframeMode;
            this.material.wireframeLinewidth = 4;
        }
        this.material.color.setHex(this.materialColor);
    }
    
    generatePrimitive($shape){
        ///////////////////////////////////////////////////////
        let primitive = null,
            geometry = new THREE.BufferGeometry();

        switch($shape){
            // case 'svg':
            //     geometry = this.importSVG();
            // break;
            case 'cube':
                // *********************+************
                // CUBE
                geometry = new THREE.BoxGeometry(
                    this.geometryWidth, this.geometryHeight, this.geometryDepth,
                    this.geometryWidthSegments, this.geometryHeightSegments, this.geometryDepthSegments
                );
            break;

            case 'sphere':
                // *********************+************
                // SPHERE                    
                 // ui: heightSegments
                geometry = new THREE.SphereGeometry(
                    this.geometryRadius, 
                    this.geometryWidthSegments, this.geometryHeightSegments
                );  
            break;
            
            case 'torus':
                // *********************+************
                // TORUS
                geometry = new THREE.TorusGeometry(
                    this.geometryRadius, this.geometryTubeRadius,
                    this.geometryRadialSegments, this.geometryTubularSegments
                );

            break;
                
            case 'octahedron':
                // *********************+************
                // OCTAHEDRON
                geometry = new THREE.OctahedronGeometry(
                    this.geometryRadius, 
                    this.geometryDetail
                    );

            break;

            case 'dodecaedro':
                 // *********************+************
                // DODECAEDRO
                geometry = new THREE.DodecahedronGeometry(
                    this.geometryRadius, 
                    this.geometryDetail
                    );

            break;
            
            case 'tetrahedron':
                // *********************+************
                // TETRAHEDRON
                geometry = new THREE.TetrahedronGeometry(
                    this.geometryRadius, 
                    this.geometryDetail
                    );

            break;
             
            case 'cylinder':
                // *********************+************
                // CyLINDER

                //const thetaStart = Math.PI * 0.25;  // ui: thetaStart
                //const thetaLength = Math.PI * 1.5;  // ui: thetaLength

                geometry = new THREE.CylinderGeometry(
                    this.geometryRadiusTop, this.geometryRadiusBottom, this.geometryHeight,
                    this.geometryRadialSegments, this.geometryHeightSegments,
                    false,
                    /*thetaStart, thetaLength*/
                );

            break;
            
            case 'cone':
            case 'piramid':
                // *********************+************
                // PIRAMID / CONE                    
                geometry = new THREE.ConeGeometry(
                    this.geometryRadius, 
                    this.geometryConeHeigh, 
                    this.geometryRadialSegments
                );

            break;
            
            case 'plane':
                // *********************+************
                // PLANE 
                //alert('w: '+this.geometryWidth+' h: '+this.geometryWidth+'s: '+this.geometryWidthSegments+' '+this.geometryHeightSegments)                 
                geometry = new THREE.PlaneGeometry(
                    this.geometryWidth, this.geometryHeight,
                    this.geometryWidthSegments, this.geometryHeightSegments
                );

            break;

            case 'icosahedro':
                // *********************+************
                // ICOSAHEDRO
                geometry = new THREE.IcosahedronGeometry(
                    this.geometryRadius, 
                    this.geometryDetail
                    ); 
            break;
            
        }
        
        return geometry;
    }
    



    // --------------------------- LOAD
    onProgress = ( xhr ) => {
        if ( xhr.lengthComputable ) {    
            const percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

            let thebar      = this.scope.find('.e-threed-loading .e-threed-loading-progress'),
                theloading  = this.scope.find('.e-threed-loading');
            
            // LOADING..
            theloading.show();
            gsap.to(thebar,{width: Math.round( percentComplete, 2 )+'%', onComplete: () => { 

                if(percentComplete > 99){
                    theloading.hide();
                }

            }, });
        }
    }

    onError() {
        //alert('file not found')
    }
    importModel($importType, $cb = null){
        let stime = 0;
        if(elementorFrontend.isEditMode()){
            stime = 400;
        }
        setTimeout(()=>{ 
            // load
        switch($importType){
            case 'obj':
                this.importModelOBJ($cb);
                break;
            case 'dae':
                this.importModelDAE($cb);
                break;
            case 'gltf':
            case 'glb':   
                this.importModelGLTF($cb);
                break;
            case 'fbx':
                this.importModelFBX($cb);
                break;
        }

        },400)
        
        
    }
    importModelOBJ($cb = null){
        let _this = this;
        function loadModel() {
            //
            _this.primitive_mesh.traverse( function ( child ) {
                if ( child.isMesh ){
                    
                    //child.material.map = _this.primitive_map_texture;
                    
                    //@P l'idea è chee anche per i modelli importati voglio gestire il materiale 
                    //   non sempre mi va bene quello importato
                    if(_this.useCustomMaterial && _this.materialType != 'wireframeMaterial')
                    child.material = _this.material;

                    //@P verificare.. come gli altri dovrebbe scalare automaticamente.
                    //child.scale.multiplyScalar( 0.01 );
                    
                    
                    if(_this.isShadows){
                                                        
                        child.castShadow = _this.isShadows;
                        child.receiveShadow = _this.isShadows;
                        //alert('shadow ambient')
                        //
                    }
                }
            } );
            //
            //_this.primitive_mesh.position.set(0,-1,0);
            //_this.primitive_mesh.scale.set(0.01,0.01,0.01);
            
            //_this.scene.add( _this.primitive_mesh );
            if($cb) $cb(_this.primitive_mesh);
        }

        const manager = new THREE.LoadingManager( loadModel );
        //       
        // model
        

        function startload(){ 
            const loader = new THREE.OBJLoader( manager )
                .setPath( _this.import_folder_path )
                .load( _this.import_file_name+'.'+_this.import_format_type, function ( obj ) {
                    
                    _this.scaleModel(obj,2);

                    //_this.primitive_mesh = obj;
                    _this.themodel.add(obj);

                    _this.primitive_mesh = _this.themodel;
                    //console.log(obj)

            }, _this.onProgress, _this.onError );
        }
       
        // -------------------------------------
        function startloadmtl(){ 
            new THREE.MTLLoader()
            .setPath( _this.import_folder_path )
            .load( _this.import_file_name+'.mtl', function ( materials ) {

                materials.preload();

                new THREE.OBJLoader( manager )
                    .setMaterials( materials )
                    .setPath( _this.import_folder_path )
                    .load( _this.import_file_name+'.'+_this.import_format_type, function ( obj ) {

                        _this.scaleModel(obj,2);
                        _this.themodel.add(obj);
                        _this.primitive_mesh = _this.themodel;
                        //console.log(obj)

                    }, _this.onProgress, _this.onError );
            } );
        }
        if(_this.import_mtl){
            startloadmtl();
        }else{
            startload();
        }
    }
    importModelGLTF($cb = null){
        let _this = this;
        //GLTF ha enormi potenzialità per matriale (hdr) e animazioni paramettriche combinate
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_morph.html
        // https://threejs.org/examples/#webgl_animation_skinning_morph
        // TUTTO DA STUDIARE

        const loadingManager = new THREE.LoadingManager( function () {
            _this.primitive_mesh.traverse( function ( child ) {
                
                 if ( child.isMesh ){
                    if(_this.isShadows){
                        
                        //console.log(child.geometry);
                        //console.log(child.geometry.getSize(new THREE.Vector3()))
                        child.castShadow = _this.isShadows;
                        child.receiveShadow = _this.isShadows;
                        
                    }
                 }
            } );

            //_this.primitive_mesh.scale.set(0.2,0.2,0.2);

            //_this.scene.add( _this.primitive_mesh );
            if($cb) $cb(_this.primitive_mesh);

            //
            _this.render();

        } );

        //HDR è DA CAPIRE.... todo
        function startloadHDR(){
            new THREE.RGBELoader()
            .setPath( 'textures/equirectangular/' )
            .load( 'royal_esplanade_1k.hdr', function ( texture ) {

                texture.mapping = THREE.EquirectangularReflectionMapping;

                _this.scene.background = texture;
                _this.scene.environment = texture;

                _this.render();

                // model
                startload();

            } );   
        }
        function startload(){ 
            //alert(_this.import_folder_path+_this.import_file_name+'.'+_this.import_format_type)
            const loader = new THREE.GLTFLoader(loadingManager).setPath( _this.import_folder_path );
                loader.load( _this.import_file_name+'.'+_this.import_format_type, function ( gltf ) {
                    
                    // gltf.animations; // Array<THREE.AnimationClip>
                    // gltf.scene; // THREE.Group
                    // gltf.scenes; // Array<THREE.Group>
                    // gltf.cameras; // Array<THREE.Camera>
                    // gltf.asset; // Object

                    //console.log(gltf.scene);
                    // alert('mixer animations: '+gltf.animations.length)
                    if(_this.oggetti[$id].settings.importAnimationMixer){
                        // model.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
                         _this.mixer = new THREE.AnimationMixer( gltf.scene );
                         const action = _this.mixer.clipAction( gltf.animations[ _this.indexAnimationMixer ] );
                         action.play();
                     }

                    _this.scaleModel(gltf.scene,2);

                    _this.themodel.add(gltf.scene);

                    _this.primitive_mesh = _this.themodel;

            }, _this.onProgress, _this.onError );
        }
        startload();
    }
    
    importModelFBX($cb = null){
        let _this = this;
       
        // loading manager
        const loadingManager = new THREE.LoadingManager( function () {
            if( _this.primitive_mesh )
            _this.primitive_mesh.traverse( function ( child ) {
                if ( child.isSkinnedMesh ) {
                    
                    //console.log('isSkinnedMes');
                    //child.frustumCulled = false; //.......

                    //child.material.map = _this.primitive_map_texture;

                    
                }
                
                if ( child.isMesh ){
                    
                     //console.log(child.material);

                    //@P l'idea è chee anche per i modelli importati voglio gestire il materiale 
                    //   non sempre mi va bene quello importato
                    
                    if(_this.useCustomMaterial && _this.materialType != 'wireframeMaterial')
                    child.material = _this.material;

                    //child.material.side = THREE.DoubleSide;

                    if(_this.isShadows){
                        child.castShadow = _this.isShadows;
                        child.receiveShadow = _this.isShadows;
                    }
                }
            });

            //_this.scene.add( _this.primitive_mesh );
            if($cb) $cb(_this.primitive_mesh);

        } );
        // model
        //alert(_this.import_folder_path+_this.import_file_name+'.'+_this.import_format_type)
        const loader = new THREE.FBXLoader(loadingManager)
        .setPath( _this.import_folder_path )
        .load( _this.import_file_name+'.'+_this.import_format_type, function ( object ) {
            console.log(object);
            
            // -----ANIM-----
            if(_this.importAnimationMixer && object.animations.length){
                // model.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
                 _this.mixer = new THREE.AnimationMixer( object );
                 const action = _this.mixer.clipAction( object.animations[ _this.indexAnimationMixer ] );
                 action.play();
             }
            
            _this.scaleModel(object,2);

            _this.themodel.add(object);

            _this.primitive_mesh = _this.themodel;
           
        }, _this.onProgress, _this.onError );
    }
    importModelDAE($cb = null){
        let _this = this;
        // loading manager
            const loadingManager = new THREE.LoadingManager( function () {
                _this.primitive_mesh.traverse( function ( child ) {
                    if ( child.isSkinnedMesh ) {
                        //console.log('isSkinnedMes');
                        child.frustumCulled = false; //....... se l'elemento è renderizzato anche fuori dalla camera

                        
                    }
                     if ( child.isMesh ){
                        //console.log(child.material);

                        //@P l'idea è chee anche per i modelli importati voglio gestire il materiale 
                        //   non sempre mi va bene quello importato
                        
                        if(_this.useCustomMaterial && _this.materialType != 'wireframeMaterial')
                        child.material = _this.material;

                        if(_this.isShadows){
                                                            
                            child.castShadow = _this.isShadows;
                            child.receiveShadow = _this.isShadows;
                            //alert('shadow ambient')
                            //
                        }
                     }
                } );

                //_this.primitive_mesh.scale.set(0.2,0.2,0.2);

                //_this.scene.add( _this.primitive_mesh );
                if($cb) $cb(_this.primitive_mesh);

            } );

            // collada
            const loader = new THREE.ColladaLoader( loadingManager );
            loader
                .setPath( _this.import_folder_path )
                .load( _this.import_file_name+'.'+_this.import_format_type, function ( collada ) {
                
                _this.scaleModel(collada.scene,2);

                _this.themodel.add(collada.scene);

                _this.primitive_mesh = _this.themodel;
                

                // -----ANIM-----
                if(_this.importAnimationMixer){
                    // model.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
                     _this.mixer = new THREE.AnimationMixer( collada.scene );
                     const action = _this.mixer.clipAction( collada.animations[ _this.indexAnimationMixer ] );
                     action.play();
                 }
                


            }, _this.onProgress, _this.onError );
    }
    scaleModel(obj,dim){
        var mroot = obj;
        var bbox = new THREE.Box3().setFromObject(mroot);
        var cent = bbox.getCenter(new THREE.Vector3());
        var size = bbox.getSize(new THREE.Vector3());
       
        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        mroot.scale.multiplyScalar(dim / maxAxis);
        
        bbox.setFromObject(mroot);
        bbox.getCenter(cent);
        bbox.getSize(size);
        //Reposition to 0,halfY,0
        mroot.position.copy(cent).multiplyScalar(-1);
        //mroot.position.y-= (size.y * 0.5);
    }

    generateAmbient(){
        const subdivision = 20;
        let spostamento = -1.4;
        //inn caso di cubo: (this.geometryHeight/2)*-1
        //in caso di radius: ... valutare i diversi casi in funzione del tipo di forma.
        switch(this.ambientType){
            case 'wall':
                // *********************+************
                // WALL
                
                //(this.geometryDepth/2)*-1
                this.ambientGeometry = new THREE.PlaneGeometry(
                    10, 10,
                     subdivision,  subdivision
                ).translate( 0, 0, -1.4);
            break;
            case 'floor':
                // *********************+************
                // FLOOR
                
                this.ambientGeometry = new THREE.PlaneGeometry(
                    10, 10, 1,
                     subdivision,  subdivision
                ).translate( 0, 0, -1.9);
               
                
            break;
            case 'horizon':
                // *********************+************
                // FLOOR
                
                this.ambientGeometry = new THREE.PlaneGeometry(
                    100, 100,
                     subdivision,  subdivision
                ).translate( 0, 0, -1.4);
               
                
            break;
            case 'room':
                // *********************+************
                // ROOM
                this.ambientGeometry = new THREE.BoxGeometry( 
                    10, 10, 10, 
                     subdivision,  subdivision,  subdivision 
                ).translate(0, 3.6, 0);
                
            break;
            case 'sphere':
                // *********************+************
                // SPHERE
                
                this.ambientGeometry = new THREE.SphereGeometry(
                    10, 
                     subdivision,  subdivision
                );
                
            break;
        }
        if(this.ambientType){
            //THREE.DoubleSide, THREE.BackSide
            this.ambientMaterial = new THREE.MeshPhongMaterial({color: this.ambientColor, side: THREE.DoubleSide, dithering: true });
            
            //this.ambientMaterial = new THREE.ShadowMaterial({color: this.ambientColor, side: THREE.DoubleSide, dithering: true });
            //this.ambientMaterial.opacity = 0.2;

            // this.ambientMaterial = new THREE.MeshStandardMaterial({
            //     color: this.ambientColor,
            //     roughness: this.roughness, //le riflessioni 
            //     metalness: this.metalness    //metallo
            // });

            

            if(this.ambientWireframeMode){
                this.ambientMaterial.wireframe = true;
            }
            
            this.ambientMesh = new THREE.Mesh(this.ambientGeometry, this.ambientMaterial);
            //(added.)
            this.ambientMesh.position.y = this.ambientPosY;
            

            // il pavimento
            if(this.ambientType == 'floor' || this.ambientType == 'horizon'){
                this.ambientMesh.rotation.x = - Math.PI / 2;
            }

            this.updateShadowsAmbient();
            
            this.scene.add(this.ambientMesh);
        }
    }
    updateShadowsAmbient(){
         //SHADOW /**/
         if(this.isShadows && this.ambientMesh){
            this.ambientMesh.receiveShadow = this.isShadows;
        }
    }
    updateParamsAmbient(){
        
    }
    // SKY IMAGE +++++++++++++++++++++++++
    generateSkyImage(){
        this.ambientSkyPath = this.elementSettings.sky_image ? this.elementSettings.sky_image.url : '';
        if(this.ambientSkyPath != ''){
            const textureLoader = new THREE.TextureLoader();

            this.sky_texture = textureLoader.load( this.ambientSkyPath, (texture) => {
                this.sky_texture.mapping = THREE.EquirectangularReflectionMapping; // pippo
                //this.sky_texture.encoding = THREE.sRGBEncoding;
                this.scene.environment = texture;
            });
        }else{
            this.scene.environment = null;
            this.sky_texture = null;
        }
    }
    // TEXTURE AMBIENTE +++++++++++++++++++++++++
    generateAmbientTexture(){
        // AMBIENT TEXTURE
        this.ambientPath = this.elementSettings.ambient_texture ? this.elementSettings.ambient_texture.url : '';

        if(this.ambientPath != ''){
            // Load and assign the texture and depth map
            const manager = new THREE.LoadingManager();
            const loader = new THREE.TextureLoader( manager );
            this.ambient_texture = loader.load( this.ambientPath, (texture) => {
                //console.log(texture);

                //texture.minFilter = THREE.NearestFilter;
                //texture.generateMipmaps = false;
                //this.ambientMesh.material.map = texture;
                
            } );
        
            
            
            
            //this.ambientMaterial.metalnessMap = map;
            //this.ambientMaterial.bumpMap = map;
            //this.ambientMaterial.roughnessMap = map;
            
            // if(this.isShadows)
            // this.ambientMaterial.receiveShadow = true;

                //this.ambient_texture.wrapS = this.ambient_texture.wrapT = THREE.RepeatWrapping;
                
                this.ambient_texture.wrapS = THREE.RepeatWrapping;
                this.ambient_texture.wrapT = THREE.RepeatWrapping;
                //this.ambient_texture.repeat.set(meshWidth / textureWidth, meshHeight / textureHeight);
                if(this.ambientType == 'horizon'){
                    //@p essendo che horizon è un piano molto grande motiplico * 10 la texture
                    this.ambient_textureRepX *= 10;
                    this.ambient_textureRepY *= 10;
                }
                //alert(this.ambient_textureRepX+' '+this.ambient_textureRepY);

                this.ambient_texture.repeat.set( this.ambient_textureRepX,  this.ambient_textureRepY );

                //this.ambient_texture.anisotropy = 16;
                this.ambient_texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
            
            
        }
        
        
        if(this.ambient_texture) this.ambient_texture.needsUpdate = true;

        if(this.ambientPath != ''){
            this.ambientMaterial.map = this.ambient_texture;
        }
    }

    updateParamsShadows(){
        
        // renderer

        // objectMesh / meshExtruded  
        // ambientMesh
        
        // light: point, directional, spot
       
        

        this.updateShadowsLight();
        this.updateShadowsMesh();
        //updateShadowsMeshExtrude()
        this.updateShadowsLightPoint();
        
        this.updateShadowsAmbient();
        
        this.clean3DRenderer();
        this.generateRenderer();
        //this.updateShadowsRenderer();
              
        
    }
    updateCamTarget(){

        if(this.cameraLookat){
            // if(this.interactivityType == 'orbit' || this.interactivityType == 'map' || this.interactivityType == 'wheel'){
               
            // }
            if(this.controls){
               this.controls.target.set(this.scene.position.x, this.scene.position.y, this.scene.position.z); 
            }
                this.camera.target = this.scene.position;
                this.camera.lookAt( this.scene.position );
            
            
        }else{
             // cammm
             if(this.controls){
                this.controls.target.set(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
             }
                this.camera.target = this.cameraTarget;
                this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
             
            
            
        }
        if(this.controls)
        this.controls.update();
    }
    updateHelpers($helper = 'all', $remove = false){
        
        switch($helper){
            case 'all':
            case 'axes':
                if(!$remove){
                    this.axesHelper = new THREE.AxesHelper(500);
                    this.scene.add(this.axesHelper);
                }else{
                    if(this.axesHelper) this.scene.remove(this.axesHelper);
                }
            break;
            case 'all':
            case 'camera':
                if(!$remove){
                    this.cameraPerspectiveHelper = new THREE.CameraHelper( this.camera );
                    this.scene.add( this.cameraPerspectiveHelper );
                }else{
                    if(this.cameraPerspectiveHelper) this.scene.remove( this.cameraPerspectiveHelper );
                }
            break;
            case 'all':
            case 'point':
                if(!$remove){
                    this.pointlightHelper = new THREE.PointLightHelper( this.lights[ 0 ], 0.1 );
                    this.scene.add( this.pointlightHelper );
                }else{
                    if(this.pointlightHelper) this.scene.remove( this.pointlightHelper );
                }
                
            break;
            case 'all':
            case 'spot':
                if(!$remove){
                    this.spotlightHelper = new THREE.SpotLightHelper( this.light );
                    this.scene.add( this.spotlightHelper );
                }else{
                    if(this.spotlightHelper) this.scene.remove( this.spotlightHelper );
                }
                
            break;
            case 'all':
            case 'directional':
                if(!$remove){
                    this.dirlightHelper = new THREE.DirectionalLightHelper( this.light, 1 );
                    this.scene.add( this.dirlightHelper );
                }else{
                    if(this.dirlightHelper) this.scene.remove( this.dirlightHelper );
                }
                
            break;
        }

    }

    
    //CLEAN 3D
    clean3DCamera(){
        this.camera = null;
    }
    clean3Dhotpooints(){
        this.hotpointsList.forEach((e, i) => { 
            e.elem.material.dispose();
            e.elem = null;
        });
    }
    clean3DRenderer(){
        if(this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
    }
    clean3DControls(){
        if(this.controls) {
            this.controls.dispose();
            this.controls = null;
        }
    }
    clean3DMesh(){
        if(this.primitive_mesh) this.scene.remove( this.primitive_mesh );
        if(this.geometry) this.geometry.dispose();
    }
    clean3DMaterial(){
        
        if(this.material) this.material.dispose();
    }
    clean3Dtexturemap(){
        if(this.primitive_map_texture) this.primitive_map_texture.dispose();
        this.primitive_map_texture = null;
    }
    clean3Dtexturebump(){
        if(this.primitive_bump_texture) this.primitive_bump_texture.dispose();
        this.primitive_bump_texture = null;
    }
    clean3Dtextureroughness(){
        if(this.primitive_roughness_texture) this.primitive_roughness_texture.dispose();
        this.primitive_roughness_texture = null;
    }
    clean3Dtexturenormal(){
        if(this.primitive_normal_texture) this.primitive_normal_texture.dispose();
        this.primitive_normal_texture = null;
    }
    clean3Dtexturedisplacement(){
        if(this.primitive_displacement_texture) this.primitive_displacement_texture.dispose();
        this.primitive_displacement_texture = null;
    }
    clean3Dtextureenv(){
        if(this.primitive_env_texture) this.primitive_env_texture.dispose();
        this.primitive_env_texture = null;
    }
    clean3Dtexturemetalness(){
        if(this.primitive_metalness_texture) this.primitive_metalness_texture.dispose();
        this.primitive_metalness_texture = null;
    }
    clean3Dtexturealpha(){
        if(this.primitive_alpha_texture) this.primitive_alpha_texture.dispose();
        this.primitive_alpha_texture = null;
    }
    clean3Dtexturelight(){ // ...
    }
    clean3Dtextureemissive(){ // ...
    }
    clean3DLight(){
        if(this.light){
            this.updateHelpers('directional',true);
            this.updateHelpers('spot',true);

            this.scene.remove(this.light);
            this.light.dispose();
            //
            this.light = null;
            
            
        }
    }
    clean3DPointLight(){
        if(this.lights[ 0 ]){
            this.updateHelpers('point',true);
            
            this.scene.remove(this.lights[ 0 ]);
            this.lights[ 0 ].dispose();
           // if(this.scene) this.scene.dispose();
           this.lights = [];

           
        }
    }
    clean3DAmbient(){
        
            if(this.ambientMesh) this.scene.remove( this.ambientMesh );
            if(this.ambientGeometry) this.ambientGeometry.dispose();
            if(this.ambientMaterial) this.ambientMaterial.dispose();
    }
    clean3DAmbientTexture(){
        //if(this.ambientPath != '')){
            if(this.ambient_texture) this.ambient_texture.dispose();                
        //}
    }
    clean3DskyImage(){
        //if(this.ambientPath != '')){
            if(this.sky_image) this.sky_image.dispose();                
        //}
    }
    clean3Dmodifier(){
        //if(this.ambientPath != '')){
            
            if(this.twist) this.modifier.removeModifier(this.twist);
            //if(this.modifier) this.modifier.dispose();
            if(this.modifier) this.modifier.reset(); 

            this.bend = null;
            this.twist = null;
            this.skew = null;               
        //}
    }
    clean3D(){
        /*
        const geometry = new THREE.SphereGeometry( 50, Math.random() * 64, Math.random() * 32 );

        //const texture = new THREE.CanvasTexture( createImage() );

        const material = new THREE.MeshBasicMaterial( { map: texture, wireframe: true } );

        const mesh = new THREE.Mesh( geometry, material );
        this.primitive_mesh = new THREE.Mesh(this.geometry, material);

        scene.add( mesh );

        renderer.render( scene, camera );
        */
        // the cancellation uses the last requestId
        //var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
        //cancelAnimationFrame(this.myReq);

        if(this.primitive_mesh) this.scene.remove( this.primitive_mesh );
        
        // clean up
        if(this.geometry) this.geometry.dispose();
        
        
        //if(this.controls) this.controls.dispose();
        
        
        //if(this.renderer) this.renderer.dispose();

        
        //if(this.scene) this.scene.dispose();
    }
    initGeometryMesh(){
        
        // ----> SCENE ........
        //this.generateScene();
         
        
        // ----> RENDERER ........
        //this.generateRenderer();

       

       // ----> CONTROLS ........
       //this.generateControls();

       
        
        // ----> LIGHT .........
        //this.generateLight();
        

        

        // ----> RENDER-ANIMATIONS ........
        //this.generateRender()
        
        // ----> CAMERA ........
        //this.generateCamera();

        
    }


    updateMaterial(){
        this.clean3DMaterial();
        this.material = this.generateMaterial(this.materialType);
    }
    updateEnvMap(){
        
    }
    updateLight(){
        this.clean3DLight();
        this.generateLight();
    }
    updatePointsLight(){
        this.clean3DPointLight();
        this.generatePointsLight();
    }
    
    updateGeometryMesh(){
        
        this.clean3DMesh();
        this.meshConstructor();
    }
    updateControls(){
        this.clean3DControls();
        this.generateControls();
        this.controls.update();
    }
    render() {
        if(this.renderer) this.renderer.render( this.scene, this.camera );
    }
    onElementChange(propertyName, settings) {
        this.elementSettings = settings;
        
        // VIEWPORT -------------------------------------- 
        if ('viewport_width' === propertyName) {
            this.windowResize();
        }
        if ('viewport_height' === propertyName) {
            this.windowResize();
        }
        if ('viewport_extend' === propertyName) {
            // if(this.elementSettings.viewport_extend){
            //     jQuery('.elementor-element-'+$id+' .e-threed-container').addClass('e3d-viewport-extend');
            //     this.windowResize();
            // }else{
            //     jQuery('.elementor-element-'+$id+' .e-threed-container').removeClass('e3d-viewport-extend');
            //     this.windowResize();
            // }
        }

        
        // GEOMETRY --------------------------------------            
        if ('geometry_type' === propertyName) {
            this.geometryType = this.elementSettings['geometry_type'] || 'cube';
            
            this.updateData3d();
            this.updateGeometryMesh();
        }
        //obj mmodel
        /*if ('object_3d' === propertyName) {
            this.object3did = this.elementSettings.object_3d;

            this.updateData3d();
            this.updateGeometryMesh();
        }*/
        // cube, plane
        if ('geometry_width' === propertyName) {
            this.geometryWidth = this.elementSettings.geometry_width ? this.elementSettings.geometry_width.size : 2,
            this.geometry.width = this.geometryWidth;
            this.updateGeometryMesh();
        }
        // cube, cylinder, plane
        if ('geometry_height' === propertyName) {
            this.geometryHeight = this.elementSettings.geometry_height ? this.elementSettings.geometry_height.size : 2,
            this.geometry.height = this.geometryHeight;
            this.updateGeometryMesh();
        }
        // cube
        if ('geometry_depth' === propertyName) {
            this.geometryDepth = this.elementSettings.geometry_depth ? this.elementSettings.geometry_depth.size : 2;
            this.geometry.depth = this.geometryDepth;
            this.updateGeometryMesh();
        }
        // sphere, torus, octahedron, dodecaedro, tetrahedron, cone, piramid, icosahedro
        if ('geometry_radius' === propertyName) {
            this.geometryRadius = this.elementSettings.geometry_radius ? this.elementSettings.geometry_radius.size : 1;
            this.geometry.radius = this.geometryRadius;
            this.updateGeometryMesh();
        }
        // cylinder

        if ('geometry_cylinder_radiusTop' === propertyName) {
            this.geometryRadiusTop = this.elementSettings.geometry_cylinder_radiusTop ? this.elementSettings.geometry_cylinder_radiusTop.size : 1;
            this.geometry.radiusTop = this.geometryRadiusTop;
            this.updateGeometryMesh();
        }
        if ('geometry_cylinder_radiusBottom' === propertyName) {
            this.geometryRadiusBottom = this.elementSettings.geometry_cylinder_radiusBottom ? this.elementSettings.geometry_cylinder_radiusBottom.size : 1;
            this.geometry.radiusBottom = this.geometryRadiusBottom;
            this.updateGeometryMesh();
        }
        // cone
        if ('geometry_coneHeigh' === propertyName) {
            this.geometryConeHeigh = this.elementSettings.geometry_coneHeigh ? this.elementSettings.geometry_coneHeigh.size : 1;
            this.geometry.height = this.geometryConeHeigh;
            this.updateGeometryMesh();
        }
        //torus
        if ('geometry_tubeRadius' === propertyName) {
            this.geometryTubeRadius = this.elementSettings.geometry_tubeRadius ? this.elementSettings.geometry_tubeRadius.size : 0.5;
            
            this.updateGeometryMesh();
        }
        //SVG
        if ('geometry_svg_depth' === propertyName) {
            this.svgDepth = this.elementSettings.geometry_svg_depth ? this.elementSettings.geometry_svg_depth.size : 16;
            
            this.updateGeometryMesh();
        }


        // DETAIL --------------------------------------
        // octahedron, dodecaedro, tetrahedron, icosahedro
        if ('geometry_detail' === propertyName) {
            this.geometryDetail = this.elementSettings.geometry_detail ? this.elementSettings.geometry_detail.size : 2;
            this.updateGeometryMesh();
        }


        // SEGMENTS --------------------------------------            
        if ('geometry_widthSegments' === propertyName) {
            this.geometryWidthSegments = this.elementSettings.geometry_widthSegments || 4;
            this.updateGeometryMesh();
        }
        
        if ('geometry_heightSegments' === propertyName) {
            this.geometryHeightSegments = this.elementSettings.geometry_heightSegments || 4;
            this.updateGeometryMesh();
        }
        
        if ('geometry_depthSegments' === propertyName) {
            this.geometryDepthSegments = this.elementSettings.geometry_depthSegments || 4;
            this.updateGeometryMesh();
        }
        
        if ('geometry_radialSegments' === propertyName) {
            this.geometryRadialSegments = this.elementSettings.geometry_radialSegments || 12;
            this.updateGeometryMesh();
        }
        
        if ('geometry_tubularSegments' === propertyName) {
            this.geometryTubularSegments = this.elementSettings.geometry_tubularSegments || 10;
            this.updateGeometryMesh();
        }
        
        
        
        
        
        
        
        // CAMERA --------------------------------------
        if ('camera_type' === propertyName) {
            this.cameraType = this.elementSettings.camera_type || 'perspective';

            this.clean3DCamera();
            this.updateCamera();
            this.camera.updateProjectionMatrix();
            
            if(this.interactivityType) this.updateControls();

            this.render();
        }
        if ('camera_fov' === propertyName) {
            this.cameraFov = this.elementSettings.camera_fov && Boolean(this.elementSettings.camera_fov.size) ? this.elementSettings.camera_fov.size : 40;
            this.camera.fov = this.cameraFov;

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_zoom' === propertyName) {
            this.cameraZoom = this.elementSettings.camera_zoom && Boolean(this.elementSettings.camera_zoom.size) ? this.elementSettings.camera_zoom.size : 1;
            this.camera.zoom = this.cameraZoom;

            this.camera.updateProjectionMatrix();
            this.render();
        }
        
        


        // Aggancio la rotazione della scena sempre al centro della scena.
        if ('camera_lookat' === propertyName) {
            this.cameraLookat = Boolean(this.elementSettings.camera_lookat) || false;

            this.updateCamTarget();
            
            this.camera.updateProjectionMatrix();
            this.render();
        }



        // POSITIONS x-y-z
        if ('camera_posx' === propertyName) {
            this.cameraPosX = this.elementSettings.camera_posx ? this.elementSettings.camera_posx.size : 0;
            this.camera.position.x = this.cameraPosX;
            
            this.updateCamTarget();

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_posy' === propertyName) {
            this.cameraPosY = this.elementSettings.camera_posy ? this.elementSettings.camera_posy.size : 0;
            this.camera.position.y = this.cameraPosY;

            this.updateCamTarget();

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_posz' === propertyName) {
            this.cameraPosZ = this.elementSettings.camera_posz ? this.elementSettings.camera_posz.size : 4;
            this.camera.position.z = this.cameraPosZ;

            this.updateCamTarget();

            this.camera.updateProjectionMatrix();
            this.render();
        }




        // TARGET x-y-z
        if ('camera_targetx' === propertyName) {
            this.cameraTargetX = this.elementSettings.camera_targetx ? this.elementSettings.camera_targetx.size : 0;
            
            this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
            
            this.updateCamTarget();

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_targety' === propertyName) {
            this.cameraTargetY = this.elementSettings.camera_targety ? this.elementSettings.camera_targety.size : 0;
            
            this.updateCamTarget();

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_targetz' === propertyName) {
            this.cameraTargetZ = this.elementSettings.camera_targetz ? this.elementSettings.camera_targetz.size : 4;
            
            this.updateCamTarget();

            this.camera.updateProjectionMatrix();
            this.render();
            
        }




        // TRANSFORM --------------------------------------
        if ('geometry_mesh_posx' === propertyName) {
            this.geometryMeshPosX = this.elementSettings.geometry_mesh_posx ? this.elementSettings.geometry_mesh_posx.size : 0;
            this.primitive_mesh.position.x = this.geometryMeshPosX;
            this.render();
        }
        if ('geometry_mesh_posy' === propertyName) {
            this.geometryMeshPosY = this.elementSettings.geometry_mesh_posy ? this.elementSettings.geometry_mesh_posy.size : 0;
            this.primitive_mesh.position.y = this.geometryMeshPosY;
            this.render();
        }
        if ('geometry_mesh_posz' === propertyName) {
            this.geometryMeshPosZ = this.elementSettings.geometry_mesh_posz ? this.elementSettings.geometry_mesh_posz.size : 0;
            this.primitive_mesh.position.z = this.geometryMeshPosZ;
            this.render();
        }
        if ('geometry_mesh_rotx' === propertyName) {
            this.geometryMeshRotX = this.elementSettings.geometry_mesh_rotx ? this.elementSettings.geometry_mesh_rotx.size : 0;
            this.primitive_mesh.rotation.x = THREE.MathUtils.degToRad (this.geometryMeshRotX);
            this.render();
        }
        if ('geometry_mesh_roty' === propertyName) {
            this.geometryMeshRotY = this.elementSettings.geometry_mesh_roty ? this.elementSettings.geometry_mesh_roty.size : 0;
            this.primitive_mesh.rotation.y = THREE.MathUtils.degToRad (this.geometryMeshRotY);
            this.render();
        }
        if ('geometry_mesh_rotz' === propertyName) {
            this.geometryMeshRotZ = this.elementSettings.geometry_mesh_rotz ? this.elementSettings.geometry_mesh_rotz.size : 0;
            this.primitive_mesh.rotation.z = THREE.MathUtils.degToRad (this.geometryMeshRotZ);
            this.render();
        }
        if ('geometry_mesh_scale' === propertyName) {
            this.geometryMeshScale = this.elementSettings.geometry_mesh_scale ? this.elementSettings.geometry_mesh_scale.size : 1;
            this.primitive_mesh.scale.set(this.geometryMeshScale,this.geometryMeshScale,this.geometryMeshScale);
            this.render();
        }
        // IMPORT ---------------------------------------
        


        // AMBIENT --------------------------------------
        if ('ambient_type' === propertyName) {
            this.ambientType = this.elementSettings.ambient_type || '';
            this.clean3DAmbient();
            
            this.generateAmbient();
            this.generateAmbientTexture();

            
        }
        // (added.)
        if ('ambient_posy' === propertyName) {
            this.ambientPosY = this.elementSettings.ambient_posy ? this.elementSettings.ambient_posy.size : 0;
            this.ambientMesh.position.y = this.ambientPosY;
            this.render();
        }
        if ('ambient_texture' === propertyName) {
            this.ambientPath = this.elementSettings.ambient_texture ? this.elementSettings.ambient_texture.url : '';
            this.clean3DAmbient();
            this.clean3DAmbientTexture();
            
            
            this.generateAmbient();
            this.generateAmbientTexture();

            
        }
        if ('ambient_color' === propertyName) {
            this.ambientColor = this.elementSettings.ambient_color || 0xFFFFFF;
            this.ambientMaterial.color = new THREE.Color(this.ambientColor);
            this.render();
        }
        if ('ambient_wireframe_mode' === propertyName) {
            this.ambientWireframeMode = Boolean(this.elementSettings.ambient_wireframe_mode) || false;
            this.ambientMaterial.wireframe = this.ambientWireframeMode;
            this.render();
        }
        if ('sky_color' === propertyName) {
            this.ambientSkyColor = this.elementSettings['sky_color'] || 0xFFFFFF;
            this.scene.background = new THREE.Color(this.ambientSkyColor);
            this.render();
        }
        if ('sky_image' === propertyName) {
            this.ambientSkyPath = this.elementSettings.sky_image ? this.elementSettings.sky_image.url : '';
            this.ambientSkyColor = this.elementSettings['sky_color'] || 0xFFFFFF;

            this.clean3DskyImage()
            this.generateSkyImage();
            
            if(this.ambientSkyPath){
                this.scene.background = this.sky_texture;
            }else{
                this.scene.background = new THREE.Color(this.ambientSkyColor);
            }
            this.render();
        }
        if ('sky_hide' === propertyName) {
            if(!this.elementSettings.sky_hide){
                this.scene.background = this.sky_texture;
            }else{
                this.scene.background = new THREE.Color(this.ambientSkyColor);
            }
        }
        if ('sky_environment' === propertyName) {
            if(this.elementSettings.sky_environment){
                this.scene.environment = this.sky_texture;
            }else{
                this.scene.environment = null;
            }
        }
        if ('ambient_textureRepX' === propertyName) {
            this.ambient_textureRepX = this.elementSettings.ambient_textureRepX ? this.elementSettings.ambient_textureRepX : 1;
            this.ambient_texture.repeat.x = this.ambient_textureRepX;
            this.render();
        }
        if ('ambient_textureRepY' === propertyName) {
            this.ambient_textureRepY = this.elementSettings.ambient_textureRepY ? this.elementSettings.ambient_textureRepY : 1;
            this.ambient_texture.repeat.y = this.ambient_textureRepY;
            this.render();
        }
        // SCENE FOG
        if ('ambient_fog' === propertyName) {
            
            this.fogAmbient = Boolean(this.elementSettings.ambient_fog) || false;
            this.ambientMaterial.isFog = this.fogAmbient;
            
            this.updateParamsSceneFog();
            this.updateParamsMaterialFog( this.ambientMaterial);  
            
            this.clean3DAmbient();
            this.generateAmbient();
            
            this.render();
        }

        if ('fog_color' === propertyName) {
            this.fogColor = this.elementSettings.fog_color || 0x000000;
            this.scene.fog.color = new THREE.Color(this.fogColor);
            this.render();
        }
        if ('ambient_fog_near' === propertyName) {
            this.fogAmbientNear = this.elementSettings.ambient_fog_near ? this.elementSettings.ambient_fog_near.size : 2;
            this.scene.fog.near = this.fogAmbientNear;
            this.render();
        }
        if ('ambient_fog_far' === propertyName) {
            this.fogAmbientFar = this.elementSettings.ambient_fog_far ? this.elementSettings.ambient_fog_far.size : 12;
            this.scene.fog.far = this.fogAmbientFar;
            this.render();
        }
        
        //AMBIENT LIGHT
        if ('ambientlight_color' === propertyName) {
            this.ambientlightColor = this.elementSettings.ambientlight_color || 0xFFFFFF;
            this.ambientLight.color = new THREE.Color(this.ambientlightColor);
            this.render();
        }
        if ('ambientlight_intensity' === propertyName) {
            this.ambientlightIntensity = this.elementSettings.ambientlight_intensity ? this.elementSettings.ambientlight_intensity.size : 1;
            this.ambientLight.intensity = this.ambientlightIntensity;
            this.render();
        }


        // MATERIAL --------------------------------------
        // da sistemare
        if ('material_type' === propertyName) {
            this.materialType = this.elementSettings['material_type'] || 'wireframeMaterial';
            
            this.updateData3d();
            this.updateMaterial();

            this.updateGeometryMesh();
            this.render();
        }
        // da sistemare
        if ('material_texture' === propertyName) {
            this.textureMapPath = this.elementSettings.material_texture ? this.elementSettings.material_texture.url : '';
            //this.primitive_map_texture.image.url = this.textureMapPath;
            
            this.clean3Dtexturemap();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_bump_map' === propertyName) {
            this.textureBumpPath = this.elementSettings.material_bump_map ? this.elementSettings.material_bump_map.url : '';
            //this.primitive_map_texture.image.url = this.textureMapPath;
            
            this.clean3Dtexturebump();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_roughness_map' === propertyName) {
            this.textureRoughnessPath = this.elementSettings.material_roughness_map ? this.elementSettings.material_roughness_map.url : '';
            //this.primitive_map_texture.image.url = this.textureMapPath;
            
            this.clean3Dtextureroughness();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_normal_map' === propertyName) {
            this.textureNormalPath = this.elementSettings.material_normal_map ? this.elementSettings.material_normal_map.url : '';
            
            this.clean3Dtexturenormal();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_displacement_map' === propertyName) {
            this.textureDisplacementPath = this.elementSettings.material_displacement_map ? this.elementSettings.material_displacement_map.url : '';
            
            this.clean3Dtexturedisplacement();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_env_map' === propertyName) {
            this.textureEnv = this.elementSettings.material_env_map ? this.elementSettings.material_env_map.url : '';
            
            this.clean3Dtextureenv();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_metalness_map' === propertyName) {
            this.textureMetalnessPath = this.elementSettings.material_metalness_map ? this.elementSettings.material_metalness_map.url : '';
            
            this.clean3Dtexturemetalness();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_alpha_map' === propertyName) {
            this.textureAlphaPath = this.elementSettings.material_alpha_map ? this.elementSettings.material_alpha_map.url : '';
            
            this.clean3Dtexturealpha();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }


        //@p questo usa come env map l'immaginee di sky
        if ('enable_envmap' === propertyName) {
            this.isEnvMap = Boolean(this.elementSettings.enable_envmap) || false;

            this.updateData3d();
            this.updateMaterial();
            this.updateGeometryMesh();

            this.render();
        }


        if ('material_texture_offsetx' === propertyName) {
            this.textureOffsetx = this.elementSettings.material_texture_offsetx ? this.elementSettings.material_texture_offsetx.size : 0;
            if(this.primitive_map_texture) this.primitive_map_texture.offset.x = this.textureOffsetx;
            if(this.primitive_bump_texture) this.primitive_bump_texture.offset.x = this.textureOffsetx;
            if(this.primitive_light_texture) this.primitive_light_texture.offset.x = this.textureOffsetx;
            if(this.primitive_emissive_texture) this.primitive_emissive_texture.offset.x = this.textureOffsetx;
            if(this.primitive_alpha_texture) this.primitive_alpha_texture.offset.x = this.textureOffsetx;
            if(this.primitive_roughness_texture) this.primitive_roughness_texture.offset.x = this.textureOffsetx;
            if(this.primitive_metalness_texture) this.primitive_metalness_texture.offset.x = this.textureOffsetx;
            if(this.primitive_normal_texture) this.primitive_normal_texture.offset.x = this.textureOffsetx;
            if(this.primitive_env_texture) this.primitive_env_texture.offset.x = this.textureOffsetx;
            if(this.primitive_displacement_texture) this.primitive_displacement_texture.offset.x = this.textureOffsetx;
            if(this.primitive_ao_texture) this.primitive_ao_texture.offset.x = this.textureOffsetx;

            //this.updateParamsTexture();
            this.render();
        }
        if ('material_texture_offsety' === propertyName) {
            this.textureOffsety = this.elementSettings.material_texture_offsety ? this.elementSettings.material_texture_offsety.size : 0;
            if(this.primitive_map_texture) this.primitive_map_texture.offset.y = this.textureOffsety;
            if(this.primitive_bump_texture) this.primitive_bump_texture.offset.y = this.textureOffsety;
            if(this.primitive_light_texture) this.primitive_light_texture.offset.y = this.textureOffsety;
            if(this.primitive_emissive_texture) this.primitive_emissive_texture.offset.y = this.textureOffsety;
            if(this.primitive_alpha_texture) this.primitive_alpha_texture.offset.y = this.textureOffsety;
            if(this.primitive_roughness_texture) this.primitive_roughness_texture.offset.y = this.textureOffsety;
            if(this.primitive_metalness_texture) this.primitive_metalness_texture.offset.y = this.textureOffsety;
            if(this.primitive_normal_texture) this.primitive_normal_texture.offset.y = this.textureOffsety;
            if(this.primitive_env_texture) this.primitive_env_texture.offset.y = this.textureOffsety;
            if(this.primitive_displacement_texture) this.primitive_displacement_texture.offset.y = this.textureOffsety;
            if(this.primitive_ao_texture) this.primitive_ao_texture.offset.y = this.textureOffsety;

            //this.updateParamsTexture();
            this.render();
        }
        if ('material_texture_centerx' === propertyName) {
            this.textureCenterx = this.elementSettings.material_texture_centerx ? this.elementSettings.material_texture_centerx.size : 0;
            if(this.primitive_map_texture) this.primitive_map_texture.center.x = this.textureCenterx;
            if(this.primitive_bump_texture) this.primitive_bump_texture.center.x = this.textureCenterx;
            if(this.primitive_light_texture) this.primitive_light_texture.center.x = this.textureCenterx;
            if(this.primitive_emissive_texture) this.primitive_emissive_texture.center.x = this.textureCenterx;
            if(this.primitive_alpha_texture) this.primitive_alpha_texture.center.x = this.textureCenterx;
            if(this.primitive_roughness_texture) this.primitive_roughness_texture.center.x = this.textureCenterx;
            if(this.primitive_metalness_texture) this.primitive_metalness_texture.center.x = this.textureCenterx;
            if(this.primitive_normal_texture) this.primitive_normal_texture.center.x = this.textureCenterx;
            if(this.primitive_env_texture) this.primitive_env_texture.center.x = this.textureCenterx;
            if(this.primitive_displacement_texture) this.primitive_displacement_texture.center.x = this.textureCenterx;
            if(this.primitive_ao_texture) this.primitive_ao_texture.center.x = this.textureCenterx;

            //this.updateParamsTexture();
            this.render();
        }
        if ('material_texture_centery' === propertyName) {
            this.textureCentery = this.elementSettings.material_texture_centery ? this.elementSettings.material_texture_centery.size : 0;
            if(this.primitive_map_texture) this.primitive_map_texture.center.y = this.textureCentery;
            if(this.primitive_bump_texture) this.primitive_bump_texture.center.y = this.textureCentery;
            if(this.primitive_light_texture) this.primitive_light_texture.center.y = this.this.textureCentery;
            if(this.primitive_emissive_texture) this.primitive_emissive_texture.center.y = this.this.textureCentery;
            if(this.primitive_alpha_texture) this.primitive_alpha_texture.center.y = this.this.textureCentery;
            if(this.primitive_roughness_texture) this.primitive_roughness_texture.center.y = this.this.textureCentery;
            if(this.primitive_metalness_texture) this.primitive_metalness_texture.center.y = this.this.textureCentery;
            if(this.primitive_normal_texture) this.primitive_normal_texture.center.y = this.this.textureCentery;
            if(this.primitive_env_texture) this.primitive_env_texture.center.y = this.this.textureCentery;
            if(this.primitive_displacement_texture) this.primitive_displacement_texture.center.y = this.this.textureCentery;
            if(this.primitive_ao_texture) this.primitive_ao_texture.center.y = this.this.textureCentery;

            //this.updateParamsTexture();
            this.render();
        }
        if ('material_textureRepX' === propertyName) {
            this.textureRepx = this.elementSettings.material_textureRepX ? this.elementSettings.material_textureRepX : 1;
            if(this.primitive_map_texture) this.primitive_map_texture.repeat.x = this.textureRepx;
            if(this.primitive_bump_texture) this.primitive_bump_texture.repeat.x = this.textureRepx;
            if(this.primitive_light_texture) this.primitive_light_texture.repeat.x = this.textureRepx;
            if(this.primitive_emissive_texture) this.primitive_emissive_texture.repeat.x = this.textureRepx;
            if(this.primitive_alpha_texture) this.primitive_alpha_texture.repeat.x = this.textureRepx;
            if(this.primitive_roughness_texture) this.primitive_roughness_texture.repeat.x = this.textureRepx;
            if(this.primitive_metalness_texture) this.primitive_metalness_texture.repeat.x = this.textureRepx;
            if(this.primitive_normal_texture) this.primitive_normal_texture.repeat.x = this.textureRepx;
            if(this.primitive_env_texture) this.primitive_env_texture.repeat.x = this.textureRepx;
            if(this.primitive_displacement_texture) this.primitive_displacement_texture.repeat.x = this.textureRepx;
            if(this.primitive_ao_texture) this.primitive_ao_texture.repeat.x = this.textureRepx;

            //this.updateParamsTexture();
            this.render();
        }
        if ('material_textureRepY' === propertyName) {
            this.textureRepy = this.elementSettings.material_textureRepY ? this.elementSettings.material_textureRepY : 1;
            if(this.primitive_map_texture) this.primitive_map_texture.repeat.y = this.textureRepy;
            if(this.primitive_bump_texture) this.primitive_bump_texture.repeat.y = this.textureRepy;
            if(this.primitive_light_texture) this.primitive_light_texture.repeat.y = this.textureRepy;
            if(this.primitive_emissive_texture) this.primitive_emissive_texture.repeat.y = this.textureRepy;
            if(this.primitive_alpha_texture) this.primitive_alpha_texture.repeat.y = this.textureRepy;
            if(this.primitive_roughness_texture) this.primitive_roughness_texture.repeat.y = this.textureRepy;
            if(this.primitive_metalness_texture) this.primitive_metalness_texture.repeat.y = this.textureRepy;
            if(this.primitive_normal_texture) this.primitive_normal_texture.repeat.y = this.textureRepy;
            if(this.primitive_env_texture) this.primitive_env_texture.repeat.y = this.textureRepy;
            if(this.primitive_displacement_texture) this.primitive_displacement_texture.repeat.y = this.textureRepy;
            if(this.primitive_ao_texture) this.primitive_ao_texture.repeat.y = this.textureRepy;
            
            //this.updateParamsTexture();
            this.render();
        }
        // MATERIAL --------------------------------------
        if ('material_color' === propertyName) {
            this.materialColor = this.elementSettings.material_color ? this.elementSettings.material_color : 0xCCCCCC;
            this.material.color = new THREE.Color(this.materialColor);
            this.render();
        }
        if ('material_wireframe_mode' === propertyName) {
            this.materialWireframeMode = Boolean(this.elementSettings.material_wireframe_mode);
            this.material.wireframe = this.materialWireframeMode;
            this.render();
        }
        if ('enable_transparent' === propertyName) {
            this.isTransparent = Boolean(this.elementSettings.enable_transparent);
            //this.material.transparent = this.isTransparent;
            
            this.clean3Dtexturealpha();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            
            this.render();
        }
        if ('material_opacity' === propertyName) {
            this.materialOpacity = this.elementSettings.material_opacity ? this.elementSettings.material_opacity.size : 1;
            this.material.opacity = this.materialOpacity;

            this.render();
        }


        if ('material_shininess' === propertyName) {
            this.materialShininess = this.elementSettings.material_shininess ? this.elementSettings.material_shininess.size : 50;
            this.material.shininess = this.materialShininess;
            this.render();
        }
        if ('material_reflectivity' === propertyName) {
            this.materialReflectivity = this.elementSettings.material_reflectivity ? this.elementSettings.material_reflectivity.size : 1;
            this.material.reflectivity = this.materialReflectivity;
            this.render();
        }
        
        if ('material_roughness' === propertyName) {
            this.materialRoughness = this.elementSettings.material_roughness ? this.elementSettings.material_roughness.size : 0;
            this.material.roughness = this.materialRoughness;
            this.render();
        }
        if ('material_metalness' === propertyName) {
            this.materialMetalness = this.elementSettings.material_metalness ? this.elementSettings.material_metalness.size : 0.5;
            this.material.metalness = this.materialMetalness;
            this.render();
        }
        if ('material_bumpscale' === propertyName) {
            this.materialBumpScale = this.elementSettings.material_bumpscale ? this.elementSettings.material_bumpscale.size : 0.02;
            this.material.bumpScale = this.materialBumpScale;
            this.render();
        }
        if ('material_displacementscale' === propertyName) {
            this.materialDisplacementScale = this.elementSettings.material_displacementscale ? this.elementSettings.material_displacementscale.size : 1;
            this.material.displacementScale = this.materialDisplacementScale;
            this.render();
        }
        if ('material_displacementbias' === propertyName) {
            this.materialDisplacementBias = this.elementSettings.material_displacementbias ? this.elementSettings.material_displacementbias.size : 0;
            this.material.displacementBias = this.materialDisplacementBias;
            this.render();
        }
        if ('material_aointensity' === propertyName) {
            this.materialAOIntensity = this.elementSettings.material_aointensity ? this.elementSettings.material_aointensity.size : 1;
            this.material.aoMapIntensity = this.materialAOIntensity
            this.render();
        }


        // LIGHT --------------------------------------
        // da sistemare
        if ('light_type' === propertyName) {
            this.lightType = this.elementSettings['light_type'] || '';
            if(this.lightType == ''){
                this.clean3DLight();
            }else{
                this.updateLight()
            }
            
            
        }
        // light color
        if ('light_color' === propertyName) {
            this.lightColor = this.elementSettings['light_color'] || 0xff8888;
            this.light.color = new THREE.Color(this.lightColor);
            this.render();
        }
        // light intensity
        if ('light_spot_intensity' === propertyName) {
            this.lightSpotIntensity = this.elementSettings.light_spot_intensity ?  this.elementSettings.light_spot_intensity.size : 1;
            this.light.intensity = this.lightSpotIntensity;
            this.render();
        }
        if ('light_dir_intensity' === propertyName) {
            this.lightDirIntensity = this.elementSettings.light_dir_intensity ? this.elementSettings.light_dir_intensity.size : 2;
            this.light.intensity = this.lightDirIntensity;
            this.render();
        }
        // pos X
        if ('geometry_light_posx' === propertyName) {
            this.lightPosX = this.elementSettings.geometry_light_posx ? this.elementSettings.geometry_light_posx.size :-3;
            this.light.position.x = this.lightPosX;
            this.render();
        }
        // pos Y
        if ('geometry_light_posy' === propertyName) {
            this.lightPosY = this.elementSettings.geometry_light_posy ? this.elementSettings.geometry_light_posy.size : 3;
            this.light.position.y = this.lightPosY;
            this.render();
        }
        // pos Z
        if ('geometry_light_posz' === propertyName) {
            this.lightPosZ = this.elementSettings.geometry_light_posz ? this.elementSettings.geometry_light_posz.size : 2;
            this.light.position.z = this.lightPosZ;
            this.render();
        }
        // Light Point
        // da sistemare
        if ('enable_lightpoint' === propertyName) {
            this.lightsPoints = Boolean(this.elementSettings.enable_lightpoint);
            
            this.updatePointsLight();
        }
        // da sistemare
        if ('lightpoint_fly' === propertyName) {
            this.flyLightsPoints = Boolean(this.elementSettings.lightpoint_fly);
            
            this.updatePointsLight();
        }
        if ('lightpoint_color' === propertyName) {
            this.lightPointColor = this.elementSettings.lightpoint_color || 0xFFFFFF;
            this.lights[ 0 ].color = new THREE.Color(this.lightPointColor);
            this.render();
        }
        if ('lightpoint_intensity' === propertyName) {
            this.lightPointIntensity = this.elementSettings.lightpoint_intensity ? this.elementSettings.lightpoint_intensity.size : 3;
            this.lights[ 0 ].intensity = this.lightPointIntensity;
            this.render();
        }
        if ('lightpoint_distance' === propertyName) {
            this.lightPointDistance = this.elementSettings.lightpoint_distance ? this.elementSettings.lightpoint_intensity.size : 0;
            this.lights[ 0 ].distance = this.lightPointDistance;
            this.render();
        }
        // pos X
        if ('lightpoint_posx' === propertyName) {
            this.lightsPointsPosX = this.elementSettings.lightpoint_posx ? this.elementSettings.lightpoint_posx.size : 1;
            this.lights[ 0 ].position.x = this.lightsPointsPosX;
            this.render();
        }
        // pos Y
        if ('lightpoint_posy' === propertyName) {
            this.lightsPointsPosY = this.elementSettings.lightpoint_posy ? this.elementSettings.lightpoint_posy.size : 1;
            this.lights[ 0 ].position.y = this.lightsPointsPosY;
            this.render();
        }
        // pos Z
        if ('lightpoint_posz' === propertyName) {
            this.lightsPointsPosZ = this.elementSettings.lightpoint_posz ? this.elementSettings.lightpoint_posz.size : 1;
            this.lights[ 0 ].position.z = this.lightsPointsPosZ;
            this.render();
        }

        
        // SHADOW --------------------------------------
        if ('enable_shadows' === propertyName) {
            this.isShadows = Boolean(this.enable_shadows);
            
            this.updateData3d();
            
            if(this.renderer) this.renderer.shadowMap.enabled = this.isShadows;
            if(this.light) this.light.castShadow = this.isShadows;
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

            this.updateParamsShadows();
        }
        if ('shadow_type' === propertyName) {
            this.shadowType = this.elementSettings.shadow_type || 'PCFSoftShadowMap';
            
            this.updateData3d();
            
            this.clean3DRenderer();
            this.generateRenderer();
            //this.updateShadowsRenderer();
            
            //this.updateParamsShadows();
            //this.render(); // ...mapPass..
        }
        
        
        if ('geometry_shadow_radius' === propertyName) {
            this.shadowRadius = this.elementSettings.geometry_shadow_radius ? this.elementSettings.geometry_shadow_radius.size : 4;
            if(this.light) this.light.shadow.radius = this.shadowRadius;
            if(this.lights[ 0 ]) this.lights[ 0 ].shadow.radius = this.shadowRadius;
            //this.updateParamsShadows();
            this.render();
        }
        if ('geometry_shadow_blurSamples' === propertyName) {
            this.shadowBlurSamples = this.elementSettings.geometry_shadow_blurSamples ? this.elementSettings.geometry_shadow_blurSamples.size : 8;
            if(this.light) this.light.shadow.blurSamples = this.shadowBlurSamples;
            if(this.lights[ 0 ]) this.lights[ 0 ].shadow.blurSamples = this.shadowBlurSamples;
            //this.updateParamsShadows();
            this.render();
        }
        
        // ANIMATIONS ----------------------------------
        // da sistemare
        if ('geometry_animated' === propertyName) {
            this.animated = Boolean(this.elementSettings.geometry_animated) || false;
            this.updateGeometryMesh();
        }
        if ('geometry_animated_x' === propertyName) {
            this.animatedX = Boolean(this.elementSettings.geometry_animated_x) || false;
            if(!this.animatedX){
                this.primitive_mesh.rotation.x = 0;
            }
        }
        if ('geometry_animated_y' === propertyName) {
            this.animatedY = Boolean(this.elementSettings.geometry_animated_y) || false;
            if(!this.animatedY){
                this.primitive_mesh.rotation.y = 0;
            }
        }
        if ('geometry_animated_z' === propertyName) {
            this.animatedZ = Boolean(this.elementSettings.geometry_animated_z) || false;
            if(!this.animatedZ){
                this.primitive_mesh.rotation.z = 0;
            }
        }
        if ('geometry_animated_speed' === propertyName) {
            this.animatedSpeed = this.elementSettings.geometry_animated_speed || 1;
            
        }
        
        
        if ('modifier_twist_angle' === propertyName) {
            this.modifierTwistAngle = this.elementSettings.modifier_twist_angle ? this.elementSettings.modifier_twist_angle.size : 0.2;
            
            this.twist.angle = this.modifierTwistAngle; //Math.PI / 12;
            this.render();
        }

        //CONTROLS
        if ('interactivity_type' === propertyName) {
            this.interactivityType = this.elementSettings.interactivity_type || '';
            switch(this.interactivityType){
                case 'tilt':
                case 'orbit':
                case 'map':
                    this.updateControls();
                break;
                case 'wheel':
                    this.wheelnum = 0;

                    this.updateControls();
                break;
                default:
                    this.clean3DControls();
                    this.resetCamera();

            }
            this.updateParamsCamera();
        }
        if ('interactivity_dbclick' === propertyName) {
            this.interactivityDbClick = this.elementSettings.interactivity_dbclick || '';

        }
        if ('tilt_amount' === propertyName) {
            this.tiltAmount = this.elementSettings.tilt_amount ? this.elementSettings.tilt_amount.size : 1;
        }
        if ('tilt_speed' === propertyName) {
            this.tiltSpeed = this.elementSettings.tilt_speed ? this.elementSettings.tilt_speed.size : 5;
        }
        if ('orbit_panning' === propertyName) {
            this.orbitPanning = Boolean(this.elementSettings.orbit_panning) || false;
            this.controls.screenSpacePanning = this.orbitPanning;

            this.controls.update();
        }
        if ('orbit_autorotate' === propertyName) {
            this.orbitAutorotate = Boolean(this.elementSettings.orbit_autorotate) || false;
            this.controls.autoRotate = this.orbitAutorotate;

            this.controls.update();
        }
        if ('orbit_autorotate_speed' === propertyName) {
            this.autorotateSpeed = this.elementSettings.orbit_autorotate_speed ? this.elementSettings.orbit_autorotate_speed.size : 2.5;
            this.controls.autoRotateSpeed = this.autorotateSpeed;

            this.controls.update();
        }
        if ('orbit_damping' === propertyName) {
            this.orbitDamping = Boolean(this.elementSettings.orbit_damping) || false;
            this.controls.enableDamping = this.orbitDamping; // an animation loop is required when either damping or auto-rotation are enabled
            
            this.controls.update();
        }
        if ('orbit_damping_speed' === propertyName) {
            this.orbitDampingSpeed = this.elementSettings.orbit_damping_speed ? this.elementSettings.orbit_damping_speed.size : 0.05;
            this.controls.dampingFactor = this.orbitDampingSpeed;

            this.controls.update();
        }

        // RENDERER ------------------------------

        if ('renderer_physicallyCorrectLights' === propertyName) {
            this.physicallyCorrectLights = Boolean(this.elementSettings.renderer_physicallyCorrectLights) || false;
            this.renderer.physicallyCorrectLights = this.physicallyCorrectLights;
            
            //console.log(this.renderer.physicallyCorrectLights);

            //this.clean3DRenderer();
            //this.generateRenderer();
            this.render();
        }
        

        
        //
        if ('renderer_toneMapping' === propertyName) {
            this.toneMapping = this.elementSettings.renderer_toneMapping || 'NoToneMapping';
            this.updateToneMapping();
            
            this.render();
        }
        if ('renderer_toneMapping_exposure' === propertyName) {
            this.toneMappingExposure = this.elementSettings.renderer_toneMapping_exposure ? this.elementSettings.renderer_toneMapping_exposure.size : 0.68;
            this.renderer.toneMappingExposure = this.toneMappingExposure;
            this.render();
        }
        if ('renderer_outputEncoding' === propertyName) {
            this.outputEncoding = this.elementSettings.renderer_outputEncoding || 'LinearEncoding';
            this.updateOutputEncoding();

            this.render();
        }

        /*
        if ('threed_hotpoints' === propertyName) {
            console.log('a');
            this.repeaterMarkers = this.elementSettings.threed_hotpoints;
            if(this.repeaterMarkers.length > 0){
                this.repeaterMarkers.forEach((element, index, array) => { 
                    
                    let marker_posx = element.hp_x.size,
                        marker_posy = element.hp_y.size,
                        marker_posz = element.hp_z.size;
                    
                    console.log(marker_posx)
                });
            }
            
            this.render();
        }
        */
    }
}