import Head from "next/head";
import React, { useState } from "react";
import ReactStreetview from "../components/ReactStreetview";
import MapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
// There's a bug with mapbox-gl@2.1.1 and the code below fixes it (https://github.com/mapbox/mapbox-gl-js/issues/10173)
// This code requires worker-loader@^3.0.0 which requires webpack@^4.0.0
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

function Play() {
  const [lat, setLat] = useState(48.8582449);
  const [lng, setLng] = useState(2.2923836);
  const [streetViewPanoramaOptions, setStreetViewPanoramaOptions] = useState({
    position: { lat, lng },
    pov: { heading: 92.21, pitch: 24.66 },
    zoom: 1,
    addressControl: false,
    imageDateControl: true,
    showRoadLabels: false,
  });
  const [viewport, setViewport] = useState({
    latitude: lat,
    longitude: lng,
    zoom: 10,
    bearing: 0,
    pitch: 0,
  });
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

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
      <div style={{ width: "49vw", height: "50vh", float: "left" }}>
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/dark-v10"
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          onViewportChange={setViewport}
        ></MapGL>
      </div>
      <div style={{ width: "49vw", height: "50vh", float: "left" }}>
        <button onClick={() => console.log("Guess")}>Guess</button>
        <button onClick={() => console.log("Next Round")}>Next Round</button>
        Score: {score} Round: {round}
        <div>Maximum score per round is 50,000</div>
      </div>
    </div>
  );
}

export default Play;
