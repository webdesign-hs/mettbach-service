<?php
/**
 * Kontaktformular Backend
 *
 * Verarbeitet die Formular-Anfragen und sendet E-Mails
 */

// Konfiguration laden
require_once 'contact-config.php';

// CORS Headers (für AJAX-Anfragen)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Nur POST-Anfragen erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode nicht erlaubt']);
    exit;
}

// Eingabedaten abrufen
$input = json_decode(file_get_contents('php://input'), true);

// Fallback für normale Form-Submissions
if (empty($input)) {
    $input = $_POST;
}

// Pflichtfelder prüfen
$name = trim($input['name'] ?? '');
$phone = trim($input['phone'] ?? '');
$service = trim($input['service'] ?? '');
$message = trim($input['message'] ?? '');
$timestamp = $input['timestamp'] ?? 0;
$honeypot = $input['website'] ?? ''; // Honeypot-Feld (sollte leer sein)

// Validierung
$errors = [];

if (empty($name)) {
    $errors[] = 'Bitte geben Sie Ihren Namen ein.';
}

if (empty($phone)) {
    $errors[] = 'Bitte geben Sie Ihre Telefonnummer ein.';
}

if (empty($service)) {
    $errors[] = 'Bitte wählen Sie einen Service aus.';
}

if (empty($message)) {
    $errors[] = 'Bitte geben Sie eine Nachricht ein.';
}

// Spam-Schutz: Honeypot-Feld
if (ENABLE_SPAM_PROTECTION && !empty($honeypot)) {
    // Bot erkannt
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam erkannt.']);
    exit;
}

// Spam-Schutz: Zeitprüfung
if (ENABLE_SPAM_PROTECTION && $timestamp > 0) {
    $submitTime = time() - $timestamp;
    if ($submitTime < MIN_SUBMIT_TIME) {
        // Zu schnell abgeschickt
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

// E-Mail-Nachricht erstellen
$emailBody = "
Neue Kontaktanfrage über die Website
=====================================

Name: {$name}
Telefon: {$phone}
Service: {$service}

Nachricht:
{$message}

---
Gesendet von: {$_SERVER['REMOTE_ADDR']}
Datum/Zeit: " . date('d.m.Y H:i:s') . "
";

// E-Mail-Header
$headers = [
    'From: ' . SENDER_NAME . ' <' . SENDER_EMAIL . '>',
    'Reply-To: ' . $phone,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=utf-8'
];

// E-Mail senden
$mailSent = mail(
    CONTACT_EMAIL,
    EMAIL_SUBJECT,
    $emailBody,
    implode("\r\n", $headers)
);

// Antwort senden
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
