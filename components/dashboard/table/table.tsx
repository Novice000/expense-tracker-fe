"use client";
import React, { useState, useEffect } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { columns, Expense } from "@/components/dashboard/table/table-def";
import { useQuery } from "@tanstack/react-query";
import { useExpenseStore } from "@/store/store";
import { getExpenses } from "@/axios/util";
import { ClimbingBoxLoader } from "react-spinners";
import { Card, CardContent } from "@/components/ui/card";

export function DataTable({ className }: { className: string }) {
  const { expenses, setExpense, setTotal,setFilteredTotal, setFiltered } = useExpenseStore();
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const query = useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(),
  });
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    if (monthFilter === null && yearFilter === null) {
      setColumnFilters([]); // No filters applied
    } else {
      setColumnFilters([
        {
          id: "timestamp",
          value: { month: monthFilter, year: yearFilter },
        },
      ]);
    }
  }, [monthFilter, yearFilter]);

  useEffect(() => {
    if (query.data) {
      setExpense(query.data);
      setTotal(query.data.reduce((acc: number, expense: Expense) => acc + expense.amount, 0));
      console.log(query.data);
    }
  }, [query.data, setExpense]);

  const table = useReactTable({
    data: expenses,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      // rowSelection,
    },
  });

  useEffect(() => {
    const newFilteredExpenses = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    setFilteredExpenses(newFilteredExpenses);
    const totalAmount = newFilteredExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    setFilteredTotal(totalAmount);
    setFiltered(filteredExpenses);
  }, [table.getFilteredRowModel().rows]);

  const[availableMonths, setAvailableMonths] = useState<number[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    if (expenses.length) {
      const months = new Set<number>();
      const years = new Set<number>();

      expenses.forEach((expense) => {
        const date = new Date(expense.timestamp);
        months.add(date.getMonth() + 1); // Months are 0-based
        years.add(date.getFullYear());
      });

      setAvailableMonths([...months].sort((a, b) => a - b));
      setAvailableYears([...years].sort((a, b) => b - a)); // Sort descending
    }
  }, [expenses]);
  if (query.isLoading) {
    return (
      <div className="w-full grid place-content-center">
        <ClimbingBoxLoader size={20} />
      </div>
    );
  }

  return (
    <Card className={`w-full h-fit ${className ? className : ""} `}>
      <CardContent>
      <div className="flex items-center py-4 flex-col md:flex-row">
        <div className="flex gap-4 mb-4">
          <Select
            value={monthFilter !== null ? `${monthFilter}` : ""}
            onValueChange={(value) =>
              setMonthFilter(value === "all" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>{" "}
              {/* Default "All" Option */}
              {availableMonths.map((month) => (
                <SelectItem key={month} value={`${month}`}>
                  {new Date(0, month - 1).toLocaleString("en-US", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={yearFilter !== null ? `${yearFilter}` : ""}
            onValueChange={(value) =>
              setYearFilter(value === "all" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>{" "}
              {/* Default "All" Option */}
              {availableYears.map((year) => (
                <SelectItem key={year} value={`${year}`}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
