import { dynamoDB } from "@/config/aws";
import fs from "fs";
import { getMapboxIconNames } from "@/helpers/data";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { numberOfMarkers } = req.body;

  if (!numberOfMarkers) {
    return res.status(400).json({ error: "Missing body parameter" });
  }

  // DynamoDB formatting for coordinates
  // S = string
  // M = map
  // N = number
  const markers: {
    icon: {
      S: string;
    };
    customerId: {
      S: string;
    };
    coordinates: {
      M: {
        latitude: {
          N: string;
        };
        longitude: {
          N: string;
        };
      };
    };
  }[] = [];

  const mapboxIconNames = getMapboxIconNames();

  console.log("Creating items");
  var currCustomer = "";
  // Create random coordinates with random mapbox icon names
  // The coordinates are fixed to 6 decimal places to optimize DynamoDB storage and Mapbox rendering while still being accurate enough
  for (let i = 0; i < parseInt(numberOfMarkers as string); i++) {
    // Create a customer id for each set of coordinates
    // This is hardcoded to 11110 coordinates for 4 customers in total
    if (i >= 1110) {
      currCustomer = "customer-4";
    } else if (i >= 110) {
      currCustomer = "customer-3";
    } else if (i >= 10) {
      currCustomer = "customer-2";
    } else {
      currCustomer = "customer-1";
    }

    markers.push({
      icon: {
        S: mapboxIconNames[Math.floor(Math.random() * mapboxIconNames.length)],
      },
      customerId: {
        S: currCustomer,
      },
      coordinates: {
        M: {
          latitude: {
            N: (Math.random() * 180 - 90).toFixed(6).toString(),
          },
          longitude: {
            N: (Math.random() * 360 - 180).toFixed(6).toString(),
          },
        },
      },
    });
  }

  console.log("Formatting items");
  // Format the coordinates to for DynamoDB batchWriteItem which has a limit of 25 items per request
  const batchSize = 25;
  const batches = [];
  for (let i = 0; i < parseInt(numberOfMarkers as string); i += batchSize) {
    const items = markers.slice(i, i + batchSize);

    const batch = {
      RequestItems: {
        "evoly-markers": items.map((item, index) => ({
          PutRequest: {
            Item: {
              ["markerId"]: {
                N: `${i + index}`,
              },
              ...item,
            },
          },
        })),
      },
    };
    batches.push(batch);
  }

  console.log("Writing items to table");
  // Write the coordinates to DynamoDB in batches
  Promise.all(batches.map((batch) => dynamoDB.batchWriteItem(batch).promise()))
    .then(() => console.log("Items written to table"))
    .catch((err) => console.error(err));

  // Clear the cache
  fs.unlink(`./cache/`, (err) => {
    if (err) {
      console.error(`Error clearing cache for customers`, err);
    }
  });

  return res.status(200).json({ message: "Success" });
}
