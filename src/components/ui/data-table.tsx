"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  Row,
} from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  onRowClick?: (row: TData) => void
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  onRowClick,
  className = "",
}: DataTableProps<TData, TValue>) {
  console.log("DataTable received data:", data)
  console.log("DataTable loading:", loading)
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  console.log("Table rows:", table.getRowModel().rows)

  return (
    <div className={`w-full overflow-x-auto rounded-md border bg-card ${className}`}>
      <table className="w-full table-auto divide-y divide-border">
        <thead className="bg-muted">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-muted-foreground">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-muted-foreground">
                No data found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={onRowClick ? "cursor-pointer hover:bg-accent/50 transition-colors" : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
