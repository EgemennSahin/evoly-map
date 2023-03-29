export interface MarkerData {
  markerId: number;
  customerId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  icon: string;
}

// DynamoDB formatting for coordinates
// S = string
// M = map
// N = number
export interface MarkerDynamoDBData {
  markerId: {
    N: string;
  };
  icon: {
    S: string;
  };
  ["customerId"]: {
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
}
