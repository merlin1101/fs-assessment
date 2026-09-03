<?php
require_once __DIR__ . '/../controller/LoginController.php';
require_once __DIR__ . '/../controller/ProductController.php';
require_once __DIR__ . '/../controller/OrdersController.php';

$requestUri = $_SERVER['REQUEST_URI'];

$base_path = strstr($requestUri, '/api');

$raw_input = file_get_contents("php://input");
$request_data = json_decode($raw_input, true) ?? [];

switch ($base_path) {
    case '/api/login':
        $loginController = new LoginController();
        $loginController->execute($request_data);
        break;

    case '/api/products':
        $ProductController = new ProductController();
        $response = $ProductController->getProducts();
        break;

    case '/api/product/create':
        $productController = new ProductController();
        $response = $productController->createProduct($request_data);
        break;

    case '/api/cart':
        $OrdersController = new OrdersController();
        $cartData = $OrdersController->getCart($request_data);
        http_response_code(200);
        echo json_encode(["status" => "success", "cart" => $cartData]);
        exit();
        break;

    case '/api/placeorder':
        $OrdersController = new OrdersController();
        $OrdersController->placeOrder($request_data);
        break;

    case '/api/orders':
        $OrdersController = new OrdersController();
        $response = $OrdersController->getOrders();
        break;

    case '/api/order/view':
        $OrdersController = new OrdersController();
        $response = $OrdersController->viewOrder($request_data);
        break;

    default :
        http_response_code(404);
        echo json_encode(["error" => "route not found", "base_path" => $base_path, "requestUri" => $requestUri]);
        break;
}

exit();
