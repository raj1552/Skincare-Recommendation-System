// initializers/loadEnvs.go  → replace your current function with this
package initializers

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnvs() {
	// Try to load .env, but don't panic if it doesn't exist (Render uses env vars directly)
	err := godotenv.Load()
	if err != nil {
		log.Println(".env file not found – using environment variables directly (this is normal on Render)")
	}

	// Optional: log that we're running in production
	if os.Getenv("RENDER") == "true" {
		log.Println("Running on Render – using injected environment variables")
	}
}
