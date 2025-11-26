package main

import (
	"gin-quickstart/controllers"
	"gin-quickstart/initializers"
	"gin-quickstart/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()

}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://skincare-recommendation-system-frontend.onrender.com"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}))

	router.POST("/auth/signup", controllers.CreateUser)
	router.POST("/auth/login", controllers.Login)
	router.POST("/predict", controllers.UploadHandler)
	router.GET("/user/profile", middlewares.CheckAuth, controllers.GetUserProfile)
	router.GET("/analysis/:userId", controllers.GetAnalyses)
	router.GET("/analysis/detail/:userId/:id", controllers.GetAnalyses)
	router.DELETE("/analysis/:userId/:id", controllers.DeleteAnalysis)
	router.Run()
}
