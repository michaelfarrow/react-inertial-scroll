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
    children: PropTypes.node
  }

  static childContextTypes = {
    getScrollbar: PropTypes.func
  }

  mounted = false
  contentHeight = 0

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
    if (this.scrollbar && this.$content) {
      const height = this.$content.clientHeight
      if (height !== this.contentHeight) {
        this.contentHeight = height
        const atBottomLimit = this.scrollbar.offset.y === this.scrollbar.limit.y
        this.scrollbar.update()
        if (atBottomLimit) {
          this.scrollbar.setPosition(this.scrollbar.limit.x, this.scrollbar.limit.y)
        }
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
    const { damping, thumbMinSize, syncCallbacks, renderByPixels, alwaysShowTracks, continuousScrolling, wheelEventTarget, plugins, onScroll, children, ...props } = this.props

    return (
      <section data-scrollbar ref={ref => this.$container = ref} {...props}>
        <div ref={ref => this.$content = ref}>
          {children}
        </div>
      </section>
    )
  }
}