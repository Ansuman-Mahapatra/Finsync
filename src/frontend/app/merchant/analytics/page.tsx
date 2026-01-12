"use client"

import { useEffect, useState } from "react"
import { MerchantLayout } from "@/components/merchant-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Calendar } from "lucide-react"
import { SalesChart } from "@/components/sales-chart"
import { RevenueBreakdown } from "@/components/revenue-breakdown"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    avgOrderValue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const response = await fetch(`/api/merchant/dashboard/summary?userId=${userId}`)
      const data = await response.json()
      
      // Map the data to our metrics
      setMetrics({
        totalRevenue: data.revenue || 0,
        avgOrderValue: data.orders > 0 ? data.revenue / data.orders : 0,
        totalOrders: data.orders || 0,
        totalCustomers: data.customers || 0,
        revenueGrowth: data.revenueChange || 0,
        orderGrowth: data.ordersChange || 0,
        customerGrowth: data.customersChange || 0,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const MetricCard = ({ title, value, change, icon: Icon, prefix = "" }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {prefix}{typeof value === 'number' ? value.toFixed(2) : value}
        </div>
        {change !== undefined && (
          <p className={`text-xs flex items-center mt-1 ${change >= 0 ? 'text-secondary' : 'text-destructive'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(change).toFixed(1)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive business performance insights</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={metrics.totalRevenue}
            change={metrics.revenueGrowth}
            icon={DollarSign}
            prefix="$"
          />
          <MetricCard
            title="Average Order Value"
            value={metrics.avgOrderValue}
            icon={ShoppingCart}
            prefix="$"
          />
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders}
            change={metrics.orderGrowth}
            icon={ShoppingCart}
          />
          <MetricCard
            title="Total Customers"
            value={metrics.totalCustomers}
            change={metrics.customerGrowth}
            icon={Users}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueBreakdown />
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Conversion Rate</p>
                  <p className="text-xs text-muted-foreground">Orders / Customers</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    {metrics.totalCustomers > 0 
                      ? ((metrics.totalOrders / metrics.totalCustomers) * 100).toFixed(1) 
                      : 0}%
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Revenue per Customer</p>
                  <p className="text-xs text-muted-foreground">Total Revenue / Customers</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    ${metrics.totalCustomers > 0 
                      ? (metrics.totalRevenue / metrics.totalCustomers).toFixed(2) 
                      : 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Growth Rate</p>
                  <p className="text-xs text-muted-foreground">Overall business growth</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${metrics.revenueGrowth >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                    {metrics.revenueGrowth >= 0 ? '+' : ''}{metrics.revenueGrowth.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MerchantLayout>
  )
}
