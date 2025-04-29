export interface WeatherReport {
  id: number;
  timestamp: string;
  temperature: number;
  pressure: number;
  humidity: number;
  cloudCover: number;
  latitude: number;
  longitude: number;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

export interface WeatherHistoryResponse {
  data: {
    count: number;
    items: WeatherReport[];
    pagination: {
      nextCursor: number;
      prevCursor: number;
      hasMore: boolean;
    };
  };
  responseTime: string;
  timestamp: number;
}
