# evoly Waste Collection Sensor Map

This is a web application that displays the location of waste collection sensors on a map, and allows you to view information about each sensor by clicking on its icon. The application is built using **Next.js**, **TypeScript**, **DynamoDB**, **Mapbox GL** ([React component](https://visgl.github.io/react-map-gl/)), **TailwindCSS**, and **React**.

## Features

- Displays the location of waste collection sensors on a map.
- Retrieves sensor location, customer information, and icons from DynamoDB.
- Caches and saves the data for optimal speed.
- Allows you to select a customer and see the sensors associated with them.
- (Additional) Streamlines the Calendly demo process to keep users on the website

## Development Documentation

### Frontend

- Next.js is used to render the webpage on the serverside in order to speed up initial page load.
- React is used to create reusable components and manage the application's state.
- TailwindCSS is used for styling.

### Backend

- DynamoDB is used as the NoSQL database for the backend of the application.
- AWS SDK is used to interact with the DynamoDB tables.

### Mapping

- Mapbox GL is used for displaying interactive maps on the frontend.
- React-Map-Gl is used as the client-side React component for rendering the maps.
- Mapbox GL Styles are used to define the look and feel of the maps.

### Communication between frontend and backend

- The frontend communicates with the backend via API calls using NextJS's API routes.

### Deployment

- The application is deployed on Vercel, which also hosts the API routes as serverless functions.

### Optimization

Several optimization techniques were employed to ensure that the app runs smoothly and efficiently.

#### **Caching data**

The API's caching system which caches data from DynamoDB. This technique ensures that the initial loading speed of a set of coordinates is normal, and subsequent loading speeds are minimized by retrieving data from the cache.

This technique not only enhances the application's speed but also minimizes network costs since DynamoDB is only called once per coordinate set per user.

#### **Mapbox styling and parameters**

Another optimization technique used was setting the Mapview minZoom to 1 instead of 0. Setting the minZoom to 1 allows the user to see every part of the world, and prevents the user from seeing multiple icons, which would negatively affect performance. This approach doesn't restrict the user's ability but increases performance.

The mapstyle was also optimized by setting the "?optimize=true" parameter, which removes unused features in the style, making it lighter and faster to load.

Additionally, the iconSize was optimized to a size of 1, which was tested against sizes of 0.5, 0.85, 1, 1.5, and 2. This size was found to be the optimal size, balancing visibility and performance.

#### **Database schema**

Finally, the DynamoDB table was optimized by setting the customerId as the sort key. This approach ensures that only data for the customer is queried, which removes the need to download the entire dataset and filter out the customer's data.

## Getting Started

To view the deployed project, go [here](https://egemen-sahin-evoly-assessment.vercel.app/).

To run this project on your local machine, follow these steps:

1.  Clone the repository to your local machine with

        git clone https://github.com/EgemennSahin/evoly-map.git

2.  Install the required packages with

        npm install

3.  Start the development server with

        npm run dev

4.  Open your browser and navigate to http://localhost:3000.

## Usage

1. After running the application, you will see a landing page with information about the service. From here, you can click on the "See our map of sensors" button to navigate to the map view. Additionally, you can click on "Book a demo" to check out the Calendly implementation.
2. On the map view, you will see a map of the world with sensor icons displayed on it.
3. Use the buttons above the map to select a customer and see their sensors. The number of sensors displayed will change based on the selected customer.
