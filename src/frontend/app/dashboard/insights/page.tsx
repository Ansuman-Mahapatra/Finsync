"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingDown, TrendingUp, DollarSign, AlertTriangle } from "lucide-react"
import { dashboardAPI, aiAPI } from "@/lib/api"

interface CategoryInsight {
  category: string
  amount: number
  percentage: number
  trend: string
  suggestion: string
}

interface SpendingPattern {
  pattern: string
  description: string
  recommendation: string
}

interface EnhancedInsights {
  mainSuggestion: string
  potentialSavings: number
  categoryInsights: CategoryInsight[]
  spendingPatterns: SpendingPattern[]
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<EnhancedInsights | null>(null)
  const [aiInsights, setAIInsights] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) return
        
        // Fetch both traditional insights and AI insights
        const [traditionalResponse, aiResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/dashboard/enhanced-insights?userId=${userId}`),
          aiAPI.getInsights(userId)
        ])
        
        const traditionalData = await traditionalResponse.json()
        setInsights(traditionalData)
        setAIInsights(aiResponse.insights || "")
      } catch (e) {
        console.error("Error fetching insights", e)
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
            <p className="text-muted-foreground mt-1">Personalized financial recommendations</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Sparkles className="w-4 h-4 mr-2" />
            Refresh Insights
          </Button>
        </div>

        {/* Main AI Suggestion */}
        <Card className="border-primary">
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading AI insights...</div>
            ) : aiInsights ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">AI-Powered Financial Insights</h3>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{aiInsights}</p>
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs">Powered by OpenAI GPT</Badge>
                  </div>
                </div>
              </div>
            ) : insights ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">AI-Powered Recommendation</h3>
                  <p className="text-sm text-muted-foreground mt-1">{insights.mainSuggestion}</p>
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs">AI Generated</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No insights available yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Potential Savings */}
        {insights && insights.potentialSavings > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Potential Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-secondary mb-2">
                <TrendingDown className="w-5 h-5" />
                <span className="text-2xl font-bold">${insights.potentialSavings.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                By optimizing your spending habits, you could save this amount monthly.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Category Insights */}
        {insights && insights.categoryInsights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.categoryInsights.slice(0, 5).map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">${category.amount.toFixed(2)}</span>
                        <Badge variant="secondary" className="text-xs">{category.percentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">{category.suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Spending Patterns */}
        {insights && insights.spendingPatterns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Spending Patterns Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.spendingPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">{pattern.pattern}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
                      <p className="text-xs text-primary mt-2">→ {pattern.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
