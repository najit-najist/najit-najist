export enum ComgateResponseCode {
  'OK' = 0,
  UNKNOWN_ERROR = 1100, // neznámá chyba
  UNSUPPORTED_LANGUAGE = 1102, // zadaný jazyk není podporován
  INVALID_PARAM = 1103, // nesprávně zadaná metoda
  CANNOT_LOAD_PAYMENT = 1104, // nelze načíst platbu
  PRICE_NOT_SUPPORTED = 1107, // cena platby není podporovaná
  DB_ERROR = 1200, // databázová chyba
  UNKNOWN_ESHOP = 1301, // neznámý e-shop
  CONNECTION_OR_LANGUAGE_MISSING = 1303, // propojení nebo jazyk chybí
  UNKNOWN_CATEGORY = 1304, // neplatná kategorie
  MISSING_DESCRIPTION = 1305, // chybí popis produktu
  CHOOSE_CORRECT_METHOD = 1306, // vyberte správnou metodu
  PAYMENT_TYPE_NOT_SUPPORTED = 1308, // vybraný způsob platby není povolen
  UNKNOWN_PRICE = 1309, // nesprávná částka
  UNKNOWN_CURRENCY = 1310, // neznámá měna
  UNKNOWN_BANK_ACCOUNT_ID = 1311, // neplatný identifikátor bankovního účtu Klienta
  RECURRING_DISABLED = 1316, // e-shop nemá povolené opakované platby
  RECURRING_UNSUPPORTED_FOR_METHOD = 1317, // neplatná metoda – nepodporuje opakované platby
  BANK_ERROR = 1319, // nelze založit platbu, problém na straně banky
  INVALID_RESPONSE_FROM_DB = 1399, // neočekávaný výsledek z databáze
  INVALID_REQUEST = 1400, // chybný dotaz
  SERVER_ERROR = 1500, // 1500 neočekávaná chyba
}
