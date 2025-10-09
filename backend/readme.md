# Go Authentication System with Gin and Gorm

This is a simple authentication system built with Go, Gin, GORM, and PostgreSQL. It allows users to register, login, and receive a JWT token for authentication.

## Setup

1. **Clone the repo**:  
```bash
git clone git@github.com:raj1552/Auth-System-Using-Go-Gin-and-Gorm.git
cd /Auth-System-Using-Go-Gin-and-Gorm
Create a .env file in the root with the following:

env
PORT=3000
DB_URL="host=localhost user= password= dbname= port= sslmode=disable"
SECRET=jwt-secret
Update values according to your PostgreSQL setup and secret key.

Install dependencies and run:

bash
go mod tidy
go run main.go

Server runs on http://localhost:3000.

API
POST /auth/signup – Create a new user. Body:
json
{ "username": "yourusername", "password": "yourpassword" }

POST /auth/login – Login and receive JWT. Body:
json
{ "username": "yourusername", "password": "yourpassword" }

Response:
json
{ "token": "your-jwt-token" }