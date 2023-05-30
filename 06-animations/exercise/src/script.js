import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// // Clock 
// const clock = new THREE.Clock()

gsap.to(mesh.position, {duration: 1, delay: 1, x: 2})
gsap.to(mesh.position, {duration: 1, delay: 2, x: 0})

// Animation
const tick = () => 
{ 
    // // Clock
    // const elapsedTime = clock.getElapsedTime()

    // // Update objects
    // // mesh.rotation.y = elapsedTime * Math.PI * 2 // elaspseTime is the time since the page loaded
    // camera.position.y = Math.sin(elapsedTime)// sin function returns a value between -1 and 1
    // camera.position.x = Math.cos(elapsedTime)// sin function returns a value between -1 and 1
    // camera.lookAt(mesh.position) // camera will look at the mesh position
    // // mesh.rotation.x += 0.01
    
    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()
