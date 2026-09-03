<?php
// $host = "localhost";
// $user = "root";
// $pass = "";
// $db   = "fs-db"; 

define('DB_HOST', 'localhost');
define('DB_NAME', 'fs-db');
define('DB_USER', 'root');
define('DB_PASS', '');

class DatabaseConnection 
{
    private static $instance = null;
    private $mysqli = null;

    // A private constructor prevents creating objects via 'new DatabaseConnection()' outside this file
    private function __construct() {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

        try {
            $this->mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            $this->mysqli->set_charset("utf8mb4");
        } catch(mysqli_sql_exception $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    // Static method to get the single shared instance
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // Helper method to return the actual MySQLi object
    public function getConnection() {
        return $this->mysqli;
    }
}
