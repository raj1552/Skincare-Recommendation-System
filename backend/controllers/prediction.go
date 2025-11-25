package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gin-quickstart/initializers"
	"gin-quickstart/models"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UploadHandler(c *gin.Context) {
	// 1. Get user ID
	userId := c.PostForm("userId")
	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required"})
		return
	}

	id, err := strconv.Atoi(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UserID"})
		return
	}

	// 2. Get uploaded file
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file received"})
		return
	}

	// 3. Save file locally
	uploadDir := "/home/raj/skincare-app/frontend/public/upload"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads folder"})
		return
	}

	filePath := filepath.Join(uploadDir, file.Filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// 4. Prepare multipart request for Python FastAPI
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", filepath.Base(filePath))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create multipart request (file)"})
		return
	}

	f, err := os.Open(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file"})
		return
	}
	defer f.Close()
	io.Copy(part, f)
	writer.Close()

	// 5. Get Python API URL from environment
	pythonAPI := os.Getenv("PYTHON_API_URL")
	if pythonAPI == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Python API URL not set in environment"})
		return
	}

	// 6. Send request to Python FastAPI
	resp, err := http.Post(pythonAPI, writer.FormDataContentType(), body)
	if err != nil {
		os.Remove(filePath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to connect to prediction API: %v", err)})
		return
	}
	defer resp.Body.Close()

	// 7. Read Python response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read prediction response"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": string(respBody)})
		return
	}

	// 8. Parse JSON into Prediction struct
	var pred models.Prediction
	if err := json.Unmarshal(respBody, &pred); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse prediction result"})
		return
	}

	// 9. Save additional info
	pred.ImagePath = file.Filename
	pred.UserID = id

	initializers.DB.Create(&pred)

	// 10. Return result
	c.JSON(http.StatusOK, gin.H{
		"message":   "Prediction successful",
		"predicted": pred,
	})
}
