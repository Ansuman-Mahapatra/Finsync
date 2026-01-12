"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, TrendingUp, Calendar } from "lucide-react"
import { CreateGoalDialog } from "@/components/create-goal-dialog"
import { goalsAPI } from "@/lib/api"

export default function GoalsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return
      const data = await goalsAPI.getGoals(userId)
      setGoals(data)
    } catch (e) {
      console.error("Error fetching goals", e)
    } finally {
      setLoading(false)
    }
  }

  const totalTarget = goals.reduce((sum, g) => sum + (g.target || 0), 0)
  const totalCurrent = goals.reduce((sum, g) => sum + (g.current || 0), 0)
  const completedGoals = goals.filter((g) => (g.current || 0) >= (g.target || 0)).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Goals</h1>
            <p className="text-muted-foreground mt-1">Track your progress towards your financial objectives</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Progress</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? "..." : `$${totalCurrent.toLocaleString()} / $${totalTarget.toLocaleString()}`}
              </div>
              <Progress value={totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {loading ? "..." : `${totalTarget > 0 ? ((totalCurrent / totalTarget) * 100).toFixed(1) : 0}% of total goals`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{loading ? "..." : goals.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Goals in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <Target className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{loading ? "..." : completedGoals}</div>
              <p className="text-xs text-muted-foreground mt-1">Goals achieved</p>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading goals...</div>
        ) : goals.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No goals yet</p>
                <p className="text-xs mt-1">Create your first goal to start tracking</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const percentage = goal.target > 0 ? (goal.current / goal.target) * 100 : 0
              const remaining = Math.max(0, (goal.target || 0) - (goal.current || 0))
              const daysUntilDeadline = goal.deadline
                ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : undefined
              const color = goal.color || "bg-primary"

              return (
                <Card key={goal.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${color}/10 rounded-lg flex items-center justify-center`}>
                            <Target className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{goal.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{goal.category}</span>
                              {goal.deadline && (
                                <>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {daysUntilDeadline !== undefined
                                        ? daysUntilDeadline > 0
                                          ? `${daysUntilDeadline} days left`
                                          : "Deadline passed"
                                        : "No deadline"}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">
                            ${Number(goal.current || 0).toLocaleString()} / ${Number(goal.target || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">${remaining.toLocaleString()} to go</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Progress value={Math.min(percentage, 100)} className="h-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}% complete</span>
                          {percentage >= 100 ? (
                            <span className="text-xs font-medium text-secondary">Goal achieved!</span>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              Add Contribution
                            </Button>
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

      <CreateGoalDialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) fetchGoals() }} />
    </DashboardLayout>
  )
}
