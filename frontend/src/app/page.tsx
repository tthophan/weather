"use client";

import ReportCard from "@/components/ReportCard";
import { WeatherReport } from "@/interfaces";
import { fetchCurrentWeather } from "@/services/weather-service";
import { useState } from "react";

export default function HomePage() {
  const [report, setReport] = useState<WeatherReport | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    const data = await fetchCurrentWeather().finally(() => {
      setLoading(false);
    });
    setReport(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Report Generator</h1>
      <button
        onClick={generateReport}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Generate Report"}
      </button>

      {report && (
        <div className="mt-6">
          <ReportCard report={report} />
        </div>
      )}
    </div>
  );
}
