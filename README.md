# react-google-map ![npm](https://img.shields.io/npm/v/react-google-map.svg) ![license](https://img.shields.io/npm/l/react-google-map.svg)

React component to render a map with markers from Google Maps API

![react-google-map example](/screenshots/react-google-map-exemple.png)

## Install

```sh
npm install --save react-google-map
```

## Changelog

See [changelog](./CHANGELOG.md)

## Demo 

<http://cedricdelpoux.github.io/react-google-map/>

## Usage

```js
import React, { Component } from 'react'
import GooglePlacesSuggest from 'react-google-map'

export default class MyComponent extends Component {
  state = {
    search: '',
    selectedCoordinate: null,
  }

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value })
  }

  handleSelectSuggest = (suggestName, coordinate) => {
    this.setState({ search: suggestName, selectedCoordinate: coordinate })
  }

  render() {
    const { search } = this.state

    return (
      <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ search }>
        <input
          type="text"
          value={ search }
          placeholder="Search a location"
          onChange={ this.handleSearchChange }
        />
      </GooglePlacesSuggest>
    )
  }
}
```

## Props

  * `coordinates`: Array of objects with shape { description: String, latitude: Number, longitude: Number, title: String } - by default is []
  * `defaultLat`: Number,
  * `defaultLng`: Number,
  * `googleMaps`: Object - injected by decorator,
  * `onChange`: Function with two parameters (New coordinates object, actual zoom),
  * `zoom`: Number - isRequired,

## Classes

  * `.googleMap`

## Development

### Clean `lib` folder

```js
npm run clean
```

### Build `lib` folder

```js
npm run build
```

### Watch `src` folder

```js
npm run watch
```

### Lint `src` folder

```js
npm run lint
```

## License

See [MIT](./LICENCE)
