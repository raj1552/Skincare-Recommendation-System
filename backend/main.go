package main

import (
	"log" // ← ADD THIS

	"gin-quickstart/controllers"
	"gin-quickstart/initializers"
	"gin-quickstart/middlewares"
	"gin-quickstart/models" // ← ADD THIS (your models package)

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()

	// AUTO MIGRATION — THIS FIXES YOUR PROBLEM
	log.Println("Running database auto-migration...")
	err := initializers.DB.AutoMigrate(
		&models.User{},     // ← your User model
		&models.Analysis{}, // ← your Analysis / Prediction model (check exact name)
		// Add any other models here if you have more
	)
	if err != nil {
		log.Fatalf("Auto migration failed: %v", err)
	}
	log.Println("Auto migration completed successfully!")
}

func main() {
	router := gin.Default()

	// CORS — updated to your real frontend URL
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://skincare-recommendation-system-1.onrender.com"}, // ← your actual frontend URL
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
	router.GET("/analysis/detail/:userId/:id", controllers.GetAnalysisDetail) // ← fixed route name if needed
	router.DELETE("/analysis/:userId/:id", middlewares.CheckAuth, controllers.DeleteAnalysis)

	log.Println("Backend server starting on :8080...")
	router.Run() // defaults to :8080, Render overrides with $PORT
}
