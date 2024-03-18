
## Bereitstellung einer VM

Eine VM wird über eine modifizierte Debian-Netinstall ISO gebooted. Diese enthält einen HTTP Link, um eine Preseed Config-Datei von dem NodeJS Server heruterzuladen. Diese Konfig Datei enthält Daten, um automatisch alle während der Installation aufkommenden Fragen zu beantworten. Grundlegende Einstellungen können so schon vorgenommen werden (Benutzereinrichtung, Paket-Auswahl, Sprache, ...).
Am Ende dieser Datei wird ein Post-Install Command ausgeführt. Dieser Command selbst lädt wiederum ein Shell-Script herunter, welches die weitere Konfiguration, die während der Installation nicht durchgeführt werden kann (wie bsw. die statische IP), vornimmt.