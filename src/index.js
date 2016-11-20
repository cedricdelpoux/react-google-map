import React, {Component, PropTypes} from "react"

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
    const {coordinates, googleMaps, onLoaded, ...props} = this.props

    const map = new googleMaps.Map(this.ref_map, {
      ...props,
    })

    this.setState({map}, () => {
      this.addNewMarkers(coordinates)
    })

    if (onLoaded) {
      onLoaded(googleMaps, map)
    }
  }

  componentWillReceiveProps(nextProps) {
    const newMarkers = nextProps.coordinates.some(coordinate => !this.state.markers.has(this.getMarkerId(coordinate)))
    const oldMarkers = [...this.state.markers.keys()].some(markerId =>
      !nextProps.coordinates.some(coordinate => markerId === this.getMarkerId(coordinate))
    )

    if (oldMarkers) {
      this.removeOldMarkers(nextProps.coordinates)
    }

    if (newMarkers) {
      this.addNewMarkers(nextProps.coordinates)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.coordinates.length !== nextProps.coordinates.length
  }

  getMarkerId(coordinate) {
    return coordinate.position.lat + "_" + coordinate.position.lng
  }

  removeOldMarkers(coordinates) {
    const {markers} = this.state
    const {autoFitBounds} = this.props

    markers.forEach((marker, markerId) => {
      const isMarkerUsed = coordinates.some(coordinate =>
        this.getMarkerId(coordinate) === markerId
      )

      if (!isMarkerUsed) {
        marker.setMap(null)
        markers.delete(markerId)
      }
    })

    this.setState({markers})

    if (autoFitBounds) {
      this.fitBounds()
    }
  }

  addNewMarkers(coordinates) {
    const {markers} = this.state
    const {autoFitBounds} = this.props

    coordinates.forEach(coordinate => {
      const markerId = this.getMarkerId(coordinate)
      if (!markers.has(markerId)) {
        markers.set(markerId, this.addMarker(markerId, coordinate))
      }
    })

    this.setState({markers})

    if (autoFitBounds) {
      this.fitBounds()
    }
  }

  addMarker(markerId, coordinate) {
    const {map} = this.state
    const {googleMaps} = this.props
    const {
      onLoaded, ...markerProps,
    } = coordinate

    const marker = new googleMaps.Marker({
      map: map,
      ...markerProps,
    })

    if (onLoaded) {
      onLoaded(googleMaps, map, marker)
    }

    return marker
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
    return (
      <div ref={ref => this.ref_map = ref} style={inlineStyles} />
    )
  }
}

GoogleMap.propTypes = {
  autoFitBounds: PropTypes.bool,
  boundsOffset: PropTypes.number,
  coordinates: PropTypes.arrayOf(PropTypes.shape({
    onLoaded: PropTypes.func,
  })),
  googleMaps: PropTypes.object.isRequired,
  onLoaded: PropTypes.func,
}

GoogleMap.defaultProps = {
  autoFitBounds: false,
  boundsOffset: 0.002,
  coordinates: [],
  onLoaded: null,
}

export default GoogleMap
