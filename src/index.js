import React, {Component, PropTypes} from "react"

import iconMarker from "./iconMarker.svg"
import iconTrash from "./iconTrash.svg"

const inlineStyles = {
  position: "relative",
  overflow: "hidden",
  height: "100%",
  width: "100%",
}

class GoogleMap extends Component {
  constructor() {
    super()
    this.state = {
      map: null,
      markers: new Map(),
    }
  }

  componentDidMount() {
    const {googleMaps, centerLat, centerLng, mapType, ...props} = this.props

    const mapTypes = [
      "HYBRID": googleMaps.MapTypeId.HYBRID,
      "ROADMAP": googleMaps.MapTypeId.ROADMAP,
      "SATELLITE": googleMaps.MapTypeId.SATELLITE,
      "TERRAIN": googleMaps.MapTypeId.TERRAIN,
    ]

    const map = new googleMaps.Map(this.ref_map, {
      center: new googleMaps.LatLng(centerLat, centerLng),
      mapTypeId: mapTypes[mapType],
      ...props,
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
    if (this.props.autoFitBounds) {
      this.fitBounds()
    }
    return (
      <div ref={ref => this.ref_map = ref} style={inlineStyles} />
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
  centerLat: PropTypes.number,
  centerLng: PropTypes.number,
  mapType: PropTypes.oneOf(["HYBRID", "ROADMAP", "SATELLITE", "TERRAIN"]),
}

GoogleMap.defaultProps = {
  autoFitBounds: true,
  boundsOffset: 0.002,
  coordinates: [],
  onChange: null,
  removeMarkerOnClick: false,

  // google maps props
  centerLat: 43.604363,
  centerLng: 1.443363,
  mapType: "ROADMAP",
}

export default GoogleMap
