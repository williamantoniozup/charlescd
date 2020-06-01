CREATE DATABASE charlesmoove;
CREATE USER charlesmoove WITH PASSWORD '${charlesmoove_password}';
GRANT ALL PRIVILEGES ON DATABASE charlesmoove TO charlesmoove;
