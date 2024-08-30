<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'connection.php';

$input = json_decode(file_get_contents("php://input"), true);

if (isset($input['petName']) && isset($input['speciesId']) && isset($input['breedId']) && isset($input['ownerId']) && isset($input['date'])) {
    $petName = $input['petName'];
    $speciesId = $input['speciesId'];
    $breedId = $input['breedId'];
    $ownerId = $input['ownerId'];
    $date = $input['date'];

    // Debugging: Output the date to check its format
    error_log("Received date: $date");

    try {
        $stmt = $conn->prepare("INSERT INTO Pets (Name, SpeciesID, BreedID, DateOfBirth, OwnerID) VALUES (:petName, :speciesId, :breedId, :date, :ownerId)");
        $stmt->bindParam(':petName', $petName);
        $stmt->bindParam(':speciesId', $speciesId);
        $stmt->bindParam(':breedId', $breedId);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':ownerId', $ownerId);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Pet added successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to add pet"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
}