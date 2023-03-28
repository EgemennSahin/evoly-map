import MapView from "@/components/MapView";
import { createGeoJSONFromMarkers } from "@/helpers/data";
import { FeatureCollection, Geometry } from "geojson";

export default function HomePage({
  coordinates,
}: {
  coordinates: FeatureCollection<Geometry>;
}) {
  return (
    <div>
      <h1>Map with points on coordinates</h1>
      <button
        onClick={async () => {
          await fetch(
            "http://localhost:3000/api/create-markers?numberOfCoordinates=10",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }}
      >
        Create 10 markers
      </button>
      <MapView coordinates={coordinates} />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const res = await fetch("http://localhost:3000/api/get-markers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  const coordinates = createGeoJSONFromMarkers(data);
  console.log(coordinates);

  return {
    props: {
      coordinates,
    },
  };
}
