package models

import (
	"time"
)

type Prediction struct {
	PredictId      uint    `json:"predictedID" gorm:"primaryKey"`
	UserID         int     `json:"user_id"`
	PredictedClass string  `json:"predicted_class"`
	ImagePath      string  `json: "image_path"`
	Percentages    float64 `json:"percentages"`
	CreatedAt      time.Time
}
