<?php
/**
 * Kontaktformular Backend
 *
 * Verarbeitet die Formular-Anfragen und sendet E-Mails
 * Mit Input-Validierung, Sanitization und Rate Limiting
 */

// Konfiguration laden
require_once 'contact-config.php';

// CORS Headers (für AJAX-Anfragen)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.mettbach-service24.de');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Nur POST-Anfragen erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode nicht erlaubt']);
    exit;
}

// ========================================
// RATE LIMITING (IP-basiert, Dateisystem)
// ========================================
$rateLimitDir = sys_get_temp_dir() . '/mettbach_ratelimit';
if (!is_dir($rateLimitDir)) {
    mkdir($rateLimitDir, 0700, true);
}

$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = $rateLimitDir . '/' . md5($clientIP) . '.json';
$rateLimitSeconds = 30;
$maxRequestsPerHour = 10;

if (file_exists($rateLimitFile)) {
    $rateLimitData = json_decode(file_get_contents($rateLimitFile), true);

    // Letzte Anfrage prüfen
    if (isset($rateLimitData['last_request'])) {
        $timeSinceLast = time() - $rateLimitData['last_request'];
        if ($timeSinceLast < $rateLimitSeconds) {
            $wait = $rateLimitSeconds - $timeSinceLast;
            http_response_code(429);
            echo json_encode(['success' => false, 'message' => "Bitte warten Sie noch {$wait} Sekunden, bevor Sie erneut absenden."]);
            exit;
        }
    }

    // Stündliches Limit prüfen
    $oneHourAgo = time() - 3600;
    $recentRequests = array_filter($rateLimitData['requests'] ?? [], function($t) use ($oneHourAgo) {
        return $t > $oneHourAgo;
    });

    if (count($recentRequests) >= $maxRequestsPerHour) {
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Zu viele Anfragen. Bitte versuchen Sie es später erneut oder rufen Sie uns an: 02433 / 3027044']);
        exit;
    }
} else {
    $rateLimitData = ['requests' => []];
}

// ========================================
// EINGABEDATEN
// ========================================
$input = json_decode(file_get_contents('php://input'), true);

if (empty($input)) {
    $input = $_POST;
}

// ========================================
// SANITIZATION
// ========================================
$name     = htmlspecialchars(strip_tags(trim($input['name'] ?? '')), ENT_QUOTES, 'UTF-8');
$phone    = htmlspecialchars(strip_tags(trim($input['phone'] ?? '')), ENT_QUOTES, 'UTF-8');
$service  = htmlspecialchars(strip_tags(trim($input['service'] ?? '')), ENT_QUOTES, 'UTF-8');
$message  = htmlspecialchars(strip_tags(trim($input['message'] ?? '')), ENT_QUOTES, 'UTF-8');
$timestamp = intval($input['timestamp'] ?? 0);
$honeypot = $input['website'] ?? '';
$privacy  = filter_var($input['privacy'] ?? false, FILTER_VALIDATE_BOOLEAN);

// ========================================
// VALIDIERUNG
// ========================================
$errors = [];

// DSGVO
if (!$privacy) {
    $errors[] = 'Bitte stimmen Sie der Datenschutzerklärung zu.';
}

// Name: 2-100 Zeichen, nur Buchstaben/Leerzeichen/Bindestriche
if (empty($name) || mb_strlen($name) < 2 || mb_strlen($name) > 100) {
    $errors[] = 'Bitte geben Sie einen gültigen Namen ein (2-100 Zeichen).';
} elseif (!preg_match('/^[\p{L}\s\-\'.]+$/u', strip_tags(html_entity_decode($name)))) {
    $errors[] = 'Der Name enthält ungültige Zeichen.';
}

// Telefon: 6-20 Ziffern (nach Bereinigung)
$phoneClean = preg_replace('/[\s\-\/().+]+/', '', $phone);
if (empty($phone) || strlen($phoneClean) < 6 || strlen($phoneClean) > 20) {
    $errors[] = 'Bitte geben Sie eine gültige Telefonnummer ein.';
} elseif (!preg_match('/^[0-9]+$/', $phoneClean)) {
    $errors[] = 'Die Telefonnummer enthält ungültige Zeichen.';
}

// Service: nur erlaubte Werte
$validServices = [
    'Entrümpelung', 'Haushaltsauflösung', 'Wohnungsauflösung',
    'Geschäfts- / Büroauflösung', 'Keller-Entrümpelung',
    'Sperrmüllabholung', 'Instandsetzungen', 'Sonstiges'
];
if (empty($service) || !in_array(html_entity_decode($service), $validServices)) {
    $errors[] = 'Bitte wählen Sie einen gültigen Service aus.';
}

// Nachricht: 10-2000 Zeichen
if (empty($message) || mb_strlen($message) < 10 || mb_strlen($message) > 2000) {
    $errors[] = 'Die Nachricht muss zwischen 10 und 2000 Zeichen lang sein.';
}

// Spam-Schutz: Honeypot-Feld
if (ENABLE_SPAM_PROTECTION && !empty($honeypot)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam erkannt.']);
    exit;
}

// Spam-Schutz: Zeitprüfung (Formular zu schnell abgeschickt)
if (ENABLE_SPAM_PROTECTION && $timestamp > 0) {
    $submitDuration = (time() * 1000 - $timestamp) / 1000;
    if ($submitDuration < MIN_SUBMIT_TIME) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Anfrage zu schnell abgeschickt.']);
        exit;
    }
}

// Fehler zurückgeben
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ========================================
// RATE LIMIT UPDATE
// ========================================
$rateLimitData['last_request'] = time();
$rateLimitData['requests'][] = time();
// Alte Einträge bereinigen (älter als 1 Stunde)
$oneHourAgo = time() - 3600;
$rateLimitData['requests'] = array_values(array_filter($rateLimitData['requests'], function($t) use ($oneHourAgo) {
    return $t > $oneHourAgo;
}));
file_put_contents($rateLimitFile, json_encode($rateLimitData), LOCK_EX);

// ========================================
// E-MAIL SENDEN
// ========================================

// Für die E-Mail HTML-Entities zurück dekodieren (plain text E-Mail)
$emailName = html_entity_decode($name, ENT_QUOTES, 'UTF-8');
$emailPhone = html_entity_decode($phone, ENT_QUOTES, 'UTF-8');
$emailService = html_entity_decode($service, ENT_QUOTES, 'UTF-8');
$emailMessage = html_entity_decode($message, ENT_QUOTES, 'UTF-8');

$emailBody = "
Neue Kontaktanfrage über die Website
=====================================

Name: {$emailName}
Telefon: {$emailPhone}
Service: {$emailService}

Nachricht:
{$emailMessage}

---
DSGVO-Einwilligung: Ja
Gesendet von: {$clientIP}
Datum/Zeit: " . date('d.m.Y H:i:s') . "
";

$headers = [
    'From: ' . SENDER_NAME . ' <' . SENDER_EMAIL . '>',
    'Reply-To: ' . $emailPhone,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=utf-8'
];

$mailSent = mail(
    CONTACT_EMAIL,
    EMAIL_SUBJECT,
    $emailBody,
    implode("\r\n", $headers)
);

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => SUCCESS_MESSAGE
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => ERROR_MESSAGE
    ]);
}
?>
