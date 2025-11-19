package main

import (
	"gin-quickstart/initializers"
	"gin-quickstart/models"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()

}

func main() {
	initializers.DB.AutoMigrate(&models.User{}, &models.Prediction{})
}
