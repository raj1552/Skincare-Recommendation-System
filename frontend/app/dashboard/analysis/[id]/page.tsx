"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Products } from "@/data/Products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      window.scrollTo(0, 0);
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return router.replace("/login");

      const user = JSON.parse(storedUser);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analysis/detail/${user.id}/${params.id}`
        );
        if (!response.ok) throw new Error("Analysis not Found");

        const data = await response.json();
        console.log(data);
        setAnalysis(data.analysis);
      } catch (err) {
        console.error(err);
        router.replace("/dashboard");
      }
    };
    fetchAnalysis();
  }, [params.id, router]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const getSkinTypeInfo = (skinType: string) => {
    const info: Record<
      string,
      {
        color: string;
        description: string;
        characteristics: string[];
        tips: string[];
      }
    > = {
      dry: {
        color: "text-amber-600",
        description:
          "Your skin tends to feel tight and may show flaking or rough patches.",
        characteristics: [
          "Tight feeling after cleansing",
          "Visible flaking",
          "Fine lines more apparent",
          "Dull appearance",
        ],
        tips: [
          "Use gentle, creamy cleansers",
          "Apply rich moisturizers",
          "Avoid hot water",
          "Use hydrating serums with hyaluronic acid",
        ],
      },
      oily: {
        color: "text-blue-600",
        description:
          "Your skin produces excess sebum, leading to shine and potential breakouts.",
        characteristics: [
          "Shiny appearance",
          "Enlarged pores",
          "Prone to acne",
          "Makeup doesn't last long",
        ],
        tips: [
          "Use oil-free, non-comedogenic products",
          "Cleanse twice daily",
          "Use lightweight moisturizers",
          "Consider salicylic acid treatments",
        ],
      },
      normal: {
        color: "text-green-600",
        description: "Your skin is well-balanced with minimal concerns.",
        characteristics: [
          "Balanced moisture",
          "Few imperfections",
          "Not too oily or dry",
          "Smooth texture",
        ],
        tips: [
          "Maintain your routine",
          "Use gentle cleansers",
          "Apply daily SPF",
          "Keep skin hydrated",
        ],
      },
      combination: {
        color: "text-purple-600",
        description:
          "Your skin has both oily and dry areas, typically oily in the T-zone.",
        characteristics: [
          "Oily T-zone",
          "Dry cheeks",
          "Enlarged pores on nose",
          "Mixed texture",
        ],
        tips: [
          "Use different products for different zones",
          "Balance with lightweight moisturizers",
          "Gentle exfoliation",
          "Oil-free products for T-zone",
        ],
      },
      sensitive: {
        color: "text-pink-600",
        description:
          "Your skin is easily irritated and may react to products or environmental factors.",
        characteristics: [
          "Redness or irritation",
          "Burning or stinging",
          "Reacts to products",
          "Prone to rashes",
        ],
        tips: [
          "Use fragrance-free products",
          "Patch test new products",
          "Avoid harsh ingredients",
          "Choose gentle, soothing formulas",
        ],
      },
    };
    return info[skinType] || info.normal;
  };

  const skinTypeInfo = getSkinTypeInfo(analysis.predicted_class);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold">Analysis Results</h1>
            <p className="text-muted-foreground mt-2">
              Analyzed on {new Date(analysis.CreatedAt).toLocaleDateString()}
            </p>
          </div>
          <Link href="/dashboard/analyze">
            <Button variant="outline">New Analysis</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={
                  analysis.ImagePath
                    ? `/upload/${analysis.ImagePath}`
                    : "/placeholder.svg"
                }
                alt="Analyzed skin"
                className="w-full rounded-lg object-cover"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detected Skin Type</CardTitle>
              <CardDescription>Based on AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className={`text-5xl font-bold capitalize`}>
                  {analysis.predicted_class}
                </p>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Confidence Score
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{
                          width: analysis?.percentages
                            ? `${analysis.percentages.toFixed(2)}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="font-medium">
                      {analysis?.percentages
                        ? `${analysis.percentages.toFixed(2)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                {skinTypeInfo.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skin Characteristics</CardTitle>
            <CardDescription>
              Common traits of {analysis.skinType} skin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skinTypeInfo.characteristics.map((char, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skincare Tips</CardTitle>
            <CardDescription>
              Recommendations for {analysis.skinType} skin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {skinTypeInfo.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Products</CardTitle>
            <CardDescription>
              Curated for your {analysis.skinType} skin type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Products[analysis.predicted_class as keyof typeof Products].map(
                (product) => (
                  <div
                    key={product.id}
                    className="border border-border rounded-lg p-4 space-y-3"
                  >
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-100 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand}
                      </p>
                    </div>
                    <p className="text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
