<?php

class OrdersRepository
{
    private $orderTable = 'orders';

    private $orderItemTable = 'order_items';

    public function getAllOrders() {
        // Grab the single open database connection directly inside the method
        $db = DatabaseConnection::getInstance()->getConnection();
        
        try {
            $result = $db->execute_query("SELECT * FROM {$this->orderTable}");
            return $result->fetch_all(MYSQLI_ASSOC);
        } catch (mysqli_sql_exception $e) {
            error_log("Fetching orders failed: " . $e->getMessage());
            return [];
        }
    }

    public function getOrder($id) {
        $db = DatabaseConnection::getInstance()->getConnection();

        $orderFetchSql = "SELECT * FROM {$this->orderTable} WHERE id=?";

        try {
            $result = $db->execute_query($orderFetchSql, [$id]);
            $orderRecord = $result->fetch_assoc();
        } catch (mysqli_sql_exception $e) {
            error_log("Fetching order failed: " . $e->getMessage());
            $orderRecord = [];
        }

        return $orderRecord;
    }

    public function getOrderItems($id) {
        $db = DatabaseConnection::getInstance()->getConnection();

        $orderItemsSql = "SELECT * FROM {$this->orderItemTable} WHERE order_id=?";

        try {
            $result = $db->execute_query($orderItemsSql, [$id]);
            $orderItemsRecord = $result->fetch_all(MYSQLI_ASSOC);
        } catch (mysqli_sql_exception $e) {
            error_log("Fetching order failed: " . $e->getMessage());
            $orderItemsRecord = [];
        }

        return $orderItemsRecord;
    }

    public function createOrder($customerData, $orderItemsData, $grandTotal) {
        $db = DatabaseConnection::getInstance()->getConnection();

        $columns = ['customer_name', 'customer_email', 'address', 'total_amount', 'status'];
        $escapedColumns = implode(', ', $columns);

        $values = [$customerData['name'], $customerData['email'], $customerData['address'], $grandTotal, 'pending'];

        $placeholders = implode(', ', array_fill(0, count($columns), '?'));

        $orderTableSql = "INSERT INTO {$this->orderTable} ({$escapedColumns}) VALUES ({$placeholders})";

        try {
            $db->begin_transaction();

            $result = $db->execute_query($orderTableSql, $values);
            if ($result) {
                $orderId = $db->insert_id;
                $response = $this->createOrderItems($orderItemsData, $orderId, $db);
                if (!$response) throw new Exception("Order items save failed processing");
                $db->commit();
            } else {
                throw new Exception("Something went wrong on Order processing");
            }
            
            return true;
        } catch (Exception  $e) {
            $db->rollback();
            error_log("Order creation failed: " . $e->getMessage());
            return false;
        }
    }

    public function createOrderItems(array $orderItemsData, int $orderId, $db) {

        $columns = ['order_id', 'product_id', 'product_name', 'price', 'quantity', 'subtotal'];
        $escapedColumns = implode(', ', $columns);
        $placeholders = implode(', ', array_fill(0, count($columns), '?'));

        foreach ($orderItemsData as $orderItem) {
            $values = [$orderId, $orderItem['id'], $orderItem['name'], $orderItem['price'], $orderItem['quantity'], $orderItem['total']];
            $orderItemsTableSql = "INSERT INTO {$this->orderItemTable} ({$escapedColumns}) VALUES ({$placeholders})";

            try {
                $db->execute_query($orderItemsTableSql, $values);
            } catch (mysqli_sql_exception $e) {
                error_log("Order items creation failed: " . $e->getMessage());
                return false;
            }
        }
        return true;
    }
}
