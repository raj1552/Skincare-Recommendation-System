package controllers

import (
	"gin-quickstart/initializers"
	"gin-quickstart/models"
	"net/http"
	"os"
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

	predictionIdParam := c.Param("id")

	// If predictionId is provided, fetch specific prediction
	if predictionIdParam != "" {
		predictionId, err := strconv.ParseUint(predictionIdParam, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prediction ID"})
			return
		}

		var prediction models.Prediction
		result := initializers.DB.Where("user_id = ? AND predict_id = ?", userId, predictionId).First(&prediction)
		if result.Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"analysis": prediction})
		return
	}

	// If no predictionId, fetch all analyses for user
	var predictions []models.Prediction
	result := initializers.DB.Where("user_id = ?", userId).Find(&predictions)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch analyses"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"analyses": predictions})
}

func DeleteAnalysis(c *gin.Context) {
	userIdParam := c.Param("userId")
	predictionIdParam := c.Param("id")

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
	result := initializers.DB.Where("user_id = ? AND predict_id = ?", userId, predictionId).First(&prediction)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
		return
	}

	// Delete the image file if it exists
	if prediction.ImagePath != "" {
		err := os.Remove("/home/raj/skincare-app/frontend/public/upload/" + prediction.ImagePath)
		if err != nil && !os.IsNotExist(err) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image file"})
			return
		}
	}

	// Delete the database record
	if err := initializers.DB.Delete(&prediction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete analysis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Analysis deleted successfully"})
}
