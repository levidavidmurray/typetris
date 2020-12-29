-- Your SQL goes here

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(20) NOT NULL,
    score INT NOT NULL,
    request_ip VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);