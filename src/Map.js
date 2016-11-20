import React, {Component} from "react"

import GoogleMap from "react-google-map"
import GoogleMapLoader from "react-google-maps-loader"

import iconMarker from "./assets/iconMarker.svg"
import iconMarkerHover from "./assets/iconMarkerHover.svg"

class Map extends Component {
  render() {
    const {googleMaps} = this.props
    return (
      <div style={{height: "500px"}}>
        <GoogleMap
          googleMaps={googleMaps}
          coordinates={[
            {
              icon: iconMarker,
              title: "Toulouse",
              position: {
                lat: 43.604363,
                lng: 1.443363,
              },
              onLoaded: (googleMaps, map, marker) => {
                // Set Marker animation
                marker.setAnimation(googleMaps.Animation.BOUNCE)

                // Define Marker InfoWindow
                const infoWindow = new googleMaps.InfoWindow({
                  content: `
                    <div>
                      <h3>Toulouse</h3>
                      <div>
                        Toulouse is the capital city of the southwestern
                        French department of Haute-Garonne,
                        as well as of the Occitanie region.
                      </div>
                    </div>
                  `,
                })

                // Open InfoWindow when Marker will be clicked
                googleMaps.event.addListener(marker, "click", () => {
                  infoWindow.open(map, marker)
                })

                // Change icon when Marker will be hovered
                googleMaps.event.addListener(marker, "mouseover", () => {
                  marker.setIcon(iconMarkerHover)
                })

                googleMaps.event.addListener(marker, "mouseout", () => {
                  marker.setIcon(iconMarker)
                })

                // Open InfoWindow directly
                infoWindow.open(map, marker)
              },
            },
          ]}
          center={{lat: 43.604363, lng: 1.443363}}
          zoom={8}
          onLoaded={(googleMaps, map) => {
            map.setMapTypeId(googleMaps.MapTypeId.HYBRID)
          }}
        />
      </div>
    )
  }
}

export default GoogleMapLoader(Map, {
  libraries: ["places"],
  key: "AIzaSyAGz5ACyQ8hyEB-foU68UYgR66ISFJ8ofI",
})
