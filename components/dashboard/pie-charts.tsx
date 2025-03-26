"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useExpenseStore, useUserStore } from "@/store/store";

const chartConfig = {
  total: {
    label: "Expense",
    color: "var(--chart-1)",
  },
  budget: {
    label: "Budget",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function ExpenseBudgetPieChart({ className }: { className?: string }) {
  const { filteredTotal } = useExpenseStore();
  const { budget } = useUserStore();
  // Convert to an array of objects
  const chartData = [
    { name: "Total", value: filteredTotal, fill: "var(--chart-2)" },
    { name: "Budget", value: budget, fill: "var(--chart-1)" },
  ];

  return (
    <Card className={`flex flex-col ${className ? className : ""}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart</CardTitle>
        <CardDescription>Budget vs Expense</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              color="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {filteredTotal.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Expense
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total and budget for the filtered expenses
        </div>
      </CardFooter>
    </Card>
  );
}

export default ExpenseBudgetPieChart;
