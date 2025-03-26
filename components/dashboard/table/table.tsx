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
import { ChevronDown } from "lucide-react";
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
import { ClipLoader } from "react-spinners";
import { Card, CardContent } from "@/components/ui/card";

export function DataTable({ className }: { className?: string }) {
  const { expenses, setExpense, setTotal, setFilteredTotal, setFiltered } =
    useExpenseStore();
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [availableMonths, setAvailableMonths] = useState<number[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const query = useQuery({ queryKey: ["expenses"], queryFn: ()=> getExpenses() });

  useEffect(() => {
    if (query.data) {
      setExpense(query.data);
      setTotal(query.data.reduce((acc : number, expense : Expense) => acc + expense.amount, 0));
    }
  }, [query.data, setExpense, setTotal]);

  useEffect(() => {
    if (monthFilter === null && yearFilter === null) {
      setColumnFilters([]);
    } else {
      setColumnFilters([
        { id: "timestamp", value: { month: monthFilter, year: yearFilter } },
      ]);
    }
  }, [monthFilter, yearFilter]);

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
    state: { sorting, columnFilters, columnVisibility },
  });

  useEffect(() => {
    const newFilteredExpenses = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    setFilteredExpenses(newFilteredExpenses);
    setFilteredTotal(
      newFilteredExpenses.reduce((acc, expense) => acc + expense.amount, 0)
    );
    setFiltered(newFilteredExpenses);
  }, [table.getFilteredRowModel().rows, setFilteredTotal, setFiltered]);

  useEffect(() => {
    if (expenses.length) {
      const months = new Set<number>();
      const years = new Set<number>();

      expenses.forEach((expense) => {
        const date = new Date(expense.timestamp);
        months.add(date.getMonth() + 1);
        years.add(date.getFullYear());
      });

      setAvailableMonths([...months].sort((a, b) => a - b));
      setAvailableYears([...years].sort((a, b) => b - a));
    }
  }, [expenses]);

  if (query.isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-60">
        <ClipLoader size={50} color="#4A90E2" />
      </div>
    );
  }

  return (
    <Card className={`w-full h-fit ${className || ""}`}>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center py-4 gap-4">
          <div className="flex justify-between md:justify-start gap-2 w-full">
          <Select
            value={monthFilter?.toString() || ""}
            onValueChange={(value) =>
              setMonthFilter(value === "all" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {new Date(0, month - 1).toLocaleString("en-US", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={yearFilter?.toString() || ""}
            onValueChange={(value) =>
              setYearFilter(value === "all" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
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
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
      </CardContent>
    </Card>
  );
}
