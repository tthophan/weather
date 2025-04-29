"use client";

import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Column } from "@/components/Table/types";
import { WeatherReport } from "@/interfaces";
import { fetchWeatherHistory } from "@/services";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<WeatherReport[]>([]);
  const [selectedReports, setSelectedReports] = useState<WeatherReport[]>([]);
  const [paginate, setPaginate] = useState<{
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  }>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<Record<string, "desc" | "asc">>(
    {}
  );

  const columns: Column<WeatherReport>[] = [
    {
      header: "#",
      accessor: (report) => report.id,
      className: "w-4",
    },
    {
      header: "Timestamp",
      accessor: (report) => new Date(report.timestamp).toLocaleString(),
      sortKey: "timestamp",
      sortable: true,
    },
    {
      header: "Temperature",
      accessor: (report) => report.temperature + "°C",
      sortKey: "temperature",
      sortable: true,
    },
    {
      header: "Pressure",
      accessor: (report) => report.pressure + "hPa",
      sortKey: "pressure",
      sortable: true,
    },
    {
      header: "Humidity",
      accessor: (report) => report.humidity + "%",
      sortKey: "humidity",
      sortable: true,
    },
    {
      header: "Cloud Cover",
      accessor: (report) => report.cloudCover + "%",
      sortKey: "cloudCover",
      sortable: true,
    },
  ];

  const isRowSelected = (report: WeatherReport) =>
    !!selectedReports.find((r) => r.id === report.id);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (Object.keys(sortConfig).length > 0) {
      const newPage = 1;
      setPaginate((prev) => ({ ...prev, page: newPage }));
      loadHistory(paginate.limit, newPage, sortConfig);
    }
  }, [sortConfig, paginate.limit]);

  const loadHistory = useCallback(
    async (
      limit: number = 10,
      page?: number,
      sort?: Record<string, "desc" | "asc">
    ) => {
      try {
        setIsLoading(true);
        const res = await fetchWeatherHistory(page, limit, sort || sortConfig);
        setHistory(res.items);
        setPaginate({
          ...paginate,
          page: res.page,
          limit: res.limit,
          total: res.count,
          hasMore: res.hasMore,
        });
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const toggleSelect = (report: WeatherReport) => {
    if (selectedReports.find((r) => r.id === report.id)) {
      setSelectedReports(selectedReports.filter((r) => r.id !== report.id));
    } else if (selectedReports.length < 2) {
      setSelectedReports([...selectedReports, report]);
    }
  };

  const handleCompare = () => {
    if (selectedReports.length === 2) {
      const ids = selectedReports.map((r) => r.id).join(",");
      router.push(`/compare?ids=${ids}`);
    } else {
      alert("Please select exactly 2 reports to compare.");
    }
  };

  const paginateElement = useMemo(() => {
    return (
      <Pagination
        currentPage={paginate.page}
        totalItems={paginate.total}
        hasMore={paginate.hasMore}
        isLoading={isLoading}
        onPageChanged={({ page, limit }) => {
          const newPage = page;
          const newLimit = limit;
          setPaginate((prev) => ({
            ...prev,
            page: newPage,
            limit: newLimit,
          }));

          loadHistory(newLimit, newPage, sortConfig);
        }}
      />
    );
  }, [paginate, setPaginate, sortConfig]);

  return (
    <div className="h-[calc(100vh-110px)] p-4">
      <h1 className="text-2xl font-bold mb-4">History</h1>
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={handleCompare}
          disabled={selectedReports.length !== 2}
          className={`px-6 py-2 rounded transition-colors ${
            selectedReports.length === 2
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 cursor-not-allowed text-gray-200"
          }`}
        >
          Compare Selected ({selectedReports.length}/2)
        </button>
      </div>

      <div className="min-h-[calc(100vh-220px)] overflow-hidden">
        <Table
          data={history}
          columns={columns}
          onRowClick={toggleSelect}
          isRowSelected={isRowSelected}
          theme="dark"
          onSort={(column) => {
            setSortConfig((prev) => ({ ...prev, ...column }));
          }}
          sortConfig={sortConfig}
        />
        {paginateElement}
      </div>
    </div>
  );
}
