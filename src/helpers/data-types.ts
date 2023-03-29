export type MarkerData = {
  markerId: number;
  customerId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  icon: string;
};

// DynamoDB formatting for coordinates
// S = string
// M = map
// N = number
export type MarkerDynamoDBData = {
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
};

export type PopupInfo = {
  x: string;
  y: string;
  markerId: number;
};
