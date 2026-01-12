"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MerchantLayout } from "@/components/merchant-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react"
import { SalesChart } from "@/components/sales-chart"
import { RevenueBreakdown } from "@/components/revenue-breakdown"

export default function MerchantDashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [dashboardData, setDashboardData] = useState({
    netSales: 0,
    revenue: 0,
    orders: 0,
    customers: 0,
    salesChange: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
  })
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const name = localStorage.getItem("userName")

    if (!userType || userType !== "merchant") {
      router.push("/login")
      return
    }

    setUserName(name || "Business")

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const [summaryResponse, transactionsResponse] = await Promise.all([
        fetch(`/api/merchant/dashboard/summary?userId=${userId}`),
        fetch(`/api/transactions/recent?userId=${userId}`)
      ])
      const summaryData = await summaryResponse.json()
      const transactionsData = await transactionsResponse.json()
      setDashboardData(summaryData)
      setRecentTransactions(transactionsData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Business Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {userName}</p>
          </div>
          <Button>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Sales</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${loading ? "..." : dashboardData.netSales.toFixed(2)}
              </div>
              <p className="text-xs text-secondary flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {loading ? "..." : `+${dashboardData.salesChange}%`} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${loading ? "..." : dashboardData.revenue.toFixed(2)}
              </div>
              <p className="text-xs text-secondary flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {loading ? "..." : `+${dashboardData.revenueChange}%`} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{loading ? "..." : `+${dashboardData.orders}`}</div>
              <p className="text-xs text-secondary flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {loading ? "..." : `+${dashboardData.ordersChange}%`} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? "..." : `+${dashboardData.customers}`}
              </div>
              <p className="text-xs text-secondary flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {loading ? "..." : `+${dashboardData.customersChange}%`} from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueBreakdown />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Business Activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/merchant/transactions")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Loading transactions...</p>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No recent transactions</p>
                <p className="text-xs mt-1">Add your first transaction to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === "INCOME" ? "bg-secondary/10" : "bg-muted"
                      }`}>
                        <ShoppingCart className={`w-5 h-5 ${
                          transaction.type === "INCOME" ? "text-secondary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.categoryName || "Uncategorized"}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      transaction.type === "INCOME" ? "text-secondary" : "text-foreground"
                    }`}>
                      {transaction.type === "INCOME" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MerchantLayout>
  )
}
