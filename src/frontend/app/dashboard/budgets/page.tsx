"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, TrendingUp, AlertCircle, Pencil, Trash2 } from "lucide-react"
import { CreateBudgetDialog } from "@/components/create-budget-dialog"
import { budgetsAPI } from "@/lib/api"

export default function BudgetsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mutatingId, setMutatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return
      const data = await budgetsAPI.getBudgets(userId)
      setBudgets(data)
    } catch (error) {
      console.error("Error fetching budgets:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const overBudget = budgets.filter((b) => b.spent > b.budgeted).length

  const handleDelete = async (id: string) => {
    if (!id) return
    const confirmDelete = window.confirm("Delete this budget?")
    if (!confirmDelete) return
    try {
      setMutatingId(id)
      await budgetsAPI.deleteBudget(id)
      await fetchBudgets()
    } catch (error) {
      console.error("Error deleting budget:", error)
    } finally {
      setMutatingId(null)
    }
  }

  const handleEdit = async (budget: any) => {
    if (!budget?.id) return
    const category = window.prompt("Category", budget.category || "")
    if (category === null) return
    const budgetedStr = window.prompt("Budgeted amount", String(budget.budgeted ?? "0"))
    if (budgetedStr === null) return
    const spentStr = window.prompt("Spent amount", String(budget.spent ?? "0"))
    if (spentStr === null) return
    try {
      setMutatingId(budget.id)
      await budgetsAPI.updateBudget(budget.id, {
        ...budget,
        category,
        budgeted: Number(budgetedStr) || 0,
        spent: Number(spentStr) || 0,
      })
      await fetchBudgets()
    } catch (error) {
      console.error("Error updating budget:", error)
    } finally {
      setMutatingId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Budgets</h1>
            <p className="text-muted-foreground mt-1">Track your spending against your budget goals</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Budget
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budgeted</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${loading ? "..." : totalBudgeted.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${loading ? "..." : totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalBudgeted > 0 ? `${((totalSpent / totalBudgeted) * 100).toFixed(1)}% of budget` : "No budget set"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Over Budget</CardTitle>
              <AlertCircle className="w-4 h-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{loading ? "..." : overBudget}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {overBudget === 0 ? "All on track" : "Categories need attention"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No budgets yet</p>
                <p className="text-xs mt-1">Create your first budget to start tracking spending</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.budgeted) * 100
              const isOverBudget = budget.spent > budget.budgeted

              return (
                <Card key={budget.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                          <h3 className="font-semibold text-foreground">{budget.category}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${isOverBudget ? "text-chart-3" : "text-foreground"}`}>
                              ${budget.spent.toFixed(2)} / ${budget.budgeted.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${(budget.budgeted - budget.spent).toFixed(2)} remaining
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(budget)}
                              disabled={mutatingId === budget.id}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDelete(budget.id)}
                              disabled={mutatingId === budget.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={Math.min(percentage, 100)} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span className={isOverBudget ? "text-chart-3" : "text-muted-foreground"}>
                            {percentage.toFixed(1)}% used
                          </span>
                          {isOverBudget && (
                            <span className="text-chart-3 font-medium">
                              ${(budget.spent - budget.budgeted).toFixed(2)} over budget
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <CreateBudgetDialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) fetchBudgets() }} />
    </DashboardLayout>
  )
}
