=== Mesh 3D for Elementor ===
Contributors: nerdsfarm, poglie, frapesce
Author URI: https://nerds.farm/
Plugin URL: https://3deven.com/mesh3d-for-elementor/
Tags: elementor, 3d, threejs, creative, mesh, object, widget, svg, design
Requires at least: 5.0
Tested up to: 6.1
Elementor tested up to: 3.7.0
Stable tag: 1.0
Requires PHP: 7.1
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

The Mesh 3D widget by Three.js for Elementor.

== Description ==

= Mission =
The goal of this plugin is to create 3D content within websites using the simple Elementor UI interface, where at the base it uses the great/mythical/extraordinary [THREEJS](https://github.com/mrdoob/three.js/) invented by mr Doob.
Building three-dimensional environments composed of objects, lights, shadows and a setting context is not easy.
Our aim is to make this possible, and we have come a long way to make it affordable for everyone.

Good fun.

= Main Features =
In the interface we have inserted these possibilities:

**Objects** 
- **Primitives**. They are basic forms dynamically processed by parameters
-- Cube
-- Sphere
-- Torus
-- Piramid
-- Cylinder
-- Cone
-- Dodecahedron
-- Tetraedron
-- Icosahedron
-- etc
- **SVG**. Import SVG files and extrude the shape.
- **External files**. Created by major 3D programs
-- Blender by the Blender Foundation
-- Substance Painter by Allegorithmic
-- Modo by Foundry
-- Toolbag by Marmoset
-- Houdini by SideFX
-- Cinema 4D by MAXON
-- COLLADA2GLTF by the Khronos Group
-- FBX2GLTF by Facebook
-- OBJ2GLTF by Analytical Graphics Inc
-- …and many more

**Transform**
Move / Rotate / Scale, place your object in the scene space.

**Materials**
Define the material of your object with the methods:
- Wireframe
- Basic
- Phong
- Standard
- Phisic (todo)
- Shader (todo)
Model specific materials with the parameters dedicated to them:
- Color
- Roughness
- Metalness
- etc
        
**Light & Shadow**
- Point
- Directional
- Spot

**Camera**
- Fov
- Zoom
- Position x-y-z
- Target LookAt

**Sky**
- Color
- Image
- Environment
- Hide

**Ambient**
As for a photographic set, the objects could be contextualized in a simple environment:
- Floor
- Room
- Wall
- Sphere Panorama
- Horizon

**Animations**
Each object can move independently.
- Entrance animations
- Loop animations

**Renderer**
They are options that refer how to color and rendering algorithms produce the result.

**Canvas Viewport**
The size of the CANVAS on the web page.

**Interactivity**
How the mouse or wheel could interact with the camera.

**Options**
The additional features concerning:
- Helpers

= Demo =
You can see some demos that show the possibilities of [Mesh3D in action](https://3deven.com/demo3d/)

= 3D Even =
Mesh3D is just the tip of the iceberg, we have an ambitious project in mind that will allow you to have ever greater control over the features.

What you will find more on [3D Even](https://www.3deven.com)
- Multiple objects
- Multiple lights
- Hot-Points and advanced interactivity
- Postprocessing
More will coming soon:
- Texts and fonts
- Particles and distribution
- Plans based on transformations and events
- Actions and transformations from buttons on the page
- Applied physics
- VR oculus




== Installation ==

= Minimum Requirements =

* WordPress 5.0 or greater
* Elementor Free 3.*
* PHP version 7.1 or greater
* MySQL version 5.0 or greater
* WordPress Memory limit of 128 MB

= We recommend your host supports: =

* PHP version 8.0 or greater
* MySQL version 8.0 or greater
* WordPress Memory limit of 256 MB or higher is preferred

= Installation =

1. Install using the WordPress built-in Plugin installer, or Extract the zip file and drop the contents in the `wp-content/plugins/` directory of your WordPress installation.
2. Activate the Elementor and Mesh3D plugins through the 'Plugins' menu in WordPress.
3. Go to Pages > Add New
4. Press the 'Edit with Elementor' button.
5. Now you can drag and drop Mesh3D widget from the left panel onto the content area

For documentation and tutorials visit our [Knowledge Base](https://elementor.com/help/?utm_source=wp-repo&utm_medium=link&utm_campaign=readme).


== Frequently Asked Questions ==

= Is Elementor Free required? =

Yes, you can't use this plugin without Elmentor FREE.

= Is Elementor PRO required? =

No! You don't need the PRO version. Only the Free is required. But it works great also with PRO enabled.


== Screenshots ==

1. The Widget in Editor, full of Section with a lot of dedicated options
2. An example of a real product, like a pair of shoes, imported as it is (no extra configuration)
3. Create primitive object into the main scene and customize them in advanced way

== Changelog ==

= 1.0 - 18-06-2022 =
* First release