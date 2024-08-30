<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'connection.php';

$response = [];

try {
    // !Get total pets
    $stmt = $conn->query("SELECT COUNT(*) as total FROM Pets");
    $response['totalPets'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // !Get total owners
    $stmt = $conn->query("SELECT COUNT(*) as total FROM Owners");
    $response['totalOwners'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    //! Get total breeds
    $stmt = $conn->query("SELECT COUNT(*) as total FROM Breeds");
    $response['totalBreeds'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    //! Get total species
    $stmt = $conn->query("SELECT COUNT(*) as total FROM Species");
    $response['totalSpecies'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode(["success" => true, "data" => $response]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}