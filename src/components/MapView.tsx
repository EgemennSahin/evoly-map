import { useRef } from "react";
import { MapRef, Source, Layer, Map } from "react-map-gl";
import { FeatureCollection, Geometry } from "geojson";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapView({
  coordinates,
}: {
  coordinates: FeatureCollection<Geometry>;
}) {
  const mapRef = useRef<MapRef>(null);

  // Sort out the coordinates according to their icon

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
        <Source id="earthquakes" type="geojson" data={coordinates}>
          <Layer
            id="earthquake-markers"
            type="symbol"
            layout={{
              "icon-image": ["get", "icon"],
              "icon-allow-overlap": true,
              "icon-size": 2,
            }}
          />
        </Source>
      </Map>
    </>
  );
}
