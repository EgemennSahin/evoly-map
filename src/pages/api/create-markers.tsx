// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dynamoDB } from "@/config/aws";
import { getMapboxIconNames } from "@/helpers/data";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create 10, 100, 1000, 10000 coordinates depending on the query parameter
  const { numberOfCoordinates } = req.query;

  if (!numberOfCoordinates) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

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

  for (let i = 0; i < parseInt(numberOfCoordinates as string); i++) {
    markers.push({
      icon: {
        S: mapboxIconNames[Math.floor(Math.random() * mapboxIconNames.length)],
      },
      coordinates: {
        M: {
          latitude: {
            N: (Math.random() * 180 - 90).toString(),
          },
          longitude: {
            N: (Math.random() * 360 - 180).toString(),
          },
        },
      },
    });
  }

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

  Promise.all(batches.map((batch) => dynamoDB.batchWriteItem(batch).promise()))
    .then(() => console.log("Items written to table"))
    .catch((err) => console.error(err));
}
