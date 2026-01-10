
-- Script SQL complet pour POC Chat + Réservation (PostgreSQL)



-- Table USER (pour le chat et les réservations)

CREATE TABLE IF NOT EXISTS "user" (
    id BIGSERIAL PRIMARY KEY,
    last_name VARCHAR(50),
    first_name VARCHAR(50),
    date_of_birth DATE,
    address VARCHAR(255),
    email VARCHAR(100),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    );


-- Table CONVERSATION (POC chat)

CREATE TABLE IF NOT EXISTS conversation (
     id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES "user"(id),
    subject VARCHAR(255),
    type VARCHAR(20),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
    );


-- Table MESSAGE (POC chat)

CREATE TABLE IF NOT EXISTS message (
     id BIGSERIAL PRIMARY KEY,
     conversation_id BIGINT REFERENCES conversation(id),
    author VARCHAR(50),
    author_type VARCHAR(20),
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
    );


-- Table AGENCIES

CREATE TABLE IF NOT EXISTS agencies (
    id_agency SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    address VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255)
    );


-- Table VEHICULES

CREATE TABLE IF NOT EXISTS vehicules (
    id_vehicule SERIAL PRIMARY KEY,
    id_agency INT NOT NULL REFERENCES agencies(id_agency),
    category VARCHAR(100),
    model VARCHAR(100),
    brand VARCHAR(100),
    year INT,
    license_plate VARCHAR(50),
    status VARCHAR(50)
    );


-- Table RESERVATIONS
CREATE TABLE IF NOT EXISTS reservations (
    id_reservation SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES "user"(id),
    id_vehicule INT NOT NULL REFERENCES vehicules(id_vehicule),
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,
    pickup_agency_id INT NOT NULL REFERENCES agencies(id_agency),
    return_agency_id INT NOT NULL REFERENCES agencies(id_agency),
    total_price NUMERIC(10,2),
    status VARCHAR(50)
    );


-- Table PAYMENTS

CREATE TABLE IF NOT EXISTS payments (
    id_payment SERIAL PRIMARY KEY,
    id_reservation INT NOT NULL REFERENCES reservations(id_reservation),
    amount NUMERIC(10,2),
    status VARCHAR(50),
    payment_provider VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


