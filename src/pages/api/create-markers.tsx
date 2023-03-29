import { dynamoDB } from "@/config/aws";
import fs from "fs";
import {
  createDynamoDBItemFromMarker,
  getCustomers,
  getMapboxIconNames,
} from "@/helpers/data";
import { NextApiRequest, NextApiResponse } from "next";
import { MarkerData, MarkerDynamoDBData } from "@/helpers/data-types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const customers = getCustomers();

  const markers: MarkerDynamoDBData[] = [];

  const mapboxIconNames = getMapboxIconNames();

  // Create random coordinates with random mapbox icon names
  console.log("Creating items");
  for (customerIndex in customers) {
    const customerName = customers[customerIndex].name;
    const numberOfSensors = customers[customerIndex].sensors;
    for (let i = 0; i < numberOfSensors; i++) {
      const newMarker: MarkerData = {
        markerId: i,
        icon: mapboxIconNames[
          Math.floor(Math.random() * mapboxIconNames.length)
        ],
        customerId: customerName,
        coordinates: {
          latitude: Math.random() * 180 - 90,
          longitude: Math.random() * 360 - 180,
        },
      };

      markers.push(createDynamoDBItemFromMarker(newMarker));
    }
  }

  // Format the coordinates to for DynamoDB batchWriteItem which has a limit of 25 items per request
  console.log("Formatting items for batchWriteItem");
  const batchSize = 25;
  const nMarkers = markers.length;
  const batches = [];
  for (let i = 0; i < nMarkers; i += batchSize) {
    // Check if the batch is the last batch
    // If it is, only take the remaining items
    let endIndex = i + batchSize;
    if (i + batchSize >= nMarkers) {
      endIndex = nMarkers;
    }

    const items = markers.slice(i, endIndex);

    const batch = {
      RequestItems: {
        "evoly-markers": items.map((item) => ({
          PutRequest: {
            Item: { ...item },
          },
        })),
      },
    };

    batches.push(batch);
  }

  // Write the coordinates to DynamoDB in batches
  console.log("Writing items to table");

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const result = dynamoDB.batchWriteItem(batch, (err, data) => {
      if (err) {
        console.error(`Error writing batch ${i} to DynamoDB`, err);
        return res
          .status(500)
          .json({ error: "Error writing markers to DynamoDB" });
      }
    });
  }

  // Clear the cache
  for (var customerIndex in customers) {
    fs.unlink(`./cache/${customers[customerIndex].name}.json`, (err) => {
      if (err) {
        console.error(`Error clearing cache for customer 1`, err);
      }
    });
  }
  console.log("Cache cleared");

  return res.status(200).json({ message: "Success" });
}
