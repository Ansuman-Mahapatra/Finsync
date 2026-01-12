"use client"

import { useState, useEffect } from "react"
import { MerchantLayout } from "@/components/merchant-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Download } from "lucide-react"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"

export default function MerchantTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const response = await fetch(`/api/transactions?userId=${userId}&type=business`)
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.trim().toLowerCase()
    const typeNorm = (transaction.type || "").toLowerCase()
    const category = (transaction.category || "").toString()
    const amountText =
      typeof transaction.amount === "number" ? transaction.amount.toFixed(2) : (transaction.amount || "").toString()
    const dateText = transaction.date ? new Date(transaction.date).toLocaleDateString().toLowerCase() : ""
    const searchBlob = [
      transaction.description,
      transaction.customer,
      category,
      typeNorm,
      amountText,
      dateText,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const matchesSearch = !query || searchBlob.includes(query)
    const matchesType = filterType === "all" || typeNorm === filterType
    const matchesCategory = filterCategory === "all" || category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Business Transactions</h1>
            <p className="text-muted-foreground mt-1">View and manage all business transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions or customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Products">Products</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                  <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                  <SelectItem value="Expenses">Expenses</SelectItem>
                  <SelectItem value="Refunds">Refunds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No transactions found</p>
                <p className="text-xs mt-1">Add your first business transaction to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{transaction.description}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.customer}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {transaction.category}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-4 text-sm font-semibold text-right ${
                            transaction.type === "income" ? "text-secondary" : "text-foreground"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </MerchantLayout>
  )
}
