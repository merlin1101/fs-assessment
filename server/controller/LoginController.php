<?php

class LoginController 
{
    
    /**
     * Log In Logic
     * 
     * @param array $request
     */
    public function execute(array $request) {
        $username = isset($request['username']) ? trim($request['username']) : null;
        $password = isset($request['password']) ? trim($request['password']) : null;

        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Both username and password are required fields."
            ]);
            exit();
        }

        if ($username === $_ENV['ADMIN_USERNAME'] && $password === $_ENV['ADMIN_PASSWORD']) {
            http_response_code(200);
            echo json_encode([
                "status" => true,
                "message" => "Authentication successful!"
            ]);
        } else {
            http_response_code(401); // Unauthorized status
            echo json_encode([
                "status" => "error",
                "message" => "Invalid credentials provided."
            ]);
        }
        exit();
    }
}
