"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  hour: string; // e.g., "00:00"
  temperature: number; // e.g., 21.8
}

interface TemperatureChartProps {
  hourlyData: {
    time: string[]; // e.g., ["2025-04-15T00:00", ...]
    temperature_2m: number[]; // e.g., [21.8, 21.5, ...]
  } | null;
}

const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function TemperatureChart({ hourlyData }: TemperatureChartProps) {
  // Prepare chart data by mapping time and temperature
  const chartData: ChartData[] = hourlyData?.time
    ? hourlyData.time.slice(0, 24).map((time, index) => ({
        hour: new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }), // e.g., "00:00"
        temperature: hourlyData.temperature_2m[index] || 0, // Fallback to 0 if undefined
      }))
    : [];

  return (
    <>
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="hour"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value} // Already formatted as "HH:mm"
          />
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value} °C`}
          />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(value) => `${value} °C`} />}
          />
        <Bar
          dataKey="temperature"
          fill="var(--color-temperature)"
          radius={4}
          />
      </BarChart>
    </ChartContainer>
    <p className=" text-center text-muted-foreground text-sm">Hour based weather data</p>
          </>
  );
}