import { dynamoDB } from "@/config/aws";
import fs from "fs";
import { createGeoJSONFromMarkers } from "@/helpers/data";
import AWS from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { MarkerData } from "@/helpers/data-types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing body parameter" });
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
        FilterExpression: "customerId = :customerId",
        ExpressionAttributeValues: {
          ":customerId": { S: customerId },
        },
      };

      return dynamoDB.scan(params, (err, data) => {
        if (err) {
          console.error("Error getting customer data from DynamoDB", err);
          return res
            .status(500)
            .json({ error: "Error getting customer data from DynamoDB" });
        }

        // Unmarshall the data from DynamoDB's format to JSON
        const customerData = data.Items?.map((item) => {
          return AWS.DynamoDB.Converter.unmarshall(item);
        }) as MarkerData[];

        const geoJson = createGeoJSONFromMarkers(customerData);

        // Check if the cache directory exists
        fs.access("./cache", (err) => {
          if (err && err.code === "ENOENT") {
            // If the cache directory doesn't exist, create it
            fs.mkdir("./cache", (err) => {
              if (err && err.code !== "EEXIST") {
                console.error("Error creating cache directory", err);
              }
            });
          }
        });

        // Cache the data
        fs.writeFile(
          `./cache/${customerId}.json`,
          JSON.stringify(geoJson),
          (err) => {
            if (err) {
              console.error(
                `Error caching data for customer ${customerId}`,
                err
              );
            }
          }
        );

        return res.status(200).json(geoJson);
      });
    });
  });
}
