import MapView from "@/components/map-view";
import { NavBar } from "@/components/nav-bar";
import { FeatureCollection, Geometry } from "geojson";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function MapPage() {
  const numberOptions = [
    "Customer 1",
    "Customer 2",
    "Customer 3",
    "Customer 4",
  ];
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const [coordinateData, setCoordinateData] = useState<
    FeatureCollection<Geometry>
  >({ type: "FeatureCollection", features: [] });

  useEffect(() => {
    async function getMarkers(customerId: string) {
      console;
      const res = await fetch("/api/get-markers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
        }),
      });
      const data = await res.json();
      setCoordinateData(data);
    }

    function getCustomerIdFromIndex(index: number) {
      return `customer-${index + 1}`;
    }

    getMarkers(getCustomerIdFromIndex(selectedOption)).catch(console.error);
  }, [selectedOption]);

  return (
    <>
      <Head>
        <title>Sensors view - evoly</title>
        <meta name="description" content="See your sensors around the world" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />

      <main className="flex flex-col h-screen items-center pt-24">
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
                } p-2 rounded-md flex flex-col items-center`}
                key={index}
                onClick={() => setSelectedOption(index)}
              >
                <span className="text-slate-800">{option}</span>
              </button>
            ))}
          </div>

          <span className="text-slate-700">
            {10 ** (selectedOption + 1)} sensors
          </span>
        </div>

        <div className="w-5/6 h-full rounded-md drop-shadow-xl">
          <MapView coordinates={coordinateData} />
        </div>
      </main>
    </>
  );
}
