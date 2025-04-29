# Weather App Frontend

This is a modern weather application built with [Next.js](https://nextjs.org), providing real-time weather information with a clean and intuitive interface.

## Features

- Real-time weather data display
- Location-based weather forecasts
- Responsive design for all devices
- Dark/Light mode support
- Interactive weather maps

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- Docker (optional, for containerized deployment)
- npm or yarn package manager

### Environment Setup

1. Clone the repository:

````bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app

2. Create a .env.local file in the root directory:
```bash
cp .env.example .env.local
````

3. Install dependencies:

```bash
yarn install
```

### Running Locally

1. Start the development server:

```bash
yarn dev
```

2. Open http://localhost:3000 in your browser.

### Building for Production

1. Create a production build:

```bash
yarn build
```

2. Start the production server:

```bash
yarn start
```

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t weather-app --arg NEXT_PUBLIC_API_URL=<your_api_url> .
```

2. Run the Docker container:

```bash
docker run -p 3000:3000 weather-app
```

Using Docker Compose:

- Update the arguments in docker-compose.yml to match your environment.
- Run the following command to start the application:

```bash
docker-compose up -d
```

## Project Structure

```
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Next.js pages
│   ├── styles/           # Global styles and CSS modules
│   ├── lib/              # Utility functions and API clients
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── tests/                # Test files
└── next.config.js        # Next.js configuration
```
