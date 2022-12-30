CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    MiddleName VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255));

CREATE TABLE work (
    id SERIAL PRIMARY KEY,
    time VARCHAR(255),
    chislo DATE,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id));