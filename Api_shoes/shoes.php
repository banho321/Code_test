<?php
include './config/config.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$response = array();

$shoesQuery = "SELECT * FROM `shoes`";
$result = mysqli_query($con, $shoesQuery);

if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        // Chuyển đổi giá trị inventory thành số nguyên
        $row['inventory'] = intval($row['inventory']);
        $row['price'] = intval($row['price']);
        $row['inCart'] = intval($row['inCart']);
        $response['shoes'][] = $row;
    }
    $response['status'] = "200";
} else {
    $response['status'] = "500";
    $response['shoes'] = array();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>

