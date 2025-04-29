import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { Column, TableProps } from "./types";

export function Table<T>({
  data,
  columns,
  onRowClick,
  isRowSelected,
  className = "",
  theme = "light",
  onSort,
  sortConfig,
}: TableProps<T>) {
  const isDark = theme === "dark";

  const handleSort = (columnHeader: string) => {
    const column = columns.find((col) => col.header === columnHeader);
    if (!column?.sortable || !onSort || !sortConfig) return;
    const newDirection =
      sortConfig[column.sortKey || column.header] === "asc" ? "desc" : "asc";
    onSort({ [column.sortKey || column.header]: newDirection });
  };

  const renderSortIcon = useMemo(() => {
    return (column: Column<T>) => {
      if (!column.sortable || !sortConfig) return null;

      const currentDirection = sortConfig[column.sortKey || column.header];
      if (!currentDirection) return null;
      const isAsc = sortConfig[column.sortKey || column.header] === "asc";
      return (
        <span className="inline-flex">
          {column.sortable ? (
            isAsc ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )
          ) : (
            <div className="flex flex-col opacity-30">
              <ChevronUpIcon className="w-3 h-3 -mb-1" />
              <ChevronDownIcon className="w-3 h-3 -mt-1" />
            </div>
          )}
        </span>
      );
    };
  }, [sortConfig]);

  return (
    <div className={"relative overflow-x-auto shadow-md sm:rounded-lg"}>
      <table
        className={`w-full text-sm text-left ${
          isDark ? "text-gray-300" : "text-gray-500"
        } ${className}`}
      >
        <thead
          className={`text-xs uppercase ${
            isDark ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-700"
          }`}
        >
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                onClick={() => handleSort(column.header)}
                className={`px-6 py-4 font-medium tracking-wider ${
                  column.sortable && onSort
                    ? "cursor-pointer select-none hover:bg-opacity-80"
                    : ""
                } ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(item)}
              className={`
                border-b cursor-pointer transition-colors duration-200
                ${isDark ? "border-gray-700" : "border-gray-200"}
                ${
                  isRowSelected?.(item)
                    ? isDark
                      ? "bg-indigo-900/50 hover:bg-indigo-900/70 border-indigo-700"
                      : "bg-indigo-100 hover:bg-indigo-200 border-indigo-200"
                    : isDark
                    ? rowIndex % 2 === 0
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-900 hover:bg-gray-700"
                    : rowIndex % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "bg-white hover:bg-gray-100"
                }
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap ${
                    column.className || ""
                  }`}
                >
                  {typeof column.accessor === "function"
                    ? column.accessor(item)
                    : String(item[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
