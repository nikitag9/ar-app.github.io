import './index.css'
import {initScenePipelineModule} from './threejs-scene-init'
import * as camerafeedHtml from './camerafeed.html'
import createVirtualTourGuidePipelineModule from './createVirtualTourGuidePipelineModule'

// Check Location Permissions at beginning of session
const errorCallback = (error) => {
  if (error.code === error.PERMISSION_DENIED) {
    // alert('LOCATION PERMISSIONS DENIED. PLEASE ALLOW AND TRY AGAIN.')
  }
}
navigator.geolocation.getCurrentPosition((pos) => {}, errorCallback)

const onxrloaded = () => {
  XR8.XrController.configure({enableVps: true})
  XR8.addCameraPipelineModules([
    XR8.GlTextureRenderer.pipelineModule(),
    XR8.Threejs.pipelineModule(),
    XR8.XrController.pipelineModule(),
    window.LandingPage.pipelineModule(),
    window.VpsCoachingOverlay.pipelineModule(),
    XRExtras.FullWindowCanvas.pipelineModule(),
    XRExtras.Loading.pipelineModule(),
    XRExtras.RuntimeError.pipelineModule(),
    initScenePipelineModule(),
    createVirtualTourGuidePipelineModule(),
  ])

  document.body.insertAdjacentHTML('beforeend', camerafeedHtml)
  const canvas = document.getElementById('camerafeed')

  XR8.run({canvas})
}

if (window.XR8) {
  onxrloaded()
} else {
  window.addEventListener('xrloaded', onxrloaded)
}
