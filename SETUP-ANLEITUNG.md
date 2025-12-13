# Setup-Anleitung: Mettbach Entrümpelung & Service Website

## 📋 Checkliste vor der Veröffentlichung

### 1. Domain & Hosting einrichten

- [ ] Domain registrieren (Empfehlung: `mettbach-service.de`)
- [ ] Webhosting mit PHP-Support einrichten
- [ ] SSL-Zertifikat installieren (Let's Encrypt)
- [ ] FTP/SSH-Zugangsdaten notieren

### 2. Kontaktdaten anpassen

#### **Impressum & Datenschutz**

Öffnen Sie folgende Dateien und ersetzen Sie die Platzhalter-Daten:

**`impressum.html`** (Zeilen 108-110, 120-121, 132, 154-156):
```
Musterstraße 123 → Echte Adresse
0123 / 456 789 → Echte Telefonnummer
DE123456789 → Echte USt-ID
```

**`datenschutz.html`** (Zeilen 173-178):
```
Musterstraße 123 → Echte Adresse
0123 / 456 789 → Echte Telefonnummer
```

#### **Kontaktformular Backend**

**`contact-config.php`** - Zeile 10-11:
```php
define('CONTACT_EMAIL', 'info@mettbach-service.de'); // Echte E-Mail
define('SENDER_EMAIL', 'noreply@mettbach-service.de'); // Echte Domain
```

#### **Telefonnummern auf der Website**

Suchen und ersetzen Sie in allen HTML-Dateien:
- `0123 / 456 789` → Echte Telefonnummer
- `491234567890` → WhatsApp-Nummer (im Format: 49... ohne + oder 00)

**Betroffene Dateien:**
- `index.html` (Navigation, Hero, Kontakt, WhatsApp-Button)
- `impressum.html` (Navigation)
- `datenschutz.html` (Navigation)

### 3. Website hochladen

1. Alle Dateien per FTP/SFTP auf den Server hochladen
2. Sicherstellen, dass folgende Ordner hochgeladen wurden:
   - `/public` (Bilder & Logos)
   - `/fonts` (Schriftarten)
   - `/dist` (Kompiliertes CSS)
   - `*.php` (Backend-Dateien)
   - `*.html` (Website-Seiten)
   - `*.js` (JavaScript)

3. **Wichtig:** Dateiberechtigungen prüfen:
   - PHP-Dateien: 644
   - Verzeichnisse: 755

### 4. Kontaktformular testen

1. Website im Browser öffnen
2. Kontaktformular ausfüllen und absenden
3. Prüfen, ob E-Mail bei `info@mettbach-service.de` ankommt
4. Bei Problemen: Server-Logs prüfen oder Hoster kontaktieren

### 5. CSS neu kompilieren (optional)

Falls Sie Änderungen an `styles.css` oder `tailwind.config.js` vorgenommen haben:

```bash
npm run build:css
```

Dann die neue `dist/output.css` hochladen.

---

## 🔧 Technische Details

### Dateistruktur

```
/
├── index.html              # Hauptseite
├── impressum.html          # Impressum
├── datenschutz.html        # Datenschutzerklärung
├── login.html              # Login-Seite (optional)
├── script.js               # JavaScript (inkl. Formular-Logik)
├── contact-config.php      # ⚠️ HIER KONFIGURIEREN
├── send-contact.php        # Formular-Backend
├── tailwind.config.js      # Tailwind-Konfiguration
├── package.json            # NPM-Abhängigkeiten
├── /public/                # Bilder & Logos
├── /fonts/                 # Schriftarten (Outfit)
└── /dist/                  # Kompiliertes CSS
```

### Formular-Funktionsweise

1. **Frontend** (`index.html`):
   - Formular mit ID `contact-form`
   - Client-seitige Validierung (HTML5)
   - Honeypot-Feld gegen Spam

2. **JavaScript** (`script.js`):
   - Formular-Submit abfangen
   - Daten per AJAX an `send-contact.php` senden
   - Erfolgs-/Fehlermeldungen anzeigen

3. **Backend** (`send-contact.php`):
   - Validierung der Eingaben
   - Spam-Schutz (Honeypot + Zeitprüfung)
   - E-Mail versenden via PHP `mail()`

### Spam-Schutz

- **Honeypot-Feld**: Verstecktes Feld `contact-website` (sollte leer bleiben)
- **Zeitprüfung**: Formular muss mindestens 3 Sekunden offen sein
- **Server-seitige Validierung**: Alle Eingaben werden geprüft

---

## 🚀 SEO-Optimierung (nach Domain-Aktivierung)

### 1. sitemap.xml erstellen

Erstellen Sie eine `sitemap.xml` im Root-Verzeichnis:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mettbach-service.de/</loc>
    <lastmod>2025-01-XX</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mettbach-service.de/impressum.html</loc>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://mettbach-service.de/datenschutz.html</loc>
    <priority>0.3</priority>
  </url>
</urlset>
```

### 2. robots.txt erstellen

Erstellen Sie eine `robots.txt` im Root-Verzeichnis:

```
User-agent: *
Allow: /

Sitemap: https://mettbach-service.de/sitemap.xml
```

### 3. Google Search Console einrichten

1. Website in Google Search Console registrieren
2. Sitemap einreichen
3. Indexierung beantragen

### 4. Google My Business

1. Google My Business-Profil erstellen
2. Adresse, Telefon, Öffnungszeiten eintragen
3. Fotos hochladen
4. Website verlinken

---

## 🛡️ DSGVO-Compliance

### Noch zu erledigen:

1. **Cookie-Consent-Banner** (z.B. mit Cookiebot oder Borlabs Cookie)
2. **Datenschutzerklärung** auf Vollständigkeit prüfen lassen
3. **Impressum** mit echten Daten füllen

### Bereits implementiert:

- ✅ Lokale Ressourcen (keine CDNs)
- ✅ Datenschutzerklärung vorhanden
- ✅ Impressum vorhanden
- ✅ WhatsApp Business DSGVO-Hinweise
- ✅ Kontaktformular-Hinweise

---

## 📞 Support

Bei Fragen oder Problemen:
- Website: webdesign-hs.de
- Dokumentation: Diese Datei

---

**Erstellt von webdesign-hs.de**
**Version 1.0 - Januar 2025**
