import { dynamoDB } from "@/config/aws";
import { getMapboxIconNames } from "@/helpers/data";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create 10, 100, 1000, 10000 coordinates depending on the query parameter
  const { numberOfCoordinates } = req.query;

  if (!numberOfCoordinates) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  // DynamoDB formatting for coordinates
  // S = string
  // M = map
  // N = number
  const markers: {
    icon: {
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

  // Create random coordinates with random mapbox icon names
  // The coordinates are fixed to 6 decimal places to optimize DynamoDB storage and Mapbox rendering while still being accurate enough
  for (let i = 0; i < parseInt(numberOfCoordinates as string); i++) {
    markers.push({
      icon: {
        S: mapboxIconNames[Math.floor(Math.random() * mapboxIconNames.length)],
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

  // Format the coordinates to for DynamoDB batchWriteItem which has a limit of 25 items per request
  const batchSize = 25;
  const batches = [];
  for (let i = 0; i < markers.length; i += batchSize) {
    const items = markers.slice(i, i + batchSize);
    const batch = {
      RequestItems: {
        "evoly-markers": items.map((item, index) => ({
          PutRequest: {
            Item: {
              ["id"]: {
                N: `${i * batchSize + index + 1}`,
              },
              ...item,
            },
          },
        })),
      },
    };
    batches.push(batch);
  }

  // Write the coordinates to DynamoDB in batches
  Promise.all(batches.map((batch) => dynamoDB.batchWriteItem(batch).promise()))
    .then(() => console.log("Items written to table"))
    .catch((err) => console.error(err));
}
