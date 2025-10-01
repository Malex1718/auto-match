-- Crear base de datos si no existe
-- CREATE DATABASE vehiculos_db;

-- Tabla de marcas
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    logo TEXT,
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de tipos de vehículo
CREATE TABLE IF NOT EXISTS vehicle_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de tipos de combustible
CREATE TABLE IF NOT EXISTS fuel_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de tipos de transmisión
CREATE TABLE IF NOT EXISTS transmissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla principal de vehículos
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    model VARCHAR(200) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
    type_id INTEGER NOT NULL REFERENCES vehicle_types(id),
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) DEFAULT 'MXN',
    fuel_type_id INTEGER NOT NULL REFERENCES fuel_types(id),
    transmission_id INTEGER NOT NULL REFERENCES transmissions(id),
    doors INTEGER CHECK (doors >= 0 AND doors <= 10),
    seats INTEGER CHECK (seats >= 1 AND seats <= 50),
    engine_size DECIMAL(3,1) CHECK (engine_size >= 0),
    horsepower INTEGER CHECK (horsepower >= 0),
    torque INTEGER CHECK (torque >= 0),
    fuel_economy DECIMAL(4,1) CHECK (fuel_economy >= 0),
    tank_capacity DECIMAL(5,1) CHECK (tank_capacity >= 0),
    cargo_space DECIMAL(7,1) CHECK (cargo_space >= 0),
    image_url TEXT,
    description TEXT,
    safety_rating DECIMAL(2,1) CHECK (safety_rating >= 0 AND safety_rating <= 5),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de características de vehículos
CREATE TABLE IF NOT EXISTS vehicle_features (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    UNIQUE(vehicle_id, feature)
);

-- Tabla de imágenes adicionales de vehículos
CREATE TABLE IF NOT EXISTS vehicle_images (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50), -- interior, exterior, engine, etc.
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de especificaciones técnicas adicionales
CREATE TABLE IF NOT EXISTS vehicle_specs (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    spec_name VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    spec_unit VARCHAR(20),
    spec_category VARCHAR(50), -- performance, dimensions, safety, etc.
    UNIQUE(vehicle_id, spec_name)
);

-- Tabla de búsquedas de usuarios (para analytics y mejora del agente IA)
CREATE TABLE IF NOT EXISTS user_searches (
    id SERIAL PRIMARY KEY,
    search_query TEXT,
    filters JSONB,
    results_count INTEGER,
    selected_vehicle_id INTEGER REFERENCES vehicles(id),
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de preferencias de usuarios para el agente IA
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    preference_type VARCHAR(50), -- budget, usage, features, etc.
    preference_value TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_vehicles_brand_id ON vehicles(brand_id);
CREATE INDEX idx_vehicles_type_id ON vehicles(type_id);
CREATE INDEX idx_vehicles_fuel_type_id ON vehicles(fuel_type_id);
CREATE INDEX idx_vehicles_transmission_id ON vehicles(transmission_id);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_model ON vehicles(model);
CREATE INDEX idx_vehicle_features_vehicle_id ON vehicle_features(vehicle_id);
CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_specs_vehicle_id ON vehicle_specs(vehicle_id);
CREATE INDEX idx_user_searches_session_id ON user_searches(session_id);
CREATE INDEX idx_user_searches_created_at ON user_searches(created_at);

-- Índice de texto completo para búsquedas
CREATE INDEX idx_vehicles_search ON vehicles USING gin(
    to_tsvector('spanish', 
        coalesce(model, '') || ' ' || 
        coalesce(description, '')
    )
);

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos iniciales de catálogo
INSERT INTO vehicle_types (name) VALUES 
    ('Sedan'),
    ('SUV'),
    ('Pickup'),
    ('Hatchback'),
    ('Coupe'),
    ('Convertible'),
    ('Minivan'),
    ('Van'),
    ('Crossover'),
    ('Wagon')
ON CONFLICT (name) DO NOTHING;

INSERT INTO fuel_types (name) VALUES 
    ('Gasolina'),
    ('Diesel'),
    ('Híbrido'),
    ('Híbrido Enchufable'),
    ('Eléctrico'),
    ('Gas LP'),
    ('Gas Natural')
ON CONFLICT (name) DO NOTHING;

INSERT INTO transmissions (name) VALUES 
    ('Manual'),
    ('Automática'),
    ('CVT'),
    ('Dual-Clutch'),
    ('Semi-Automática')
ON CONFLICT (name) DO NOTHING;

-- Insertar algunas marcas populares en México
INSERT INTO brands (name, country) VALUES 
    ('Toyota', 'Japón'),
    ('Nissan', 'Japón'),
    ('Mazda', 'Japón'),
    ('Honda', 'Japón'),
    ('Volkswagen', 'Alemania'),
    ('General Motors', 'Estados Unidos'),
    ('Ford', 'Estados Unidos'),
    ('Chevrolet', 'Estados Unidos'),
    ('KIA', 'Corea del Sur'),
    ('Hyundai', 'Corea del Sur'),
    ('Peugeot', 'Francia'),
    ('Renault', 'Francia'),
    ('SEAT', 'España'),
    ('BMW', 'Alemania'),
    ('Mercedes-Benz', 'Alemania'),
    ('Audi', 'Alemania'),
    ('Jeep', 'Estados Unidos'),
    ('RAM', 'Estados Unidos'),
    ('Mitsubishi', 'Japón'),
    ('Suzuki', 'Japón')
ON CONFLICT (name) DO NOTHING;