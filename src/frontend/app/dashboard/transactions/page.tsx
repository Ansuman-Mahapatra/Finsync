"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, ArrowUpRight, ArrowDownRight, Filter, Pencil, Trash2 } from "lucide-react"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { transactionAPI } from "@/lib/api"

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mutatingId, setMutatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return
      const data = await transactionAPI.getTransactions(userId)
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) return
    const confirmDelete = window.confirm("Delete this transaction?")
    if (!confirmDelete) return
    try {
      setMutatingId(id)
      await transactionAPI.deleteTransaction(id)
      await fetchTransactions()
    } catch (error) {
      console.error("Error deleting transaction:", error)
    } finally {
      setMutatingId(null)
    }
  }

  const handleEdit = async (transaction: any) => {
    if (!transaction?.id) return
    const desc = window.prompt("Description", transaction.description || "")
    if (desc === null) return
    const amountStr = window.prompt("Amount", String(transaction.amount ?? "0"))
    if (amountStr === null) return
    const category = window.prompt("Category", transaction.categoryName || transaction.category || "")
    if (category === null) return
    const type = window.prompt("Type (income/expense)", (transaction.type || "").toLowerCase())?.toLowerCase()
    if (!type || (type !== "income" && type !== "expense")) return

    try {
      setMutatingId(transaction.id)
      const userId = localStorage.getItem("userId")
      if (!userId) throw new Error("No userId in storage")
      await transactionAPI.updateTransaction(transaction.id, {
        ...transaction,
        userId,
        description: desc,
        amount: Number(amountStr) || 0,
        categoryName: category,
        type: type.toUpperCase(),
      })
      await fetchTransactions()
    } catch (error) {
      console.error("Error updating transaction:", error)
    } finally {
      setMutatingId(null)
    }
  }

  const filteredTransactions = transactions.filter((t: any) => {
    const query = searchQuery.trim().toLowerCase()
    const typeNorm = (t.type || "").toString().toLowerCase()
    const category = (t.categoryName || t.category || "").toString()
    const account = (t.accountId || t.account || "").toString()
    const amountText = typeof t.amount === "number" ? t.amount.toFixed(2) : (t.amount || "").toString()
    const dateText = t.date ? new Date(t.date).toLocaleDateString().toLowerCase() : ""
    const searchBlob = [
      t.description,
      category,
      account,
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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground mt-1">View and manage all your transactions</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
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
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
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
                <p className="text-xs mt-1">Add your first transaction to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((t: any) => {
                  const typeNorm = (t.type || "").toString().toLowerCase()
                  const category = t.categoryName || t.category || ""
                  const account = t.accountId || t.account || ""
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            typeNorm === "income" ? "bg-secondary/10" : "bg-chart-3/10"
                          }`}
                        >
                          {typeNorm === "income" ? (
                            <ArrowUpRight className="w-5 h-5 text-secondary" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-chart-3" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.description || category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{category}</span>
                            {account && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{account}</span>
                              </>
                            )}
                            {t.date && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(t.date).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`text-sm font-semibold ${
                            typeNorm === "income" ? "text-secondary" : "text-foreground"
                          }`}
                        >
                          {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(t)}
                            disabled={mutatingId === t.id}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(t.id)}
                            disabled={mutatingId === t.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </DashboardLayout>
  )
}
