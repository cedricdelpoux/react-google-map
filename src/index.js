import './index.css'
import iconMarker from './iconMarker.svg'
import iconTrash from './iconTrash.svg'

import React, { Component, PropTypes } from 'react'
import googleMapsLoader from 'react-google-maps-loader'

const { arrayOf, func, object, number, shape, string } = PropTypes

@googleMapsLoader({ libraries: 'places' })
export default class GoogleMap extends Component {
  static propTypes = {
    coordinates: arrayOf(shape({
      description: string,
      latitude: number.isRequired,
      longitude: number.isRequired,
      title: string.isRequired,
    })),
    defaultLat: number,
    defaultLng: number,
    googleMaps: object,
    onChange: func,
    zoom: number.isRequired,
  }

  static defaultProps = {
    boundsOffset: 0.002,
    coordinates: [],
    defaultLat: 43.604305,
    defaultLng: 1.443999,
    googleMaps: null,
    onChange: () => {},
    zoom: 8,
  }

  state = {
    map: null,
    markers: new Map(),
  }

  componentDidMount() {
    const { defaultLat, defaultLng, googleMaps, zoom } = this.props
    const map = new googleMaps.Map(React.findDOMNode(this.refs.map), {
      zoom,
      center: new googleMaps.LatLng(defaultLat, defaultLng),
      panControl: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
    })

    this.setState({ map }, () => this.initMarkers())
  }

  componentWillReceiveProps(nextProps) {
    const newMarkers = nextProps.coordinates.some(coordinate => !this.state.markers.has(this.getMarkerId(coordinate)))
    if (newMarkers) {
      this.updateMarkers(nextProps.coordinates)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.coordinates.length !== nextProps.coordinates.length
  }

  initMarkers() {
    this.addNewMarkers(this.props.coordinates)
  }

  updateMarkers(coordinates) {
    this.addNewMarkers(coordinates)

    this.props.onChange(this.getNewCoordinates(), this.state.map.getZoom())
  }

  addNewMarkers(coordinates) {
    const { markers } = this.state

    coordinates.forEach((coordinate, key) => {
      const markerId = this.getMarkerId(coordinate)
      if (!markers.has(markerId)) {
        markers.set(markerId, this.addMarker(markerId, coordinate))
      }
    })

    this.setState({ markers })
  }

  getMarkerId(coordinate) {
    return coordinate.latitude + '_' + coordinate.longitude
  }

  getNewCoordinates() {
    return Array.from(this.state.markers.values()).map((marker) => {
      const position = marker.getPosition()
      return {
        description: marker.description,
        latitude: position.lat(),
        longitude: position.lng(),
        title: marker.getTitle(),
      }
    })
  }

  addMarker(markerId, coordinate) {
    const { googleMaps } = this.props
    const { map } = this.state

    const marker = new googleMaps.Marker({
      animation: googleMaps.Animation.DROP,
      map: map,
      position: new googleMaps.LatLng(coordinate.latitude, coordinate.longitude),
      title: coordinate.title,
      description: coordinate.description,
      icon: iconMarker,
    })

    googleMaps.event.addListener(marker, 'mouseover', () => {
      marker.setIcon(iconTrash)
    })

    googleMaps.event.addListener(marker, 'mouseout', () => {
      marker.setIcon(iconMarker)
    })

    googleMaps.event.addListener(marker, 'click', () => {
      this.removeMarker(markerId)
    })

    return marker
  }

  removeMarker(markerId) {

    const { onChange } = this.props
    const { map, markers } = this.state
    const marker = markers.get(markerId)

    marker.setMap(null)
    markers.delete(markerId)

    onChange(this.getNewCoordinates(), map.getZoom())
  }

  fitBounds() {
    const { boundsOffset, googleMaps } = this.props
    const { map, markers } = this.state

    if (!map || markers.size === 0) {
      return
    }

    const bounds = Array.from(markers.values()).reduce((bound, marker) => bound.extend(marker.getPosition()), new googleMaps.LatLngBounds())
    const center = bounds.getCenter()

    bounds
      .extend(new googleMaps.LatLng(center.lat() + boundsOffset, center.lng() + boundsOffset))
      .extend(new googleMaps.LatLng(center.lat() - boundsOffset, center.lng() - boundsOffset))
    map.setCenter(center)

    map.fitBounds(bounds)
  }

  render() {
    this.fitBounds()
    return (
      <div ref="map" className="googleMap"></div>
    )
  }
}
