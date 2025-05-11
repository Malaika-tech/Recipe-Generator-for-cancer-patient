package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	_ "github.com/swaggo/swag/example/basic/web/docs"
)

// @title           Communication Service API
// @version         1.0
// @description     API for handling real-time communication between patients and nutritionists
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Swagger documentation
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Health check
	// @Summary Health check endpoint
	// @Description Get the health status of the communication service
	// @Tags health
	// @Produce json
	// @Success 200 {object} map[string]string
	// @Router / [get]
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Communication Service is running",
		})
	})

	// WebSocket endpoint for real-time messaging
	// @Summary WebSocket connection for real-time messaging
	// @Description Establish a WebSocket connection for real-time communication
	// @Tags websocket
	// @Security BearerAuth
	// @Router /ws [get]
	r.GET("/ws", func(c *gin.Context) {
		// TODO: Implement WebSocket connection handling
	})

	// REST endpoints for message history
	// @Summary Get conversation messages
	// @Description Retrieve message history for a specific conversation
	// @Tags messages
	// @Security BearerAuth
	// @Param conversationId path string true "Conversation ID"
	// @Param limit query int false "Number of messages to return" default(50) minimum(1) maximum(100)
	// @Produce json
	// @Success 200 {array} Message
	// @Router /messages/{conversationId} [get]
	r.GET("/messages/:conversationId", func(c *gin.Context) {
		// TODO: Implement message history retrieval
	})

	// @Summary Send a message
	// @Description Send a new message in a conversation
	// @Tags messages
	// @Security BearerAuth
	// @Accept json
	// @Produce json
	// @Param message body MessageRequest true "Message details"
	// @Success 201 {object} Message
	// @Router /messages [post]
	r.POST("/messages", func(c *gin.Context) {
		// TODO: Implement message sending
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// Message represents a chat message
type Message struct {
	ID             string `json:"id"`
	ConversationID string `json:"conversationId"`
	SenderID       string `json:"senderId"`
	Content        string `json:"content"`
	Timestamp      string `json:"timestamp"`
	IsRead         bool   `json:"isRead"`
}

// MessageRequest represents the request body for sending a message
type MessageRequest struct {
	ConversationID string `json:"conversationId" binding:"required"`
	Content        string `json:"content" binding:"required"`
} 