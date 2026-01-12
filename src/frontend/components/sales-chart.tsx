"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function SalesChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        const response = await fetch(`/api/merchant/dashboard/sales-chart?userId=${userId}`)
        const result = await response.json()
        setData(result.data || [])
      } catch (error) {
        console.error("Error fetching sales data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSalesData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">Loading sales data...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No sales data available</p>
          <p className="text-xs mt-1">Add income transactions to see sales trends</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSales)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
