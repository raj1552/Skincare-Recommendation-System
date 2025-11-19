package controllers

import (
	"encoding/json"
	"fmt"
	"gin-quickstart/initializers"
	"gin-quickstart/models"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UploadHandler(c *gin.Context) {
	userId := c.PostForm("userId")
	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Userid is Required"})
		return
	}

	id, err := strconv.Atoi(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UserID"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No File Received"})
		return
	}

	uploadDir := "/home/raj/skincare-app/frontend/public/upload"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads folder"})
		return
	}
	filePath := filepath.Join(uploadDir, file.Filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Save File"})
		return
	}

	cmd := exec.Command("/home/raj/skincare-app/python/venv/bin/python", "/home/raj/skincare-app/python/predict.py", filePath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		os.Remove(filePath)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("Python error: %v, output: %s", err, string(output)),
		})
		return
	}

	var pred models.Prediction
	if err := json.Unmarshal(output, &pred); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse Python Output"})
		return
	}

	filename := file.Filename
	pred.ImagePath = filename // Gives Full File Name

	prediction := models.Prediction{
		PredictedClass: pred.PredictedClass,
		Percentages:    pred.Percentages,
		UserID:         id,
		ImagePath:      pred.ImagePath,
	}

	initializers.DB.Create(&prediction)

	c.JSON(http.StatusOK, gin.H{
		"message":   "Prediction successful",
		"predicted": prediction,
	})
}
