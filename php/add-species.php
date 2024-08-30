<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'connection.php';

$input = json_decode(file_get_contents("php://input"), true);

if (isset($input['speciesName']) && !empty($input['speciesName'])) {
    $speciesName = $input['speciesName'];

    try {
        $stmt = $conn->prepare("INSERT INTO Species (SpeciesName) VALUES (:speciesName)");
        $stmt->bindParam(':speciesName', $speciesName);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Species added successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to add species"
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