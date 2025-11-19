"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import type { SkinAnalysis, SkinType } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { showToast} from "nextjs-toast-notify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HistoryPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<SkinAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<SkinAnalysis[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkinType, setFilterSkinType] = useState<string>("all");
  const [loading, setLoading] = useState(true);


  // ✅ Fetch all analyses from backend
  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analysis/${user.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch analyses");

        const data = await res.json();
        console.log("Fetched analyses:", data);
        setAnalyses(data.analyses || []);
        setFilteredAnalyses(data.analyses || []);
      } catch (err) {
        console.error("Error loading analyses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [user]);


const deleteAnalysis = async (analysisId: string) => {
  if (!user) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/analysis/${user.id}/${analysisId}`,
      { method: "DELETE" }
    );

    if (!res.ok) throw new Error("Failed to delete analysis");

    setAnalyses((prev) => prev.filter((a) => a.predictedID !== analysisId));

    // Show success toast
    showToast.success("Sucessfully Deleted", {
      duration: 4000,
      position: "top-right",
      progress: true,
      transition: "bounceIn",
      icon: "",
      sound: true,
    });
  } catch (err) {
    console.error(err);

    showToast.error("Failed to Delete", {
      duration: 4000,
      position: "top-right",
      progress: true,
      transition: "bounceIn",
      icon: "",
      sound: true,
    });
  }
};

  // ✅ Apply search & filter logic
  useEffect(() => {
    let filtered = analyses;

    if (filterSkinType !== "all") {
      filtered = filtered.filter((a) => a.predicted_class === filterSkinType);
    }

    if (searchQuery) {
      filtered = filtered.filter((a) =>
        new Date(a.CreatedAt)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAnalyses(filtered);
  }, [searchQuery, filterSkinType, analyses]);

  const getSkinTypeColor = (skinType: string) => {
    const colors: Record<string, string> = {
      dry: "text-amber-600 bg-amber-50",
      oily: "text-blue-600 bg-blue-50",
      normal: "text-green-600 bg-green-50",
      combination: "text-purple-600 bg-purple-50",
      sensitive: "text-pink-600 bg-pink-50",
    };
    return colors[skinType] || "text-foreground bg-muted";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold">Analysis History</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your past skin analyses
            </p>
          </div>
          <Link href="/dashboard/analyze">
            <Button>New Analysis</Button>
          </Link>
        </div>

        {analyses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">No analyses yet</h3>
                <p className="text-muted-foreground mt-1">
                  Start your first skin analysis to see results here
                </p>
              </div>
              <Link href="/dashboard/analyze">
                <Button>Start Analysis</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 🔍 Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter & Search</CardTitle>
                <CardDescription>Find specific analyses</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search by date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                  value={filterSkinType}
                  onValueChange={setFilterSkinType}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by skin type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="oily">Oily</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="combination">Combination</SelectItem>
                    <SelectItem value="sensitive">Sensitive</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* 📄 Results */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">
                {filteredAnalyses.length}{" "}
                {filteredAnalyses.length === 1 ? "Result" : "Results"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnalyses.map((analysis) => (
                  <Card key={analysis.predictedID} className="overflow-hidden">
                    <div className="aspect-square flex-1 relative">
                      <img
                        src={
                          analysis.ImagePath
                            ? `/upload/${analysis.ImagePath}`
                            : "/placeholder.svg"
                        }
                        alt="Skin analysis"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium capitalize ${getSkinTypeColor(
                          analysis.predicted_class
                        )}`}
                      >
                        {analysis.predicted_class}
                      </div>
                    </div>
                    <CardContent className="pt-4 space-y-3">
                      <div>
                        <p className="font-medium">
                          {new Date(analysis.CreatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {analysis.percentages?.toFixed(2)}%
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/analysis/${analysis.predictedID}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteAnalysis(analysis.predictedID)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
