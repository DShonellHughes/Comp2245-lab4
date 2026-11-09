<?php
header('Content-Type: application/json; charset=UTF-8');
require __DIR__ . '/db.php';

// Search text
$search = $_GET['q'] ?? '';
if (!is_string($search)) {
    $search = '';
}
$search = trim($search);
$pattern = '%' . $search . '%';

// Always-present part of the query
$sql = 'SELECT books.title,
               books.author,
               books.year,
               subjects.name AS subject,
               books.copies,
               books.copies - books.on_loan AS available
        FROM books
        JOIN subjects ON books.subject_id = subjects.id
        WHERE (books.title LIKE :title OR books.author LIKE :author)';
$params = [':title' => $pattern, ':author' => $pattern];

// Optional filter: subject id (whole number, 1 or more)
$subject = filter_input(INPUT_GET, 'subject', FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1],
]);
if (is_int($subject)) {
    $sql .= ' AND books.subject_id = :subject';
    $params[':subject'] = $subject;
}

// Optional filter: only books on the shelf
if (($_GET['available'] ?? '') === '1') {
    $sql .= ' AND books.copies - books.on_loan > 0';
}

$sql .= ' ORDER BY books.title';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
echo json_encode($stmt->fetchAll());