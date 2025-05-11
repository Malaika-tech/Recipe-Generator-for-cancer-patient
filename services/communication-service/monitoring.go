package main

import (
	"log"
	"net/http"
	"os"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

func init() {
	// Configure logging
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetOutput(os.Stdout)
	logger.SetLevel(logrus.InfoLevel)

	// Create logs directory if it doesn't exist
	if err := os.MkdirAll("logs", 0755); err != nil {
		log.Fatal("Failed to create logs directory:", err)
	}

	// Add file output
	file, err := os.OpenFile("logs/communication_service.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err == nil {
		logger.SetOutput(file)
	} else {
		logger.Info("Failed to log to file, using default stderr")
	}
}

// RequestLogger middleware for logging HTTP requests
func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		// Process request
		c.Next()

		// Log request details
		latency := time.Since(start)
		clientIP := c.ClientIP()
		method := c.Request.Method
		statusCode := c.Writer.Status()

		logger.WithFields(logrus.Fields{
			"status":     statusCode,
			"latency":    latency,
			"client_ip":  clientIP,
			"method":     method,
			"path":       path,
			"query":      raw,
			"user_agent": c.Request.UserAgent(),
		}).Info("Request completed")
	}
}

// ErrorLogger middleware for logging errors
func ErrorLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			for _, e := range c.Errors {
				logger.WithFields(logrus.Fields{
					"error": e.Error(),
					"path":  c.Request.URL.Path,
				}).Error("Request error")
			}
		}
	}
}

// HealthCheck handler for monitoring service health
func HealthCheck(c *gin.Context) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	health := gin.H{
		"status":    "UP",
		"timestamp": time.Now(),
		"uptime":    time.Since(startTime).String(),
		"memory": gin.H{
			"alloc":      m.Alloc,
			"total_alloc": m.TotalAlloc,
			"sys":        m.Sys,
			"num_gc":     m.NumGC,
		},
		"goroutines": runtime.NumGoroutine(),
	}

	logger.WithFields(logrus.Fields(health)).Info("Health check")
	c.JSON(http.StatusOK, health)
}

var startTime = time.Now() 