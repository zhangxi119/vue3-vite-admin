// 全屏方法
export function fullScreenFun(type) {
  let fullscreenEnabled = document.fullscreenEnabled ||
  document.mozFullScreenEnabled ||
  document.webkitFullscreenEnabled ||
  document.msFullscreenEnabled

  if (fullscreenEnabled) {
    let de = document.documentElement
    if (!type) {
    // 关闭全屏
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    } else {
    // 打开全屏
      if (de.requestFullscreen) {
        de.requestFullscreen()
      } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen()
      } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen()
      }
    }
  } else {
    alert('浏览器当前不能全屏')
  }
}