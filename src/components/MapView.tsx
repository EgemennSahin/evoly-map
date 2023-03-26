import { useRef } from "react";
import { MapRef, Source, Layer, Map } from "react-map-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function App() {
  const mapRef = useRef<MapRef>(null);

  // TODO: change url to dynamoDB url
  const dataEndpoint =
    "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson";

  // TODO: change the marker icon to the point's icon which is stored in dynamoDB

  return (
    <>
      <Map
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 3,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        ref={mapRef}
      >
        <Source id="earthquakes" type="geojson" data={dataEndpoint}>
          <Layer
            id="earthquake-markers"
            type="symbol"
            layout={{
              "icon-image": "marker-15",
              "icon-allow-overlap": true,
              "icon-size": 2,
            }}
          />
        </Source>
      </Map>
    </>
  );
}
