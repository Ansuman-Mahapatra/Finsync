"use client"

import { useState, useEffect } from "react"
import { MerchantLayout } from "@/components/merchant-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, FileText, Calculator, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { transactionAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function AccountingPage() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    transactionCount: 0,
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    calculateSummary()
  }, [transactions])

  const fetchTransactions = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return
      const data = await transactionAPI.getTransactions(userId)
      setTransactions(data || [])
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateSummary = () => {
    const revenue = transactions
      .filter((t) => (t.type || "").toString().toUpperCase() === "INCOME")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    
    const expenses = transactions
      .filter((t) => (t.type || "").toString().toUpperCase() === "EXPENSE")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)

    setSummary({
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: revenue - expenses,
      transactionCount: transactions.length,
    })
  }

  const filteredTransactions = transactions.filter((t) => {
    if (dateRange.start && new Date(t.date) < new Date(dateRange.start)) return false
    if (dateRange.end && new Date(t.date) > new Date(dateRange.end)) return false
    return true
  })

  const handleExport = () => {
    const csv = [
      ["Date", "Type", "Description", "Category", "Amount"].join(","),
      ...filteredTransactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString(),
          (t.type || "").toString(),
          t.description || "",
          t.categoryName || t.category || "",
          t.amount || 0,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `accounting-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Report exported successfully",
    })
  }

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accounting</h1>
            <p className="text-muted-foreground mt-1">Manage your business finances and generate reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${loading ? "..." : summary.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All income transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <TrendingDown className="w-4 h-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">
                ${loading ? "..." : summary.totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All expense transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.netProfit >= 0 ? "text-secondary" : "text-chart-3"}`}>
                ${loading ? "..." : summary.netProfit.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Revenue - Expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? "..." : summary.transactionCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
            {(dateRange.start || dateRange.end) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setDateRange({ start: "", end: "" })}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No transactions found</p>
                <p className="text-xs mt-1">Try adjusting your filters or add transactions</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => {
                      const typeNorm = (transaction.type || "").toString().toUpperCase()
                      const isIncome = typeNorm === "INCOME"
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-sm">
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={isIncome ? "default" : "secondary"}>
                              {isIncome ? "Income" : "Expense"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{transaction.description || "-"}</TableCell>
                          <TableCell>{transaction.categoryName || transaction.category || "-"}</TableCell>
                          <TableCell className={`text-right font-semibold ${isIncome ? "text-secondary" : "text-foreground"}`}>
                            {isIncome ? "+" : "-"}${Math.abs(transaction.amount || 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MerchantLayout>
  )
}


