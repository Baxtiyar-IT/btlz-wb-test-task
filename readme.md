# Описание
Сервис для получения тарифов Wildberries (коробки) через API и сохранения их в PostgreSQL (ежечасно) и подготовки данных для Google Sheets (каждые 30 минут).
Google Sheets интеграция работает в режиме симуляции из-за отсутствия учетных данных.

fetchTariffs: Получает тарифы, сохраняет в БД (tariffs) с UPSERT, обрабатывает '-' как 0.
updateSheets: Извлекает данные из БД, сортирует по коэффициенту, логирует для листа stocks_coefs. Реальный Google API код закомментирован.
Планировщик: Запускает fetchTariffs ежечасно, updateSheets каждые 30 минут.
Тесты: Закомментированы в app.ts для отладки.

# Требования

Node.js v20+
Docker

# .env: Не включён (в .gitignore). Создайте из example.env.
WB_TOKEN: Обязательный токен для Wildberries API (например, тестовый, предоставленный в задании).
GOOGLE_SHEET_IDS: Список ID Google Sheets через запятую (например, 1xXxxXxxXx123,1yYyyYyyYy456). Без валидных ID используется симуляция.
GOOGLE_SERVICE_ACCOUNT_KEY: JSON-ключ сервисного аккаунта Google Cloud. Без ключа updateSheets логирует данные вместо записи.

# Настройка

Установите зависимости:
npm install

WB_TOKEN я оставил тот, который мне выдали на hh
GOOGLE_SHEET_IDS и GOOGLE_SERVICE_ACCOUNT_KEY для реального Google Sheets. Без них — симуляция.

# Запустите PostgreSQL и приложение:
docker compose up -d --build

Или для разработки:
docker compose up -d postgres
npm run dev

# Ожидаем в консоли:

All migrations have been run
All seeds have been run
Scheduler started
Running tariff fetch job → Fetched and saved X tariffs (каждый час)
Running Google Sheets update job → Data to be written to stocks_coefs: [...] (каждые 30 минут)

# Примечания для проверки

WB API: Полностью работает, сохраняет данные с обработкой '-' (0 вместо NaN).
Google Sheets: Симуляция из-за отсутствия учетных данных. Реальный код готов, но закомментирован.
Ошибки: Логируются через log4js и console.
Тесты: Закомментированы в app.ts. Для проверки раскомментируйте, затем верните чистую версию.
Очистка БД: docker exec -it postgres psql -U postgres -d postgres -c "TRUNCATE TABLE tariffs;"

PS: Если есть Google учетные данные, раскомментируйте код в updateSheets.ts для реального теста.
