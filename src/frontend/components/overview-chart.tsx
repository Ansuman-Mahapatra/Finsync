"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export default function OverviewChart() {
  const data: any[] = []

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No data available</p>
          <p className="text-xs mt-1">Connect your database to see income and expense trends</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
