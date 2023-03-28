import MapView from "@/components/map-view";
import { NavBar } from "@/components/nav-bar";
import { createGeoJSONFromMarkers } from "@/helpers/data";
import { FeatureCollection, Geometry } from "geojson";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage({
  coordinates,
}: {
  coordinates: FeatureCollection<Geometry>;
}) {
  const numberOptions = [10, 100, 1000, 10000];
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const [coordinateData, setCoordinateData] =
    useState<FeatureCollection<Geometry>>(coordinates);

  useEffect(() => {
    const newCoordinates = {
      type: coordinates.type,
      features: coordinates.features.slice(
        numberOptions[selectedOption - 1] || 0,
        numberOptions[selectedOption]
      ),
    };
    setCoordinateData(newCoordinates);
  }, [selectedOption]);

  return (
    <>
      <Head>
        <title>evoly</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />

      <main className="flex flex-col h-screen gap-2 items-center pt-24">
        <div className="flex flex-col gap-4 p-8 items-center justify-start ">
          <h1 className="text-4xl">Our deployed sensors</h1>
          <p className="text-slate-800">
            This is a map of all our deployed sensors. The number of sensors
            shown can be changed using the buttons below.
          </p>
          <div className="flex gap-4 justify-between">
            {numberOptions.map((option, index) => (
              <button
                className={`${
                  selectedOption === index
                    ? "bg-teal-400"
                    : "bg-slate-200 hover:bg-slate-300"
                } p-2 rounded-md`}
                key={index}
                onClick={() => setSelectedOption(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="w-5/6 h-full rounded-md drop-shadow-xl">
          <MapView coordinates={coordinateData} />
        </div>
      </main>
    </>
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

  return {
    props: {
      coordinates,
    },
  };
}
