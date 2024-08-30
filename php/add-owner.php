<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require_once 'connection.php';

$input = json_decode(file_get_contents("php://input"), true);


if (isset($input['ownerName']) && isset($input['address']) && isset($input['phone'])) {
    $ownerName = $input['ownerName'];
    $address = $input['address'];
    $phone = $input['phone'];

    try {
        $stmt = $conn->prepare("INSERT INTO Owners (Name, Address, ContactDetails) VALUES (:ownerName, :address, :phone)");
        $stmt->bindParam(':ownerName', $ownerName);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':phone', $phone);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Owner added successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to add owner"
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input"
    ]);
}