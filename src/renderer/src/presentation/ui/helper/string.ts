function requestFullScreen(element) {
  const requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen

  const isInFullScreen =
    (document.fullscreenElement && document.fullscreenElement !== null) ||
    ('webkitFullscreenElement' in document && document.webkitFullscreenElement !== null) ||
    ('mozFullScreenElement' in document && document.mozFullScreenElement !== null)
  // (document.msFullscreenElement && (document as any).msFullscreenElement !== null)

  if (!isInFullScreen) {
    if (requestMethod) {
      // Native full screen.
      requestMethod.call(element)
    }
    // else if (typeof (window as any).ActiveXObject !== 'undefined') {
    // Older IE.
    // eslint-disable-next-line no-undef
    let ActiveXObject
    const wscript = new ActiveXObject('WScript.Shell')
    if (wscript !== null) {
      wscript.SendKeys('{F11}')
    }
  }
  return
}
if (document.exitFullscreen) {
  document.exitFullscreen()
}
// else if ((document as any).webkitExitFullscreen) {
// ;(document as any).webkitExitFullscreen()
// } else if ((document as any).mozCancelFullScreen) {
// ;(document as any).mozCancelFullScreen()
// } else if ((document as any).msExitFullscreen) {
// ;(document as any).msExitFullscreen()
// }

const dayByNumber = (text) => {
  switch (text) {
    case '1':
      return 'Monday'
    case '2':
      return 'Tuesday'
    case '3':
      return 'Wednesday'
    case '4':
      return 'Thursday'
    case '5':
      return 'Friday'
    case '6':
      return 'Saturday'
    case '7':
      return 'Sunday'
    default:
      return null
  }
}

const IMAGEURL = 'https://graph.k3mart.id/image'

const formatRupiah = (amount: number): string => {
  return amount.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// Untuk hapus format file (png, jpg, jpeg, gif) - dari pos legacy
function withoutFormat(file: string): string {
  const formats = ['png', 'jpg', 'jpeg', 'gif']
  const regex = new RegExp(`.(${formats.join('|')})$`, 'gi')
  return file.replace(regex, '')
}

export default formatRupiah

export { requestFullScreen, dayByNumber, IMAGEURL, formatRupiah, withoutFormat }
//   module.exports = {
//     dayByNumber
//   }
