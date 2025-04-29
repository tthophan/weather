export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => any);
  className?: string;
  sortable?: boolean;
  sortKey?: string;
}

export interface SortConfig {
  [key: string]: "asc" | "desc";
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isRowSelected?: (item: T) => boolean;
  className?: string;
  theme?: "light" | "dark";
  onSort?: (config: SortConfig) => void;
  sortConfig?: SortConfig | null;
}
