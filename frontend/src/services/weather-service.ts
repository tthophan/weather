import { WeatherReport } from "@/interfaces";
import internalHttpClientService from "@/modules/http/internal-http.service";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1.0'; // Your backend URL
// const API_URL =
//   process.env.NODE_ENV === "development"
//     ? ""
//     : "https://your-production-backend.com";

export const fetchCurrentWeather = async (): Promise<WeatherReport> => {
  return await internalHttpClientService.get<WeatherReport>(
    "/api/v1.0/weather/current",
    {}
  );
};

export const fetchWeatherHistory = async (
  page?: number,
  limit: number = 10,
  sortConfig?: Record<string, "asc" | "desc"> | null
): Promise<{
  items: WeatherReport[];
  page: number;
  limit: number;
  count: number;
  hasMore: boolean;
}> => {
  const queryParams = new URLSearchParams();
  queryParams.set("limit", String(limit || "10"));
  if (page) queryParams.set("page", page.toString());
  if (sortConfig) {
    for (const [key, value] of Object.entries(sortConfig)) {
      queryParams.set(`sort[${key}]`, value);
    }
  }
  return await internalHttpClientService.get<{
    items: WeatherReport[];
    page: number;
    count: number;
    limit: number;
    hasMore: boolean;
  }>(`/api/v1.0/weather/histories?${queryParams.toString()}`, {});
};

export const fetchReportsByIds = async (
  id1: number,
  id2: number
): Promise<Record<number, WeatherReport>> => {
  return await internalHttpClientService.get<Record<number, WeatherReport>>(
    `/api/v1.0/weather/histories/compare/${id1}/${id2}`,
    {}
  );
};
