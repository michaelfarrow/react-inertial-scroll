import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SmoothScrollbar from 'smooth-scrollbar'
import hoistStatics from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'

export function wrapScrollChild (ComposedComponent) {
  const displayName = getDisplayName(ComposedComponent)

  class WrappedScrollChild extends Component {

    static contextTypes = {
      getScrollbar: PropTypes.func
    }

    state = {
      scrollbar: null
    }

    static displayName = `WrappedScrollChild(${displayName})`

    componentDidMount () {
      const { getScrollbar } = this.context
      if (getScrollbar) {
        getScrollbar(scrollbar => {
          this.setState(state => ({...state, scrollbar}))
        })
      }
    }

    render () {
      const { scrollbar } = this.state
      return scrollbar && <ComposedComponent scrollbar={scrollbar} {...this.props} /> || null
    }
  }

  return hoistStatics(WrappedScrollChild, ComposedComponent)
}

export default class ScrollContainer extends Component {

  static propTypes = {
    damping: PropTypes.number,
    thumbMinSize: PropTypes.number,
    syncCallbacks: PropTypes.bool,
    renderByPixels: PropTypes.bool,
    alwaysShowTracks: PropTypes.bool,
    continuousScrolling: PropTypes.bool,
    wheelEventTarget: PropTypes.element,
    plugins: PropTypes.object,
    onScroll: PropTypes.func,
    onResize: PropTypes.func,
    children: PropTypes.node
  }

  static childContextTypes = {
    getScrollbar: PropTypes.func
  }

  mounted = false
  sizes = {
    container: {
      width: 0,
      height: 0
    },
    content: {
      width: 0,
      height: 0
    }
  }

  constructor (props) {
    super(props)

    this.callbacks = []
  }

  getChildContext () {
    return {
      getScrollbar: (cb) => {
        if (typeof cb !== 'function') return

        if (this.scrollbar) {
          setTimeout(() => cb(this.scrollbar))
        } else {
          this.callbacks.push(cb)
        }
      }
    }
  }

  monitorHeight = () => {
    const { onResize } = this.props
    const { scrollbar, $container, $content } = this
    if (scrollbar && $container && $content) {
      const containerWidth = $container.clientWidth
      const containerHeight = $container.clientHeight
      const contentWidth = $content.clientWidth
      const contentHeight = $content.clientHeight
      if (containerWidth !== this.sizes.container.width ||
        containerHeight !== this.sizes.container.height ||
        contentWidth !== this.sizes.content.width ||
        contentHeight !== this.sizes.content.height) {
        this.sizes = {
          container: {
            width: containerWidth,
            height: containerHeight
          },
          content: {
            width: contentWidth,
            height: contentHeight
          }
        }
        const atBottomLimit = scrollbar.offset.y === scrollbar.limit.y
        scrollbar.update()
        if (atBottomLimit) {
          scrollbar.setPosition(scrollbar.limit.x, scrollbar.limit.y)
        }
        onResize && onResize(this.sizes)
      }
    }
    if (this.mounted) requestAnimationFrame(this.monitorHeight)
  }

  componentDidMount () {
    this.mounted = true
    this.scrollbar = SmoothScrollbar.init(this.$container, this.props)

    this.callbacks.forEach((cb) => {
      requestAnimationFrame(() => cb(this.scrollbar))
    })

    this.scrollbar.addListener(this.handleScroll)

    requestAnimationFrame(this.monitorHeight)
  }

  componentWillUnmount () {
    this.mounted = false
    if (this.scrollbar) {
      this.scrollbar.destroy()
    }
  }

  componentWillReceiveProps (nextProps) {
    Object.keys(nextProps).forEach((key) => {
      if (!key in this.scrollbar.options) {
        return
      }

      if (key === 'plugins') {
        Object.keys(nextProps.plugins).forEach((pluginName) => {
          this.scrollbar.updatePluginOptions(pluginName, nextProps.plugins[pluginName])
        })
      } else {
        this.scrollbar.options[key] = nextProps[key]
      }
    })
  }

  componentDidUpdate () {
    this.scrollbar && this.scrollbar.update()
  }

  handleScroll = status => {
    if (this.props.onScroll) {
      this.props.onScroll(status, this.scrollbar)
    }
  }

  render () {
    const { damping, thumbMinSize, syncCallbacks, renderByPixels, alwaysShowTracks, continuousScrolling, wheelEventTarget, plugins, onScroll, onResize, children, ...props } = this.props

    return (
      <section data-scrollbar ref={ref => this.$container = ref} {...props}>
        <div ref={ref => this.$content = ref}>
          {children}
        </div>
      </section>
    )
  }
}
