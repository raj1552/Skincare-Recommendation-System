"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyzePage() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setSelectedImage(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  interface User {
    id: number;
    name: string;
    email: string;
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const storedUserJSON = localStorage.getItem("user");
      if (!storedUserJSON) {
        setError("User not found. Please login again.");
        return;
      }

      const storedUser: User = JSON.parse(storedUserJSON);
      const formData = new FormData();
      formData.append("userId", storedUser.id.toString());
      formData.append("image", selectedImage);

      const response = await fetch(url || '', {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();

      const skinType = result.predicted.predicted_class;
      const percentages = result.predicted.percentages;
      console.group(skinType, percentages);

      // Example basic recommendations (optional)
      const recommendations = [
        `Your skin type seems ${skinType}.`,
        percentages > 50
          ? "Confidence is strong — results are quite reliable."
          : "Confidence is moderate — consider uploading another photo for better accuracy.",
      ];

      const analysis = {
        id: result.predicted.predictedID,
        userid: result.predicted.user_id,
        imageUrl: result.predicted.ImagePath,
        skinType,
        percentages,
        analyzedAt: new Date().toISOString(),
        recommendations,
      };

      console.log(analysis)

      router.push(`/dashboard/analysis/${analysis.id}`);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold">Skin Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Upload a clear photo of your face to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Your Photo</CardTitle>
            <CardDescription>
              For best results, take a photo in natural lighting without makeup.
              Make sure your face is clearly visible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-96 mx-auto rounded-lg object-cover"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Choose Different Image
                  </Button>
                </div>
              ) : (
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PNG, JPG or JPEG (max. 5MB)
                      </p>
                    </div>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium text-sm">Tips for best results:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Use natural lighting, preferably near a window</li>
                <li>Remove makeup and cleanse your face</li>
                <li>Face the camera directly with a neutral expression</li>
                <li>Ensure your entire face is visible and in focus</li>
              </ul>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Analyzing...
                </>
              ) : (
                "Analyze My Skin"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">AI Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Our Vision Transformer model analyzes your skin to identify
                  your skin type
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Get Results</p>
                <p className="text-sm text-muted-foreground">
                  Receive your skin type classification with confidence score
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Personalized Recommendations</p>
                <p className="text-sm text-muted-foreground">
                  Get curated product suggestions tailored to your skin type
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
