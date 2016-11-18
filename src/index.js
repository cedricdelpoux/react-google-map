import React, {Component, PropTypes} from "react"

import iconMarker from "./iconMarker.svg"
import iconTrash from "./iconTrash.svg"

import styles from "./index.css"

const MAP_TYPES = [
  "HYBRID": google.maps.MapTypeId.HYBRID,
  "ROADMAP": google.maps.MapTypeId.ROADMAP,
  "SATELLITE": google.maps.MapTypeId.SATELLITE,
  "TERRAIN": google.maps.MapTypeId.TERRAIN,
]

class GoogleMap extends Component {
  constructor() {
    super()
    this.state = {
      map: null,
      markers: new Map(),
    }
  }

  componentDidMount() {
    const {
      googleMaps, backgroundColor, centerLat, centerLng, clickableIcons, disableDefaultUI,
      disableDoubleClickZoom, draggable, draggableCursor, draggingCursor,
      fullscreenControl, heading, keyboardShortcuts, mapTypeControl,
      mapTypeControlOptions, mapTypeId, maxZoom, nimZoom, noClear, panControl,
      panControlOptions, rotateControl, rotateControlOptions, scaleControl,
      scaleControlOptions, scrollwheel, signInControl, streetView, streetViewControl,
      streetViewControlOptions, styles, tilt, zoom, zoomControl, zoomControlOptions,
    } = this.props

    const map = new googleMaps.Map(this.ref_map, {
      backgroundColor,
      center: new googleMaps.LatLng(centerLat, centerLng),
      clickableIcons,
      disableDefaultUI,
      disableDoubleClickZoom,
      draggable,
      draggableCursor,
      draggingCursor,
      fullscreenControl,
      heading,
      keyboardShortcuts,
      mapTypeControl,
      mapTypeControlOptions,
      mapTypeId: MAP_TYPES[mapTypeId],
      maxZoom,
      nimZoom,
      noClear,
      panControl,
      panControlOptions,
      rotateControl,
      rotateControlOptions,
      scaleControl,
      scaleControlOptions,
      scrollwheel,
      signInControl,
      streetView,
      streetViewControl,
      streetViewControlOptions,
      styles,
      tilt,
      zoom,
      zoomControl,
      zoomControlOptions,
    })

    this.setState({map}, () => this.initMarkers())
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
    const {autoFitBounds, coordinates} = this.props

    this.addNewMarkers(coordinates)
    if (autoFitBounds) {
      this.fitBounds()
    }
  }

  updateMarkers(coordinates) {
    this.addNewMarkers(coordinates)
  }

  addNewMarkers(coordinates) {
    const {markers} = this.state

    coordinates.forEach((coordinate, key) => {
      const markerId = this.getMarkerId(coordinate)
      if (!markers.has(markerId)) {
        markers.set(markerId, this.addMarker(markerId, coordinate))
      }
    })

    this.setState({markers})
  }

  getMarkerId(coordinate) {
    return coordinate.latitude + "_" + coordinate.longitude
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
    const {map} = this.state
    const {googleMaps, removeMarkerOnClick} = this.props

    const marker = new googleMaps.Marker({
      animation: googleMaps.Animation.DROP,
      map: map,
      position: new googleMaps.LatLng(coordinate.latitude, coordinate.longitude),
      title: coordinate.title,
      description: coordinate.description,
      icon: coordinate.icon ? coordinate.icon : iconMarker,
    })

    if (removeMarkerOnClick) {
      googleMaps.event.addListener(marker, "mouseover", () => {
        marker.setIcon(iconTrash)
      })

      googleMaps.event.addListener(marker, "mouseout", () => {
        marker.setIcon(iconMarker)
      })

      googleMaps.event.addListener(marker, "click", () => {
        this.removeMarker(markerId)
      })
    }

    return marker
  }

  removeMarker(markerId) {
    const {map, markers} = this.state
    const {onChange} = this.props
    const marker = markers.get(markerId)

    marker.setMap(null)
    markers.delete(markerId)

    if (onChange) {
      onChange(this.getNewCoordinates(), map.getZoom())
    }

    this.setState({markers})
  }

  fitBounds() {
    const {map, markers} = this.state
    const {boundsOffset, googleMaps} = this.props

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
    if (autoFitBounds) {
      this.fitBounds()
    }
    return (
      <div ref={ref => this.ref_map = ref} className={styles.googleMap} />
    )
  }
}

GoogleMap.propTypes = {
  autoFitBounds: PropTypes.bool,
  boundsOffset: PropTypes.number,
  coordinates: PropTypes.arrayOf(PropTypes.shape({
    description: PropTypes.string,
    icon: PropTypes.string,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  googleMaps: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  removeMarkerOnClick: PropTypes.bool,

  // google maps props
  backgroundColor: PropTypes.string,
  clickableIcons: PropTypes.bool,
  centerLat: PropTypes.number,
  centerLng: PropTypes.number,
  disableDefaultUI: PropTypes.bool,
  disableDoubleClickZoom: PropTypes.bool,
  draggable: PropTypes.bool,
  draggableCursor: PropTypes.string,
  draggingCursor: PropTypes.string,
  fullscreenControl: PropTypes.bool,
  heading: PropTypes.number,
  keyboardShortcuts: PropTypes.bool,
  mapTypeControl: PropTypes.bool,
  mapTypeControlOptions: PropTypes.bool,
  mapTypeId: PropTypes.oneOf(["HYBRID", "ROADMAP", "SATELLITE", "TERRAIN"]),
  maxZoom: PropTypes.number,
  nimZoom: PropTypes.number,
  noClear: PropTypes.bool,
  panControl: PropTypes.bool,
  panControlOptions: PropTypes.object,
  rotateControl: PropTypes.bool,
  rotateControlOptions: PropTypes.object,
  scaleControl: PropTypes.bool,
  scaleControlOptions: PropTypes.object,
  scrollwheel: PropTypes.bool,
  signInControl: PropTypes.bool,
  streetView: PropTypes.object,
  streetViewControl: PropTypes.bool,
  streetViewControlOptions: PropTypes.object,
  styles: PropTypes.array,
  tilt: PropTypes.number,
  zoom: PropTypes.number.isRequired,
  zoomControl: PropTypes.bool,
  zoomControlOptions: PropTypes.object,
}

GoogleMap.defaultProps = {
  autoFitBounds: false,
  boundsOffset: 0.002,
  coordinates: [],
  onChange: null,
  removeMarkerOnClick: false,
}

export default GoogleMap
