<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'connection.php';

$response = [];

try {
    //! Get the most popular pets (e.g., by the number of owners or instances)
    $stmt = $conn->query("
        SELECT p.PetID as id, p.Name as name, COUNT(p.PetID) as count
        FROM Pets p
        GROUP BY p.Name
        ORDER BY count DESC
        LIMIT 10
    ");
    $response['popularPets'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //! Get the most popular breeds (e.g., by the number of pets with this breed)
    $stmt = $conn->query("
        SELECT b.BreedID as id, b.BreedName as name, COUNT(p.BreedID) as count
        FROM Breeds b
        JOIN Pets p ON p.BreedID = b.BreedID
        GROUP BY b.BreedName
        ORDER BY count DESC
        LIMIT 10
    ");
    $response['popularBreeds'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //! Get the top owners (e.g., by the number of pets they own)
    $stmt = $conn->query("
        SELECT o.OwnerID as id, o.Name as name, COUNT(p.OwnerID) as petCount
        FROM Owners o
        JOIN Pets p ON p.OwnerID = o.OwnerID
        GROUP BY o.Name
        ORDER BY petCount DESC
        LIMIT 10
    ");
    $response['topOwners'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $response]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}