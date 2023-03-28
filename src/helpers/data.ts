import { Feature, FeatureCollection, Geometry } from "geojson";

export interface MarkerData {
  id: number;
  customerId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  icon: string;
}

// Mapbox GL JS requires a FeatureCollection of GeoJSON features, so we need to convert our data to that format
export function createGeoJSONFromMarkers(
  markers: MarkerData[]
): FeatureCollection<Geometry> {
  const features: Feature<Geometry>[] = markers.map((item) => ({
    type: "Feature",
    properties: {
      id: item.id,
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

export function getMapboxIconNames() {
  // This data comes from https://github.com/mapbox/mapbox-gl-styles/tree/master/sprites/basic-v8/_svg
  // There is no other way to get this data from Mapbox GL JS, so I scraped it from their website
  return [
    "airfield-15",
    "airport-15",
    "alcohol-shop-15",
    "america-football-15",
    "amusement-park-15",
    "aquarium-15",
    "art-gallery-15",
    "attraction-15",
    "bakery-15",
    "bank-15",
    "bar-15",
    "baseball-15",
    "basketball-15",
    "beer-15",
    "bicycle-15",
    "bicycle-share-15",
    "bus-15",
    "cafe-15",
    "campsite-15",
    "car-15",
    "castle-15",
    "cemetery-15",
    "cinema-15",
    "circle-15",
    "circle-stroked-15",
    "clothing-store-15",
    "college-15",
    "dentist-15",
    "doctor-15",
    "dog-park-15",
    "drinking-water-15",
    "embassy-15",
    "fast-food-15",
    "ferry-15",
    "fire-station-15",
    "fuel-15",
    "garden-15",
    "golf-15",
    "grocery-15",
    "hairdresser-15",
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
    "rail-15",
    "rail-light-15",
    "rail-metro-15",
    "religious-christian-15",
    "religious-jewish-15",
    "religious-muslim-15",
    "restaurant-15",
    "rocket-15",
    "school-15",
    "shop-15",
    "stadium-15",
    "star-15",
    "suitcase-15",
    "sushi-15",
    "swimming-15",
    "theatre-15",
    "toilet-15",
    "town-hall-15",
    "triangle-15",
    "triangle-stroked-15",
    "veterinary-15",
    "volcano-15",
    "zoo-15",
  ];
}
