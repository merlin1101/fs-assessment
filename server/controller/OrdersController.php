<?php
// require_once(__DIR__ . '/../model/ProductsRepository.php');

class OrdersController
{
    public function getCart(array $cartItems) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->jsonResponse(false, 'Method not allowed. Use POST.', 405);
        }
        
        $productIds = array_column($cartItems, 'id');

        if (empty($productIds)) {
            http_response_code(200);
            echo json_encode(["status" => "success ...", "cart" => [], "cartitems" => $cartItems, "productIds"=> $productIds]);
            exit();
        }

        $productsRepository = new ProductsRepository();
        $productsData = $productsRepository->getProducts($productIds);

        // null passed to keep the entire original array row intact
        $productDataById = array_column($productsData, null, 'id');

        $cart = [];
        foreach ($cartItems as $cartItem) {
            $id = $cartItem['id'];

            if (isset($productDataById[$id])) {
                $product = $productDataById[$id];
                $productTotal = (float)$product['price'] * (int)$cartItem['quantity'];

                $cart[] = [
                    'id' => $product['id'],
                    'name' => $product['name'],
                    'quantity' => $cartItem['quantity'],
                    'price' => $product['price'],
                    'total' => $productTotal
                ];
            }
        }

        return $cart;
    }

    public function placeOrder(array $orderData) {
        $customerData = $orderData['customerData'];
        $cartData = $orderData['cartData'];
        $grandTotal = $orderData['grandTotal'];

        $orderItemsData = $this->getCart($cartData);
        $subtotals = array_column($orderItemsData, 'total');
        $orderTotal = array_sum($subtotals);
        $orderTotal = sprintf('%0.2f', $orderTotal);

        if ($grandTotal != $orderTotal) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Grand total doesn't match","orderTotal" => $orderTotal]);
            exit(); 
        }

        $orderRepository = new OrdersRepository();
        $response = $orderRepository->createOrder($customerData, $orderItemsData, $grandTotal);

        if (!$response) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Place Order Failed"]);
            exit();
        }

        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Order placed successfully!"]);
        exit();
    }

    public function getOrders() {
        $OrdersRepository = new OrdersRepository();        
        $orders = $OrdersRepository->getAllOrders();
        
        if ($orders) {
            http_response_code(200);
            echo json_encode(["message" => "Orders fetched successfully", "status" => "success", "orders" => $orders]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Something went wrong", "status" => "error"]);
        }
        
        exit();
    }

    public function viewOrder(array $data) {
        $orderId = $data['id'];

        $ordersRepository = new OrdersRepository();
        
        $order = $ordersRepository->getOrder($orderId);
        $orderItems = $ordersRepository->getOrderItems($orderId);

        if (empty($order) || empty($orderItems)) {
            http_response_code(500);
            echo json_encode(["message" => "Error on order fetching", "status" => "error"]);
        }

        $orderData = [
            'order' => $order,
            'orderItems' => $orderItems
        ];

        http_response_code(200);
        echo json_encode(["message" => "Order fetched successfully", "status" => "success", "orderData" => $orderData]);
        exit();
    }
}
