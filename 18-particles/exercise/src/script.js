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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')
/**
 * Particles
 */
// Geometry
const particleGeometry = new THREE.BufferGeometry()
const count = 50000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particleGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
)

particleGeometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(colors, 3)
)

// Material
const particleMaterial = new THREE.PointsMaterial()
particleMaterial.size = 0.05 // Size of the particles
particleMaterial.sizeAttenuation = true // Makes the particles smaller when they are far away
particleMaterial.color = new THREE.Color('#ff88cc')// Color of the particles (red, green, blue)
particleMaterial.transparent = true // Makes the particles transparent
particleMaterial.alphaMap = particleTexture // Texture of the particles
// particleMaterial.alphaTest = 0.001 // Makes the particles transparent
// particleMaterial.depthTest = false // Makes the particles transparent
particleMaterial.depthWrite = false // Depth write is disabled so that the particles don't write on top of each other
particleMaterial.blending = THREE.AdditiveBlending // Makes the particles blend with the background
particleMaterial.vertexColors = true // Makes the particles have different colors
// Points
const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

// Cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)

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
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    particles.rotation.y = elapsedTime * 0.2
    for(let i = 0; i < count; i++)
    {
        const i3 = i * 3

        const x = particleGeometry.attributes.position.array[i3 + 0]
        particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particleGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()