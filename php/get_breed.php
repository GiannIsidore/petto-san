<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'connection.php';

try {

    $stmt =$conn->prepare( "
        SELECT 
            b.BreedID, 
            b.BreedName, 
            s.SpeciesName
        FROM 
            breeds b
        INNER JOIN 
            species s
        ON 
            b.SpeciesID = s.SpeciesID;
    ");

    $stmt->execute();

    $breeds = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $breeds
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>