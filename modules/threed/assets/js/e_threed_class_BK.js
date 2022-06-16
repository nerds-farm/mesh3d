var e_threed_class_instance = [];
var e_threed_isinit = false;
var e_threed_points_isinit = false;
class e_threed_class {

    constructor(e) {
        this.containere = e.$threedcontainer;

        ////////////////////////////////////////////////
        this.id_scope = e.$id_scope;
        this.scope = e.$scope;
        this.threedgeometryElement = e.$threedgeometry;   
        ////////////////////////////////////////////////
        this.baseId;
        this.activeId;

        // THIS internal global items ... 
        this.elementSettings = {};
        this.canvas = this.threedgeometryElement[0];
        this.viewport = this.canvas;

        this.container = this.containere[0];
        
        this.oids = [];
        this.oggetti = [];

        this.lids = [];
        this.luci = [];
        
        //L'OGGETTO 3D E LE CARATTERISTICHE DELLE PRIMITIVE
        this.scene = null; 
        this.camera = null;
        this.renderer = null;


        this.geometry = null;
        this.primitive_mesh = null;
        this.groupGeometry = new THREE.BufferGeometry();

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
        
        //COMPOSER shader (todo)
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
        this.mouseOffset = new THREE.Vector2();
        this.mouseIntersect = new THREE.Vector3(); //**
        this.wheelnum = 0;

        // MOUSEMOVE of viewport CANVAS
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.intersects = new THREE.Vector3();
        this.intersectsPoint = new THREE.Vector3(); //**

        // HOTPOINTS
        
        this.pids = [];
        this.punti = [];
        
        this.hotpointsList = []; //questo array raccoglie le sprite object
        this.activeHpId;
        this.activeHpIndex;

        this.hpstatus = false;
        this.hpindex = -1;
       
        this.helpernormal;        


        //RENDER ANIMATION
        this.clock = new THREE.Clock();

    }
    /************************* DATA ************************ */
    updateData3d_oggetto($id, $settings){
        this.oggetti[$id].settings.geometryType = $settings.geometry_type || 'cube';

        // OBJECT PARAMETERS
        this.oggetti[$id].settings.geometryWidth = $settings.geometry_width ? $settings.geometry_width.size : 2,
        this.oggetti[$id].settings.geometryHeight = $settings.geometry_height ? $settings.geometry_height.size : 2,
        this.oggetti[$id].settings.geometryDepth = $settings.geometry_depth ? $settings.geometry_depth.size : 2;
        
        this.oggetti[$id].settings.geometryRadius = $settings.geometry_radius ? $settings.geometry_radius.size : 1;
        
        //SVG
        this.oggetti[$id].settings.svgDepth = $settings.geometry_svg_depth ? $settings.geometry_svg_depth.size : 16;
        //this.oggetti[$id].settings.enableBelve = Boolean($settings.enable_svg_belve) || false;
        
        //segments
        this.oggetti[$id].settings.geometryWidthSegments = $settings.geometry_widthSegments || 4;
        this.oggetti[$id].settings.geometryHeightSegments = $settings.geometry_heightSegments || 4;
        this.oggetti[$id].settings.geometryDepthSegments = $settings.geometry_depthSegments || 4;
        
        this.oggetti[$id].settings.geometryRadialSegments = $settings.geometry_radialSegments || 8;
        
        //torus
        this.oggetti[$id].settings.geometryTubularSegments = $settings.geometry_tubularSegments || 10;
        this.oggetti[$id].settings.geometryTubeRadius = $settings.geometry_tubeRadius ? $settings.geometry_tubeRadius.size : 0.5;

        //cylinder
        this.oggetti[$id].settings.geometryRadiusTop = $settings.geometry_cylinder_radiusTop ? $settings.geometry_cylinder_radiusTop.size : 1;
        this.oggetti[$id].settings.geometryRadiusBottom = $settings.geometry_cylinder_radiusBottom ? $settings.geometry_cylinder_radiusBottom.size : 1;

        //cone
        this.oggetti[$id].settings.geometryConeHeigh = $settings.geometry_coneHeigh ? $settings.geometry_coneHeigh.size : 1;

        //detail
        this.oggetti[$id].settings.geometryDetail = $settings.geometry_detail ? $settings.geometry_detail.size : 2;


        //IMPORT MODEL
        this.oggetti[$id].settings.object3did = $settings.object_3d; //deprecato!!
        
        this.oggetti[$id].settings.import_folder_path = $settings.import_folder_path;
        this.oggetti[$id].settings.import_format_type = $settings.import_format_type;
        this.oggetti[$id].settings.import_file_name = $settings.import_file_name;

        //il gruppo che contiene l'import
        this.oggetti[$id].settings.themodel = new THREE.Group();
        //CUSTOM MATERIAL
        this.oggetti[$id].settings.useCustomMaterial = Boolean($settings.import_useCustomMaterial);

        //IMPORT - ojb/mtl
        this.oggetti[$id].settings.import_mtl = Boolean($settings.import_mtl);
        //IMPORT - ColladaDAE
        

        // animations MIXER
        this.oggetti[$id].settings.mixer;
        this.oggetti[$id].settings.clock;
        this.oggetti[$id].settings.importAnimationMixer = Boolean($settings.import_animationMixer);
        this.oggetti[$id].settings.indexAnimationMixer = $settings.index_animationMixer || 0;


        // TRANSFORM PRIMITIVA
        // pos X
        this.oggetti[$id].settings.geometryMeshPosX = $settings.geometry_mesh_posx ? $settings.geometry_mesh_posx.size : 0;
        // pos Y
        this.oggetti[$id].settings.geometryMeshPosY = $settings.geometry_mesh_posy ? $settings.geometry_mesh_posy.size : 0;
        // pos Z
        this.oggetti[$id].settings.geometryMeshPosZ = $settings.geometry_mesh_posz ? $settings.geometry_mesh_posz.size : 0;
        // rot X
        this.oggetti[$id].settings.geometryMeshRotX = $settings.geometry_mesh_rotx ? $settings.geometry_mesh_rotx.size : 0;
        // rot Y
        this.oggetti[$id].settings.geometryMeshRotY = $settings.geometry_mesh_roty ? $settings.geometry_mesh_roty.size : 0;
        // rot Z
        this.oggetti[$id].settings.geometryMeshRotZ = $settings.geometry_mesh_rotz ? $settings.geometry_mesh_rotz.size : 0;
        // scale
        this.oggetti[$id].settings.geometryMeshScale = $settings.geometry_mesh_scale ? $settings.geometry_mesh_scale.size : 1;

        // ANIMATIONS
        // rotation axis: loop random - x - y - z
        this.oggetti[$id].settings.animated = Boolean($settings.geometry_animated) || false;
        this.oggetti[$id].settings.animatedX = Boolean($settings.geometry_animated_x) || false;
        this.oggetti[$id].settings.animatedY = Boolean($settings.geometry_animated_y) || false;
        this.oggetti[$id].settings.animatedZ = Boolean($settings.geometry_animated_z) || false;
        this.oggetti[$id].settings.animatedSpeed = $settings.geometry_animated_speed || 1;
    }
    updateData3d_material($id, $settings){
        this.oggetti[$id].settings.materialType = $settings.material_type || 'wireframeMaterial';

        // MATERIAL
        this.oggetti[$id].settings.materialColor = $settings.material_color ? $settings.material_color : 0xCCCCCC;
        this.oggetti[$id].settings.materialShininess = $settings.material_shininess ? $settings.material_shininess.size : 50;
        this.oggetti[$id].settings.materialReflectivity = $settings.material_reflectivity ? $settings.material_reflectivity.size : 1;
        
        this.oggetti[$id].settings.isTransparent = Boolean($settings.enable_transparent);
        this.oggetti[$id].settings.materialOpacity = $settings.material_opacity ? $settings.material_opacity.size : 1;
      
        this.oggetti[$id].settings.materialWireframeMode = Boolean($settings.material_wireframe_mode);
        
        //material options
        this.oggetti[$id].settings.materialRoughness = $settings.material_roughness ? $settings.material_roughness.size : 0;
        this.oggetti[$id].settings.materialMetalness = $settings.material_metalness ? $settings.material_metalness.size : 0.5;
        this.oggetti[$id].settings.materialBumpScale = $settings.material_bumpscale ? $settings.material_bumpscale.size : 0.02;
        this.oggetti[$id].settings.materialDisplacementScale = $settings.material_displacementscale ? $settings.material_displacementscale.size : 1;
        this.oggetti[$id].settings.materialDisplacementBias = $settings.material_displacementbias ? $settings.material_displacementbias.size : 0;
        this.oggetti[$id].settings.materialAOIntensity = $settings.material_aointensity ? $settings.material_aointensity.size : 1;

        this.oggetti[$id].settings.materialNormalScale = new THREE.Vector2( 1, 1 ); //$settings.material_normalscale ? $settings.material_normalscale.size : 0.02;
        

        //TEXTURE of primitive
        //alert($settings.material_texture.url);
        
        this.oggetti[$id].settings.textureMapPath = $settings.material_texture ? $settings.material_texture.url : '';
        
        this.oggetti[$id].settings.textureBumpPath = $settings.material_bump_map ? $settings.material_bump_map.url : '';
        this.oggetti[$id].settings.textureRoughnessPath = $settings.material_roughness_map ? $settings.material_roughness_map.url : '';
        this.oggetti[$id].settings.textureNormalPath = $settings.material_normal_map ? $settings.material_normal_map.url : '';
        this.oggetti[$id].settings.textureEnvPath = $settings.material_env_map ? $settings.material_env_map.url : '';
        this.oggetti[$id].settings.textureAlphaPath = $settings.material_alpha_map ? $settings.material_alpha_map.url : '';
        this.oggetti[$id].settings.textureMetalnessPath = $settings.material_metalness_map ? $settings.material_metalness_map.url : '';
        this.oggetti[$id].settings.textureDisplacementPath = $settings.material_displacement_map ? $settings.material_displacement_map.url : '';
        this.oggetti[$id].settings.textureAOPath = $settings.material_ao_map ? $settings.material_ao_map.url : '';

        //TEXTURE position & ripetition
        this.textureOffsetx = this.elementSettings.material_texture_offsetx ? this.elementSettings.material_texture_offsetx.size : 0;
        this.textureOffsety = this.elementSettings.material_texture_offsety ? this.elementSettings.material_texture_offsety.size : 0;
        this.textureRepx = this.elementSettings.material_textureRepX ? this.elementSettings.material_textureRepX : 1;
        this.textureRepy = this.elementSettings.material_textureRepY ? this.elementSettings.material_textureRepY : 1;
        this.textureCenterx = this.elementSettings.material_texture_centerx ? this.elementSettings.material_texture_centerx.size : 0;
        this.textureCentery = this.elementSettings.material_texture_centery ? this.elementSettings.material_texture_centery.size : 0;
        
    }
    updateData3d_hotpoints($id, $settings){
        
        this.repeaterMarkers = $settings.threed_hotpoints || [];

        this.hpRenderIn = $settings.hp_render_in || 'scene';
        this.hpRenderInId = $settings.hp_render_in_id || '';
        this.hpRenderInElement = this.scene; //default is scene

        
       

        this.enableHPLookatTarget = Boolean($settings.enable_hplookattarget);
        this.hpTrigggers = $settings.hp_trigggers || ['click'];
        this.hpOnLiknkid = $settings.hp_on_liknkid || 'click';
        this.markerType = $settings.marker_type || 'defalut';
        this.markerColor = $settings.marker_color || '#FF0000';
        this.markerSize = $settings.marker_size ? $settings.marker_size.size : 1;
        this.markerShapeStyle = $settings.marker_sahpe_style || 'M75,0c41.4,0,75,33.6,75,75s-33.6,75-75,75S0,116.4,0,75S33.6,0,75,0z';
        this.markerMarkerShapeCustom = $settings.marker_sahpe_custom || '';


        this.markerImage = $settings.marker_custom_image ? $settings.marker_custom_image.url : ''; //todo
        this.tweenEase = "expo.inOut";
        if(this.hpTrigggers.includes("scroll")){
            this.tweenEase = "none";
        }
        this.tlmaster = gsap.timeline({ 
            force3D:true, 
            onStart: () => {} 
            
        });

        //hp3d
        this.punti[$id] = {
            repeaterMarkers : this.repeaterMarkers,
            hotpointsList : [],
            enableHPLookatTarget : this.enableHPLookatTarget,
            marker : {type: this.markerType, color: this.markerColor, size: this.markerSize, image: this.markerImage, path: this.markerShapeStyle},
            hpOnLiknkid: this.hpOnLiknkid,
            hpTrigggers : this.hpTrigggers,
            hpRenderIn : this.hpRenderIn,
            hpRenderInId : this.hpRenderInId,
            hpRenderInElement : null,
            tlmaster: this.tlmaster
        }
        
        //this.scaleMarker = 0.03; //forse lo parametrizzo

    }
    updateData3d_viewport(){
        this.viewportExtend = this.elementSettings.viewport_extend || '';
        
        if(this.viewportExtend){
            this.canvasW = window.innerWidth; 
            this.canvasH = window.innerHeight;

            this.viewport = document;
        }else{
            // le dimensioni del viewport
            //this.canvasW = this.threedgeometryElement.width(); 
            //this.canvasH = this.threedgeometryElement.height();
            this.canvasW = this.containere.width(); 
            this.canvasH = this.containere.height();
            //this.canvasW = this.elementSettings.viewport_width.size;
            //this.canvasH = this.elementSettings.viewport_height.size; 

            this.viewport = this.canvas;
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
        this.updateData3d_oggetto(this.baseId, this.elementSettings);
        this.updateData3d_material(this.baseId, this.elementSettings);
        this.updateData3d_hotpoints(this.baseId, this.elementSettings);
        //
        
        //RENDERER
        this.physicallyCorrectLights = Boolean(this.elementSettings.renderer_physicallyCorrectLights);
        this.outputEncoding = this.elementSettings.renderer_outputEncoding || 'LinearEncoding';
        this.toneMapping = this.elementSettings.renderer_toneMapping || 'NoToneMapping';
        this.toneMappingExposure = this.elementSettings.renderer_toneMapping_exposure ? this.elementSettings.renderer_toneMapping_exposure.size : 0.68;
        
        //CONTROL
        this.interactivityType = this.elementSettings.interactivity_type || '';
        this.tiltAmount = this.elementSettings.tilt_amount ? this.elementSettings.tilt_amount.size : 1;
        this.tiltSpeed = this.elementSettings.tilt_speed ? this.elementSettings.tilt_speed.size : 5;
        this.orbitAutorotate = Boolean(this.elementSettings.orbit_autorotate);
        this.autorotateSpeed = this.elementSettings.orbit_autorotate_speed ? this.elementSettings.orbit_autorotate_speed.size : 2.5;
        this.orbitPanning = Boolean(this.elementSettings.orbit_panning);
        this.interactivityDbClick = this.elementSettings.interactivity_dbclick || '';
        this.orbitDamping = Boolean(this.elementSettings.orbit_damping);
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
        

        
        
        
        
        // L'AMBIENT
        // ambient TYPE: wall, floor, room, spheres
        this.ambientType = this.elementSettings.ambient_type || '';

        this.ambientPosY = this.elementSettings.ambient_posy ? this.elementSettings.ambient_posy.size : 0;

        this.ambientPath = this.elementSettings.ambient_texture ? this.elementSettings.ambient_texture.url : '';
        this.ambientColor = this.elementSettings.ambient_color || 0xFFFFFF;
        
        this.ambientWireframeMode = Boolean(this.elementSettings.ambient_wireframe_mode);
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
        this.fogAmbient = Boolean(this.elementSettings.ambient_fog);
        this.fogColor = this.elementSettings.fog_color || 0x000000;
        this.fogAmbientNear = this.elementSettings.ambient_fog_near ? this.elementSettings.ambient_fog_near.size : 2;
        this.fogAmbientFar = this.elementSettings.ambient_fog_far ? this.elementSettings.ambient_fog_far.size : 12;
        
        //ENVMAP of primitive from sky
        this.isEnvMap = Boolean(this.elementSettings.enable_envmap);
        


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
        this.cameraHelper;
        this.cameraOrthoHelper;
        this.axesHelper;
        this.dirlightHelper;
        this.pointlightHelper;
        this.spotlightHelper;
        this.boxHelper;

        //MODIFIER
        this.modifierType = this.elementSettings.modifier_type || '';
        this.modifierTwistAngle = this.elementSettings.modifier_twist_angle ? this.elementSettings.modifier_twist_angle.size : 0.2;

        //pointtest (prova)
        this.mypoint;

        

    }
    pointTest($id){
        //voglio rendere visibile un punto
         const spherepoint = new THREE.SphereGeometry( 0.1, 16, 8 );
         
         let mymaterial = new THREE.MeshBasicMaterial( { color: 0x000000 });
         this.mypoint = new THREE.Mesh( spherepoint, mymaterial );
         
         
         
         this.scene.add( this.mypoint );
     }
     delete_pointTest($id){
         
         this.oggetti[$id].geometry.dispose();
         this.oggetti[$id].material.dispose();
         //this.oggetti[$id].primitive_mesh.dispose();
 
         this.scene.remove( this.mypoint );
         
     }
     // INIT ----------------------------------------------
     init($id, $settings){
        // i settings della scena/camera/render/viewport
        this.elementSettings = $settings;
        this.baseId = $id;
        // ------------------------------------------------
        this.oids.push($id);
        this.oggetti[$id] = {
            eid: $id,
            type: 'scene',
            settings: {}
        }
        // ------------------------------------------------
        
        this.updateData3d();
        

        // ----> SCENE ........
        this.generateScene();
        
        // ----> RENDERER ........
        this.generateRenderer();
        
        // ----> CAMERA ........
        this.generateCamera();
        
        

        // ----> LIGHT .........
        this.generatePointsLight();
        this.generateLight();
        this.generateAmbientLight();

        


        /*
        //... MATERIAL +++++++
        if(this.oggetti[$id].settings.materialType != 'wireframeMaterial')
        this.material = this.generateMaterial($id, this.oggetti[$id].settings.materialType);
        //@p genero la forma primitiva +++++++
        this.meshConstructor($id);
        */

        
        let theobjects = this.scope.closest('.elementor-element.e-container').find('.elementor-widget-e-3d-object');
        if(elementorFrontend.isEditMode() && e_threed_isinit){
            theobjects.each((i,el) => {
                if(jQuery(el).data('OBJECT3D')) jQuery(el).data('OBJECT3D')();
                
                //this.generate_object3d(jQuery(el).data('id'), jQuery(el).data('settings'));
            });
        }





        //---- AMBIENT ..........
        // genero l'ambiente se diverso da none
        if(this.ambientType != ''){
            this.generateAmbient();
            this.generateAmbientTexture();
        }
        
        // ----> RENDER ........
        this.generateRender();
        
        // ----> UTILITY ..........
        if(this.frontendHelpers || elementorFrontend.isEditMode()){
           this.updateHelpers('axes'); 
        }
        

        // ----> CONTROLS ........
        if(this.interactivityType == 'orbit' || this.interactivityType == 'wheel' || this.interactivityType == 'map')
        this.generateControls();

        // ----> HOT POINTS ........
        this.pointIsActive = false;
        //this.generateHotpoints();

        //debug
        //this.pointTest();
        this.generateRaycaster()

        // -----------------------------------------
        // EVENTS 
        this.add_triggerBdClick();
        
        // MOUSEWHEEL
        this.threedgeometryElement.on('mousewheel', (event) => {
            this.wheelnum += (event.deltaFactor * event.deltaY) * 0.01;
        });
        
        // MOUSEMOVE of viewport CANVAS
        this.viewport.addEventListener( 'mousemove', (event) => {
            this.mouseX = (( (event.offsetX) - this.windowHalfX ) / 2) * 0.01;
            this.mouseY = (( event.offsetY - this.windowHalfY ) / 4) * 0.01;
        } );
        
        // RESIZE of viewport CANVAS
        window.addEventListener( 'resize', () => {
            this.windowResize();
        });


       
    }
    /************************ EVENTS *********************** */
    add_triggerBdClick(){
        if(this.interactivityDbClick)
        this.viewport.addEventListener('dblclick', (e) => {
            //
            switch(this.interactivityDbClick){
                case 'intersect':
                    gsap.to(this.controls.target, {duration: 1, 
                        x: this.intersectsPoint.x,
                        y: this.intersectsPoint.y,
                        z: this.intersectsPoint.z,
                        ease: this.tweenEase});
                break;
                case 'reset':
                    this.resetCamera(this.activeHpId);
                break;
            }
            
            //alert(this.intersectsPoint.x+' '+this.intersectsPoint.y+' '+this.intersectsPoint.z);
        });
    }
    remove_triggerBdClick(){
        this.viewport.removeEventListener('dblclick');
    }


    /************************ EDITOR UTILS *********************** */
    writeWidgetPanel($id){
        if(elementorFrontend.isEditMode() && this.oggetti[$id] && this.oggetti[$id].primitive_mesh  && this.oggetti[$id].object3d){
            
            var bbox = new THREE.Box3().setFromObject(this.oggetti[$id].primitive_mesh);
            var cent = bbox.getCenter(new THREE.Vector3());
            var size = bbox.getSize(new THREE.Vector3());

            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-widget-boxw .e-threed-widget-value').text(size.x.toFixed(2));
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-widget-boxh .e-threed-widget-value').text(size.y.toFixed(2));
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-widget-boxd .e-threed-widget-value').text(size.z.toFixed(2));

            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-widget-boxx .e-threed-widget-value').text(this.oggetti[$id].object3d.position.x.toFixed(2));
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-widget-boxy .e-threed-widget-value').text(this.oggetti[$id].object3d.position.y.toFixed(2));
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-widget-boxz .e-threed-widget-value').text(this.oggetti[$id].object3d.position.z.toFixed(2));
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-widget-boxs .e-threed-widget-value').text(this.oggetti[$id].object3d.scale.x.toFixed(2));
        }
    }
    /************************ METHODS *********************** */
    generate_object3d($id, $settings){
        e_threed_isinit = true;
        //console.log(this.oggetti[$id]);

        this.oids.push($id);

        this.oggetti[$id] = {};
        this.oggetti[$id].settings = {};
        this.oggetti[$id].type = 'object';
        this.oggetti[$id].boxHelper = null;
        this.oggetti[$id].vertexNormalsHelper = null;
        this.oggetti[$id].material;

        this.updateData3d_oggetto($id, $settings);
        this.updateData3d_material($id, $settings);
        
        
        //... MATERIAL +++++++
        if(this.oggetti[$id].settings.materialType != 'wireframeMaterial'){
            this.material = this.generateMaterial($id, this.oggetti[$id].settings.materialType);
            this.oggetti[$id].material = this.material;
        }else{
            
        }
        
        //console.log(this.material);

        //@p PRIMITIVE MASH +++++++
        this.meshConstructor($id);

       

    }
    delete_object3d($id){
        this.cleanHelperMesh($id);

        if(this.oggetti[$id].primitive_mesh){
            if(this.oggetti[$id].primitive_mesh.geometry) this.oggetti[$id].primitive_mesh.geometry.dispose();
            if(this.oggetti[$id].material) this.oggetti[$id].material.dispose();
            //this.oggetti[$id].primitive_mesh.dispose();

            if(this.oggetti[$id].object3d) this.scene.remove( this.oggetti[$id].object3d );
            if(this.oggetti[$id].primitive_mesh) this.oggetti[$id].primitive_mesh = null;
            if(this.oggetti[$id].object3d) this.oggetti[$id].object3d = null;
            
            
        }
        if(this.oggetti[$id].settings) this.oggetti[$id].settings = null;

        const index_ob = this.oggetti.indexOf($id);
        if (index_ob > -1) {
            this.oggetti.splice(index_ob, 1);
        }

        const index_id = this.oids.indexOf($id);
        if (index_id > -1) {
            this.oids.splice(index_id, 1);
        }
    }
    generate_points3d($id, $settings){
        this.pids.push($id);

        this.punti[$id] = {};
        this.updateData3d_hotpoints($id, $settings);

        this.generateHotpoints($id);
    }
    delete_points3d($id, $settings){
        this.cleanHotpoints($id);
        if(this.punti[$id].repeaterMarkers.length){
            this.punti[$id].hotpointsList.forEach((el, i) => { 
                el.elem.children.forEach((element, index) => { 

                });
            });
            // this.punti[$id].repeaterMarkers.forEach((element, index, array) => {
                
            // });
        }
        
        const index_p = this.punti.indexOf($id);
        if (index_p > -1) {
            this.punti.splice(index_p, 1);
        }

        const index_id = this.pids.indexOf($id);
        if (index_id > -1) {
            this.pids.splice(index_id, 1);
        }
    }
    setActiveId($id){
        //alert($id);
        this.activeId = $id;
    }
    /******************************************************* */


    test3d($id){
        alert(this.luci[$id].shadow.enable);
    }
    
    
   
    windowResize(){
        this.updateData3d_viewport();
        
        let ratio = this.canvasW / this.canvasH;
        
        switch(this.cameraType){
            case 'perspective':
                this.camera.aspect = ratio;
            break;
            case 'orthographic':
                this.camera.left = - this.frustumSize * ratio / 2;
                this.camera.right = this.frustumSize * ratio / 2;
                this.camera.top = this.frustumSize / 2;
                this.camera.bottom = - this.frustumSize / 2;
            break;
        }
        this.camera.updateProjectionMatrix();
        
        
        this.renderer.setSize( this.canvasW, this.canvasH );
    }




    
    //hotpoints marker
    cleanHotpoints($id){
        //console.log('clean:');
        //console.log(this.punti[$id]);
        
        
        //
        if(this.punti[$id] && this.punti[$id].hotpointsList)
        this.punti[$id].hotpointsList.forEach((iel, ii) => { 
            //
            iel.elem.children.forEach((element, index) => {
                //pulisco i dati della shape
                element.material.dispose(); 
                element.geometry.dispose();

                
            });
            this.punti[$id].hpRenderInElement.remove( iel.elem ); // elimino il Group
            
        });

        // il top sarebbe pescare direttamente dalla scena tutti i punti
        // -- che solo una sprite ..
        console.log(this.scene); 
    }
    
    generateRaycaster(){
        let plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        var intersects_plane = new THREE.Vector3();
        let onDocumentMouseMove = (event) => {
            

                //https://jsfiddle.net/amitlzkpa/n0t1wq5f/
                // this.mouseOffset = {x: event.offsetX, y: event.offsetY}
                // this.pointer.x = ( event.offsetX / this.canvasW ) * 2 - 1;
                // this.pointer.y = - ( event.offsetY / this.canvasH ) * 2 + 1;

                this.mouseOffset = {x: event.clientX, y: event.clientY}
                //this.pointer.x = ( event.clientX / this.canvasW ) * 2 - 1;
                //this.pointer.y = - ( event.clientY / this.canvasH ) * 2 + 1;
                this.pointer.x = ( event.offsetX / this.canvasW ) * 2 - 1;
                this.pointer.y = - ( event.offsetY / this.canvasH ) * 2 + 1;
                
                // @p da capire meglio....
                //
                plane.translate.y = this.pointer.y;
                plane.translate.x = this.pointer.x;
                plane.translate.z = this.pointer.z;

                this.raycaster.ray.intersectPlane(plane,  intersects_plane);

                this.raycaster.setFromCamera( this.pointer, this.camera );



                // this.oids.forEach((o,i)=>{
                //     if(this.oggetti[o]){
                        
                //         //this.intersects = this.raycaster.intersectObject( this.oggetti[o].primitive_mesh );
                //         //this.raycaster.ray.intersectObject(this.oggetti[o].element,  intersects_plane);

                //         //console.log(this.raycaster.ray);
                //     };
                // });
                
                //jQuery('.e-3d-cursor').css('transform','translate3d(calc('+this.raycaster.ray.direction+'px - 50%), -50%, 0)');
                
                //gsap.to('.e-3d-cursor',{x: this.mouseOffset.x, y: this.mouseOffset.y})

                this.intersectsPoint.x = intersects_plane.x;
                this.intersectsPoint.y = intersects_plane.y;
                this.intersectsPoint.z = intersects_plane.z;

                //questo è un test per visualizzare il comportamento
                //this.mypoint.position.set( intersects_plane.x,  intersects_plane.y,  intersects_plane.z);
                //this.mouseIntersect = intersects_plane;
                
                //console.log(this.raycaster.ray.direction);
                //console.log(this.raycaster.ray.origin);
                //console.log(intersects_plane)



                /*
                this.intersects = this.raycaster.intersectObject( this.scene );
                        
                if ( this.intersects.length > 0 ) {
                    //this.cameraToMarker(element.point,element.point);
                    //this.cameraToTween($id,index);
                    //console.log(this.intersects.length);
                    
                    //console.log(this.raycaster);
                    //this.mypoint.position.x = this.raycaster.ray.direction.x * 2;
                }
                */
                
                //per la gestione dei tooltip
                this.pids.forEach((el,i) => {
                    this.punti[el].hotpointsList.forEach((element, index) => { 
                        
                        let tooltip = this.scope.find('.e-3d-tooltip span').eq(index);           
                        this.intersects = this.raycaster.intersectObject( element.point );
                        
                        if ( this.intersects.length > 0 ) {
                            //this.cameraToMarker(element.point,element.point);
                            //this.cameraToTween($id,index);
                            //console.log(this.intersects.length);
                            //console.log(this.raycaster);
                            
                            
                            gsap.set(tooltip,{display: 'block', x: this.mouseOffset.x, y: this.mouseOffset.y})
                            
                            //this.mypoint.position.x = this.raycaster.ray.origin.x;
                        }else{
                            gsap.set(tooltip,{display: 'none'})
                        }
                    });
                });
                
        
        }
        this.viewport.addEventListener('mousemove', onDocumentMouseMove, false); 
    }
    generateHotpoints($id){
        //alert('generateHotpoints');
        // console.log('punti:')
        // console.log(this.punti[$id].hotpointsList);
        // console.log('--------------');
        //alert(this.punti[$id].repeaterMarkers.length);

        if(this.punti[$id].repeaterMarkers.length > 0){

            //this.cleanHotpoints($id);

            let countMarker = 0;
            this.punti[$id].repeaterMarkers.forEach((element, index, array) => { 
                //alert(element._id)                
                // element sono i dati del ripetitore
                
                this.loadMarker($id, element, (sprm) => {
                    //alert(this.punti[$id].repeaterMarkers[index]);
                    //alert('load marker');
                    sprm.name = 'marker';

                    this.updateHotpoints($id, index, element, sprm);
                    this.calcSpriteSize();
                    
                   
                    if(element.hp_anchorid == this.punti[$id].hotpointsList[index].anchorid){
                        
                        if(this.punti[$id].hpTrigggers.includes("sectionid") && !this.punti[$id].hpTrigggers.includes("scroll")){
                            if(element.hp_anchorid){
                                let element_anchor = jQuery(document).find('*#'+element.hp_anchorid);
                                //alert(element.hp_anchorid+' - '+element_anchor.length);
                                if(element_anchor.length){
                                    ScrollTrigger.create({
                                        trigger: "#"+this.punti[$id].hotpointsList[index].anchorid,
                                        //start: "top top",
                                        //endTrigger: "#otherID",
                                        //end: "bottom 50%+=100px",
                                        onToggle: self => {
                                            //console.log("toggled, isActive:", self.isActive)
                                            if(self.isActive){
                                                //console.log(this.punti[$id].hotpointsList[index].anchorid);
                                                this.cameraToTween($id,index);
                                            }else{

                                                
                                            }
                                        },
                                        /*onLeave: ({progress, direction, isActive}) => {
                                            console.log(progress, direction, isActive);
                                            if(index == 0){
                                                alert('top')
                                                //@p quando lo scroll della pagina ritorna in alto (inizio) resetto la posizione a default.
                                                this.cameraToTween($id);
                                            }
                                        },*/

                                        // onEnter: ({progress, direction, isActive}) => {alert('onEnter')},
                                        // onEnterBack: ({progress, direction, isActive}) => {alert('onEnterBack')},
                                        // onLeave: ({progress, direction, isActive}) => {alert('onLeave')},
                                        // onLeaveBack: ({progress, direction, isActive}) => {alert('onLeaveBack '+index)},

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
                    if(this.punti[$id].hpTrigggers.includes("linkid")){
                        if(element.hp_anchorid){
                            let button_a = jQuery(document).find('a[href=#'+element.hp_anchorid+']');
                            //alert(element.hp_anchorid+' - '+button_a.length);
                            if(button_a.length){
                                
                                button_a.on(this.punti[$id].hpOnLiknkid,() => {
                                    this.punti[$id].hotpointsList.forEach((e, i) => { 
                                        if(element.hp_anchorid == e.anchorid){
                                            //alert(e.index+' '+element.hp_anchorid+'-'+e.anchorid);
                                            this.cameraToTween($id,i);
                                        }
                                    });
                                });
                                if(this.punti[$id].hpOnLiknkid == 'mouseover'){
                                    button_a.on('mouseleave',() => {
                                        this.cameraToTween();
                                    });
                                }
                            }
                        }
                    }
                   
                    
                    // ------------------------------
                     if(this.punti[$id].marker.type != 'none' || elementorFrontend.isEditMode()){
                           //kakao
                        
                            if(this.hpRenderIn == 'scene'){
                                this.hpRenderInElement = this.scene;
                            }else if(this.hpRenderIn == 'object'){
                                if(this.hpRenderInId){
                                    this.hpRenderInElement = this.oggetti[this.hpRenderInId].object3d;
                                }else{

                                }
                                
                            }
                            this.punti[$id].hpRenderInElement = this.hpRenderInElement;
                            this.punti[$id].hpRenderInElement.add( sprm );
                     }
                    // ------------------------------
                    //ipotesi A 
                    //this.primitive_mesh.add( sprm );
                    //ipotesi B
                    

                    //@P questo è un'esperimento... per ora chi se ne ciava
                    //this.helpernormal = new THREE.VertexNormalsHelper( sprm, 2, 0x00ff00, 1 );
                    //this.scene.add( helpernormal );
                    countMarker ++;
                    if(array.length-1 == countMarker){
                        setTimeout(()=>{
                            this.anableScrollBody($id);
                        },400)
                        
                    }
                    
                    //console.log(this.punti[$id].hpTrigggers);
                    if(this.punti[$id].hpTrigggers.includes("click")){
                       
                        let onDocumentMouseDown = (event) => {
                            event.preventDefault();
            
                            //this.pids.forEach((e, i, a) => { 
                                
                                this.activeHpId = $id;
                                this.pointer.x = ( event.offsetX / this.canvasW ) * 2 - 1;
                                this.pointer.y = - ( event.offsetY / this.canvasH ) * 2 + 1;
            
                                //console.log(this.pointer.x);
                                this.raycaster.setFromCamera( this.pointer, this.camera );
                                
                                this.punti[$id].hotpointsList.forEach((element, index, array) => { 
                                    
                                    this.intersects = this.raycaster.intersectObject( this.punti[$id].hotpointsList[index].point );
                                    //console.log(this.intersects.length)
                                    if ( this.intersects.length > 0 ) {
                                        //this.cameraToMarker(element.point,element.point);
                                        this.cameraToTween($id,index);
                                        
                                        //interrompo le interattività
                                        this.pointIsActive = true;
                                        // this.interactivityType = 'orbit';
                                        // this.updateControls();
                                    }
                                });
                            
                            //});
                        }
                        //this.viewport
                        this.canvas.addEventListener('mousedown', onDocumentMouseDown, false); 
                    }
                }); // END load

            }); // END foreach
            
        }
        
        
    }
    
    anableScrollBody($id){
        if(this.punti[$id].hpTrigggers.includes("scroll")){
                
            this.punti[$id].repeaterMarkers.forEach((element, index, array) => { 
                if(this.punti[$id].hpTrigggers.includes("scroll")){
                    this.cameraToTween($id,index);

                    
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
    meshConstructor($id){
        //mmmmm
        let group;
        
        if(this.oggetti[$id].settings.geometryType == 'svg'){
            //sono una svg
            this.geometry = this.importSVG($id);
            //che lo sforzo sia con te....
            this.material = this.generateMaterial($id, this.oggetti[$id].settings.materialType);
            
            if(this.oggetti[$id].settings.materialType == 'wireframeMaterial'){
                this.primitive_mesh = this.meshWireframe($id, this.geometry);
                this.oggetti[$id].primitive_mesh = this.primitive_mesh;
            }else{
                //@p che pippa!!! il rapporto della mappa è con una svg di 500x500
                let svgRapporto = 0.005;
                if(this.oggetti[$id].material.map) this.oggetti[$id].material.map.repeat.set( svgRapporto, svgRapporto );
                if(this.oggetti[$id].material.envMap) this.oggetti[$id].material.envMap.repeat.set( svgRapporto, svgRapporto );
                if(this.oggetti[$id].material.roughnessMap) this.oggetti[$id].material.roughnessMap.repeat.set( svgRapporto, svgRapporto );
                if(this.oggetti[$id].material.metalnessMap) this.oggetti[$id].material.metalnessMap.repeat.set( svgRapporto, svgRapporto );
                if(this.oggetti[$id].material.displacementMap) this.oggetti[$id].material.displacementMap.repeat.set( svgRapporto, svgRapporto );
                if(this.oggetti[$id].material.bumpMap) this.oggetti[$id].material.bumpMap.repeat.set( svgRapporto, svgRapporto );
                if(this.oggetti[$id].material.alphaMap) this.oggetti[$id].material.alphaMap.repeat.set( svgRapporto, svgRapporto );
                if(this.oggetti[$id].material.normalMap) this.oggetti[$id].material.normalMap.repeat.set( svgRapporto, svgRapporto );
                //if(this.oggetti[$id].material.emissiveMap) this.oggetti[$id].material.emissiveMap.repeat.set( svgRapporto, svgRapporto );
                //if(this.oggetti[$id].material.lightMap) this.oggetti[$id].material.lightMap.repeat.set( svgRapporto, svgRapporto );

                if(this.geometry){
                    this.primitive_mesh = new THREE.Mesh(this.geometry, this.oggetti[$id].material);
                    this.oggetti[$id].primitive_mesh = this.primitive_mesh;
                }
                
            }
            

            // scalo la svg
            this.scaleModel(this.oggetti[$id].primitive_mesh,3);
            
            const yOffset = -1.5;
            const xOffset = -1.5;
            this.oggetti[$id].primitive_mesh.position.x = xOffset;
            this.oggetti[$id].primitive_mesh.position.y = yOffset;

            //this.oggetti[$id].primitive_mesh = this.primitive_mesh; 
            group = new THREE.Group();
            
            if(this.oggetti[$id].primitive_mesh){
                 group.add( this.oggetti[$id].primitive_mesh );
            
                this.addtoScene($id, group);
            }
           

        }else if(this.oggetti[$id].settings.geometryType == 'import'){
            //sono un modello importato
            this.importModel($id, this.oggetti[$id].settings.import_format_type, (ob) => {

                this.primitive_mesh = ob;
                this.oggetti[$id].primitive_mesh = this.primitive_mesh;
                //console.log(ob);
                group = new THREE.Group();
                group.add( this.primitive_mesh );

                this.addtoScene($id, group);
            });

        }else{
            //sono una primitiva
            this.geometry = this.generatePrimitive($id, this.oggetti[$id].settings.geometryType);
            if(this.oggetti[$id].primitive_mesh){
                this.oggetti[$id].primitive_mesh.geometry = this.generatePrimitive($id, this.oggetti[$id].settings.geometryType);
            }

            if(this.oggetti[$id].settings.materialType == 'wireframeMaterial'){
                this.primitive_mesh = this.meshWireframe($id, this.geometry);
                if(this.oggetti[$id].primitive_mesh){
                    this.primitive_mesh = this.meshWireframe($id, this.oggetti[$id].primitive_mesh.geometry);
                }
            }else{
                this.primitive_mesh = new THREE.Mesh(this.geometry, this.material);
                if(this.oggetti[$id].primitive_mesh){
                    this.primitive_mesh = new THREE.Mesh(this.oggetti[$id].primitive_mesh.geometry, this.oggetti[$id].material);
                }
            }
            
            this.oggetti[$id].primitive_mesh = this.primitive_mesh; 
            group = this.primitive_mesh;
            
            this.addtoScene($id, group);

            
        }
        
    }
    addtoScene($id, $element){
        this.oggetti[$id].object3d = $element;
        //
        //this.generateModifiers($id); // aspetto a gestirli per bene, se ne vale la pena
        this.positionMesh($id); // puttana la merda!
        this.updateShadowsMesh($id);
    
        // .....
        //@p aggiungo la forma alla scena  !!!!!!!!!!!
        //alert(this.oggetti[$id].object3d+' '+this.oggetti[$id].settings.geometryType);            
        if(this.oggetti[$id].object3d) this.scene.add( this.oggetti[$id].object3d );
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
    positionMesh($id){
        //@p la posizioni se ho definito transform
        if(this.oggetti[$id].object3d) this.oggetti[$id].object3d.position.x = this.oggetti[$id].settings.geometryMeshPosX;
        if(this.oggetti[$id].object3d) this.oggetti[$id].object3d.position.y = this.oggetti[$id].settings.geometryMeshPosY;
        if(this.oggetti[$id].object3d) this.oggetti[$id].object3d.position.z = this.oggetti[$id].settings.geometryMeshPosZ;

        if(this.oggetti[$id].object3d) this.oggetti[$id].object3d.rotation.x = THREE.Math.degToRad (this.oggetti[$id].settings.geometryMeshRotX);
        if(this.oggetti[$id].object3d) this.oggetti[$id].object3d.rotation.y = THREE.Math.degToRad (this.oggetti[$id].settings.geometryMeshRotY);
        if(this.oggetti[$id].object3d) this.oggetti[$id].object3d.rotation.z = THREE.Math.degToRad (this.oggetti[$id].settings.geometryMeshRotZ);
        
        if(this.oggetti[$id].object3d) 
        this.oggetti[$id].object3d.scale.set(
            this.oggetti[$id].settings.geometryMeshScale,
            this.oggetti[$id].settings.geometryMeshScale,
            this.oggetti[$id].settings.geometryMeshScale
            );

    }
    updateShadowsMesh($id){
        //SHADOW /**/
        if(this.isShadows){
            if(this.oggetti[$id].primitive_mesh) this.oggetti[$id].primitive_mesh.castShadow = this.isShadows;
            if(this.oggetti[$id].primitive_mesh) this.oggetti[$id].primitive_mesh.receiveShadow = this.isShadows;
        }
    }
    generateModifiers($id){
        if(this.modifierType){
            this.modifier = new ModifierStack(this.oggetti[$id].primitive_mesh);

            switch(this.modifierType){
                case 'bend':
                /*
                this.bend = new Bend(0.7, 0.2, 0);
                
                this.bend.force = 0;
                this.bend.offset = 0.5;
                this.bend.angle = 0;

                this.bend.constraint = ModConstant.LEFT; // RIGHT

                //this.modifier.addModifier(this.bend);
                */
                break;
                case 'skew':
                /*
                this.skew = new Skew(0);
                this.skew.force = 0;
                */
                //this.modifier.addModifier(this.skew);
                break;
                case 'twist':
                    this.modifierTwistAngle = this.elementSettings.modifier_twist_angle ? this.elementSettings.modifier_twist_angle.size : 0.2;
                    
                    this.twist = new Twist(this.modifierTwistAngle);
                    this.twist.angle = this.modifierTwistAngle; //Math.PI / 12;
                    this.twist.vector = new Vector3(0, 1, 0);
                    //this.twist.vector = new Vector3(1, 1, 0);
                    this.modifier.addModifier(this.twist);
                    
                break;
                case 'cloth':
                /*
                tthis.cloth = new Cloth(1, 0);
                this.cloth.setForce(0.2, -0.2, -0.2);

                this.bend.rigidity = 0;
                this.bend.friction = 0.5;
                this.modifier.addModifier(this.cloth);
                */
                break;

            }
        }
    }
    importSVG($id){
        //mmmmm
        // ********************************* 
        // EXTRUSION SVG
        // resouce: https://muffinman.io/blog/three-js-extrude-svg-path/

        const svgElement = jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object').find('svg')[0];
        const svgMarkup = svgElement ? svgElement.outerHTML : '';

        //console.log(svgMarkup);
        
       
        let childGeometry = [];
        let mygeometry;
        //console.log(this.groupGeometry)
        
        

        // SVG Loader is not a part of the main three.js bundle 
        // We need to load it separately, it is included in this pen's Settings > JavaScript
        // https://threejs.org/docs/#examples/en/loaders/SVGLoader
        const loader = new THREE.SVGLoader();
        const svgData = loader.parse(svgMarkup);
        
        // Loop through all of the parsed paths
        svgData.paths.forEach((path, i) => {
            const shapes = path.toShapes(true);
            //console.log(path);
            // Each path has array of shapes
            shapes.forEach((shape, j) => {
                //console.log(shape);
                const extrudeSettings = {
                    steps: 10,
                    depth: this.oggetti[$id].settings.svgDepth,
                    bevelEnabled: false,
                    bevelThickness: 1,
                    bevelSize: 1,
                    bevelOffset: 0,
                    bevelSegments: 1
                };
                // Finally we can take each shape and extrude it
                mygeometry = shape.makeGeometry();
                
                const sgeometry = new THREE.ShapeGeometry( shape );
                //console.log(sgeometry)
                
                const geometryExtrude = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                
                
                childGeometry.push(geometryExtrude);
               
                //console.log(childGeometry.length);
            });
            
        });
        //console.log(childGeometry);

        // Create a mesh and add it to the group
        if(childGeometry.length > 0){
        this.groupGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(childGeometry);
        }
        //
        return this.groupGeometry;
    }

    
    meshWireframe($id, $geom){
        let geom = new THREE.WireframeGeometry( $geom ); // or EdgesGeometry
        // LINE material
        let materialline = new THREE.LineBasicMaterial( 
            {
                color: this.oggetti[$id].settings.materialColor,
                //linewidth: 4,
                //linecap: 'round', //ignored by WebGLRenderer
                //linejoin:  'round' //ignored by WebGLRenderer
            }
        );
        this.material = materialline;
        this.oggetti[$id].material = this.material;

        const lines = new THREE.LineSegments( geom, materialline);
        
        return lines;
    }

    // ENVMAP PRIMITIVE 
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
    generateTexture_map($id, $mat){
        if(!$mat) return;

        if(this.oggetti[$id].settings.textureMapPath){
            //
            this.primitive_map_texture = new THREE.TextureLoader().load( this.oggetti[$id].settings.textureMapPath, ( texture ) => {
                
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
    generateTexture_displacement($id, $mat){
        if(!$mat) return;


        if(this.oggetti[$id].settings.textureDisplacementPath != ''){
            this.primitive_displacement_texture = new THREE.TextureLoader().load( this.oggetti[$id].settings.textureDisplacementPath, ( texture ) => {
                
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

            $mat.displacementScale = this.oggetti[$id].settings.materialDisplacementScale; //1
            $mat.displacementBias = this.oggetti[$id].settings.materialDisplacementBias;  //0
            // 
            $mat.displacementMap = this.oggetti[$id].settings.primitive_displacement_texture;

        }else{
            this.primitive_displacement_texture = null;
            if($mat) $mat.displacementMap = null; 
        }
    }
    
    generateTexture_normal($id, $mat){
        if(!$mat) return;


        if(this.oggetti[$id].settings.textureNormalPath != ''){
            
            this.primitive_normal_texture = new THREE.TextureLoader().load( this.oggetti[$id].settings.textureNormalPath, ( texture ) => {
                
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
            //console.log(this.primitive_normal_texture)
        }else{
            this.primitive_normal_texture = null;
            if($mat) $mat.normalMap = null; 
        }
    }
    generateTexture_roughness($id, $mat){
        if(!$mat) return;


        if(this.oggetti[$id].settings.textureRoughnessPath != ''){
            this.primitive_roughness_texture = new THREE.TextureLoader().load( this.oggetti[$id].settings.textureRoughnessPath, ( texture ) => {
                
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

            $mat.roughness = this.oggetti[$id].settings.materialRoughness;
            // 
            $mat.roughnessMap = this.primitive_roughness_texture;

           
        }else{
            this.primitive_roughness_texture = null;
            if($mat) $mat.roughnessMap = null; 
        }
    }
    generateTexture_env($id, $mat){
        if(!$mat) return;

        //this.oggetti[$id].settings.textureEnvPath = this.oggetti[$id].settings.material_env_map ? this.oggetti[$id].settings.material_env_map.url : '';
        
        if(this.oggetti[$id].settings.textureEnvPath != ''){
            this.primitive_env_texture = new THREE.TextureLoader().load( this.oggetti[$id].settings.textureEnvPath, ( texture ) => {
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
    generateTexture_alpha($id, $mat){
        if(!$mat) return;


        if(this.oggetti[$id].settings.textureAlphaPath != '' && this.oggetti[$id].settings.isTransparent){
            this.primitive_alpha_texture = new THREE.TextureLoader().load( this.oggetti[$id].settings.textureAlphaPath, ( texture ) => {
                
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
    generateTexture_metalness($id, $mat){
        if(!$mat) return;


        if(this.oggetti[$id].settings.textureMetalnessPath != ''){
            this.primitive_metalness_texture = new THREE.TextureLoader().load( this.oggetti[$id].settings.textureMetalnessPath, ( texture ) => {
                
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

            //$mat.metalness = this.oggetti[$id].settings.materialMetalness;
            // 
            $mat.metalnessMap = this.primitive_metalness_texture;

           
        }else{
            this.primitive_metalness_texture = null;
            if($mat) $mat.metalnessMap = null; 
        }
    }
    generateTexture_bump($id, $mat){
        if(!$mat) return;

        if(this.oggetti[$id].settings.textureBumpPath != ''){
            
            this.primitive_bump_texture = new THREE.TextureLoader().load( this.oggetti[$id].settings.textureBumpPath, ( texture ) => {
                
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

            $mat.bumpScale = this.oggetti[$id].settings.materialBumpScale;
            // 
            $mat.bumpMap = this.primitive_bump_texture;
           
        }else{
            this.primitive_bump_texture = null;
            if($mat) $mat.bumpMap = null; 
        }
    }
    generateTexture_ao($id, $mat){
        if(!$mat) return;


        if(this.oggetti[$id].settings.textureAOPath != ''){
            this.primitive_ao_texture = new THREE.TextureLoader().load( this.oggetti[$id].settings.textureAOPath, ( texture ) => {
                
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

            $mat.aoMapIntensity = this.oggetti[$id].settings.materialAOIntensity
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

           
            this.updateParamsControls();

            
            //this.controls.maxPolarAngle = Math.PI / 2;

            
            
            // this.controls.target.set( 0, 2, 0 );
            this.controls.update();
        //}
        
        // @p aggancio la camera al centro
        //this.camera.lookAt( this.scene.position );
    }
    updateParamsControls(){
        //(added...)
        
        // if(!this.cameraLookat){
        //     alert('ca')
        //     this.controls.target.set(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
        //  }else{
        //     alert('cb')
        //     this.controls.target.set(0,0,0); 
        //  }
        
        this.controls.target.set(this.scene.position.x,this.scene.position.y,this.scene.position.z);
    }


    // add_light($id,value){
    //     alert($id);
    //     console.log(value);
    //     this.luci[$id] = value;
    //     alert('lids: '+this.lids.length);
    //     this.lids.forEach((el,i)=>{
    //         this.luci.forEach((element,index)=>{
    //             alert('- '+index)
    //         });
    //     });
    // }
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
            // this.light.shadow.camera.right = 17;
            // this.light.shadow.camera.left = - 17;
            // this.light.shadow.camera.top	= 17;
            // this.light.shadow.camera.bottom = - 17;
            // this.light.shadow.mapSize.width = 512;
            // this.light.shadow.mapSize.height = 512;
            this.light.shadow.focus = 1;
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
        //SHADOW /**/
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
    





    generateCamera(){
       

        this.updateCamera();
        

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
        
        // lo spot da camera per creare una luce base (added...)
        //const camLight = new THREE.PointLight( 0xffffff, 0.4 );
        const camLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
        this.camera.add( camLight );
        this.scene.add( this.camera );
        
    }
    updateCamera(){
       
         // -------------------------
        // CAMERA
        // fov, aspect, near, far
        // X - Y - Z
        // console.log(this.camera);
        let ratio = this.canvasW / this.canvasH;
        switch(this.cameraType){
            case 'perspective':
                this.camera = new THREE.PerspectiveCamera(this.cameraFov, ratio, 1, 1000);
            break;
            case 'orthographic':
                this.camera = new THREE.OrthographicCamera( this.frustumSize * ratio / - 2, this.frustumSize * ratio / 2, this.frustumSize / 2, this.frustumSize / - 2, 1, 1000 );
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
        
        this.camera.position.set( this.cameraPosX, this.cameraPosY, this.cameraPosZ );

        this.camera.updateProjectionMatrix();
    }
    resetCamera($id){
        //riprendono le interattività
        this.pointIsActive = false;
        // this.interactivityType = this.elementSettings.interactivity_type;
        // this.updateControls();
        //
        this.cameraToTween($id);
    }




    // hotpoints marker
    updateHotpoints($id, index, settings, sprm){
        
        let cam = {};
        let marker_posx = settings.hp_x.size || 0,
            marker_posy = settings.hp_y.size || 0,
            marker_posz = settings.hp_z.size || 0,
            cam_fov = settings.hp_cam_fov.size || 40,
            cam_zoom = settings.hp_cam_zoom.size || 1,
            cam_posx = settings.hp_cam_x.size || 0,
            cam_posy = settings.hp_cam_y.size || 0,
            cam_posz = settings.hp_cam_z.size || 3,
            anchor_id = settings.hp_anchorid || ''
        //
        //sprm.center.set( 0.5, 0.5 ); //mah!

        sprm.position.set( marker_posx, marker_posy, marker_posz );
        cam.position = {x: cam_posx, y: cam_posy, z: cam_posz};
        cam.fov = cam_fov;
        cam.zoom = cam_zoom;
       
        // --------------------------------
        //hp3d
        this.punti[$id].hotpointsList[index] = {
            elem: sprm,
            point: sprm,
            cam: cam,
            index: index,
            anchorid: anchor_id,
            marker: {type: this.markerType, color: this.markerColor, size: this.markerSize, image: this.markerImage, path: this.markerShapeStyle},
        };

       

    }

    


    setList_anchorid($id, i, val){
        if(this.punti[$id].hotpointsList[i]) this.punti[$id].hotpointsList[i].anchorid = val;
    }
    setList_pointx($id, i, val){
        //console.log(this.hotpointsList.length);
        //console.log('---> '+i);
        if(this.punti[$id].hotpointsList[i]) this.punti[$id].hotpointsList[i].point.position.x = val;
        //console.log(this.punti[$id].hotpointsList[i].point.position);
        
    }
    setList_pointy($id, i, val){
        if(this.punti[$id].hotpointsList[i]) this.punti[$id].hotpointsList[i].point.position.y = val;
    }
    setList_pointz($id, i, val){
        if(this.punti[$id].hotpointsList[i]) this.punti[$id].hotpointsList[i].point.position.z = val;
    }
    setList_camx($id, i, val){
        if(this.punti[$id].hotpointsList[i]) this.punti[$id].hotpointsList[i].cam.position.x = val;
    }
    setList_camy($id, i, val){
        if(this.punti[$id].hotpointsList[i]) this.punti[$id].hotpointsList[i].cam.position.y = val;
    }
    setList_camz($id, i, val){
        if(this.punti[$id].hotpointsList[i]) this.punti[$id].hotpointsList[i].cam.position.z = val;
    }
    setList_camfov($id, i, val){
        if(this.punti[$id].hotpointsList[i]) this.punti[$id].hotpointsList[i].cam.fov = val;
    }
    setList_camzoom($id, i, val){
        if(this.punti[$id].hotpointsList[i]) this.punti[$id].hotpointsList[i].cam.zoom = val;
    }

    calcSpriteSize(){

        //hotpointsList è 
        this.pids.forEach((element, index) => { 
            if(this.punti[element])
            this.punti[element].hotpointsList.forEach((el, i) => { 
                //
                /*
                // sta roba non va bene ma l'idea è di scalare il marker in base al fov
                var scale = spriteMarker.position.distanceTo(this.camera.position) / 100;
                scale = Math.min(0.03, Math.max(0.03, scale));
                spriteMarker.scale.set(scale, scale, scale);
                */
            
                /*
                this.scaleMarker = this.punti[element].marker.size/1000; // 0.001;
                let scale = this.scaleMarker / this.camera.zoom;
                */
                this.scaleMarker = this.punti[element].marker.size/1000; // 0.0001;
                
                let scale = this.scaleMarker / this.camera.zoom;
                //scale = scale * (this.camera.position.z);
                
                
                
                el.elem.scale.set(scale,scale,scale);
                el.elem.lookAt(this.camera.position)
            });
        });
        
    }
    setHPstatus($id,$i){
        //this.punti[$id].repeaterMarkers.forEach((el, i, a) => {
            /*this.punti[$id].hotpointsList.forEach((iel, ii) => { 
                iel.elem.children.forEach((element, index) => {
                    element.material.dispose();
                    this.punti[$id].hpRenderInElement.remove( this.punti[$id].hotpointsList[index].elem );
                });
            });*/
            
           
            //this.punti[$id].hotpointsList[index].elem.material.dispose();
           
            
        //});
        this.pids.forEach((el,i)=>{
            this.punti[el].hotpointsList.forEach((el, i) => { 
                this.activeHpIndex = $i;
                el.elem.children.forEach((element, index) => {
                    if(i == $i){
                        element.material.opacity = 1;
                    }else{
                        element.material.opacity = 0.4;
                    }
                });
            });
        });
    }

    loadMarker($id, el,$cb = null){
        //el è l'oggetto e .... 
        
        // Svg marker
        const svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" style="enable-background:new 0 0 85.4 81.3;" xml:space="preserve"><path d="'+this.markerShapeStyle+'"></path></svg>';
        const svgloader = new THREE.SVGLoader();
        const svgData = svgloader.parse(svgMarkup);
        
        let themarker = new THREE.Group();
        svgData.paths.forEach((path, i) => {
            const shapes = path.toShapes(true);
            // Each path has array of shapes
            shapes.forEach((shape, j) => {
                //console.log(shape);
                
                const sgeometry = new THREE.ShapeGeometry( shape );
                //let smaterial = new THREE.SpriteMaterial( { color: new THREE.Color(this.punti[$id].marker.color), sizeAttenuation: false, transparent: true } );
                let smaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color(this.punti[$id].marker.color), side: THREE.DoubleSide, transparent: true } );
                let smesh = new THREE.Mesh( sgeometry, smaterial );

                var bbox = new THREE.Box3().setFromObject(smesh);
                var cent = bbox.getCenter(new THREE.Vector3());
                var size = bbox.getSize(new THREE.Vector3());
                smesh.position.x = size.x * -0.5;
                smesh.position.y = size.y * 0.5;
                smesh.rotation.x = THREE.Math.degToRad (-180);
                
                themarker.add(smesh);

                if($cb) $cb(themarker);

            });
            
        });

        // IMAGE marker
        /*
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
        */
    }
    setHPposition($id, index, markeronly = false) {
        //this.enableHPLookatTarget
        if(this.punti[$id] && this.punti[$id].hotpointsList[index]){

            this.hpindex = index;
            
            let marker = this.punti[$id].hotpointsList[index].point.position,
                campos = this.punti[$id].hotpointsList[index].cam.position, 
                camfov = this.punti[$id].hotpointsList[index].cam.fov, 
                camzoom = this.punti[$id].hotpointsList[index].cam.zoom;
            
            //console.log(this.punti[$id].hotpointsList[index].point.position.x)
            //markeronly = false;
            
            if(markeronly){
                marker.set( marker.x, marker.y, marker.z );
                //this.controls.target.set(0,0,0);
                this.controls.target.set(marker.x, marker.y, marker.z);
            }else{
                if(this.controls){
                    
                    this.controls.target.set(marker.x,marker.y,marker.z);
                    //console.log('control '+marker.x);
                    this.controls.update();
                }else{
                    //console.log('cam-lookat: '+marker.x)
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
        
    }
    cameraToTween($id,index,play=true) {
        
        let ob = null;
        if($id && this.punti[$id]){
            ob = this.punti[$id].hotpointsList[index];
        }
       
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
        
        let tweenease = this.tweenEase;
        let tweenduration = 1;
        let tl = gsap.timeline({paused:true,
            force3D:true, 
            onUpdate : (self) => {
                this.calcSpriteSize();
                this.camera.updateProjectionMatrix();
               
            },
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
            //alert('no controls')
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
        //alert(camzoom+' '+this.camera.fov)
        tl.to(this.camera, {duration: tweenduration, 
            fov: camfov,
            zoom: camzoom,
            ease:tweenease
            
        },0)
        if(play)
        tl.play();
        //
        // compongol la timaline master per lo scroll su tutta la pagina
        if(this.punti[$id] && this.punti[$id].hpTrigggers.includes("scroll")){
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
    
    getOggetti(){
        console.log(this.oggetti);
        //console.log(this.oids);
        this.oids.forEach((o,i)=>{
            console.log(o);
        });
    }
    generateRender(){
        // RENDER
        
        let render = (time) => {
       
            //ANIMATIONS
            this.oids.forEach((o,i)=>{
                
                if(this.oggetti[o] && this.oggetti[o].settings.animated){
                    let time0 = Date.now() * (this.oggetti[o].settings.animatedSpeed * 0.001);
                    //time *= this.oggetti[o].settings.animatedSpeed/1000;  // convert time to seconds
                
                    // ruoto ....
                    if(this.oggetti[o].settings.animatedX) this.oggetti[o].object3d.rotation.x = time0;
                    if(this.oggetti[o].settings.animatedY) this.oggetti[o].object3d.rotation.y = time0;
                    if(this.oggetti[o].settings.animatedZ) this.oggetti[o].object3d.rotation.z = time0;
                }
            })

            //FLY LIGHT
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


            //WHILL la camera ruota attornno al centro della scena rotellando
            if(this.interactivityType == 'wheel' && !this.pointIsActive){
                this.camera.position.x = Math.sin( this.wheelnum * 0.7 ) * this.cameraPosZ;
                this.camera.position.z = Math.cos( this.wheelnum * 0.7 ) * this.cameraPosZ;
                
            }


            //@p MOVE la camera al MOUSE
            if(this.interactivityType == 'tilt' && !this.pointIsActive){
                this.camera.position.x += ( this.mouseX - this.camera.position.x ) * (this.tiltSpeed * 0.01) * this.tiltAmount;
                this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * (this.tiltSpeed * 0.01) * this.tiltAmount;

            }
            
            //CAMERA LOOKAT
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
            
            
            //TWEEN.update();
           
            //ANIMATIONS ColladaDAE
            const delta = this.clock.getDelta();
            this.oids.forEach((o,i)=>{
                if (this.oggetti[o] && this.oggetti[o].settings.mixer !== undefined && this.oggetti[o].settings.importAnimationMixer ) {
                    this.oggetti[o].settings.mixer.update( delta );
                }
            });
            
            // ..editor utils
            if(elementorFrontend.isEditMode()){
                this.oids.forEach((o,i)=>{
                    this.writeWidgetPanel(o);
                });
                this.pids.forEach((o,i)=>{
                    this.writeWidgetPanel(o);
                });
            }


            this.calcSpriteSize();
            
            // FONDAMENTALE
            //if(this.renderer) this.renderer.render(this.scene, this.camera);
            this.render();

            //
            this.myReq = requestAnimationFrame(render);
        }
        this.myReq = requestAnimationFrame(render);
    }
   
    generateMaterial($id, $materialtype){            
        let thematerial = null; //un materiale base
        //
        switch($materialtype){
            case 'basicMaterial':
                thematerial = new THREE.MeshBasicMaterial({color: this.oggetti[$id].settings.materialColor });
                
                break;
            case 'standardMaterial':
                    thematerial = new THREE.MeshStandardMaterial({
                        color: this.oggetti[$id].settings.materialColor,
                        //roughness: this.roughness, //le riflessioni 
                        //metalness: this.metalness    //metallo
                    });
                    
                    break;
            case 'phongMaterial':
                thematerial = new THREE.MeshPhongMaterial({color: this.oggetti[$id].settings.materialColor});
                
                break;
            
            case 'wireframeMaterial':

                break;
            
            case 'toonMaterial':
                thematerial = new THREE.MeshToonMaterial({color: this.oggetti[$id].settings.materialColor});

                break;
            
            case 'normalMaterial':
                // NORMAL (per normal no si intende normale, ma relativo alle normali!)
                thematerial = new THREE.MeshNormalMaterial();

                break;
            
            // case 'LambertMaterial':
            //     //to do
            //     thematerial = new THREE.MeshLambertMaterial( { envMap: this.oggetti[$id].settings.primitive_map_texture } );
            //     break;
            default:
                thematerial = new THREE.MeshBasicMaterial({color: this.oggetti[$id].settings.materialColor });
        }
        
        // options
        if(this.oggetti[$id].settings.materialWireframeMode && this.oggetti[$id].settings.materialType != 'wireframeMaterial'){
            thematerial.wireframe = this.oggetti[$id].settings.materialWireframeMode;
            thematerial.wireframeLinewidth = 4;
        }
        
        //
        //thematerial.flatShading = true;
        
        //thematerial.specular = 0x222222;
        //thematerial.emissive = 0xffffee;
        //thematerial.emissiveIntensity = 1;
        
        
        if($materialtype == 'standardMaterial'){
            thematerial.roughness = this.oggetti[$id].settings.materialRoughness;
            thematerial.metalness = this.oggetti[$id].settings.materialMetalness;
        }
        if($materialtype == 'phongMaterial'){
            thematerial.shininess = this.oggetti[$id].settings.materialShininess;
            thematerial.reflectivity = this.oggetti[$id].settings.materialReflectivity;
        }
        if($materialtype == 'phongMaterial' || $materialtype == 'standardMaterial'){
            thematerial.bumpScale = this.oggetti[$id].settings.materialBumpScale;
        }
        if(this.oggetti[$id].settings.isTransparent){
            thematerial.transparent = this.oggetti[$id].settings.isTransparent;
            thematerial.opacity = this.oggetti[$id].settings.materialOpacity;
        }
        
        
        if(this.oggetti[$id].settings.geometryType == 'plane'){
           if(thematerial) thematerial.side = THREE.DoubleSide;
        }

        // ----> TEXTURE MAP .........
        if(thematerial){
            this.generateTexture_map($id, thematerial);
            this.generateTexture_bump($id, thematerial);
            this.generateTexture_roughness($id, thematerial);
            this.generateTexture_normal($id, thematerial);
            this.generateTexture_displacement($id, thematerial);
            this.generateTexture_env($id, thematerial);
            this.generateTexture_alpha($id, thematerial);
            this.generateTexture_metalness($id, thematerial);
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

        // ----> ENVMAP (tutti gli oggetti ricevono la env map)
        if(thematerial && this.isEnvMap) this.generateEnvMap(thematerial);
        
        // ----> FOG (tutti gli oggetti ricevono il fog)
        if(thematerial) this.updateParamsMaterialFog(thematerial);
        
        return thematerial;
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
        this.oggetti[$id].material.shininess = this.oggetti[$id].settings.materialShininess;
         this.oggetti[$id].material.reflectivity = this.oggetti[$id].settings.materialReflectivity
         this.oggetti[$id].material.transparent = this.oggetti[$id].settings.isTransparent;
         this.oggetti[$id].material.opacity = this.oggetti[$id].settings.materialOpacity;

        if(this.oggetti[$id].settings.materialWireframeMode){
             this.oggetti[$id].material.wireframe = this.oggetti[$id].settings.materialWireframeMode;
             this.oggetti[$id].material.wireframeLinewidth = 4;
        }
        this.oggetti[$id].material.color.setHex(this.oggetti[$id].settings.materialColor);
    }
    
    generatePrimitive($id, $shape){
        ///////////////////////////////////////////////////////
        let primitive = null,
            geometry = new THREE.BufferGeometry();

        switch($shape){
            case 'cube':
                // *********************+************
                // CUBE
                geometry = new THREE.BoxGeometry(
                    this.oggetti[$id].settings.geometryWidth, this.oggetti[$id].settings.geometryHeight, this.oggetti[$id].settings.geometryDepth,
                    this.oggetti[$id].settings.geometryWidthSegments, this.oggetti[$id].settings.geometryHeightSegments, this.oggetti[$id].settings.geometryDepthSegments
                );
            break;

            case 'sphere':
                // *********************+************
                // SPHERE                    
                 // ui: heightSegments
                geometry = new THREE.SphereGeometry(
                    this.oggetti[$id].settings.geometryRadius, 
                    this.oggetti[$id].settings.geometryWidthSegments, this.oggetti[$id].settings.geometryHeightSegments
                );  
            break;
            
            case 'torus':
                // *********************+************
                // TORUS
                geometry = new THREE.TorusGeometry(
                    this.oggetti[$id].settings.geometryRadius, this.oggetti[$id].settings.geometryTubeRadius,
                    this.oggetti[$id].settings.geometryRadialSegments, this.oggetti[$id].settings.geometryTubularSegments
                );

            break;
                
            case 'octahedron':
                // *********************+************
                // OCTAHEDRON
                geometry = new THREE.OctahedronGeometry(
                    this.oggetti[$id].settings.geometryRadius, 
                    this.oggetti[$id].settings.geometryDetail
                    );

            break;

            case 'dodecaedro':
                 // *********************+************
                // DODECAEDRO
                geometry = new THREE.DodecahedronGeometry(
                    this.oggetti[$id].settings.geometryRadius, 
                    this.oggetti[$id].settings.geometryDetail
                    );

            break;
            
            case 'tetrahedron':
                // *********************+************
                // TETRAHEDRON
                geometry = new THREE.TetrahedronGeometry(
                    this.oggetti[$id].settings.geometryRadius, 
                    this.oggetti[$id].settings.geometryDetail
                    );

            break;
             
            case 'cylinder':
                // *********************+************
                // CyLINDER

                //const thetaStart = Math.PI * 0.25;  // ui: thetaStart
                //const thetaLength = Math.PI * 1.5;  // ui: thetaLength

                geometry = new THREE.CylinderGeometry(
                    this.oggetti[$id].settings.geometryRadiusTop, this.oggetti[$id].settings.geometryRadiusBottom, this.oggetti[$id].settings.geometryHeight,
                    this.oggetti[$id].settings.geometryRadialSegments, this.oggetti[$id].settings.geometryHeightSegments,
                    false,
                    /*thetaStart, thetaLength*/
                );

            break;
            
            case 'cone':
            case 'piramid':
                // *********************+************
                // PIRAMID / CONE                    
                geometry = new THREE.ConeGeometry(
                    this.oggetti[$id].settings.geometryRadius, 
                    this.oggetti[$id].settings.geometryConeHeigh, 
                    this.oggetti[$id].settings.geometryRadialSegments
                );

            break;
            
            case 'plane':
                // *********************+************
                // PLANE                    
                geometry = new THREE.PlaneGeometry(
                    this.oggetti[$id].settings.geometryWidth, this.oggetti[$id].settings.geometryHeight,
                    this.oggetti[$id].settings.geometryWidthSegments, this.oggetti[$id].settings.geometryHeightSegments
                );

            break;

            case 'icosahedro':
                // *********************+************
                // ICOSAHEDRO
                geometry = new THREE.IcosahedronGeometry(
                    this.oggetti[$id].settings.geometryRadius, 
                    this.oggetti[$id].settings.geometryDetail
                    ); 
            break;
            
        }
        
        return geometry;
    }
    



    // --------------------------- LOAD
    onProgress = ( xhr ) => {
        
        if ( xhr.lengthComputable ) {
            
            this.oids.forEach((o,i)=>{
                const percentComplete = xhr.loaded / xhr.total * 100;
                //console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
                let loading     = jQuery('.elementor-element-'+o+'.elementor-widget-e-3d-object'); 
                
                let thebar      = loading.find('.e-threed-loading .e-threed-loading-progress'),
                    theloading  = loading.find('.e-threed-loading');
                
                gsap.to(thebar,{width: Math.round( percentComplete, 2 )+'%', onComplete: () => { 

                    if(percentComplete > 99){
                        theloading.fadeOut();
                    }

                }, });
                
            });
            
            
        }
    }

    onError = () => {
        //alert('file not found')
    }

    importModel($id, $importType, $cb = null){
        
        // load
        switch($importType){
            case 'obj':
                this.importModelOBJ($id, $cb);
                break;
            case 'dae':
                this.importModelDAE($id, $cb);
                break;
            case 'gltf':
            case 'glb':   
                this.importModelGLTF($id, $cb);
                break;
            case 'fbx':
                this.importModelFBX($id, $cb);
                break;
        }
        
    }
    importModelOBJ($id, $cb = null){
        let _this = this;
        function loadModel() {
            //
            _this.primitive_mesh.traverse( function ( child ) {
                if ( child.isMesh ){
                    
                    //child.material.map = _this.primitive_map_texture;
                    
                    //@P l'idea è chee anche per i modelli importati voglio gestire il materiale 
                    //   non sempre mi va bene quello importato
                    if(_this.oggetti[$id].settings.useCustomMaterial && _this.oggetti[$id].settings.materialType != 'wireframeMaterial'){
                        child.material = _this.oggetti[$id].material;
                    }
                    //else{
                    //     if(!_this.oggetti[$id].settings.import_mtl)
                    //     child.material = new THREE.MeshPhongMaterial({color: 0XCCCCCC, side: THREE.DoubleSide, dithering: true })
                    // }
                    

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
            
            if($cb) $cb(_this.primitive_mesh);
        }
        // LOADING..
        let loadingbar = jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-loading').fadeIn();
        //
        const manager = new THREE.LoadingManager( loadModel );      
        // model
        function startload(){ 
            const loader = new THREE.OBJLoader( manager )
                .setPath( _this.oggetti[$id].settings.import_folder_path )
                .load( _this.oggetti[$id].settings.import_file_name+'.'+_this.oggetti[$id].settings.import_format_type, function ( obj ) {
                    
                    _this.scaleModel(obj,2);

                    //_this.primitive_mesh = obj;
                    _this.oggetti[$id].settings.themodel.add(obj);

                    _this.primitive_mesh = _this.oggetti[$id].settings.themodel;
                    //console.log(obj)

            }, _this.onProgress, _this.onError );
        }
       
        // -------------------------------------
        function startloadmtl(){ 
            new THREE.MTLLoader()
            .setPath( _this.oggetti[$id].settings.import_folder_path )
            .load( _this.oggetti[$id].settings.import_file_name+'.mtl', function ( materials ) {

                materials.preload();

                new THREE.OBJLoader( manager )
                    .setMaterials( materials )
                    .setPath( _this.oggetti[$id].settings.import_folder_path )
                    .load( _this.oggetti[$id].settings.import_file_name+'.'+_this.oggetti[$id].settings.import_format_type, function ( obj ) {

                        _this.scaleModel(obj,2);

                        _this.oggetti[$id].settings.themodel.add(obj);

                        _this.primitive_mesh = _this.oggetti[$id].settings.themodel;

                        //console.log(obj)

                    }, _this.onProgress, _this.onError );
            } );
        }
        if(_this.oggetti[$id].settings.import_mtl){
            startloadmtl();
        }else{
            startload();
        }
    }
    importModelGLTF($id, $cb = null){
        let _this = this;
        //GLTF ha enormi potenzialità per matriale (hdr) e animazioni paramettriche combinate
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_morph.html
        // https://threejs.org/examples/#webgl_animation_skinning_morph
        // TUTTO DA STUDIARE

        const loadingManager = new THREE.LoadingManager( function () {
            _this.primitive_mesh.traverse( function ( child ) {
                
                 if ( child.isMesh ){
                    
                    //@P l'idea è chee anche per i modelli importati voglio gestire il materiale 
                    //   non sempre mi va bene quello importato
                    if(_this.oggetti[$id].settings.useCustomMaterial && _this.oggetti[$id].settings.materialType != 'wireframeMaterial'){
                        child.material = _this.oggetti[$id].material;
                    }

                    if(_this.isShadows){
                        
                        //console.log(child.geometry);
                        //console.log(child.geometry.getSize(new THREE.Vector3()))
                        child.castShadow = _this.isShadows;
                        child.receiveShadow = _this.isShadows;
                        
                    }
                 }
            } );

           
            if($cb) $cb(_this.primitive_mesh);

            //
            _this.render();

        } );
        // LOADING..
        let loadingbar = jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-loading').fadeIn();

        //HDR è DA CAPIRE....
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
            //alert(_this.oggetti[$id].settings.import_folder_path+_this.oggetti[$id].settings.import_file_name+'.'+_this.oggetti[$id].settings.import_format_type)
            const loader = new THREE.GLTFLoader(loadingManager).setPath( _this.oggetti[$id].settings.import_folder_path );
                loader.load( _this.oggetti[$id].settings.import_file_name+'.'+_this.oggetti[$id].settings.import_format_type, function ( gltf ) {
                    
                    // gltf.animations; // Array<THREE.AnimationClip>
                    // gltf.scene; // THREE.Group
                    // gltf.scenes; // Array<THREE.Group>
                    // gltf.cameras; // Array<THREE.Camera>
                    // gltf.asset; // Object

                    //console.log(gltf.scene);

                    // alert('mixer animations: '+gltf.animations.length)
                    //https://sbcode.net/threejs/gltf-animation/
                    // -----ANIM-----
                    if(_this.oggetti[$id].settings.importAnimationMixer){
                       // model.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
                        _this.oggetti[$id].settings.mixer = new THREE.AnimationMixer( gltf.scene );
                        const action = _this.oggetti[$id].settings.mixer.clipAction( gltf.animations[ _this.oggetti[$id].settings.indexAnimationMixer ] );
                        action.play();
                    }
                    
                    _this.scaleModel(gltf.scene,2);

                    _this.oggetti[$id].settings.themodel.add(gltf.scene);

                    _this.primitive_mesh = _this.oggetti[$id].settings.themodel;

            }, _this.onProgress, _this.onError );
        }
        startload();
    }
    
    importModelFBX($id, $cb = null){
        let _this = this;
        let childGeometry = [];
        let groupGeometry = new THREE.BufferGeometry();  
        // loading manager
        const loadingManager = new THREE.LoadingManager( function () {
            _this.primitive_mesh.traverse( function ( child ) {
                if ( child.isSkinnedMesh ) {
                    
                    //console.log('isSkinnedMes');
                    //child.frustumCulled = false; //.......

                    //child.material.map = _this.primitive_map_texture;
                    // ccccc
                    if(child.geometry){
                        
                    }
                    
                }
                //console.log(child)
                if ( child.isMesh ){
                    
                    //console.log(child.material);

                    
                    //@P l'idea è chee anche per i modelli importati voglio gestire il materiale 
                    //   non sempre mi va bene quello importato
                    if(_this.oggetti[$id].settings.useCustomMaterial && _this.oggetti[$id].settings.materialType != 'wireframeMaterial'){
                        child.material = _this.oggetti[$id].material;
                    }
                    
                    // console.log(child.geometry.attributes.uv);
                    // childGeometry.push(child.geometry.attributes.uv);
                    // if(typeof child.geometry !== 'undefined' && child.geometry.attributes.uv){
                    //     let hlpvn = new THREE.VertexNormalsHelper( child.geometry, 0.1, 0x0098c7, 2 );
                    //     this.scene.add(hlpvn);
                    // }

                    //child.material.side = THREE.DoubleSide;

                    if(_this.isShadows){
                        child.castShadow = _this.isShadows;
                        child.receiveShadow = _this.isShadows;
                    }
                }
                // LOADING..
                jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-loading').remove();

            });
            //_this.oggetti[$id].primitive_mesh = THREE.BufferGeometryUtils.mergeBufferGeometries(childGeometry);
            

            if($cb) $cb(_this.primitive_mesh);

        } );
        // model
        //alert(_this.oggetti[$id].settings.import_folder_path+_this.oggetti[$id].settings.import_file_name+'.'+_this.oggetti[$id].settings.import_format_type)
        
        // LOADING..
        let loadingbar = jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-loading').fadeIn();
        

        const loader = new THREE.FBXLoader(loadingManager)
        .setPath( _this.oggetti[$id].settings.import_folder_path )
        .load( _this.oggetti[$id].settings.import_file_name+'.'+_this.oggetti[$id].settings.import_format_type, function ( object ) {
            //alert('mixer animations fbx: '+object.animations.length)
            // -----ANIM-----
            
            if(_this.oggetti[$id].settings.importAnimationMixer){
                _this.oggetti[$id].settings.mixer = new THREE.AnimationMixer( object );
                const action = _this.oggetti[$id].settings.mixer.clipAction( 
                    
                    object.animations[ _this.oggetti[$id].settings.indexAnimationMixer ] 
                    );
                action.play();
            }
            
            _this.scaleModel(object,2);

            _this.oggetti[$id].settings.themodel.add(object);

            _this.primitive_mesh = _this.oggetti[$id].settings.themodel;
            
            
            
        },_this.onProgress, _this.onError );
    }
    importModelDAE($id, $cb = null){
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
                        
                        if(_this.oggetti[$id].settings.useCustomMaterial && _this.oggetti[$id].settings.materialType != 'wireframeMaterial')
                        child.material = _this.material;

                        if(_this.isShadows){
                                                            
                            child.castShadow = _this.isShadows;
                            child.receiveShadow = _this.isShadows;
                            //alert('shadow ambient')
                            //
                        }
                     }
                } );

                if($cb) $cb(_this.primitive_mesh);

            } );
            // LOADING..
            let loadingbar = jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-loading').fadeIn();

            // collada
            const loader = new THREE.ColladaLoader( loadingManager );
            loader
                .setPath( _this.oggetti[$id].settings.import_folder_path )
                .load( _this.oggetti[$id].settings.import_file_name+'.'+_this.oggetti[$id].settings.import_format_type, function ( collada ) {
                
                _this.scaleModel(collada.scene,2);

                _this.oggetti[$id].settings.themodel.add(collada.scene);

                _this.primitive_mesh = _this.oggetti[$id].settings.themodel;
                

                // -----ANIM-----
                if(_this.oggetti[$id].settings.importAnimationMixer && _this.oggetti[$id].settings.mixer){
                    const animations = collada.animations;
                    _this.oggetti[$id].settings.mixer = new THREE.AnimationMixer( _this.primitive_mesh );
                    _this.oggetti[$id].settings.mixer.clipAction( animations[ _this.oggetti[$id].settings.indexAnimationMixer ] ).play();
                }
                


            }, _this.onProgress, _this.onError );
    }
    scaleModel(obj,dim){
        var mroot = obj;
        var bbox = new THREE.Box3().setFromObject(mroot);
        //
        var cent = bbox.getCenter(new THREE.Vector3());
        var size = bbox.getSize(new THREE.Vector3());
       
        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        mroot.scale.multiplyScalar(dim / maxAxis);
        
       
        bbox.setFromObject(mroot);
        bbox.getCenter(cent);
        bbox.getSize(size);
        mroot.position.copy(cent).multiplyScalar(-1);
        
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
                
                this.ambientGeometry = new THREE.BoxGeometry(
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
    // SKY IMAGE ---------------------
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
    // TEXTURE AMBIENTE ---------------------
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

    updateParamsShadows($id){
        
        // renderer

        // objectMesh / meshExtruded  
        // ambientMesh
        
        // light: point, directional, spot
       
        

        this.updateShadowsLight();
        this.updateShadowsLightPoint();

        this.updateShadowsMesh($id);
        //updateShadowsMeshExtrude()
        
        
        this.updateShadowsAmbient();
        
        this.clean3DRenderer();
        this.generateRenderer();
        //this.updateShadowsRenderer();
              
        
    }

    //HELPERS
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
                    this.cameraHelper = new THREE.CameraHelper( this.camera );
                    this.scene.add( this.cameraHelper );
                }else{
                    if(this.cameraHelper) this.scene.remove( this.cameraHelper );
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
    
    
   updateHelperMesh($id){
        
        this.oids.forEach((o,i)=>{
            this.cleanHelperMesh(o);

            if($id == o){
               
                this.addHelperMesh(o);
                if(this.oggetti[$id] && this.oggetti[o].boxHelper) this.scene.add( this.oggetti[o].boxHelper );
                
                if(this.oggetti[$id] && this.oggetti[o].vertexNormalsHelper && this.oggetti[$id].primitive_mesh.geometry) 
                this.scene.add( this.oggetti[o].vertexNormalsHelper );

                this.render();
            }
        })
    }
    addHelperMesh($id){
        
        if(this.oggetti[$id] && this.oggetti[$id].primitive_mesh) 
        this.oggetti[$id].boxHelper = new THREE.BoxHelper( this.oggetti[$id].primitive_mesh, 0x0098c7 );
        
        //if(this.oggetti[$id].primitive_mesh) 
        //this.oggetti[$id].vertexNormalsHelper = new THREE.VertexNormalsHelper( this.oggetti[$id].primitive_mesh, 0.1, 0x0098c7, 2 );
    }
    cleanHelperMesh($id){
        if(this.oggetti[$id] && this.oggetti[$id].primitive_mesh) this.scene.remove( this.oggetti[$id].boxHelper );
        //if(this.oggetti[$id].primitive_mesh) this.scene.remove( this.oggetti[$id].vertexNormalsHelper );
        
        if(this.oggetti[$id] && this.oggetti[$id].boxHelper) this.oggetti[$id].boxHelper = null;
        //if(this.oggetti[$id].vertexNormalsHelper) this.oggetti[$id].vertexNormalsHelper = null;
    }
    cleanAllHelperMesh(){
        this.oids.forEach((o,i)=>{
            if(this.oggetti[$id] && this.oggetti[o].primitive_mesh) this.scene.remove( this.oggetti[o].boxHelper );
            //if(this.oggetti[o].primitive_mesh) this.scene.remove( this.oggetti[o].vertexNormalsHelper );

            if(this.oggetti[$id] && this.oggetti[o].boxHelper) this.oggetti[o].boxHelper = null;
            //if(this.oggetti[o].vertexNormalsHelper) this.oggetti[o].vertexNormalsHelper = null;
        })
        
    }

    //CLEAN 3D
    clean3DCamera(){
        this.camera = null;
    }
    clean3Dhotpoints(){
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
        
        if(this.oggetti[this.activeId].object3d ) this.scene.remove( this.oggetti[this.activeId].object3d );
        
        if(this.oggetti[this.activeId].primitive_mesh.geometry)
        this.oggetti[this.activeId].primitive_mesh.geometry.dispose();

        if(this.oggetti[this.activeId].object3d)
        this.oggetti[this.activeId].object3d = null;
        
        if(this.groupGeometry) this.groupGeometry = null;
        
        
        
    }
    clean3DMaterial(){
        if(this.oggetti[this.activeId].material) 
        this.oggetti[this.activeId].material.dispose();
    }
    clean3Dtexturemap(){
        if(this.oggetti[this.activeId].material.map) {
            this.oggetti[this.activeId].material.map.dispose();
            this.oggetti[this.activeId].material.map = null;
        }
    }
    clean3Dtexturebump(){
        if(this.oggetti[this.activeId].material.bumpMap){
            this.oggetti[this.activeId].material.bumpMap.dispose();
            this.oggetti[this.activeId].material.bumpMap = null;
        }
    }
    clean3Dtextureroughness(){
        if(this.oggetti[this.activeId].material.roughnessMap){
            this.oggetti[this.activeId].material.roughnessMap.dispose();
            this.oggetti[this.activeId].material.roughnessMap = null;
        }
    }
    clean3Dtexturenormal(){
        if(this.oggetti[this.activeId].material.normalMap){
            this.oggetti[this.activeId].material.normalMap.dispose();
            this.oggetti[this.activeId].material.normalMap = null;
        }
    }
    clean3Dtexturedisplacement(){
        if(this.oggetti[this.activeId].material.displacementMap){
            this.oggetti[this.activeId].material.displacementMap.dispose();
            this.oggetti[this.activeId].material.displacementMap = null;
        }
    }
    clean3Dtextureenv(){
        if(this.oggetti[this.activeId].material.envMap){
            this.oggetti[this.activeId].material.envMap.dispose();
            this.oggetti[this.activeId].material.envMap = null;
        }
    }
    clean3Dtexturemetalness(){
        if(this.oggetti[this.activeId].material.metalnessMap){
            this.oggetti[this.activeId].material.metalnessMap.dispose();
            this.oggetti[this.activeId].material.metalnessMap = null;
        }
    }
    clean3Dtexturealpha(){
        if(this.oggetti[this.activeId].material.alphaMap){
            this.oggetti[this.activeId].material.alphaMap.dispose();
            this.oggetti[this.activeId].material.alphaMap = null;
        }
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
    
    // UPDATES
    updateMaterial(){
        this.clean3DMaterial();
        //this.material
        if(this.oggetti[this.activeId].settings.materialType == 'wireframeMaterial'){

        }else{
            
        }
        this.material = this.generateMaterial(this.activeId, this.oggetti[this.activeId].settings.materialType);
        this.oggetti[this.activeId].material = this.material;
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
        this.updateData3d();
        this.meshConstructor(this.activeId);
        //
        this.updateHelperMesh(this.activeId);
        this.render();
    }
    updateControls(){
        this.clean3DControls();
        this.generateControls();
        this.controls.update();
    }
    render() {
        if(this.renderer) this.renderer.render(this.scene, this.camera);

        if(this.oggetti[this.activeId] && this.oggetti[this.activeId].boxHelper) this.oggetti[this.activeId].boxHelper.update();
        if(this.oggetti[this.activeId] && this.oggetti[this.activeId].vertexNormalsHelper) this.oggetti[this.activeId].vertexNormalsHelper.update();

    }

    
    elementChange($id, propertyName, settings, isMultiple) {
        this.activeId = $id;
        //
        if(!isMultiple){
            this.elementSettings = settings;
        }
        
        // if(isMultiple){
        //     this.oggetti[$id].settings = settings;
        // }

        // VIEWPORT -------------------------------------- 
        if ('viewport_width' === propertyName) {
            this.windowResize();
        }
        if ('viewport_height' === propertyName) {
            this.windowResize();
        }
        if ('viewport_extend' === propertyName) {
            // if(this.elementSettings.viewport_extend){
            //     jQuery('.elementor-element-'+$id+' .e-threed-container').addClass('e-add-viewport-extend');
            //     this.windowResize();
            // }else{
            //     jQuery('.elementor-element-'+$id+' .e-threed-container').removeClass('e-add-viewport-extend');
            //     this.windowResize();
            // }
        }
        
        // GEOMETRY --------------------------------------            
        if ('geometry_type' === propertyName) {
            this.oggetti[$id].settings.geometryType = settings.geometry_type || 'cube';
            
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-object .e-threed-widget-label').text(this.oggetti[$id].settings.geometryType);
            
            //this.updateData3d();
            this.updateData3d_oggetto($id, settings);

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
            this.oggetti[$id].settings.geometryWidth = settings.geometry_width ? settings.geometry_width.size : 2,
            //this.oggetti[$id].primitive_mesh.geometry.width = this.oggetti[$id].settings.geometryWidth;
            this.updateGeometryMesh();
        }
        // cube, cylinder, plane
        if ('geometry_height' === propertyName) {
            this.oggetti[$id].settings.geometryHeight = settings.geometry_height ? settings.geometry_height.size : 2,
            //this.oggetti[$id].primitive_mesh.geometry.height = this.oggetti[$id].settings.geometryHeight;
            this.updateGeometryMesh();
        }
        // cube
        if ('geometry_depth' === propertyName) {
            this.oggetti[$id].settings.geometryDepth = settings.geometry_depth ? settings.geometry_depth.size : 2;
            //this.oggetti[$id].primitive_mesh.geometry.depth = this.oggetti[$id].settings.geometryDepth;
            this.updateGeometryMesh();
        }
        // sphere, torus, octahedron, dodecaedro, tetrahedron, cone, piramid, icosahedro
        if ('geometry_radius' === propertyName) {
            this.oggetti[$id].settings.geometryRadius = settings.geometry_radius ? settings.geometry_radius.size : 1;
            //this.oggetti[$id].primitive_mesh.geometry.radius = this.oggetti[$id].settings.geometryRadius;
            this.updateGeometryMesh();
        }
        // cylinder

        if ('geometry_cylinder_radiusTop' === propertyName) {
            this.oggetti[$id].settings.geometryRadiusTop = settings.geometry_cylinder_radiusTop ? settings.geometry_cylinder_radiusTop.size : 1;
            //this.oggetti[$id].primitive_mesh.geometry.radiusTop = this.oggetti[$id].settings.geometryRadiusTop;
            this.updateGeometryMesh();
        }
        if ('geometry_cylinder_radiusBottom' === propertyName) {
            this.oggetti[$id].settings.geometryRadiusBottom = settings.geometry_cylinder_radiusBottom ? settings.geometry_cylinder_radiusBottom.size : 1;
            //this.oggetti[$id].primitive_mesh.geometry.radiusBottom = this.oggetti[$id].settings.geometryRadiusBottom;
            this.updateGeometryMesh();
        }
        // cone
        if ('geometry_coneHeigh' === propertyName) {
            this.oggetti[$id].settings.geometryConeHeigh = settings.geometry_coneHeigh ? settings.geometry_coneHeigh.size : 1;
            //this.oggetti[$id].primitive_mesh.geometry.height = this.oggetti[$id].settings.geometryConeHeigh;
            this.updateGeometryMesh();
        }
        //torus
        if ('geometry_tubeRadius' === propertyName) {
            this.oggetti[$id].settings.geometryTubeRadius = settings.geometry_tubeRadius ? settings.geometry_tubeRadius.size : 0.5;
            
            this.updateGeometryMesh();
        }
        //SVG
        if ('geometry_svg_depth' === propertyName) {
           
            // mmmmm
            this.oggetti[$id].settings.svgDepth = settings.geometry_svg_depth ? settings.geometry_svg_depth.size : 16;

            this.updateGeometryMesh();
        }


        // DETAIL --------------------------------------
        // octahedron, dodecaedro, tetrahedron, icosahedro
        if ('geometry_detail' === propertyName) {
            this.oggetti[$id].settings.geometryDetail = settings.geometry_detail ? settings.geometry_detail.size : 2;
            this.updateGeometryMesh();
        }


        // SEGMENTS --------------------------------------            
        if ('geometry_widthSegments' === propertyName) {
            this.oggetti[$id].settings.geometryWidthSegments = settings.geometry_widthSegments || 4;
            this.updateGeometryMesh();
        }
        
        if ('geometry_heightSegments' === propertyName) {
            this.oggetti[$id].settings.geometryHeightSegments = settings.geometry_heightSegments || 4;
            this.updateGeometryMesh();
        }
        
        if ('geometry_depthSegments' === propertyName) {
            this.oggetti[$id].settings.geometryDepthSegments = settings.geometry_depthSegments || 4;
            this.updateGeometryMesh();
        }
        
        if ('geometry_radialSegments' === propertyName) {
            this.oggetti[$id].settings.geometryRadialSegments = settings.geometry_radialSegments || 12;
            this.updateGeometryMesh();
        }
        
        if ('geometry_tubularSegments' === propertyName) {
            this.oggetti[$id].settings.geometryTubularSegments = settings.geometry_tubularSegments || 10;
            this.updateGeometryMesh();
        }
        
        
        // TRANSFORM --------------------------------------
        if ('geometry_mesh_posx' === propertyName) {
            this.oggetti[$id].settings.geometryMeshPosX = settings.geometry_mesh_posx ? settings.geometry_mesh_posx.size : 0;
            this.oggetti[$id].object3d.position.x = this.oggetti[$id].settings.geometryMeshPosX;
            this.render();
            
        }
        if ('geometry_mesh_posy' === propertyName) {
            this.oggetti[$id].settings.geometryMeshPosY = settings.geometry_mesh_posy ? settings.geometry_mesh_posy.size : 0;
            this.oggetti[$id].object3d.position.y = this.oggetti[$id].settings.geometryMeshPosY;
            this.render();
        }
        if ('geometry_mesh_posz' === propertyName) {
            this.oggetti[$id].settings.geometryMeshPosZ = settings.geometry_mesh_posz ? settings.geometry_mesh_posz.size : 0;
            this.oggetti[$id].object3d.position.z = this.oggetti[$id].settings.geometryMeshPosZ;
            this.render();
        }
        if ('geometry_mesh_rotx' === propertyName) {
            this.oggetti[$id].settings.geometryMeshRotX = settings.geometry_mesh_rotx ? settings.geometry_mesh_rotx.size : 0;
            this.oggetti[$id].object3d.rotation.x = THREE.Math.degToRad (this.oggetti[$id].settings.geometryMeshRotX);
            this.render();
        }
        if ('geometry_mesh_roty' === propertyName) {
            this.oggetti[$id].settings.geometryMeshRotY = settings.geometry_mesh_roty ? settings.geometry_mesh_roty.size : 0;
            this.oggetti[$id].object3d.rotation.y = THREE.Math.degToRad (this.oggetti[$id].settings.geometryMeshRotY);
            this.render();
        }
        if ('geometry_mesh_rotz' === propertyName) {
            this.oggetti[$id].settings.geometryMeshRotZ = settings.geometry_mesh_rotz ? settings.geometry_mesh_rotz.size : 0;
            this.oggetti[$id].object3d.rotation.z = THREE.Math.degToRad (this.oggetti[$id].settings.geometryMeshRotZ);
            this.render();
        }
        if ('geometry_mesh_scale' === propertyName) {
            this.oggetti[$id].settings.geometryMeshScale = settings.geometry_mesh_scale ? settings.geometry_mesh_scale.size : 0;
            this.oggetti[$id].object3d.scale.set(this.oggetti[$id].settings.geometryMeshScale,this.oggetti[$id].settings.geometryMeshScale,this.oggetti[$id].settings.geometryMeshScale);
            this.render();
        }
        






        // MATERIAL --------------------------------------
        if ('material_type' === propertyName) {
            this.oggetti[$id].settings.materialType = settings.material_type || 'wireframeMaterial';
            
            //this.updateData3d();
            this.updateData3d_material($id, settings);
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        // MATERIAL Params  ------------------------------
        if ('material_color' === propertyName) {
            //console.log(this.oggetti[$id]);
            this.oggetti[$id].settings.materialColor = settings.material_color ? settings.material_color : 0xCCCCCC;
            this.oggetti[$id].material.color = new THREE.Color(this.oggetti[$id].settings.materialColor);
            this.render();
        }
        if ('material_wireframe_mode' === propertyName) {
            this.oggetti[$id].settings.materialWireframeMode = Boolean(settings.material_wireframe_mode);
            this.oggetti[$id].material.wireframe = this.oggetti[$id].settings.materialWireframeMode
            
            this.render();
        }
        if ('enable_transparent' === propertyName) {
            this.oggetti[$id].settings.isTransparent = Boolean(settings.enable_transparent);
            this.oggetti[$id].material.transparent = this.oggetti[$id].settings.isTransparent;
            
            this.clean3Dtexturealpha();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            
            this.render();
        }
        if ('material_opacity' === propertyName) {
            this.oggetti[$id].settings.materialOpacity = settings.material_opacity ? settings.material_opacity.size : 1;
            this.oggetti[$id].material.opacity = this.oggetti[$id].settings.materialOpacity;

            this.render();
        }


        if ('material_shininess' === propertyName) {
            this.oggetti[$id].settings.materialShininess = settings.material_shininess ? settings.material_shininess.size : 50;
            this.oggetti[$id].material.shininess = this.oggetti[$id].settings.materialShininess;
            this.render();
        }
        if ('material_reflectivity' === propertyName) {
            this.oggetti[$id].settings.materialReflectivity = settings.material_reflectivity ? settings.material_reflectivity.size : 1;
            this.oggetti[$id].material.reflectivity = this.oggetti[$id].settings.materialReflectivity;
            this.render();
        }
        
        if ('material_roughness' === propertyName) {
            this.oggetti[$id].settings.materialRoughness = settings.material_roughness ? settings.material_roughness.size : 0;
            this.oggetti[$id].material.roughness = this.oggetti[$id].settings.materialRoughness;
            this.render();
        }
        if ('material_metalness' === propertyName) {
            this.oggetti[$id].settings.materialMetalness = settings.material_metalness ? settings.material_metalness.size : 0.5;
            this.oggetti[$id].material.metalness = this.oggetti[$id].settings.materialMetalness;
            this.render();
        }
        if ('material_bumpscale' === propertyName) {
            this.oggetti[$id].settings.materialBumpScale = settings.material_bumpscale ? settings.material_bumpscale.size : 0.02;
            this.oggetti[$id].material.bumpScale = this.oggetti[$id].settings.materialBumpScale;
            this.render();
        }
        if ('material_displacementscale' === propertyName) {
            this.oggetti[$id].settings.materialDisplacementScale = settings.material_displacementscale ? settings.material_displacementscale.size : 1;
            this.oggetti[$id].material.displacementScale = this.oggetti[$id].settings.materialDisplacementScale;
            this.render();
        }
        if ('material_displacementbias' === propertyName) {
            this.oggetti[$id].settings.materialDisplacementBias = settings.material_displacementbias ? settings.material_displacementbias.size : 0;
            this.oggetti[$id].material.displacementBias = this.oggetti[$id].settings.materialDisplacementBias;
            this.render();
        }
        if ('material_aointensity' === propertyName) {
            this.oggetti[$id].settings.materialAOIntensity = settings.material_aointensity ? settings.material_aointensity.size : 1;
            this.oggetti[$id].material.aoMapIntensity = this.oggetti[$id].settings.materialAOIntensity
            this.render();
        }
        
        
        // MATERIAL Texture ------------------------------
        if ('material_texture' === propertyName) {
            this.oggetti[$id].settings.textureMapPath = settings.material_texture ? settings.material_texture.url : '';
            
            this.clean3Dtexturemap();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_displacement_map' === propertyName) {
            this.oggetti[$id].settings.textureDisplacementPath = settings.material_displacement_map ? settings.material_displacement_map.url : '';
            
            this.clean3Dtexturedisplacement();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_bump_map' === propertyName) {
            this.oggetti[$id].settings.textureBumpPath = settings.material_bump_map ? settings.material_bump_map.url : '';
            //this.primitive_map_texture.image.url = this.textureMapPath;
            
            this.clean3Dtexturebump();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_roughness_map' === propertyName) {
            this.oggetti[$id].settings.textureRoughnessPath = settings.material_roughness_map ? settings.material_roughness_map.url : '';
            //this.primitive_map_texture.image.url = this.textureMapPath;
            
            this.clean3Dtextureroughness();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_normal_map' === propertyName) {
            this.oggetti[$id].settings.textureNormalPath = settings.material_normal_map ? settings.material_normal_map.url : '';
            
            this.clean3Dtexturenormal();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        
        if ('material_env_map' === propertyName) {
            this.oggetti[$id].settings.textureEnvPath = settings.material_env_map ? settings.material_env_map.url : '';
            
            this.clean3Dtextureenv();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_metalness_map' === propertyName) {
            this.oggetti[$id].settings.textureMetalnessPath = settings.material_metalness_map ? settings.material_metalness_map.url : '';
            
            this.clean3Dtexturemetalness();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }
        if ('material_alpha_map' === propertyName) {
            this.oggetti[$id].settings.textureAlphaPath = settings.material_alpha_map ? settings.material_alpha_map.url : '';
            
            this.clean3Dtexturealpha();
            this.updateMaterial();
            
            this.updateGeometryMesh();
            this.render();
        }


       

        //TEXTURE options
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
        

        // ANIMATIONS ----------------------------------
        // da sistemare
        if ('geometry_animated' === propertyName) {
            this.oggetti[$id].settings.animated = Boolean(settings.geometry_animated) || false;
            this.updateGeometryMesh();
        }
        if ('geometry_animated_x' === propertyName) {
            this.oggetti[$id].settings.animatedX = Boolean(settings.geometry_animated_x) || false;
            if(!this.oggetti[$id].settings.animatedX){
                this.oggetti[$id].object3d.rotation.x = 0;
            }
        }
        if ('geometry_animated_y' === propertyName) {
            this.oggetti[$id].settings.animatedY = Boolean(settings.geometry_animated_y) || false;
            if(!this.oggetti[$id].settings.animatedY){
                this.oggetti[$id].object3d.rotation.y = 0;
            }
        }
        if ('geometry_animated_z' === propertyName) {
            this.oggetti[$id].settings.animatedZ = Boolean(settings.geometry_animated_z) || false;
            if(!this.oggetti[$id].settings.animatedZ){
                this.oggetti[$id].object3d.rotation.z = 0;
            }
        }
        if ('geometry_animated_speed' === propertyName) {
            this.oggetti[$id].settings.animatedSpeed = settings.geometry_animated_speed || 1;
            
        }
        
        //MODIFIERS ...sospeso per ora...
        if ('modifier_type' === propertyName) {
            this.modifierType = this.elementSettings.modifier_type || '';
            
            this.clean3Dmodifier();
            this.generateModifiers(this.activeId);
        }
        if ('modifier_twist_angle' === propertyName) {
            this.modifierTwistAngle = this.elementSettings.modifier_twist_angle ? this.elementSettings.modifier_twist_angle.size : 0.2;
            
            this.twist.angle = this.modifierTwistAngle; //Math.PI / 12;
            this.render();
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
        if ('camera_lookat' === propertyName) {
            this.cameraLookat = Boolean(this.elementSettings.camera_lookat) || false;

            if(this.cameraLookat){
               this.camera.lookAt( this.scene.position );
            }else{
                this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
            }
            
            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_posx' === propertyName) {
            this.cameraPosX = this.elementSettings.camera_posx ? this.elementSettings.camera_posx.size : 0;
            this.camera.position.x = this.cameraPosX;

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_posy' === propertyName) {
            this.cameraPosY = this.elementSettings.camera_posy ? this.elementSettings.camera_posy.size : 0;
            this.camera.position.y = this.cameraPosY;

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_posz' === propertyName) {
            this.cameraPosZ = this.elementSettings.camera_posz ? this.elementSettings.camera_posz.size : 4;
            this.camera.position.z = this.cameraPosZ;

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_targetx' === propertyName) {
            this.cameraTargetX = this.elementSettings.camera_targetx ? this.elementSettings.camera_targetx.size : 0;
            
            this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);

            if(this.interactivityType == 'orbit' || this.interactivityType == 'wheel'){
                this.controls.target.set(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
                this.controls.update();
            }

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_targety' === propertyName) {
            this.cameraTargetY = this.elementSettings.camera_targety ? this.elementSettings.camera_targety.size : 0;
            //alert(this.cameraTargetX+' '+this.cameraTargetY+' '+this.cameraTargetZ);

            //this.updateData3d();
            
            this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);

            if(this.interactivityType == 'orbit' || this.interactivityType == 'wheel'){
                this.controls.target.set(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
                this.controls.update();
            }

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_targetz' === propertyName) {
            this.cameraTargetZ = this.elementSettings.camera_targetz ? this.elementSettings.camera_targetz.size : 4;
            this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);

            if(this.interactivityType == 'orbit' || this.interactivityType == 'wheel'){
                this.controls.target.set(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
                this.controls.update();
            }

            this.camera.updateProjectionMatrix();
            this.render();
            
        }


                


        // AMBIENT --------------------------------------
        if ('ambient_type' === propertyName) {
            this.ambientType = this.elementSettings.ambient_type || '';
            this.clean3DAmbient();
            
            this.generateAmbient();
            this.generateAmbientTexture();
        }
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

        // SCENE ENVMAP
         //@p questo usa come env map l'immaginee di sky
         if ('enable_envmap' === propertyName) {
            this.isEnvMap = Boolean(this.elementSettings.enable_envmap) || false;

            this.updateData3d();
            this.updateMaterial();
            this.updateGeometryMesh();

            this.render();
        }

        // SCENE FOG
        if ('ambient_fog' === propertyName) {
            this.fogAmbient = Boolean(this.elementSettings.ambient_fog) || false;
            this.updateParamsSceneFog();
            this.updateParamsMaterialFog( this.oggetti[$id].material);         
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

            this.updateParamsShadows(this.activeId);
        }
        if ('shadow_type' === propertyName) {
            this.shadowType = this.elementSettings.shadow_type || 'PCFSoftShadowMap';
            
            this.updateData3d();
            
            this.clean3DRenderer();
            this.generateRenderer();
            //this.updateShadowsRenderer();
            
            //this.updateParamsShadows(this.activeId);
            //this.render(); // ...mapPass..
        }
        
        
        if ('geometry_shadow_radius' === propertyName) {
            this.shadowRadius = this.elementSettings.geometry_shadow_radius ? this.elementSettings.geometry_shadow_radius.size : 4;
            this.light.shadow.radius = this.shadowRadius;
            //this.updateParamsShadows(this.activeId);
            this.render();
        }
        if ('geometry_shadow_blurSamples' === propertyName) {
            this.shadowBlurSamples = this.elementSettings.geometry_shadow_blurSamples ? this.elementSettings.geometry_shadow_blurSamples.size : 8;
            this.light.shadow.blurSamples = this.shadowBlurSamples;
            //this.updateParamsShadows(this.activeId);
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
                    this.resetCamera($id);

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
        //HOTPOINTS

        if ('marker_color' === propertyName) {
            this.markerColor = settings.marker_color || '#FF0000';
            this.punti[$id].marker.color = this.markerColor;
            //
            this.punti[$id].hotpointsList.forEach((el, i) => { 
                el.elem.children.forEach((element, index) => { 
                    element.material.color = new THREE.Color(this.markerColor);
                });
            });
        }
        if ('marker_size' === propertyName) {
            this.markerSize = settings.marker_size ? settings.marker_size.size : 1;
            this.punti[$id].marker.size = this.markerSize;
            //
            this.punti[$id].hotpointsList.forEach((el, i) => { 
                el.elem.scale.set(this.punti[$id].marker.size,this.punti[$id].marker.size,1);
            });
        }
        if ('marker_sahpe_style' === propertyName) {
            this.markerShapeStyle = settings.marker_sahpe_style || 'M75,0c41.4,0,75,33.6,75,75s-33.6,75-75,75S0,116.4,0,75S33.6,0,75,0z';
            
            this.cleanHotpoints($id);
            this.generate_points3d($id, settings);
        }
        if ('hp_render_in' === propertyName) {
            

            if(settings.hp_render_in == 'scene'){
                this.hpRenderInElement = this.scene;
                this.punti[$id].hpRenderInElement == this.hpRenderInElement;
            }else if(settings.hp_render_in == 'object'){
                this.hpRenderInId = settings.hp_render_in_id || '';
                if(this.hpRenderInId){
                    this.punti[$id].hpRenderInId = this.hpRenderInId;

                    this.hpRenderInElement = this.oggetti[this.punti[$id].hpRenderInId].object3d;
                    this.punti[$id].hpRenderInElement == this.hpRenderInElement;
                }else{
                    alert('Object id missing');
                } 
                
            }

        }
        if ('hp_render_in_id' === propertyName) {
            this.hpRenderInId = settings.hp_render_in_id || '';
            this.punti[$id].hpRenderInId = this.hpRenderInId;
        }
        /*
        //non capisce ......
        if ('threed_hotpoints' === propertyName) {
            console.log('a');
            this.punti[$id].repeaterMarkers = this.elementSettings.threed_hotpoints;
            if(this.punti[$id].repeaterMarkers.length > 0){
                this.punti[$id].repeaterMarkers.forEach((element, index, array) => { 
                    
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