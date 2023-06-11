import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Debug
 */
const gui = new dat.GUI() // this will create a debug menu

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const metcapTexture = textureLoader.load('/textures/matcaps/8.png')
// with png you can simulate the lights and shadows
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter // this property will remove the blur of the texture
gradientTexture.magFilter = THREE.NearestFilter // this property will remove the blur of the texture
gradientTexture.generateMipmaps = false // this property will remove the blur of the texture

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg', // px is positive x is the right side of the cube
    '/textures/environmentMaps/0/nx.jpg', // nx is negative x is the left side of the cube
    '/textures/environmentMaps/0/py.jpg', // py is positive y is the top side of the cube
    '/textures/environmentMaps/0/ny.jpg', // ny is negative y is the bottom side of the cube
    '/textures/environmentMaps/0/pz.jpg', // pz is positive z is the front side of the cube
    '/textures/environmentMaps/0/nz.jpg', // nz is negative z is the back side of the cube
]) // this will load the 6 images of the cube map

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture // map is the color of the material
// material.color = new THREE.Color('pink') 
// material.wireframe = true // wireframe property must be true to use wireframe
// material.color.set('#ff00ff') 
// material.opacity = 0.5 // 0 is invisible, 1 is fully visible
// material.transparent = true // transparent property must be true to use opacity
// material.alphaMap = doorAlphaTexture // alpha map is a black and white image
// material.side = THREE.DoubleSide // this will render both sides of the plane

// const material = new THREE.MeshNormalMaterial() // this material will show the normals of the object (blue is z axis, green is y axis, red is x axis)
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial() // this material looks like clay
// material.matcap = metcapTexture

// const material = new THREE.MeshDepthMaterial() // this material will show the depth of the object (white is close, black is far)

// const material = new THREE.MeshLambertMaterial() // this material will show the lights and shadows

// const material = new THREE.MeshPhongMaterial() // this material will show the lights and shadows and will be more realistic keep in mind that this material is more expensive than the others
// material.shininess = 100 // this property will make the material more shiny
// material.specular = new THREE.Color('blue') // this property will change the color of the shininess

// const material = new THREE.MeshToonMaterial() // this material will show the lights and shadows and will be more cartoonish
// material.gradientMap = gradientTexture // this property will change the color of the material

// const material = new THREE.MeshStandardMaterial() // this material will show the lights and shadows and will be more realistic
// material.metalness = 0 // this property will make the material more metallic
// material.roughness = 1 // this property will make the material more rough

// material.map = doorColorTexture // map is the color of the material
// material.aoMap = doorAmbientOcclusionTexture // ambient occlusion map is a black and white image
// material.aoMapIntensity = 1 // this property will change the intensity of the ambient occlusion map
// material.displacementMap = doorHeightTexture // displacement map is a black and white image
// material.displacementScale = 0.05 // this property will change the intensity of the displacement map
// material.metalnessMap = doorMetalnessTexture // metalness map is a black and white image
// material.roughnessMap = doorRoughnessTexture // roughness map is a black and white image
// material.normalMap = doorNormalTexture // normal map is a black and white image
// material.normalScale.set(0.5, 0.5) // this property will change the intensity of the normal map
// material.transparent = true // transparent property must be true to use opacity
// material.alphaMap = doorAlphaTexture // alpha map is a black and white image

const material = new THREE.MeshStandardMaterial() // this material will show the lights and shadows and will be more realistic
material.metalness = 0.7 // this property will make the material more metallic
material.roughness = 0.2 // this property will make the material more rough
material.envMap = environmentMapTexture // this property will add the environment map to the material

gui.add(material, 'metalness').min(0).max(1).step(0.0001) // this will add a slider to the debug menu
gui.add(material, 'roughness').min(0).max(1).step(0.0001) // this will add a slider to the debug menu
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001) // this will add a slider to the debug menu
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001) // this will add a slider to the debug menu

// tip: using one material is better for performance
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)) // this will add a second uv to the plane
sphere.position.x = -1.5 // x axis is horizontal

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)) // this will add a second uv to the plane

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)) // this will add a second uv to the plane

torus.position.x = 1.5

scene.add(sphere, plane, torus) // adding objects to the scene
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // first parameter is the color, second parameter is the intensity
scene.add(ambientLight) // adding lights to the scene

const pointLight = new THREE.PointLight(0xffffff, 0.5) // first parameter is the color, second parameter is the intensity
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight) // adding lights to the scene
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.5 * elapsedTime
    plane.rotation.y = 0.5 * elapsedTime
    torus.rotation.y = 0.5 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()