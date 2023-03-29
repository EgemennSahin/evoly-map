import { dynamoDB } from "@/config/aws";
import { createGeoJSONFromMarkers } from "@/helpers/data";
import AWS from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { MarkerData } from "@/helpers/data-types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing body parameter" });
  }

  // This will cache the response for 2 minutes
  // This is after the customerId is checked so that the client can fix the error and make a new request
  // Caching is useful for the client to not make a request to dynamoDB every time the user changes coordinate sets
  res.setHeader("Cache-Control", "public, s-maxage=120");

  const params = {
    TableName: "evoly-markers",
    FilterExpression: "customerId = :customerId",
    ExpressionAttributeValues: {
      ":customerId": { S: customerId },
    },
  };

  return new Promise((resolve, reject) => {
    dynamoDB.scan(params, (err, data) => {
      if (err) {
        console.error("Error getting customer data from DynamoDB", err);
        reject(
          res
            .status(500)
            .json({ error: "Error getting customer data from DynamoDB" })
        );
      }

      // Unmarshall the data from DynamoDB's format to JSON
      const customerData = data.Items?.map((item) => {
        return AWS.DynamoDB.Converter.unmarshall(item);
      }) as MarkerData[];

      const geoJson = createGeoJSONFromMarkers(customerData);

      resolve(res.status(200).json(geoJson));
    });
  });
}
