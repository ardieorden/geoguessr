import Head from 'next/head'
import React from 'react';
import ReactStreetview from '../components/ReactStreetview';

// see https://developers.google.com/maps/documentation/javascript/3.exp/reference#StreetViewPanoramaOptions
const streetViewPanoramaOptions = {
  position: {lat: 48.8582449, lng: 2.2923836},
  pov: {heading: 92.21, pitch: 24.66},
  zoom: 1
};

function Play() {
  return (
    <div>
        <Head>
            <title>GeoGuessr Clone</title>
            <link rel="icon" href="/favicon.ico" />"
        </Head>
        <div style={{width: '80vw', height: '100vh', float: 'left'}}>
            <ReactStreetview
                apiKey={process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY}
                streetViewPanoramaOptions={streetViewPanoramaOptions}
            />
        </div>
        <div style={{width: '20vw', height: '100vh', float: 'right'}}>
            hello
        </div>
    </div>
  );
}

export default Play
