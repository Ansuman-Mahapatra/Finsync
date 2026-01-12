"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export function RevenueBreakdown() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        const response = await fetch(`/api/merchant/dashboard/revenue-breakdown?userId=${userId}`)
        const result = await response.json()
        setData(result.data || [])
      } catch (error) {
        console.error("Error fetching revenue data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRevenueData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">Loading revenue data...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No revenue data available</p>
          <p className="text-xs mt-1">Add income transactions to see revenue breakdown</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
