// ✅ Supported skin type categories
export type SkinType = "dry" | "oily" | "normal" | "combination" | "sensitive"

// ✅ Represents a single skin analysis record returned by API
export interface SkinAnalysis {
  predictedID: string        // Unique ID for the prediction
  ImagePath: string          // Path or filename of the uploaded image
  predicted_class: SkinType  // Predicted skin type
  percentages?: number       // Confidence percentage (0–100)
  CreatedAt: string          // ISO date string, e.g. "2025-10-21T03:48:20.802Z"
  user_id: string            // ID of the user who submitted the analysis
  recommendations?: string[] // Optional array of recommendations
}

// ✅ API response for GET /analysis/:userId
export interface AnalysisResponse {
  analyses: SkinAnalysis[]
}

// ✅ Optional: User type (same as in auth context)
export interface User {
  id?: string
  name?: string
  email: string
}
