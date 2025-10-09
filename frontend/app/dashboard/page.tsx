"use client"

import { useAuth } from "@/lib/authContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useAuth()

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Track your skin analysis and discover personalized recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {/* {recentAnalyses.length} */}
                </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest Skin Type</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-4xl font-bold capitalize">
                  Oily
                </p>
              {/* {recentAnalyses.length > 0 ? (
                <p className={`text-4xl font-bold capitalize ${getSkinTypeColor(recentAnalyses[0].skinType)}`}>
                  {recentAnalyses[0].skinType}
                </p>
              ) : (
                <p className="text-muted-foreground">No analysis yet</p>
              )} */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-4xl font-bold">
               0
              </p>
              {/* <p className="text-4xl font-bold">
                {recentAnalyses.length > 0 ? recentAnalyses[0].recommendations.length : 0}
              </p> */}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start a new skin analysis or view your history</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard/analyze" className="flex-1">
              <Button className="w-full" size="lg">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                New Analysis
              </Button>
            </Link>
            <Link href="/dashboard/history" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* {recentAnalyses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>Your latest skin analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <img
                      src={analysis.imageUrl || "/placeholder.svg"}
                      alt="Skin analysis"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        Skin Type:{" "}
                        <span className={`capitalize ${getSkinTypeColor(analysis.skinType)}`}>{analysis.skinType}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(analysis.analyzedAt).toLocaleDateString()} • {analysis.confidence}% confidence
                      </p>
                    </div>
                    <Link href={`/dashboard/analysis/${analysis.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  )
}
