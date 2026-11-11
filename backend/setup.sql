CREATE DATABASE IF NOT EXISTS employee_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'employee_app'@'localhost'
    IDENTIFIED BY 'replace_with_your_password';

GRANT
    SELECT,
    INSERT,
    UPDATE,
    DELETE,
    CREATE
ON employee_db.*
TO 'employee_app'@'localhost';
