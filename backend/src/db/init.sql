CREATE TABLE "user" (
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

CREATE TABLE conversation (
                              id BIGSERIAL PRIMARY KEY,
                              user_id BIGINT REFERENCES "user"(id),
                              subject VARCHAR(255),
                              type VARCHAR(20),
                              status VARCHAR(20),
                              created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE message (
                         id BIGSERIAL PRIMARY KEY,
                         conversation_id BIGINT REFERENCES conversation(id),
                         author VARCHAR(50),
                         author_type VARCHAR(20),
                         content TEXT,
                         created_at TIMESTAMP DEFAULT NOW()
);
