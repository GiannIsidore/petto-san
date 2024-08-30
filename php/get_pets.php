<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'connection.php';

try {
    $stmt = $conn->prepare("SELECT p.PetID as id, p.Name as name, s.SpeciesName as species, b.BreedName as breed, o.Name as owner, p.DateOfBirth as date
                            FROM Pets p
                            JOIN Species s ON p.SpeciesID = s.SpeciesID
                            JOIN Breeds b ON p.BreedID = b.BreedID
                            JOIN Owners o ON p.OwnerID = o.OwnerID");
    $stmt->execute();
    $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $pets]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}