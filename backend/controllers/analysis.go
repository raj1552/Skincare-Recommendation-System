package controllers

import (
	"gin-quickstart/initializers"
	"gin-quickstart/models"
	"gin-quickstart/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAnalyses(c *gin.Context) {
	userIdParam := c.Param("userId")
	if userIdParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required"})
		return
	}

	userId, err := strconv.ParseUint(userIdParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UserID"})
		return
	}

	predictionIdParam := c.Param("predictionID")

	if predictionIdParam != "" {
		predictionId, err := strconv.ParseUint(predictionIdParam, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prediction ID"})
			return
		}

		var prediction models.Prediction
		err = initializers.DB.
			Preload("Image").
			Where("user_id = ? AND predict_id = ?", userId, predictionId).
			First(&prediction).Error

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"analysis": prediction})
		return
	}

	var predictions []models.Prediction
	err = initializers.DB.
		Preload("Image").
		Where("user_id = ?", userId).
		Order("created_at desc").
		Find(&predictions).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch analyses"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"analyses": predictions})
}

func DeleteAnalysis(c *gin.Context) {
	userIdParam := c.Param("userId")
	predictionIdParam := c.Param("predictionID")

	if userIdParam == "" || predictionIdParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID and Prediction ID are required"})
		return
	}

	userId, err := strconv.ParseUint(userIdParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UserID"})
		return
	}

	predictionId, err := strconv.ParseUint(predictionIdParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Prediction ID"})
		return
	}

	var prediction models.Prediction
	err = initializers.DB.
		Preload("Image").
		Where("user_id = ? AND predict_id = ?", userId, predictionId).
		First(&prediction).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
		return
	}

	// 1. Delete image from S3
	if prediction.Image.ID != 0 {
		if err := utils.DeleteFromS3(prediction.Image.S3Key); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image from S3"})
			return
		}

		// 2. Delete image record
		initializers.DB.Delete(&prediction.Image)
	}

	// 3. Delete prediction
	if err := initializers.DB.Delete(&prediction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete analysis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Analysis deleted successfully"})
}
