# Weather App

A simple and modern weather application that provides weather information.

## Features

- Current weather conditions
- Temperature display (Celsius/Fahrenheit)
- Location-based weather data (via geolocation)
- Responsive and mobile-friendly design

## Technologies

- **Frontend:** Next.js, Vite, Tailwind CSS, TypeScript
- **Backend:** NestJS, TypeScript
- **API:** OpenWeatherMap

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0 or later
- [Yarn](https://yarnpkg.com/) package manager
- [Docker](https://www.docker.com/) (optional, for Docker setup)

### Local Development

#### 1. Start the Backend

```bash
cd backend
yarn install
yarn dev
```

#### 1. Start the Frontend

```bash
cd frontend
yarn install
yarn dev
```

Both the frontend and backend servers will now be running locally.

### Docker Compose

Alternatively, you can run the entire application using Docker Compose:

```bash
docker-compose up -d --build
```

This command will spin up both the frontend and backend services in detached mode.

### Environment Variables

Before running, make sure to configure environment variables for both the backend and frontend.
