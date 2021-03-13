import Head from "next/head";
import React, { useState } from "react";
import ReactStreetview from "../components/ReactStreetview";
import MapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
// There's a bug with mapbox-gl@2.1.1 and the code below fixes it (https://github.com/mapbox/mapbox-gl-js/issues/10173)
// This code requires worker-loader@^3.0.0 which requires webpack@^4.0.0
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

// see https://developers.google.com/maps/documentation/javascript/3.exp/reference#StreetViewPanoramaOptions
const streetViewPanoramaOptions = {
  position: { lat: 48.8582449, lng: 2.2923836 },
  pov: { heading: 92.21, pitch: 24.66 },
  zoom: 1,
  addressControl: false,
  imageDateControl: true,
  showRoadLabels: false,
};

function Play() {
  const [viewport, setViewport] = useState({
    latitude: 12.473718352618263,
    longitude: 122.15970582093894,
    zoom: 5,
    bearing: 0,
    pitch: 0,
  });

  return (
    <div>
      <Head>
        <title>GeoGuessr Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: "50vw", height: "100vh", float: "left" }}>
        <ReactStreetview
          apiKey={process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY}
          streetViewPanoramaOptions={streetViewPanoramaOptions}
        />
      </div>
      <div style={{ width: "49vw", height: "100vh", float: "left" }}>
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/dark-v10"
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          onViewportChange={setViewport}
        ></MapGL>
      </div>
    </div>
  );
}

export default Play;
