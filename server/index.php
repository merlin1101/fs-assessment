<?php
ini_set('display_errors', 1);
// Set headers for JSON delivery
header('Content-Type: application/json; charset=UTF-8');
require_once(__DIR__ . '/config/DatabaseConnection.php');
require_once(__DIR__ . '/model/ProductsRepository.php');
require_once(__DIR__ . '/model/OrdersRepository.php');

// Load .env variables for local
$env_file_path = __DIR__ . '/.env';

if (file_exists($env_file_path)) {
    loadEnv($env_file_path);
}

function loadEnv(string $path) 
{    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value, " \t\r\n\0\x0B\"'");

            putenv("{$key}={$value}");
            $_ENV[$key] = $value;            
        }
    }
    
}

// Pass mysqli connection to model files
// $dbManager = new DatabaseConnection();
// $mysqliInstance = $dbManager->getConnection();
// Registry::set('db', $mysqliInstance);

// API endpoints
if (file_exists(__DIR__ . '/routes/api.php')) {
    require_once __DIR__ . '/routes/api.php';
} else {
    http_response_code(500);
    echo json_encode(['error' => 'router file missing']);
}
