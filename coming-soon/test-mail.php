<?php
  $to = 'info@mettbach-service24.de';
  $subject = 'Test E-Mail vom Server';
  $message = 'Dies ist eine Test-E-Mail.';
  $headers = 'From: noreply@mettbach-service24.de';

  if (mail($to, $subject, $message, $headers)) {
      echo 'E-Mail wurde erfolgreich gesendet!';
  } else {
      echo 'Fehler beim E-Mail-Versand!';
  }
  ?>