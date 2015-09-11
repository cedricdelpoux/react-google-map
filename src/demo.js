import './demo.css'
import 'react-google-places-suggest/lib/index.css'
import 'react-google-map/lib/index.css'

import React, { Component } from 'react'
import GooglePlacesSuggest from 'react-google-places-suggest'
import GoogleMap from 'react-google-map'

export default class Demo extends Component {
  state = {
    coordinates: [],
    search: '',
    selectedCoordinate: null,
    suggests: [],
    zoom: 8,
  }

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value })
  }

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value })
  }

  handleSelectSuggest = (suggestName, coordinate) => {
    this.setState({ search: suggestName, selectedCoordinate: coordinate })
  }

  handleClickOnAddPlace = () => {
    const { selectedCoordinate } = this.state
    this.addCoordinate(selectedCoordinate)
    this.setState({ search: '', selectedCoordinate: null })
  }

  handleRemoveCoordinate = (index) => {
    const { coordinates } = this.state
    const newCoordinates = coordinates.concat()
    newCoordinates.splice(index, 1)
    this.setState({ coordinates: newCoordinates })
  }

  handleZoomChange = (zoom) => {
    this.setState({ zoom: zoom })
  }

  handleMapChange = (coordinates, zoom) => {
    this.setState({ coordinates, zoom })
  }

  addCoordinate(coordinate) {
    const coordinates = [...this.state.coordinates, coordinate]
    this.setState({ coordinates })
  }

  renderSearch() {
    const { search } = this.state
    return (
      <div className="search">
        <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ search }>
          <input
            type="text"
            value={ search }
            placeholder="Search a location"
            onChange={ this.handleSearchChange }
          />
        </GooglePlacesSuggest>
      </div>
    )
  }

  renderForm() {
    const { selectedCoordinate } = this.state

    return (
      <div className="form">
        { this.renderSearch() }
        <span
          type="button"
          className="button"
          theme="blue"
          disabled={ !selectedCoordinate }
          onClick={ this.handleClickOnAddPlace }
        >
          Add marker
        </span>
      </div>
    )
  }

  renderMap() {
    const { zoom } = this.props
    const { coordinates } = this.state

    return (
      <GoogleMap
        coordinates={ coordinates }
        zoom={ zoom }
        onChange={ this.handleMapChange }
      />
    )
  }

  render() {
    return (
      <div className="container">
        <div>{ this.renderSearch() }</div>
        <div>{ this.renderMap() }</div>
      </div>
    )
  }
}
