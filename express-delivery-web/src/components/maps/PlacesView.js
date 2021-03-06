import React from "react";
import { GoogleMap, withGoogleMap, Marker, StreetViewPanorama, OverlayView, } from "react-google-maps";

const { compose, withProps, lifecycle } = require("recompose");
const { withScriptjs } = require("react-google-maps");

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
})

    const PlacesView = compose(
      withProps({
        googleMapURL:
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyAcARHUk4o65m_Oy_2_5yiUksDSQ2mtqmc&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` , position:'absolute'}} />,
        containerElement: <div style={{ height: `400px`, width:'100%' }} />,
        mapElement: <div style={{ height: `70%`}} />
      }),
      lifecycle({
        componentWillMount() {
          const refs = {};
          this.setState({
            places: []
          });
    
        }
      }),
      withScriptjs,
      withGoogleMap
    )(props => (
        <div className='container'>
          <GoogleMap defaultZoom={16} defaultCenter={props.center}>
              <Marker position={props.center} />           
          </GoogleMap>
        </div>

    ));

export default PlacesView;



