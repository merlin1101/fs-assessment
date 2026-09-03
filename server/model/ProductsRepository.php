<?php

class ProductsRepository 
{
    private $tableName = 'products';

    public function getProducts($productIds) {
        $db = DatabaseConnection::getInstance()->getConnection();

        // Dynamically build the exact count of placeholders needed: "?, ?, ?
        $placeholders = implode(', ', array_fill(0, count($productIds), '?'));

        $sql = "SELECT id, name, price FROM {$this->tableName} WHERE id IN ({$placeholders})";

        try {
            $result = $db->execute_query($sql, $productIds);
            $productsData = $result->fetch_all(MYSQLI_ASSOC);
        } catch (mysqli_sql_exception $e) {
            error_log("Fetching products failed: " . $e->getMessage());
            $productsData = [];
        }

        return $productsData;
    }
    
    public function getAllProducts() {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        // Define your secure base proxy URL string
        $proxy_url = "http://localhost/fs-assessment/server/image.php?file=";

        $result = $db->execute_query("SELECT id, name, description, price, CONCAT('$proxy_url', image) AS image, created_at FROM {$this->tableName}");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function create(array $requestData) {
        $db = DatabaseConnection::getInstance()->getConnection();

        // Extract column names
        $columns = array_keys($requestData);
        $escapedColumns = implode(', ', $columns);
        
        // Creates a string like "?, ?, ?, ?" placeholders based on how many fields were passed
        $placeholders = implode(', ', array_fill(0, count($requestData), '?'));

        // Extract the clean raw values to bind
        $values = array_values($requestData);

        // Prepare the query string
        $sql = "INSERT INTO {$this->tableName} ({$escapedColumns}) VALUES ({$placeholders})";

        // Execute safely using modern MySQLi parameterized structures
        try {
            $db->execute_query($sql, $values);
            return true;
        } catch (mysqli_sql_exception $e) {
            error_log("Product insertion failed: " . $e->getMessage());
            return false;
        }
    }
}
