// SortableTable.tsx
"use client";

import { useState, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface SortableTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    header: ReactNode;
  }>;
}

export default function SortableTable<T>({
  data,
  columns,
}: SortableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortedData, setSortedData] = useState<T[]>(data);

  const handleSort = (column: keyof T) => {
    const newSortDirection =
      column === sortColumn && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sorted = [...sortedData].sort((a, b) => {
      if (a[column] < b[column]) return newSortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);
  };

  return (
    <Table className="bg-card shadow-md rounded-lg">
      <TableHeader className="bg-muted">
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.key)}>
              <button
                className="flex items-center space-x-1 text-left font-medium text-primary-foreground hover:text-primary"
                onClick={() => handleSort(column.key)}
              >
                <span>{column.header}</span>
                <ArrowUpDown
                  className={`h-4 w-4 ${
                    sortColumn === column.key
                      ? sortDirection === "asc"
                        ? "text-primary"
                        : "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="text-foreground">
        {sortedData.map((row, rowIndex) => (
          <TableRow key={rowIndex} className="hover:bg-muted">
            {columns.map((column) => (
              <TableCell key={String(column.key)} className="px-4 py-2">
                {String(row[column.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
