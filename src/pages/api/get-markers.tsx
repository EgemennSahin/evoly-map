import { dynamoDB } from "@/config/aws";
import fs from "fs";
import { createGeoJSONFromMarkers, MarkerData } from "@/helpers/data";
import AWS from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  return new Promise((resolve, reject) => {
    fs.readFile(`./cache/${customerId}.json`, "utf-8", (err, data) => {
      if (!err) {
        // Convert the data to JSON
        const customerData = JSON.parse(data);
        return res.status(200).json(customerData);
      }

      const params = {
        TableName: "evoly-markers",
        IndexName: "customerId-index",
        KeyConditionExpression: "customerId = :customerId",
        ExpressionAttributeValues: {
          ":customerId": { S: customerId },
        },
      };

      return dynamoDB.query(params, (err, data) => {
        if (err) {
          console.error("Error getting customer data from DynamoDB", err);
          return res
            .status(500)
            .json({ error: "Error getting customer data from DynamoDB" });
        } else {
          if (!data.Items) {
            return res
              .status(200)
              .json({ type: "FeatureCollection", features: [] });
          }

          // Unmarshall the data from DynamoDB's format to JSON
          const customerData = data.Items.map((item) => {
            return AWS.DynamoDB.Converter.unmarshall(item);
          }) as MarkerData[];

          const geoJson = createGeoJSONFromMarkers(customerData);

          // Cache the data
          fs.writeFile(
            `./cache/${customerId}.json`,
            JSON.stringify(geoJson),
            (err) => {
              if (err) {
                if (err.code === "ENOENT") {
                  // If the cache file doesn't exist, create the cache directory
                  fs.mkdir("./cache", (err) => {
                    if (err && err.code !== "EEXIST") {
                      console.error("Error creating cache directory", err);
                    }
                  });
                } else {
                  console.error(
                    `Error caching data for customer ${customerId}`,
                    err
                  );
                }
              }
            }
          );

          return res.status(200).json(geoJson);
        }
      });
    });
  });
}
