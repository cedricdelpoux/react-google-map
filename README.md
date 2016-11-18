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
import React, {PropTypes} from "react"

import GoogleMap from "react-google-map"
import GoogleMapLoader from "react-google-maps-loader"

import styles from "./index.css"

const MY_API_KEY = "AIzaSyDwsdjfskhdbfjsdjbfksiTgnoriOAoUOgsUqOs10J0" // fake

const Map = ({googleMaps}) => (
  <div style={{height: "300px"}}>
    <GoogleMap googleMaps={googleMaps} coordinates={[
      {
        title: "Toulouse",
        latitude: 43.604363,
        longitude: 1.443363,
      }
    ]} />
  </div>
)

Map.propTypes = {
  googleMaps: PropTypes.object.isRequired,
}

export default GoogleMapLoader(Map, {
  libraries: ["places"],
  key: MY_API_KEY,
})

```

## Props

  * `coordinates`: Array of objects with shape { description: String, latitude: Number, longitude: Number, title: String, icon: String } - by default is []
  * `centerLat`: Number,
  * `centerLng`: Number,
  * `googleMaps`: Object - injected by placesLoader,
  * `onChange`: Function with two parameters (New coordinates object, actual zoom),
  * `mapTypeId`: String - One of ["HYBRID", "ROADMAP", "SATELLITE", "TERRAIN"],

You can also pass all Google Maps options :
https://developers.google.com/maps/documentation/javascript/reference

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
