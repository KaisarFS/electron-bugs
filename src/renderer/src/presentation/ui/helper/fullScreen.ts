/*!
 * screenfull
 * v3.3.1 - 2017-07-07
 * (c) Sindre Sorhus; MIT License
 */

interface FullscreenAPI {
  requestFullscreen: string
  exitFullscreen: string
  fullscreenElement: string
  fullscreenEnabled: string
  fullscreenchange: string
  fullscreenerror: string
}

;(function () {
  const document =
    typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : null
  const isCommonjs = typeof module !== 'undefined' && module.exports
  const keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element

  const fn: FullscreenAPI | false = (function () {
    const fnMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
      ],
      // New WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'
      ],
      // Old WebKit (Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'
      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
      ],
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
      ]
    ]

    return {
      requestFullscreen: fnMap[0][0],
      exitFullscreen: fnMap[0][1],
      fullscreenElement: fnMap[0][2],
      fullscreenEnabled: fnMap[0][3],
      fullscreenchange: fnMap[0][4],
      fullscreenerror: fnMap[0][5]
    }
  })()

  const eventNameMap = {
    change: fn.fullscreenchange,
    error: fn.fullscreenerror
  }

  const screenfull = {
    request(elem) {
      const request = fn.requestFullscreen

      elem = elem || document?.documentElement

      // Work around Safari 5.1 bug: reports support for
      // keyboard in fullscreen even though it doesn't.
      // Browser sniffing, since the alternative with
      // setTimeout is even worse.
      if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) {
        elem[request]()
      } else {
        elem[request](
          keyboardAllowed &&
            (Element as unknown as { ALLOW_KEYBOARD_INPUT: number }).ALLOW_KEYBOARD_INPUT
        )
      }
    },
    exit() {
      if (document) {
        document[fn.exitFullscreen]()
      }
    },
    isFullscreen: () => Boolean(document?.[fn.fullscreenElement]),
    toggle(elem) {
      if (this.isFullscreen()) {
        this.exit()
      } else {
        this.request(elem)
      }
    },
    onchange(callback) {
      this.on('change', callback)
    },
    onerror(callback) {
      this.on('error', callback)
    },
    on(event, callback) {
      const eventName = eventNameMap[event]
      if (eventName) {
        document?.addEventListener(eventName, callback, false)
      }
    },
    off(event, callback) {
      const eventName = eventNameMap[event]
      if (eventName) {
        document?.removeEventListener(eventName, callback, false)
      }
    },
    raw: fn
  }

  if (!fn) {
    if (isCommonjs) {
      module.exports = false
    } else {
      // ;(window).screenfull = false
    }

    return
  }

  Object.defineProperties(screenfull, {
    isFullscreen: {
      get() {
        return Boolean(document?.[fn.fullscreenElement])
      }
    },
    element: {
      enumerable: true,
      get() {
        return document?.[fn.fullscreenElement]
      }
    },
    enabled: {
      enumerable: true,
      get() {
        // Coerce to boolean in case of old WebKit
        return Boolean(document?.[fn.fullscreenEnabled])
      }
    }
  })

  if (isCommonjs) {
    module.exports = screenfull
  } else {
    // ;(window).screenfull = screenfull
  }
})()
