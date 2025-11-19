"use client"

import { useAuth } from "@/lib/authContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { SkinAnalysis, AnalysisResponse } from "@/lib/type"

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentAnalyses, setRecentAnalyses] = useState<SkinAnalysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user?.id) return
      setLoading(true)

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analysis/${user.id}`
        )

        if (!res.ok) throw new Error("Failed to fetch analyses")

        // API returns { analyses: SkinAnalysis[] }
        const responseData: AnalysisResponse = await res.json()
        const data: SkinAnalysis[] = responseData.analyses || []

        // Sort by most recent and take top 3
        const sorted = data
          .sort(
            (a, b) =>
              new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
          )
          .slice(0, 3)

        setRecentAnalyses(sorted)
      } catch (error) {
        console.error("Error loading analyses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [user])

  const getSkinTypeColor = (skinType: string) => {
    const colors: Record<string, string> = {
      dry: "text-amber-600",
      oily: "text-blue-600",
      normal: "text-green-600",
      combination: "text-purple-600",
      sensitive: "text-pink-600",
    }
    return colors[skinType] || "text-foreground"
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          Please log in to view your dashboard.
        </p>
        <Link href="/login">
          <Button className="mt-4">Go to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-4xl font-bold">
            Welcome back, {user.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your skin analysis and discover personalized recommendations
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {loading ? "..." : recentAnalyses.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest Skin Type</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : recentAnalyses.length > 0 ? (
                <p
                  className={`text-4xl font-bold capitalize ${getSkinTypeColor(
                    recentAnalyses[0].predicted_class
                  )}`}
                >
                  {recentAnalyses[0].predicted_class}
                </p>
              ) : (
                <p className="text-muted-foreground">No analysis yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {loading
                  ? "..."
                  : recentAnalyses.length > 0
                  ? recentAnalyses.length
                  : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Start a new skin analysis or view your history
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard/analyze" className="flex-1">
              <Button className="w-full" size="lg">
                New Analysis
              </Button>
            </Link>
            <Link href="/dashboard/history" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Analyses */}
        {!loading && recentAnalyses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>
                Your latest skin analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.predictedID}
                    className="flex items-center gap-4 p-4 border border-border rounded-lg"
                  >
                    <img
                      src={`/upload/${analysis.ImagePath}` || "/placeholder.svg"}
                      alt="Skin analysis"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        Skin Type:{" "}
                        <span
                          className={`capitalize ${getSkinTypeColor(
                            analysis.predicted_class
                          )}`}
                        >
                          {analysis.predicted_class}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(analysis.CreatedAt).toLocaleDateString()} •{" "}
                        {analysis.percentages}% confidence
                      </p>
                    </div>
                    <Link href={`/dashboard/analysis/${analysis.predictedID}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
