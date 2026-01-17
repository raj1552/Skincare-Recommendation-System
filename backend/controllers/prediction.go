package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gin-quickstart/initializers"
	"gin-quickstart/models"
	"gin-quickstart/utils"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
	fileHeader, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file received"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer file.Close()

	// 3. Upload image to S3
	ext := filepath.Ext(fileHeader.Filename)
	imageUUID := uuid.New().String()
	s3Key := fmt.Sprintf("images/%d/%s%s", id, imageUUID, ext)

	imageURL, err := utils.UploadToS3(
		file,
		s3Key,
		fileHeader.Header.Get("Content-Type"),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image to S3"})
		return
	}

	// 4. Save image metadata in DB
	image := models.Image{
		UserID:   uint(id),
		S3Key:    s3Key,
		S3URL:    imageURL,
		Bucket:   os.Getenv("AWS_S3_BUCKET"),
		FileName: fileHeader.Filename,
		FileSize: fileHeader.Size,
		MimeType: fileHeader.Header.Get("Content-Type"),
	}

	if err := initializers.DB.Create(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
		return
	}

	// 5. Prepare multipart request for Python FastAPI
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create multipart file"})
		return
	}

	// reopen file for FastAPI request
	fileForML, _ := fileHeader.Open()
	defer fileForML.Close()
	io.Copy(part, fileForML)
	writer.Close()

	// 6. Call Python API
	pythonAPI := os.Getenv("PYTHON_API_URL")
	if pythonAPI == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Python API URL not set"})
		return
	}

	resp, err := http.Post(pythonAPI, writer.FormDataContentType(), body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to prediction API"})
		return
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read prediction response"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": string(respBody)})
		return
	}

	// 7. Parse prediction
	var pred models.Prediction
	if err := json.Unmarshal(respBody, &pred); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse prediction"})
		return
	}

	// 8. Attach user + image
	pred.UserID = uint(id)
	pred.ImageID = image.ID

	if err := initializers.DB.Create(&pred).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save prediction"})
		return
	}

	// 9. Return response
	c.JSON(http.StatusOK, gin.H{
		"message":    "Prediction successful",
		"prediction": pred,
		"image":      image,
	})
}
