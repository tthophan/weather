"use client";

import { Table } from "@/components/Table";
import { WeatherReport } from "@/interfaces";
import { fetchReportsByIds } from "@/services";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [reports, setReports] = useState<Record<number, WeatherReport>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idsParam = searchParams.get("ids");
    const loadReports = async () => {
      if (idsParam) {
        const idList = idsParam.split(",").map(Number);
        const data = await fetchReportsByIds(idList[0], idList[1]);
        setReports(data);
        setLoading(false);
      }
    };
    loadReports();
  }, [searchParams]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const mapping = () => {
    const metrics = [
      { key: "Timestamp", value: "timestamp" },
      { key: "Temperature (°C)", value: "temperature" },
      { key: "Pressure (hPa)", value: "pressure" },
      { key: "Humidity (%)", value: "humidity" },
      { key: "Cloud Cover (%)", value: "cloudCover" },
      { key: "Location", value: "location" },
    ];

    const values = Object.values(reports);
    return metrics.map((metric) => {
      const report1Value = values[0]?.[metric.value as keyof WeatherReport];
      const report2Value = values[1]?.[metric.value as keyof WeatherReport];

      let valueReport1, valueReport2, deviation;

      switch (metric.value) {
        case "timestamp":
          valueReport1 = new Date(report1Value as number).toLocaleString();
          valueReport2 = new Date(report2Value as number).toLocaleString();
          deviation = "-";
          break;
        case "location":
          valueReport1 =
            (report1Value as WeatherReport["location"])?.name || "Unknown";
          valueReport2 =
            (report2Value as WeatherReport["location"])?.name || "Unknown";
          deviation = "-";
          break;
        case "id":
          valueReport1 = report1Value;
          valueReport2 = report2Value;
          deviation = "-";
          break;
        default:
          valueReport1 = report1Value;
          valueReport2 = report2Value;
          deviation =
            report1Value === report2Value
              ? "-"
              : Math.abs(
                  (report1Value as number) - (report2Value as number)
                ).toFixed(2);
      }

      return {
        key: metric.key,
        "Report 1": valueReport1,
        "Report 2": valueReport2,
        Deviation: deviation,
      };
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Compare</h1>
      <div className="h-[calc(100vh-220px)] overflow-auto">
        <Table
          theme="dark"
          data={mapping()}
          columns={[
            {
              header: "",
              accessor: "key",
            },
            {
              header: "Report 1",
              accessor: "Report 1",
            },
            {
              header: "Report 2",
              accessor: "Report 2",
            },
            {
              header: "Deviation",
              accessor: "Deviation",
            },
          ]}
        />
      </div>
    </div>
  );
}
