import { WeatherReport } from "@/interfaces";
import dayjs from "dayjs";

type Props = {
  report: WeatherReport;
};

export default function ReportCard({ report }: Props) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold">
        {dayjs(report.timestamp).format("DD/MM/YYYY h:mm:ss A")}
      </h2>
      <p>Temperature: {report.temperature}°C</p>
      <p>Pressure: {report.pressure} hPa</p>
      <p>Humidity: {report.humidity}%</p>
      <p>Cloud Cover: {report.cloudCover}%</p>
    </div>
  );
}
