// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dynamoDB } from "@/config/aws";
import AWS from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get marker data from DynamoDB
  const params = {
    TableName: "evoly-markers",
  };

  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error("Error getting markers from DynamoDB", err);
      return res
        .status(500)
        .json({ error: "Error getting markers from DynamoDB" });
    } else {
      if (!data.Items) {
        return res.status(200).json([]);
      }

      // Unmarshall the data from DynamoDB's format to JSON
      const markers = data.Items.map((item) => {
        return AWS.DynamoDB.Converter.unmarshall(item);
      });

      return res.status(200).json(markers);
    }
  });
}
