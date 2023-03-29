import { useEffect, useRef, useState } from "react";
import { MapRef, Source, Layer, Map, Point } from "react-map-gl";
import { FeatureCollection, Geometry } from "geojson";
import Link from "next/link";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type PopupInfo = {
  x: string;
  y: string;
  markerId: number;
};

export default function MapView({
  coordinates,
  searchedMarkerId,
}: {
  coordinates: FeatureCollection<Geometry>;
  searchedMarkerId: number | null;
}) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 40.67,
    longitude: -103.59,
    zoom: 3,
  });

  useEffect(() => {
    if (searchedMarkerId) {
      const marker = coordinates.features.find(
        (f) => f.properties?.markerId === searchedMarkerId
      );
      if (marker && marker.geometry.type === "Point") {
        setViewState({
          latitude: marker.geometry.coordinates[1],
          longitude: marker.geometry.coordinates[0],
          zoom: 5,
        });
      }
    }
  }, [searchedMarkerId]);

  const optimizationRules = {
    minZoom: 1,
    maxZoom: 18,
    mapStyle: "mapbox://styles/mapbox/streets-v11?optimize=true",
    iconSize: 1,
  };

  function getMarker(point: Point) {
    const features = mapRef.current?.queryRenderedFeatures(point);
    // Find the feature that has a layer with the id "coordinates-markers"
    const feature = features?.find((f) => f.layer.id === "coordinates-markers");
    return feature;
  }

  return (
    <>
      <Map
        reuseMaps
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        maxZoom={optimizationRules.maxZoom}
        minZoom={optimizationRules.minZoom}
        mapStyle={optimizationRules.mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%", position: "relative" }}
        ref={mapRef}
        onDrag={(e) => {
          setPopupInfo(null);
        }}
        onZoom={(e) => {
          setPopupInfo(null);
        }}
        onClick={(e) => {
          // get the feature at the click
          const feature = getMarker(e.point);

          if (!feature) {
            setPopupInfo(null);
            return;
          }

          setPopupInfo({
            x: e.point.x + "px",
            y: e.point.y + "px",
            markerId: feature.properties?.markerId,
          });
        }}
        onMouseMove={(e) => {
          // get the feature at the mouse position
          const feature = getMarker(e.point);
          if (!feature) {
            if (mapRef.current) {
              mapRef.current.getCanvas().style.cursor = "";
            }
            return;
          }

          // Make the mouse cursor a pointer if the mouse is over a marker
          mapRef.current!.getCanvas().style.cursor = "pointer";
        }}
      >
        {popupInfo && (
          <div
            id="popup"
            className="bg-slate-100 pt-3 p-5 rounded-md absolute drop-shadow-xl flex flex-col gap-2"
            style={{ left: popupInfo.x, top: popupInfo.y }}
          >
            <button
              onClick={() => {
                setPopupInfo(null);
              }}
              className="self-end"
            >
              X
            </button>
            <span>
              Sensor {popupInfo.markerId} <br />
            </span>
            <Link
              target="_blank"
              className="bg-blue-200 hover:bg-blue-300 text-blue-900 p-2 rounded-md"
              href={`/sensor/${popupInfo.markerId}`}
            >
              Go to sensor page
            </Link>
          </div>
        )}

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
    </>
  );
}
