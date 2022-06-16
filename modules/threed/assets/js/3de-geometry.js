// https://threejs.org/examples/#webgl_points_sprites
// https://threejs.org/examples/#webgl_points_billboards
// https://threejs.org/examples/#webgl_materials_envmaps
// https://threejs.org/examples/#webgl_materials_lightmap
// https://threejs.org/examples/#webxr_vr_cubes
// https://threejs.org/examples/#webgl_geometry_convex

//import * as THREE from threejsPath+'three.module.js';
//import * as THREE from 'three';

/*import { OrbitControls } from 'lib/threejs/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'lib/threejs/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'lib/threejs/jsm/postprocessing/RenderPass.js';
import { SAOPass } from 'lib/threejs/jsm/postprocessing/SAOPass.js';*/

jQuery(window).on('elementor/frontend/init', () => {

    
    class WidgetThreedGeomeryHandlerClass extends elementorModules.frontend.handlers.Base {
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
            };
        }

        bindEvents() {
            let id_scope = this.elements.$id_scope,
            
            container = this.elements.$threedcontainer;
            
            this.threedgeometryElement = this.elements.$threedgeometry,
            //            
            ////////////////////////////////////////////////////////////////////
            // THIS internal global items ... 
            this.scope = this.elements.$scope;
            this.elementSettings = this.getElementSettings(),
            this.canvas = this.threedgeometryElement[0];
            this.container = container[0];

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

            //mouse (todo)
            this.mouseX = 0;
            this.mouseY = 0;

            ////////////////////////////////////////////////////////////////////
            this.init();

            if (elementorFrontend.isEditMode()){
                elementor.channels.editor.on('reset:editor:controls', (sectionName) => {
                    this.updateParamsCamera();
                });
            }
        }
        /************************* DATA ************************ */
        updateData3d(){
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
            

            //RENDERER
            this.physicallyCorrectLights = Boolean(this.elementSettings.renderer_physicallyCorrectLights) || false;
            this.outputEncoding = this.elementSettings.renderer_outputEncoding || '';
            this.toneMapping = this.elementSettings.renderer_toneMapping || '';
            this.toneMappingExposure = this.elementSettings.renderer_toneMapping_exposure ? this.elementSettings.renderer_toneMapping_exposure.size : 0.68;
            //CONTROL
            this.interactivityType = this.elementSettings.interactivity_type || '';

            //this.enableTilt = Boolean(this.elementSettings.enable_tilt) || false;
            //this.enableOrbit = Boolean(this.elementSettings.enable_orbit) || false;
            
            this.orbitAutorotate = Boolean(this.elementSettings.orbit_autorotate) || false;
            this.autorotateSpeed = this.elementSettings.orbit_autorotate_speed ? this.elementSettings.orbit_autorotate_speed.size : 2.5;
            
            this.orbitDamping = Boolean(this.elementSettings.orbit_damping) || false;
            this.orbitDampingSpeed = this.elementSettings.orbit_damping_speed ? this.elementSettings.orbit_damping_speed.size : 0.05;
            
            //CAMERA
            this.cameraFov = this.elementSettings.camera_fov && Boolean(this.elementSettings.camera_fov.size)  ? this.elementSettings.camera_fov.size : 40;
            this.cameraLookat = Boolean(this.elementSettings.camera_lookat) || false;

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
            

            //TEXTURE of primitive
            this.textureMapPath = this.elementSettings.material_texture ? this.elementSettings.material_texture.url : '';
            // 
            this.textureBumpPath = this.elementSettings.material_bump_map ? this.elementSettings.material_bump_map.url : '';
            // 
            this.textureRoughnessPath = this.elementSettings.material_roughness_map ? this.elementSettings.material_roughness_map.url : '';
            //
            this.textureNormalPath = this.elementSettings.material_normal_map ? this.elementSettings.material_normal_map.url : '';

            
            this.textureEnvPath = this.elementSettings.material_env_map ? this.elementSettings.material_env_map.url : '';
            this.textureAlphaPath = this.elementSettings.material_alpha_map ? this.elementSettings.material_alpha_map.url : '';
            this.textureMetalnessPath = this.elementSettings.material_metalness_map ? this.elementSettings.material_metalness_map.url : '';


            this.textureDisplacementPath = this.elementSettings.material_displacement_map ? this.elementSettings.material_displacement_map.url : '';
            //
            this.textureAOPath = this.elementSettings.material_ao_map ? this.elementSettings.material_ao_map.url : '';


            this.textureOffsetx = this.elementSettings.material_texture_offsetx ? this.elementSettings.material_texture_offsetx.size : 0;
            this.textureOffsety = this.elementSettings.material_texture_offsety ? this.elementSettings.material_texture_offsety.size : 0;
            this.textureRepx = this.elementSettings.material_textureRepX ? this.elementSettings.material_textureRepX : 1;
            this.textureRepy = this.elementSettings.material_textureRepY ? this.elementSettings.material_textureRepY : 1;
            this.textureCenterx = this.elementSettings.material_texture_centerx ? this.elementSettings.material_texture_centerx.size : 0;
            this.textureCentery = this.elementSettings.material_texture_centery ? this.elementSettings.material_texture_centery.size : 0;
            
            //ENVMAP of primitive
            this.isEnvMap = Boolean(this.elementSettings.enable_envmap) || false;
            
            
            // L'AMBIENT
            // ambient TYPE: wall, floor, room, spheres
            
            this.ambientPath = this.elementSettings.ambient_texture ? this.elementSettings.ambient_texture.url : '';
            this.ambientColor = this.elementSettings.ambient_color || 0xFFFFFF;
            
            this.ambientWireframeMode = Boolean(this.elementSettings.ambient_wireframe_mode) || false;
            this.ambientSkyColor = this.elementSettings.sky_color || 0x000000;
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

            
            // ANIMATIONS
            // rotation axis: loop random - x - y - z
            this.animated = Boolean(this.elementSettings.geometry_animated) || false;
            this.animatedX = Boolean(this.elementSettings.geometry_animated_x) || false;
            this.animatedY = Boolean(this.elementSettings.geometry_animated_y) || false;
            this.animatedZ = Boolean(this.elementSettings.geometry_animated_z) || false;
            this.animatedSpeed = this.elementSettings.geometry_animated_speed || 1;


            // le dimensioni del viewport
            this.canvasW = this.threedgeometryElement.width(); 
            this.canvasH = this.threedgeometryElement.height();

            this.windowHalfX = this.canvasW / 2;
            this.windowHalfY = this.canvasH / 2;
            // this.windowHalfX = window.innerWidth / 2;
            // this.windowHalfY = window.innerHeight / 2;

            //TYPES
            this.geometryType = this.elementSettings.geometry_type || '';
            this.materialType = this.elementSettings.material_type || '';
            this.ambientType = this.elementSettings.ambient_type || '';


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

            // MATERIAL
            this.materialColor = this.elementSettings.material_color ? this.elementSettings.material_color : 0x999999;
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


            // LIGHTs
            //

            this.ambientlightColor = this.elementSettings.ambientlight_color || 0xFFFFFF;
            this.ambientlightIntensity = this.elementSettings.ambientlight_intensity ? this.elementSettings.ambientlight_intensity.size : 2;
            
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
            this.lightSpotIntensity = this.elementSettings.light_spot_intensity ?  this.elementSettings.light_spot_intensity.size : 10;
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
            
            // HELPERS (todo)
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

            //pointtest
            this.mypoint;
            this.wheelnum = 0;

        }
         // INIT +++++++++++++++++++++++++
         init(){
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
            
            //@p genero la forma primitiva
            this.meshConstructor();

            //---- AMBIENT ++
            // genero l'ambiente se diverso da none
            if(this.ambientType != ''){
                
                this.generateAmbient();
                this.generateAmbientTexture();
            }
            
            // ----> RENDER-ANIMATIONS ........
            this.generateRender()
            
            // ----> UTILITY ..........
            if(this.frontendHelpers || elementorFrontend.isEditMode()){
               this.updateHelpers('axes'); 
            }
            

            
            // ----> CONTROLS ........
            if(this.interactivityType == 'orbit' || this.interactivityType == 'wheel')
            this.generateControls();

            

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
                //console.log(this.mouseX)
            } );
            
            
            
            
            // --------------------------------------------------
            // RESIZE of viewport CANVAS
            let onWindowResize = () => {
                this.canvasW = this.scope.width(); 
                this.canvasH = this.scope.height();
                
                this.camera.aspect = this.canvasW / this.canvasH;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( this.canvasW, this.canvasH );
            }
            // RESIZE
            window.addEventListener( 'resize', onWindowResize );
        
            
        }
        /************************ METHODS *********************** */
        pointTest(){
           //voglio rendere visibile un punto
            const spherepoint = new THREE.SphereGeometry( 0.05, 16, 8 );
            this.mypoint = new THREE.Mesh( spherepoint, new THREE.MeshBasicMaterial( { color: 0xff0040 } ));
            this.scene.add( this.mypoint  );
            //this.mypoint.position.set(1,0,1);
        }

        // kkk
        meshConstructor(){

            if(this.geometryType == 'import'){


                this.importModel(this.import_format_type,(ob) => {

                    this.primitive_mesh = ob;
                    
                    this.positionMesh();
                    this.updateShadowsMesh();

                    // .....
                    //@p aggiungo la forma alla scena
                    this.scene.add( this.primitive_mesh );
                    
                });
                

            }else{

                this.geometry = this.generatePrimitive(this.geometryType);
                //

                //
                if(this.materialType == 'wireframeMaterial'){
                    // +++++++++++++++++++++++++++++++++++++
                    // WIREFRAME
                    //@p oppure converto la mesh in linee
                    this.primitive_mesh = this.applyWireframe();
                }else{
                    // +++++++++++++++++++++++++++++++++++++
                    // MATERIAL
                    //@p applico alla mesh il materiale definito
                    this.primitive_mesh = this.applyMesh();
                    //console.log(this.primitive_mesh);
                    this.generateModifiers();
                }
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
            //const degrees = THREE.Math.degToRad ( degrees : Float ) : Float
            this.primitive_mesh.rotation.x = THREE.Math.degToRad (this.geometryMeshRotX);
            this.primitive_mesh.rotation.y = THREE.Math.degToRad (this.geometryMeshRotY);
            this.primitive_mesh.rotation.z = THREE.Math.degToRad (this.geometryMeshRotZ);
            
            this.primitive_mesh.scale.set(this.geometryMeshScale,this.geometryMeshScale,this.geometryMeshScale);

            // per capovolgere .... @p non capisco!
            // if(this.geometryType == 'svg'){
            //     this.primitive_mesh.rotation.x = THREE.Math.degToRad (this.geometryMeshRotX+180);
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
        generateModifiers(){
            if(this.modifierType){
                this.modifier = new ModifierStack(this.primitive_mesh);

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
        applyMesh(){
            let primitive;

            if(this.geometryType == 'svg'){
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
                        
                        
                        
                        const meshExtruded = new THREE.Mesh(geometryExtrude, this.material);
                        
                        const yOffset = -250;
                        const xOffset = -250;
                        meshExtruded.position.x = xOffset;
                        meshExtruded.position.y = yOffset;
                        
                        

                        //primitive = this.applyWireframe(geometry);


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

                if(this.material.map) this.material.map.repeat.set( 0.005, 0.005 );

                // Finally we add svg group to the scene
                //@p l'SVG estruso diventa la mesh... 
                primitive = svgPrimitive;
                
               
            }else{
                // +++++++++++++++++++++++++++++++++++++
                // MATERIAL
                //console.log(this.material);
                
                //@p applico alla mesh il materiale definito
                this.geometry.attributes.uv2 = this.geometry.attributes.uv;
                primitive = new THREE.Mesh(this.geometry, this.material);
                
            }
            
            return primitive;
        }
        updateShadowsMeshExtrude(){
            
        }
        applyWireframe(){
            this.geometry = new THREE.WireframeGeometry( this.geometry ); // or EdgesGeometry
            // LINE material
            this.material = new THREE.LineBasicMaterial( 
                {
                    color: this.materialColor,
                    linewidth: 4,
                    linecap: 'round', //ignored by WebGLRenderer
                    linejoin:  'round' //ignored by WebGLRenderer
                }
            );
            const lines = new THREE.LineSegments( this.geometry, this.material);
            // lines.material.color.setHex(0x000000);
            // lines.material.depthTest = true;
            // lines.material.opacity = 1;
            // lines.material.transparent = true;
            
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










        // CONTROLS +++++++++++++++++++++++++
        generateControls(){
            
            //if(elementorFrontend.isEditMode()){
                
                this.container.onmousedown = this.container.onmousemove = (e)=>{
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    return false;
                };
                // orbit control
                this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
               
                
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
                this.controls.panSpeed = 0.1;
                this.controls.rotateSpeed = 0.3;


                this.controls.autoRotate = this.orbitAutorotate;
                this.controls.autoRotateSpeed = this.autorotateSpeed;
                
                this.controls.enableDamping = this.orbitDamping; // an animation loop is required when either damping or auto-rotation are enabled
				this.controls.dampingFactor = this.orbitDampingSpeed;
                //this.controls.screenSpacePanning = false;

                if(!this.cameraLookat){
                   this.controls.target.set(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
                }
                

                // this.controls.screenSpacePanning = true;
				// this.controls.minDistance = 5;
				// this.controls.maxDistance = 40;
				// this.controls.target.set( 0, 2, 0 );
				this.controls.update();
            //}
            
            // @p aggancio la camera al centro
            //this.camera.lookAt( this.scene.position );
        }
        updateParamsControls(){
            
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
            
        }
        updateParamsCamera(){
            this.camera.fov = this.cameraFov;
            
            if(this.cameraLookat){
                this.camera.lookAt( this.scene.position );
             }else{
                 this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
             }
                
            
            this.camera.position.set( this.cameraPosX, this.cameraPosY, this.cameraPosZ );
        }
        generateScene(){
            // -------------------------
            // SCENE   
            this.scene = new THREE.Scene();
            // this.scene.translateX(this.cameraTargetX);
            // this.scene.translateY(this.cameraTargetY);
            // this.scene.translateZ(this.cameraTargetZ);

            if(this.ambientSkyPath == ''){
                this.scene.background = new THREE.Color(this.ambientSkyColor);
            }else{
                
                this.generateSkyImage();
                this.scene.background = this.sky_texture;
                this.scene.environment = this.sky_texture;
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
        onProgress( xhr ) {

            if ( xhr.lengthComputable ) {

                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

            }
        }

        onError() {
            //alert('file not found')
        }
        importModel($importType, $cb = null){
            
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
                        if(_this.useCustomMaterial)
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
                //alert(_this.import_folder_path+_this.import_file_name+'.'+_this.import_format_type)
                const loader = new THREE.GLTFLoader(loadingManager).setPath( _this.import_folder_path );
                    loader.load( _this.import_file_name+'.'+_this.import_format_type, function ( gltf ) {
                        
                        // gltf.animations; // Array<THREE.AnimationClip>
                        // gltf.scene; // THREE.Group
                        // gltf.scenes; // Array<THREE.Group>
                        // gltf.cameras; // Array<THREE.Camera>
                        // gltf.asset; // Object

                        //console.log(gltf.scene);

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
                        
                        if(_this.useCustomMaterial)
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

                // -----ANIM-----
                if(_this.importAnimationMixer){
                    _this.mixer = new THREE.AnimationMixer( object );
                    const action = _this.mixer.clipAction( object.animations[ 0 ] );
                    action.play();
                }
                
                _this.scaleModel(object,2);

                _this.themodel.add(object);

                _this.primitive_mesh = _this.themodel;
               
            } );
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
                            
                            if(_this.useCustomMaterial)
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
                        const animations = collada.animations;
                        _this.mixer = new THREE.AnimationMixer( _this.primitive_mesh );
					    _this.mixer.clipAction( animations[ 0 ] ).play();
                    }
                    


				}, _this.onProgress, _this.onError );
        }
        scaleModel(obj,dim){
            var mroot = obj;
            var bbox = new THREE.Box3().setFromObject(mroot);
            var cent = bbox.getCenter(new THREE.Vector3());
            var size = bbox.getSize(new THREE.Vector3());
            console.log(size);
            //Rescale the object to normalized space
            var maxAxis = Math.max(size.x, size.y, size.z);
            mroot.scale.multiplyScalar(dim / maxAxis);
            
            //bbox.setFromObject(mroot);
            //bbox.getCenter(cent);
            //bbox.getSize(size);
            //Reposition to 0,halfY,0
            //mroot.position.copy(cent).multiplyScalar(-1);
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

                this.sky_texture = textureLoader.load( this.ambientSkyPath );
                this.sky_texture.mapping = THREE.EquirectangularReflectionMapping;
                //this.sky_texture.encoding = THREE.sRGBEncoding;
            }else{
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
        
        render() {
            if(this.renderer) this.renderer.render( this.scene, this.camera );
        }
        onElementChange(propertyName) {
            this.elementSettings = this.getElementSettings();
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
            if ('camera_fov' === propertyName) {
                this.cameraFov = this.elementSettings.camera_fov && Boolean(this.elementSettings.camera_fov.size) ? this.elementSettings.camera_fov.size : 40;
                this.camera.fov = this.cameraFov;

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
                this.primitive_mesh.rotation.x = THREE.Math.degToRad (this.geometryMeshRotX);
                this.render();
            }
            if ('geometry_mesh_roty' === propertyName) {
                this.geometryMeshRotY = this.elementSettings.geometry_mesh_roty ? this.elementSettings.geometry_mesh_roty.size : 0;
                this.primitive_mesh.rotation.y = THREE.Math.degToRad (this.geometryMeshRotY);
                this.render();
            }
            if ('geometry_mesh_rotz' === propertyName) {
                this.geometryMeshRotZ = this.elementSettings.geometry_mesh_rotz ? this.elementSettings.geometry_mesh_rotz.size : 0;
                this.primitive_mesh.rotation.z = THREE.Math.degToRad (this.geometryMeshRotZ);
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
                 /*
                this.updateData3d();
                this.updateMaterial();
                this.updateGeometryMesh();

                this.render();

                */
                this.clean3DskyImage()
                this.generateSkyImage();

                this.scene.background = this.sky_texture;
                this.render();
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
                this.updateParamsSceneFog();
                this.updateParamsMaterialFog(this.material);         
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
                this.ambientlightIntensity = this.elementSettings.ambientlight_intensity ? this.elementSettings.ambientlight_intensity.size : 2;
                this.ambientLight.intensity = this.ambientlightIntensity;
                this.render();
            }


            // MATERIAL --------------------------------------
            // da sistemare
            if ('material_type' === propertyName) {
                this.materialType = this.elementSettings['material_type'] || 'basicMateria';
                
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
                this.materialColor = this.elementSettings.material_color ? this.elementSettings.material_color : 0xFFFFFF;
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
                this.lightSpotIntensity = this.elementSettings.light_spot_intensity ?  this.elementSettings.light_spot_intensity.size : 10;
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
                this.light.shadow.radius = this.shadowRadius;
                //this.updateParamsShadows();
                this.render();
            }
            if ('geometry_shadow_blurSamples' === propertyName) {
                this.shadowBlurSamples = this.elementSettings.geometry_shadow_blurSamples ? this.elementSettings.geometry_shadow_blurSamples.size : 8;
                this.light.shadow.blurSamples = this.shadowBlurSamples;
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
            
            //MODIFIERS
            if ('modifier_type' === propertyName) {
                this.modifierType = this.elementSettings.modifier_type || '';
                
                this.clean3Dmodifier();
                this.generateModifiers();
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
                        
                    break;
                    case 'orbit':
                        this.clean3DControls();

                        this.generateControls();

                        //this.render();
                        this.controls.update();
                    break;
                    case 'wheel':
                        this.wheelnum = 0;

                        this.clean3DControls();

                        this.generateControls();

                        //this.render();
                        this.controls.update();
                    break;

                }
                this.updateParamsCamera();
            }
            // if ('enable_tilt' === propertyName) {
            //     this.enableTilt = Boolean(this.elementSettings.enable_tilt) || false;
            //     if(!this.enableTilt){
            //         this.updateParamsCamera();
            //     }
            // }
            // if ('enable_orbit' === propertyName) {
            //     this.enableOrbit = Boolean(this.elementSettings.enable_orbit) || false;
                
            //     this.clean3DControls();

            //     if(this.enableOrbit)
            //     this.generateControls();

            //     //this.render();
            //     this.controls.update();
            // }
            
            //this.controls.screenSpacePanning = false;

            // this.controls.screenSpacePanning = true;
            // this.controls.minDistance = 5;
            // this.controls.maxDistance = 40;
            // this.controls.target.set( 0, 2, 0 );

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
                this.toneMapping = this.elementSettings.renderer_toneMapping;
                this.updateToneMapping();
                
                this.render();
            }
            if ('renderer_toneMapping_exposure' === propertyName) {
                this.toneMappingExposure = this.elementSettings.renderer_toneMapping_exposure ? this.elementSettings.renderer_toneMapping_exposure.size : 0.68;
                this.renderer.toneMappingExposure = this.toneMappingExposure;
                this.render();
            }
            if ('renderer_outputEncoding' === propertyName) {
                this.outputEncoding = this.elementSettings.renderer_outputEncoding;
                this.updateOutputEncoding();

                this.render();
            }
        }
        
    }

    const ThreedGeomeryHandler = ($element) => {
        elementorFrontend.elementsHandler.addHandler(WidgetThreedGeomeryHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-geometry.default', ThreedGeomeryHandler);
});