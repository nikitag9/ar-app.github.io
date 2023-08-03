let cameraFeedRenderer = null
const renderTex_ = null
let canvasWidth_ = null
let canvasHeight_ = null
let videoWidth_ = null
let videoHeight_ = null
let texProps = null
export const initScenePipelineModule = () => {
  let renderer_ = null
  const camTexture_ = new THREE.Texture()
  const loader = new THREE.GLTFLoader()
  const renderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding,
  })
  const refMat = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xffffff,
    map: camTexture_,
  })
  // cubemap scene
  const cubeMapScene = new THREE.Scene()
  const cubeCamera = new THREE.CubeCamera(1, 1000, renderTarget)
  const sphere = new THREE.SphereGeometry(100, 15, 15)
  const sphereMesh = new THREE.Mesh(sphere, refMat)
  sphereMesh.scale.set(-1, 1, 1)
  sphereMesh.rotation.set(Math.PI, -Math.PI / 2, 0)
  cubeMapScene.add(sphereMesh)
  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the renderer.
    renderer.shadowMap.enabled = true
    // You can also try THREE.sRGBEncoding but scene may be too bright
    renderer.outputEncoding = THREE.LinearEncoding
    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 10, 0)
    directionalLight.castShadow = true
    scene.add(directionalLight)
    // Add some light to the scene.
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)
    scene.background = camTexture_
    // GLTF Model
    loader.load(
      require('./assets/buzz.glb'),
      (gltf) => {
        gltf.scene.traverse((o) => {
          if (o.isMesh) {
            o.material.envMap = cubeCamera.renderTarget.texture
            o.castShadow = true
          }
        })
        gltf.scene.position.set(0, 0.5, 0)
        gltf.scene.scale.set(0.1, 0.1, 0.1)
        gltf.scene.rotation.set(0, -Math.PI / 4, 0)
        scene.add(gltf.scene)
      }
    )
    // Add a plane that can receive shadows.
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    planeGeometry.rotateX(-Math.PI / 2)
    const planeMaterial = new THREE.ShadowMaterial()
    planeMaterial.opacity = 0.5
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    scene.add(plane)
    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 2, 2)
  }
  const updateSize = ({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx}) => {
    cameraFeedRenderer = XR8.GlTextureRenderer.create({
      GLctx,
      toTexture: {width: canvasWidth, height: canvasHeight},
      flipY: false,
    })
    canvasWidth_ = canvasWidth
    canvasHeight_ = canvasHeight
    videoWidth_ = videoWidth
    videoHeight_ = videoHeight
  }
  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'threejsinitscene',
    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onAttach: ({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx}) => {
      updateSize({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx})
    },
    onStart: ({canvas}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs
      renderer_ = renderer
      initXrScene({scene, camera, renderer})  // Add objects set the starting camera position.
      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion}
      )
      // prevent scroll/pinch gestures on canvas
      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
      })
      // Recenter content when the canvas is tapped.
      canvas.addEventListener(
        'touchstart', (e) => {
          e.touches.length === 1 && XR8.XrController.recenter()
        }, true
      )
    },
    onDeviceOrientationChange: ({videoWidth, videoHeight, GLctx}) => {
      updateSize({videoWidth, videoHeight, canvasWidth_, canvasHeight_, GLctx})
    },
    onVideoSizeChange: ({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx}) => {
      updateSize({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx})
    },
    onCanvasSizeChange: ({GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight}) => {
      updateSize({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx})
    },
    onUpdate: ({processCpuResult}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()
      cubeCamera.update(renderer, cubeMapScene)
      const {reality} = processCpuResult
      if (!reality) {
        return
      }
      texProps.__webglTexture = cameraFeedRenderer.render({renderTexture: reality.realityTexture, viewport: XR8.GlTextureRenderer.fillTextureViewport(videoWidth_, videoHeight_, canvasWidth_, canvasHeight_)})
    },
    onProcessCpu: ({frameStartResult}) => {
      const {cameraTexture} = frameStartResult
      // force initialization
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs
      texProps = renderer.properties.get(camTexture_)
      texProps.__webglTexture = cameraTexture
    },
  }
}
