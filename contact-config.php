<?php
/**
 * Kontaktformular Konfiguration
 *
 * WICHTIG: Diese Datei anpassen, sobald Hosting verfügbar ist!
 */

// ========================================
// Produktions-Konfiguration
// ========================================

// E-Mail-Empfänger (An wen sollen die Anfragen geschickt werden?)
define('CONTACT_EMAIL', 'info@mettbach-service24.de');

// Absender-E-Mail (Wird als "Von" angezeigt)
define('SENDER_EMAIL', 'noreply@mettbach-service24.de');

// Absender-Name
define('SENDER_NAME', 'Mettbach Entrümpelung & Service - Website');

// E-Mail-Betreff
define('EMAIL_SUBJECT', 'Neue Kontaktanfrage - Mettbach Service');

// Erfolgs-Nachricht
define('SUCCESS_MESSAGE', 'Vielen Dank für Ihre Anfrage! Wir melden uns schnellstmöglich bei Ihnen zurück.');

// Fehler-Nachricht
define('ERROR_MESSAGE', 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an: 02433 / 3027044');

// Validierung
define('ENABLE_SPAM_PROTECTION', true); // Honeypot und Zeitprüfung
define('MIN_SUBMIT_TIME', 3); // Mindestzeit in Sekunden (Spam-Schutz)

?>
