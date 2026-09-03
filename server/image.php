<?php
// image.php
header("Access-Control-Allow-Origin: *"); // Enable CORS for React

// 1. Get the requested image token or name safely
if (!isset($_GET['file']) || empty($_GET['file'])) {
    header("HTTP/1.0 400 Bad Request");
    exit;
}

// 2. SECURITY: Force clean the filename to prevent Directory Traversal attacks (../)
$filename = basename($_GET['file']); 

// 3. Define the real, hidden path to your uploads folder
$hidden_upload_dir = __DIR__ . '/uploads/'; 
$filePath = $hidden_upload_dir . $filename;

// 4. Validate existence and serve securely
if (file_exists($filePath)) {
    // Detect image type (image/jpeg, image/png, etc.)
    $mimeType = mime_content_type($filePath);
    
    header("Content-Type: " . $mimeType);
    header("Content-Length: " . filesize($filePath));
    
    // Clear out any previous PHP output buffers to prevent image corruption
    ob_clean();
    flush();
    
    // Stream file directly to the user's browser
    readfile($filePath);
    exit;
} else {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(["error" => "Resource not found"]);
    exit;
}
?>
