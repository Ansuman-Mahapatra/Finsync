"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Target, Sparkles } from "lucide-react"
import Link from "next/link"
import OverviewChart from "@/components/overview-chart"
import RecentTransactions from "@/components/recent-transactions"
import ChatAssistant from "@/components/chat-assistant"

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
    balanceChange: 0,
    savingsPercentage: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const name = localStorage.getItem("userName")

    if (!userType || userType !== "simple") {
      router.push("/login")
      return
    }

    setUserName(name || "User")

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (userId) {
        const { dashboardAPI } = await import('@/lib/api')
        const data = await dashboardAPI.getSummary(userId)
        setDashboardData(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Set some default data if API fails
      setDashboardData({
        totalBalance: 0,
        income: 0,
        expenses: 0,
        savings: 0,
        balanceChange: 0,
        savingsPercentage: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {userName}</h1>
          <p className="text-muted-foreground mt-1">Here's your financial overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${loading ? "..." : dashboardData.totalBalance.toFixed(2)}
              </div>
              <p className="text-xs text-secondary flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {loading ? "..." : `+${dashboardData.balanceChange}%`} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${loading ? "..." : dashboardData.income.toFixed(2)}
              </div>
              <p className="text-xs text-secondary flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
              <ArrowDownRight className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${loading ? "..." : dashboardData.expenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Savings</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${loading ? "..." : dashboardData.savings.toFixed(2)}
              </div>
              <p className="text-xs text-secondary flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {loading ? "..." : `${dashboardData.savingsPercentage}%`} of income
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights and Chatbot */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-primary h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle>AI Financial Insights</CardTitle>
                </div>
                <Link href="/dashboard/insights">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">AI insights will appear here based on your financial activity</p>
              </div>
            </CardContent>
          </Card>
          <ChatAssistant />
        </div>

        {/* Charts and Transactions */}
        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <OverviewChart />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link href="/dashboard/transactions">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
