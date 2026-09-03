<?php
header('Content-Type: application/json');
// require_once __DIR__ . '/../model/ProductsRepository.php';

class ProductController 
{
    public function getProducts() {
        $productRepository = new ProductsRepository();        
        $products = $productRepository->getAllProducts();
        
        if ($products) {
            http_response_code(200);
            echo json_encode(["message" => "Product fetched successfully", "status" => "success", "products" => $products]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Something went wrong", "status" => "error"]);
        }
        
        exit();
    }

    public function createProduct(array $request)
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->jsonResponse(false, 'Method not allowed. Use POST.', 405);
        }

        // Extract and Sanitize Text Inputs
        $name  = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
        $description  = isset($_POST['description']) ? trim(htmlspecialchars($_POST['description'])) : '';
        $price = isset($_POST['price']) ? filter_var($_POST['price'], FILTER_VALIDATE_FLOAT) : false;

        // Validate Text Fields
        if (empty($name)) {
            return $this->jsonResponse(false, 'Product name is required.');
        }
        if ($price === false || $price <= 0) {
            return $this->jsonResponse(false, 'Price must be a valid number greater than 0.');
        }

        // Prepare the initial payload
        $productPayload = [
            'name'  => $name,
            'price' => $price,
            'description' => $description
        ];

        // Secure File Upload Processing & Validation
        if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            $file = $_FILES['image'];

            // Check for native upload transmission errors
            if ($file['error'] !== UPLOAD_ERR_OK) {
                return $this->jsonResponse(false, 'File upload failed with systemic error code: ' . $file['error']);
            }

            // Enforce safe maximum size boundaries (e.g., 2MB Max)
            $maxFileSize = 2 * 1024 * 1024; 
            if ($file['size'] > $maxFileSize) {
                return $this->jsonResponse(false, 'Image size exceeds maximum limit of 2MB.');
            }

            // Verify MIME Type using finfo to prevent executable file extensions
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->file($file['tmp_name']);
            $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

            if (!in_array($mimeType, $allowedTypes)) {
                return $this->jsonResponse(false, 'Invalid image format. Allowed formats: JPG, PNG, WEBP.');
            }

            // Establish file routing structures
            $uploadDir = __DIR__ . '/../uploads/';
            
            // Create target folder dynamically if it doesn't exist yet
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            // Build a completely unique random file filename to prevent overwriting matching names
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $uniqueFileName = bin2hex(random_bytes(10)) . '.' . $extension;
            $targetFilePath = $uploadDir . $uniqueFileName;

            // Move the file out of temporary execution space
            if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
                $productPayload['image'] = 'uploads/' . $uniqueFileName;
            } else {
                return $this->jsonResponse(false, 'Could not save uploaded file to final directory.');
            }
        } else {
            return $this->jsonResponse(false, 'Product image file is required.');
        }

        $productPayload['image'] = 'uploads/' . $uniqueFileName;

        $productRepository = new ProductsRepository();        
        $response = $productRepository->create($productPayload);

        if ($response) {
            http_response_code(200);
            echo json_encode(["message" => "Product created successfully", "status" => "success"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Something went wrong", "status" => "error"]);
        }
        
        exit();
    }
}