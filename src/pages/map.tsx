import MapView from "@/components/map-view";
import { FeatureCollection, Geometry } from "geojson";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function MapPage() {
  // Each customer has a different coordinate set and a different number of sensors ranging from 10 to 10000
  const customerOptions = [
    "Customer 1",
    "Customer 2",
    "Customer 3",
    "Customer 4",
  ];

  // The selected option is the index of the customerOptions array
  const [selectedOption, setSelectedOption] = useState<number>(0);

  // The searched marker id is the id of the marker that the user searched for
  const [searchedMarkerId, setSearchedMarkerId] = useState<number | null>(null);

  // The coordinate data is the set of coordinates that is used to render the markers on the map
  const [coordinateData, setCoordinateData] = useState<
    FeatureCollection<Geometry>
  >({ type: "FeatureCollection", features: [] });

  // When the selected option changes, fetch the new coordinates
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

      <main className="flex flex-col h-screen items-center pt-24">
        <div className="flex flex-col gap-4 p-8 items-center justify-start ">
          <h1 className="text-4xl">Our deployed sensors</h1>
          <p className="text-slate-800">
            This is a map of all our deployed sensors. The number of sensors
            shown can be changed using the buttons below. <br /> Click on a
            marker to see more information about the sensor.
          </p>
          <div className="flex gap-4 justify-between">
            {customerOptions.map((option, index) => (
              <button
                className={`${
                  selectedOption === index
                    ? "bg-teal-400"
                    : "bg-slate-200 hover:bg-slate-300"
                } p-2 rounded-md flex flex-col items-center`}
                key={index}
                onClick={() => {
                  if (selectedOption === index) return;

                  // Get the input element and reset it's value
                  const input = document.querySelector("input");
                  if (input) {
                    input.value = "";
                  }

                  setSelectedOption(index);
                }}
              >
                <span className="text-slate-800">{option}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between w-96">
            <span className="text-slate-700">
              {coordinateData.features.length} sensors
            </span>
            <input
              placeholder="Search sensor by id"
              className="w-44 h-10 rounded-md shadow-inner border-2 border-slate-200 text-center"
              type="number"
              min={0}
              max={coordinateData.features.length}
              onChange={(event) => {
                // Wait for the user to finish typing
                setTimeout(() => {
                  setSearchedMarkerId(parseInt(event.target.value));
                }, 500);
              }}
            />
          </div>
        </div>

        <div className="w-5/6 h-full rounded-md drop-shadow-xl">
          <MapView
            searchedMarkerId={searchedMarkerId}
            coordinates={coordinateData}
          />
        </div>
      </main>
    </>
  );
}
