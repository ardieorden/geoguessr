import Head from "next/head";
import React, { useState } from "react";
import ReactStreetview from "../components/ReactStreetview";
import MapGL, { Marker } from "react-map-gl";
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
  const [lat, setLat] = useState(48.8618442);
  const [lng, setLng] = useState(2.2985373);
  const [streetViewPanoramaOptions, setStreetViewPanoramaOptions] = useState({
    position: { lat: 48.8618442, lng: 2.2985373 },
    pov: { heading: 253.48, pitch: -13.72 },
    zoom: 1,
    addressControl: false,
    imageDateControl: true,
    showRoadLabels: false,
  });
  const [viewport, setViewport] = useState({
    latitude: 30,
    longitude: 0,
    zoom: 1,
  });
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  async function submitGuess(pointerEvent) {
    let roundScore = await calculateScore(pointerEvent);

    if (round === 1) {
      setLat(37.8063508);
      setLng(-122.4744337);
      setStreetViewPanoramaOptions({
        position: { lat: 37.8044682, lng: -122.471869 },
        pov: { heading: 285.7, pitch: -9.69 },
        zoom: 1,
        addressControl: false,
        imageDateControl: true,
        showRoadLabels: false,
      });
    } else if (round === 2) {
      setLat(14.5802283);
      setLng(120.9771238);
      setStreetViewPanoramaOptions({
        position: { lat: 14.5802283, lng: 120.9771238 },
        pov: { heading: 329.54, pitch: 0.62 },
        zoom: 1,
        addressControl: false,
        imageDateControl: true,
        showRoadLabels: false,
      });
    } else if (round === 3) {
      setLat(51.5030724);
      setLng(-0.1376183);
      setStreetViewPanoramaOptions({
        position: { lat: 51.5030724, lng: -0.1376183 },
        pov: { heading: 227.02, pitch: 0.01 },
        zoom: 1,
        addressControl: false,
        imageDateControl: true,
        showRoadLabels: false,
      });
    } else if (round === 4) {
      setLat(35.7110421);
      setLng(139.8039924);
      setStreetViewPanoramaOptions({
        position: { lat: 35.7110421, lng: 139.8039924 },
        pov: { heading: 114.46, pitch: -0.8 },
        zoom: 1,
        addressControl: false,
        imageDateControl: true,
        showRoadLabels: false,
      });
    }

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
    return [pointerEvent.lngLat[1], pointerEvent.lngLat[0]];
  }

  return (
    <div>
      <Head>
        <title>GeoGuessr Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: "50vw", height: "100vh", float: "left" }}>
        {round === 1 ? (
          <ReactStreetview
            apiKey={process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY}
            streetViewPanoramaOptions={streetViewPanoramaOptions}
          />
        ) : null}
        {round === 2 ? (
          <ReactStreetview
            apiKey={process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY}
            streetViewPanoramaOptions={streetViewPanoramaOptions}
          />
        ) : null}
        {round === 3 ? (
          <ReactStreetview
            apiKey={process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY}
            streetViewPanoramaOptions={streetViewPanoramaOptions}
          />
        ) : null}
        {round === 4 ? (
          <ReactStreetview
            apiKey={process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY}
            streetViewPanoramaOptions={streetViewPanoramaOptions}
          />
        ) : null}
        {round === 5 ? (
          <ReactStreetview
            apiKey={process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY}
            streetViewPanoramaOptions={streetViewPanoramaOptions}
          />
        ) : null}
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
        >
          {round > 1 ? (
            <Marker
              latitude={48.8618442}
              longitude={2.2985373}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <span>Round 1 - Eiffel Tower</span>
            </Marker>
          ) : null}
          {round > 2 ? (
            <Marker
              latitude={37.8063508}
              longitude={-122.4744337}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <span>Round 2 - Golden Gate Bridge</span>
            </Marker>
          ) : null}
          {round > 3 ? (
            <Marker
              latitude={14.5802283}
              longitude={120.9771238}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <span>Round 3 - Rizal Monument</span>
            </Marker>
          ) : null}
          {round > 4 ? (
            <Marker
              latitude={51.5030724}
              longitude={-0.1376183}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <span>Round 4 - Buckingham Palace</span>
            </Marker>
          ) : null}
          {round > 5 ? (
            <Marker
              latitude={35.7110421}
              longitude={139.8039924}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <span>Round 5 - Tokyo Skytree</span>
            </Marker>
          ) : null}
        </MapGL>
      </div>
      {round < 6 ? (
        <div style={{ width: "49vw", height: "50vh", float: "left" }}>
          <button onClick={() => console.log("Guess")}>Guess</button>
          <button onClick={() => console.log("Next Round")}>Next Round</button>
          Score: {formatNumber(score)} Round: {round}
          <div>Maximum score per round is 50,000</div>
        </div>
      ) : (
        <div>
          That&rsquo;s all for now! <br />
          Final Score: {formatNumber(score)}
        </div>
      )}
    </div>
  );
}

export default Play;
