import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262837', 1, 20) // color, near, far
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8) // repeat the texture 8 times on the x and y axis
grassAmbientOcclusionTexture.repeat.set(8, 8) // repeat the texture 8 times on the x and y axis
grassNormalTexture.repeat.set(8, 8) // repeat the texture 8 times on the x and y axis
grassRoughnessTexture.repeat.set(8, 8) // repeat the texture 8 times on the x and y axis

grassColorTexture.wrapS = THREE.RepeatWrapping // repeat the texture on the x axis
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping // repeat the texture on the x axis
grassNormalTexture.wrapS = THREE.RepeatWrapping // repeat the texture on the x axis
grassRoughnessTexture.wrapS = THREE.RepeatWrapping // repeat the texture on the x axis

grassColorTexture.wrapT = THREE.RepeatWrapping // repeat the texture on the y axis
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping // repeat the texture on the y axis
grassNormalTexture.wrapT = THREE.RepeatWrapping // repeat the texture on the y axis
grassRoughnessTexture.wrapT = THREE.RepeatWrapping // repeat the texture on the y axis


/**
 * House
 */

// Ghost
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3) // color, intensity, distance

const ghost2 = new THREE.PointLight('#00ffff', 2, 3) // color, intensity, distance

const ghost3 = new THREE.PointLight('#ffff00', 2, 3) // color, intensity, distance

scene.add(ghost1, ghost2, ghost3) // add the lights to the scene

//Group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4), // width, height, depth
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture, // color texture
        aoMap: bricksAmbientOcclusionTexture, // ambient occlusion texture
        normalMap: bricksNormalTexture, // normal texture
        roughnessMap: bricksRoughnessTexture // roughness texture
    })
)
walls.position.y = 2.5 / 2 // half of the height of the walls
house.add(walls) // add walls to the house

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4), // radius, height, segments
    new THREE.MeshStandardMaterial({ color: '#b35f45' }) // color
)
roof.position.y = 2.5 + 0.5 // half of the height of the walls + half of the height of the roof
roof.rotation.y = Math.PI * 0.25 // rotate the roof 45 degrees
house.add(roof) // add roof to the house

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture, // color texture
        transparent: true, // make the door transparent
        alphaMap: doorAlphaTexture, // alpha texture
        aoMap: doorAmbientOcclusionTexture, // ambient occlusion texture 
        displacementMap: doorHeightTexture, // height texture
        displacementScale: 0.1, // scale the height texture
        normalMap: doorNormalTexture, // normal texture 
        metalnessMap: doorMetalnessTexture, // metalness texture
        roughnessMap: doorRoughnessTexture // roughness texture
    })
)
door.position.y = 1 // half of the height of the door
door.position.z = 2 + 0.01 // half of the depth of the door
house.add(door) // add door to the house

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16) // radius, widthSegments, heightSegments
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' }) // color

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5) // scale the bush
bush1.position.set(1, 0.1, 2.2) // position the bush

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25) // scale the bush
bush2.position.set(1.4, 0.1, 2.1) // position the bush

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4) // scale the bush
bush3.position.set(- 1.4, 0.1, 2.2) // position the bush

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15) // scale the bush
bush4.position.set(- 1.3, 0.05, 2.6) // position the bush

house.add(bush1, bush2, bush3, bush4) // add bushes to the house

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2) // width, height, depth
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' }) // color

for (let i = 0; i < 50; i++) // create 50 graves
{
    const angle = Math.random() * Math.PI * 2 // random angle
    const radius = 3 + Math.random() * 6 // random radius

    const x = Math.sin(angle) * radius // x position
    const z = Math.cos(angle) * radius // z position

    const grave = new THREE.Mesh(graveGeometry, graveMaterial) // create a grave
    grave.position.set(x, 0.3, z) // position the grave
    grave.rotation.y = (Math.random() - 0.5) * 0.4 // rotate the grave
    grave.rotation.z = (Math.random() - 0.5) * 0.4 // rotate the grave
    grave.castShadow = true // cast shadows
    graves.add(grave) // add the grave to the graves group
}

// Temporary sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
sphere.position.y = 1
scene.add(sphere)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture, // color texture
        aoMap: grassAmbientOcclusionTexture, // ambient occlusion texture
        normalMap: grassNormalTexture, // normal texture
        roughnessMap: grassRoughnessTexture // roughness texture
    })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7) // color, intensity, distance
doorLight.position.set(0, 2.2, 2.7) // position the light
house.add(doorLight) // add the light to the house

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837') // color of the fog in the scene

// Shadows
renderer.shadowMap.enabled = true // enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap // soft shadows

// Moon light
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

// Door light
doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

// Ghosts shadows
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

// House
walls.castShadow = true

// Bushes
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

// Floor
floor.receiveShadow = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Ghosts
    const ghost1Angle = elapsedTime * 0.5 // rotate the ghost 180 degrees per second
    ghost1.position.x = Math.cos(ghost1Angle) * 4 // move the ghost on the x axis
    ghost1.position.z = Math.sin(ghost1Angle) * 4 // move the ghost on the z axis
    ghost1.position.y = Math.sin(elapsedTime * 3) // move the ghost on the y axis

    const ghost2Angle = - elapsedTime * 0.32 // rotate the ghost 180 degrees per second
    ghost2.position.x = Math.cos(ghost2Angle) * 5 // move the ghost on the x axis
    ghost2.position.z = Math.sin(ghost2Angle) * 5 // move the ghost on the z axis
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5) // move the ghost on the y axis

    const ghost3Angle = - elapsedTime * 0.18 // rotate the ghost 180 degrees per second
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32)) // move the ghost on the x axis
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5)) // move the ghost on the z axis
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5) // move the ghost on the y axis

    // Update sphere
    sphere.position.x = Math.cos(elapsedTime) * 7 // move the sphere on the x axis
    sphere.position.z = Math.sin(elapsedTime) * 7 // move the sphere on the z axis
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 4)) // move the sphere on the y axis

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()