import Head from "next/head";
import React, { useState } from "react";
import ReactStreetview from "../components/ReactStreetview";
import MapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
// There's a bug with mapbox-gl@2.1.1 and the code below fixes it (https://github.com/mapbox/mapbox-gl-js/issues/10173)
// This code requires worker-loader@^3.0.0 which requires webpack@^4.0.0
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

// Distance between two lat/lng coordinates in km using the Haversine formula
// Copyright 2016, Chris Youderian, SimpleMaps, http://simplemaps.com/resources/location-distance
// Released under MIT license - https://opensource.org/licenses/MIT
function getDistanceFromLatLng(lat1, lng1, lat2, lng2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  function square(x) {
    return Math.pow(x, 2);
  }
  var r = 6371; // radius of the earth in km
  lat1 = deg2rad(lat1);
  lat2 = deg2rad(lat2);
  var lat_dif = lat2 - lat1;
  var lng_dif = deg2rad(lng2 - lng1);
  var a =
    square(Math.sin(lat_dif / 2)) +
    Math.cos(lat1) * Math.cos(lat2) * square(Math.sin(lng_dif / 2));
  var d = 2 * r * Math.asin(Math.sqrt(a));
  return d;
}

// Taken from https://blog.abelotech.com/posts/number-currency-formatting-javascript/
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function Play() {
  const [lat, setLat] = useState(48.8582449);
  const [lng, setLng] = useState(2.2923836);
  const [guessLat, setGuessLat] = useState();
  const [guessLng, setGuessLng] = useState();
  const [streetViewPanoramaOptions, setStreetViewPanoramaOptions] = useState({
    position: { lat, lng },
    pov: { heading: 92.21, pitch: 24.66 },
    zoom: 1,
    addressControl: false,
    imageDateControl: true,
    showRoadLabels: false,
  });
  const [viewport, setViewport] = useState({
    latitude: 30,
    longitude: 0,
    zoom: 1,
    bearing: 0,
    pitch: 0,
  });
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  async function submitGuess(pointerEvent) {
    let roundScore = await calculateScore(pointerEvent);
    setScore(score + Math.round(roundScore));
    setRound(round + 1);
  }

  async function calculateScore(pointerEvent) {
    let coords = await setGuess(pointerEvent);
    let distance = getDistanceFromLatLng(lat, lng, coords[0], coords[1]);

    if ((distance === 0) | (distance <= 1)) {
      return 50000;
    } else if ((distance > 1) & (distance <= 500)) {
      return (1 / distance) * 50000;
    } else if (distance > 500) {
      return 0;
    } else {
      console.log("distance is NaN");
    }
  }

  async function setGuess(pointerEvent) {
    setGuessLat(pointerEvent.lngLat[1]);
    setGuessLng(pointerEvent.lngLat[0]);
    return [pointerEvent.lngLat[1], pointerEvent.lngLat[0]];
  }

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
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          onViewportChange={setViewport}
          onClick={(pointerEvent) => submitGuess(pointerEvent)}
        ></MapGL>
      </div>
      <div style={{ width: "49vw", height: "50vh", float: "left" }}>
        <button onClick={() => console.log("Guess")}>Guess</button>
        <button onClick={() => console.log("Next Round")}>Next Round</button>
        Score: {formatNumber(score)} Round: {round}
        <div>Maximum score per round is 50,000</div>
      </div>
    </div>
  );
}

export default Play;
