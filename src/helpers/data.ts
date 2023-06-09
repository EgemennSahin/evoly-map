import { Feature, FeatureCollection, Geometry } from "geojson";
import { MarkerData, MarkerDynamoDBData } from "./data-types";

// Mapbox GL JS requires a FeatureCollection of GeoJSON features, so we need to convert our data to that format
export function createGeoJSONFromMarkers(
  markers: MarkerData[]
): FeatureCollection<Geometry> {
  const features: Feature<Geometry>[] = markers.map((item) => ({
    type: "Feature",
    properties: {
      markerId: item.markerId,
      icon: item.icon,
    },
    geometry: {
      type: "Point",
      coordinates: [item.coordinates.longitude, item.coordinates.latitude],
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

// The coordinates are fixed to 6 decimal places to optimize DynamoDB storage and Mapbox rendering while still being accurate enough
export function createDynamoDBItemFromMarker(
  item: MarkerData
): MarkerDynamoDBData {
  return {
    markerId: { N: item.markerId.toString() },
    icon: { S: item.icon },
    coordinates: {
      M: {
        latitude: { N: item.coordinates.latitude.toFixed(6) },
        longitude: { N: item.coordinates.longitude.toFixed(6) },
      },
    },
    ["customerId"]: { S: item.customerId },
  };
}

export function getCustomers() {
  return [
    {
      name: "customer-1",
      sensors: 10,
    },
    {
      name: "customer-2",
      sensors: 100,
    },
    {
      name: "customer-3",
      sensors: 1000,
    },
    {
      name: "customer-4",
      sensors: 10000,
    },
  ];
}

export function getMapboxIcons() {
  // This data comes from https://github.com/mapbox/mapbox-gl-styles/tree/master/sprites/basic-v8/_svg
  // There is no other way to get this data from Mapbox GL JS, so I scraped it from their website
  // Furthermore, the following icons were removed from the list because they are not available:
  const invalidIcons = new Set([
    "america-football-15",
    "baseball-15",
    "bicycle-share-15",
    "bus-15",
    "circle-stroked-15",
    "circle-15",
    "sushi-15",
    "star-15",
    "rail-metro-15",
    "triangle-stroked-15",
    "rail-light-15",
    "ferry-15",
    "rail-15",
    "triangle-15",
    "hairdresser-15",
  ]);

  const allIcons = [
    "airfield-15",
    "airport-15",
    "alcohol-shop-15",
    "amusement-park-15",
    "aquarium-15",
    "art-gallery-15",
    "attraction-15",
    "bakery-15",
    "bank-15",
    "bar-15",
    "basketball-15",
    "beer-15",
    "bicycle-15",
    "cafe-15",
    "campsite-15",
    "car-15",
    "castle-15",
    "cemetery-15",
    "cinema-15",
    "clothing-store-15",
    "college-15",
    "dentist-15",
    "doctor-15",
    "dog-park-15",
    "drinking-water-15",
    "embassy-15",
    "fast-food-15",
    "fire-station-15",
    "fuel-15",
    "garden-15",
    "golf-15",
    "grocery-15",
    "harbor-15",
    "heliport-15",
    "hospital-15",
    "ice-cream-15",
    "information-15",
    "laundry-15",
    "library-15",
    "lodging-15",
    "marker-15",
    "monument-15",
    "mountain-15",
    "museum-15",
    "music-15",
    "park-15",
    "pharmacy-15",
    "picnic-site-15",
    "place-of-worship-15",
    "playground-15",
    "police-15",
    "post-15",
    "prison-15",
    "religious-christian-15",
    "religious-jewish-15",
    "religious-muslim-15",
    "restaurant-15",
    "rocket-15",
    "school-15",
    "shop-15",
    "stadium-15",
    "suitcase-15",
    "swimming-15",
    "theatre-15",
    "toilet-15",
    "town-hall-15",
    "veterinary-15",
    "volcano-15",
    "zoo-15",
  ];

  return allIcons;
}
