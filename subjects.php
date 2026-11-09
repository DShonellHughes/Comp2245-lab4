<?php
header('Content-Type: application/json; charset=UTF-8');
require __DIR__ . '/db.php';

$stmt = $pdo->query('SELECT id, name FROM subjects ORDER BY name');
echo json_encode($stmt->fetchAll());