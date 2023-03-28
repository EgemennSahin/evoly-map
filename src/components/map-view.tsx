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

  const optimizationRules = {
    minZoom: 1,
    maxZoom: 18,
    mapStyle: "mapbox://styles/mapbox/streets-v11?optimize=true",
    iconSize: 1,
  };

  return (
    <Map
      reuseMaps
      initialViewState={{
        latitude: 40.67,
        longitude: -103.59,
        zoom: 3,
      }}
      maxZoom={optimizationRules.maxZoom}
      minZoom={optimizationRules.minZoom}
      mapStyle={optimizationRules.mapStyle}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ width: "100%", height: "100%" }}
      ref={mapRef}
    >
      <Source id="coordinates" type="geojson" data={coordinates}>
        <Layer
          id="coordinates-markers"
          type="symbol"
          layout={{
            "icon-image": ["get", "icon"],
            "icon-allow-overlap": true,
            "icon-size": optimizationRules.iconSize,
          }}
        />
      </Source>
    </Map>
  );
}
