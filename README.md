# React Inertial Scroll

[smooth-scrollbar](https://github.com/idiotWu/smooth-scrollbar) for React projects.

## Install

```
npm install react-inertial-scroll --save
```

## Demo

[http://weyforth.github.io/react-inertial-scroll/](http://weyforth.github.io/react-inertial-scroll/)

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ScrollContainer from 'react-smooth-scrollbar';

class App extends React.Component {
    render() {
        return (
            <ScrollContainer
                damping={number}
                thumbMinSize={number}
                syncCallbacks={boolean}
                renderByPixels={boolean}
                alwaysShowTracks={boolean}
                continuousScrolling={boolean}
                wheelEventTarget={element}
                plugins={object}
                onScroll={func}
                onResize={func}
            >
                your contents here...
            </ScrollContainer>
        );
    }
}

ReactDOM.render(<App />, document.body);
```

### Available Options

| parameter | type | default | description |
| :--------: | :--: | :-----: | :---------- |
| damping | `number` | `0.1` | Momentum reduction damping factor, a float value between `(0, 1)`. The lower the value is, the more smooth the scrolling will be (also the more paint frames). |
| thumbMinSize | `number` | `20` | Minimal size for scrollbar thumbs. |
| renderByPixels | `boolean` | `true` | Render every frame in integer pixel values, set to `true` to improve scrolling performance. |
| alwaysShowTracks | `boolean` | `false` | Keep scrollbar tracks visible. |
| continuousScrolling | `boolean` | `true` | Set to `true` to allow outer scrollbars continue scrolling when current scrollbar reaches edge. |
| wheelEventTarget | `EventTarget` | `null` | Element to be used as a listener for mouse wheel scroll events. By default, the container element is used. This option will be useful for dealing with fixed elements.  |
| plugins | `object` | `{}` | Options for plugins, see [Plugin System](https://github.com/idiotWu/smooth-scrollbar/blob/master/docs/plugin.md). |


Confusing with the option field? Try the [edit tool](http://idiotwu.github.io/smooth-scrollbar/)

## APIs

[Documents](https://github.com/idiotWu/smooth-scrollbar/tree/develop/docs)

## License

MIT.
