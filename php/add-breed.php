<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'connection.php';

$input = json_decode(file_get_contents("php://input"), true);

if (isset($input['breedName']) && isset($input['speciesId'])) {
    $breedName = $input['breedName'];
    $speciesId = $input['speciesId'];

    try {
        $stmt = $conn->prepare("INSERT INTO Breeds (BreedName, SpeciesID) VALUES (:breedName, :speciesId)");
        $stmt->bindParam(':breedName', $breedName);
        $stmt->bindParam(':speciesId', $speciesId);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Breed added successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to add breed"
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