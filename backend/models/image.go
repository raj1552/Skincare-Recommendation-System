package models

import "time"

type Image struct {
	ID     uint `gorm:"primaryKey" json:"id"`
	UserID uint `gorm:"index;not null" json:"user_id"`

	Bucket string `gorm:"not null" json:"bucket"`
	S3Key  string `gorm:"not null" json:"s3_key"`
	S3URL  string `gorm:"not null" json:"s3_url"`

	FileName string `json:"file_name"`
	FileSize int64  `json:"file_size"`
	MimeType string `json:"mime_type"`

	CreatedAt time.Time `json:"created_at"`
}
