<?php
// fetch_img.php

// --- CORS aberto (apenas para DEV) ---
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Se for preflight, sai imediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// A partir daqui, seu código POST continua...
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Apenas POST permitido.']);
    exit;
}

if (empty($_POST['phone'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta parâmetro phone em $_POST']);
    exit;
}

$phone = preg_replace('/\D/', '', $_POST['phone']);
if (strlen($phone) < 10) {
    http_response_code(400);
    echo json_encode(['error' => 'Telefone inválido: ' . $phone]);
    exit;
}

// Chama o RapidAPI…
$curl = curl_init("https://whatsapp-data1.p.rapidapi.com/number/$phone");
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_HTTPHEADER     => [
        "x-rapidapi-host: whatsapp-data1.p.rapidapi.com",
        "x-rapidapi-key: 4f9decdf1cmsha8e3c875cf114cfp10297fjsnf1451941f64f"
    ],
]);
$response = curl_exec($curl);
$err      = curl_error($curl);
curl_close($curl);

if ($err) {
    http_response_code(500);
    echo json_encode(['error' => "Erro cURL: $err"]);
    exit;
}

// Tudo ok, devolve o JSON da API
header('Content-Type: application/json');
echo $response;
