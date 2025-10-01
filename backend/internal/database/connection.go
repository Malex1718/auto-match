package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

type DB struct {
	SQL   *sql.DB
	Redis *redis.Client
	ctx   context.Context
}

func NewConnection() (*DB, error) {
	// Configuración PostgreSQL
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "vehiculos_db")
	sslMode := getEnv("DB_SSL_MODE", "disable")

	// Construir DSN de PostgreSQL
	psqlDSN := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, sslMode,
	)

	// Conectar a PostgreSQL
	sqlDB, err := sql.Open("postgres", psqlDSN)
	if err != nil {
		return nil, fmt.Errorf("error al abrir conexión con PostgreSQL: %w", err)
	}

	// Configurar pool de conexiones
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	// Verificar conexión
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := sqlDB.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("error al conectar con PostgreSQL: %w", err)
	}

	// Configuración Redis
	redisHost := getEnv("REDIS_HOST", "localhost")
	redisPort := getEnv("REDIS_PORT", "6379")
	redisPassword := getEnv("REDIS_PASSWORD", "")
	redisDB := 0 // default DB

	// Conectar a Redis
	rdb := redis.NewClient(&redis.Options{
		Addr:         fmt.Sprintf("%s:%s", redisHost, redisPort),
		Password:     redisPassword,
		DB:           redisDB,
		PoolSize:     10,
		MinIdleConns: 2,
		MaxRetries:   3,
	})

	// Verificar conexión con Redis
	if _, err := rdb.Ping(ctx).Result(); err != nil {
		log.Printf("Advertencia: No se pudo conectar a Redis: %v", err)
		// No retornamos error porque Redis es opcional (caché)
	}

	log.Println("✓ Conexión establecida con PostgreSQL")
	if rdb != nil {
		log.Println("✓ Conexión establecida con Redis")
	}

	return &DB{
		SQL:   sqlDB,
		Redis: rdb,
		ctx:   context.Background(),
	}, nil
}

func (db *DB) Close() {
	if db.SQL != nil {
		db.SQL.Close()
	}
	if db.Redis != nil {
		db.Redis.Close()
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// Métodos de utilidad para transacciones
func (db *DB) BeginTx(ctx context.Context) (*sql.Tx, error) {
	return db.SQL.BeginTx(ctx, nil)
}

// Cache helpers
func (db *DB) SetCache(key string, value string, expiration time.Duration) error {
	if db.Redis == nil {
		return nil // Si Redis no está disponible, no hacer nada
	}
	return db.Redis.Set(db.ctx, key, value, expiration).Err()
}

func (db *DB) GetCache(key string) (string, error) {
	if db.Redis == nil {
		return "", redis.Nil
	}
	return db.Redis.Get(db.ctx, key).Result()
}

func (db *DB) DeleteCache(pattern string) error {
	if db.Redis == nil {
		return nil
	}
	keys, err := db.Redis.Keys(db.ctx, pattern).Result()
	if err != nil {
		return err
	}
	if len(keys) > 0 {
		return db.Redis.Del(db.ctx, keys...).Err()
	}
	return nil
}