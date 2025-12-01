package main

import (
	"log"

	"gin-quickstart/controllers"
	"gin-quickstart/initializers"
	"gin-quickstart/middlewares"
	"gin-quickstart/models" // ← This line is required

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()

	// AUTO MIGRATION — ONLY ADD THE MODELS THAT ACTUALLY EXIST IN models/
	log.Println("Running database auto-migration...")
	err := initializers.DB.AutoMigrate(
		&models.User{}, // ← 100% exists
		// &models.Analysis{},   // ← COMMENT THIS OUT IF IT DOESN'T EXIST YET
		// &models.Prediction{}, // ← OR use this if your struct is called Prediction
	)
	if err != nil {
		log.Fatalf("Auto migration failed: %v", err)
	}
	log.Println("Auto migration completed successfully!")
}

func main() {
	router := gin.Default()

	// CORS — your real frontend URL
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://skincare-recommendation-system-frontend.onrender.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}))

	// Routes
	router.POST("/auth/signup", controllers.CreateUser)
	router.POST("/auth/login", controllers.Login)
	router.POST("/predict", controllers.UploadHandler)

	router.GET("/user/profile", middlewares.CheckAuth, controllers.GetUserProfile)
	router.GET("/analysis/:userId", controllers.GetAnalyses)
	// Use the same handler that already exists in your code
	router.GET("/analysis/detail/:userId/:id", controllers.GetAnalyses) // ← already exists, reuse it
	router.DELETE("/analysis/:userId/:id", middlewares.CheckAuth, controllers.DeleteAnalysis)

	log.Println("Backend server starting...")
	router.Run() // Render overrides port automatically
}
