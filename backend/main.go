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
		AllowOrigins:     []string{"http://localhost:3001"},         // Allow your frontend origin
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},        
		AllowHeaders:     []string{"Content-Type", "Authorization"}, 
		AllowCredentials: true,                                      
		MaxAge:           12 * 60 * 60,                            
	}))

	router.POST("/auth/signup", controllers.CreateUser)
	router.POST("/auth/login", controllers.Login)
	router.GET("/user/profile", middlewares.CheckAuth, controllers.GetUserProfile)
	router.Run()
}
