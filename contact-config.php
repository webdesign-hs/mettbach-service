<?php
/**
 * Kontaktformular Konfiguration
 *
 * WICHTIG: Diese Datei anpassen, sobald Hosting verfügbar ist!
 */

// ========================================
// TODO: Hier die echten Daten eintragen!
// ========================================

// E-Mail-Empfänger (An wen sollen die Anfragen geschickt werden?)
define('CONTACT_EMAIL', 'info@mettbach-service.de'); // TODO: Echte E-Mail eintragen

// Absender-E-Mail (Wird als "Von" angezeigt)
define('SENDER_EMAIL', 'noreply@mettbach-service.de'); // TODO: Echte Domain eintragen

// Absender-Name
define('SENDER_NAME', 'Mettbach Service Website');

// E-Mail-Betreff
define('EMAIL_SUBJECT', 'Neue Anfrage über die Website');

// Erfolgs-Nachricht
define('SUCCESS_MESSAGE', 'Vielen Dank für Ihre Anfrage! Wir melden uns schnellstmöglich bei Ihnen.');

// Fehler-Nachricht
define('ERROR_MESSAGE', 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.');

// Validierung
define('ENABLE_SPAM_PROTECTION', true); // Honeypot und Zeitprüfung
define('MIN_SUBMIT_TIME', 3); // Mindestzeit in Sekunden (Spam-Schutz)

?>
