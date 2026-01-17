package models

import (
	"time"
)

type Prediction struct {
	PredictId uint `gorm:"primaryKey" json:"predicted_id"`
	UserID    uint `json:"user_id"`

	ImageID uint  `json:"image_id"`
	Image   Image `gorm:"foreignKey:ImageID"`

	PredictedClass string  `json:"predicted_class"`
	Percentages    float64 `json:"percentages"`

	CreatedAt time.Time `json:"created_at"`
}
