<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Include the database connection
require_once 'connection.php';

$speciesId = $_GET['speciesId'];

try {
    $stmt = $conn->prepare("SELECT BreedID, BreedName FROM Breeds WHERE SpeciesID = :speciesId");
    $stmt->bindParam(':speciesId', $speciesId);
    $stmt->execute();
    $breeds = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $breeds]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}