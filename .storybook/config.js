import { addParameters, configure } from '@storybook/react'

addParameters({
  options: {
    showPanel: false
  }
})

function loadStories () {
  require('../stories/index.js')
}

configure(loadStories, module)
