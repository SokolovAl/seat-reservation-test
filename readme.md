# 🎟️ Seat Reservation API

Простой сервис для бронирования мест на мероприятие.  
Правила:
- Один пользователь **не может** забронировать **одно и то же** событие дважды
- Нельзя бронировать, если места закончились

**Таблицы базы данных:**
- `events (id, name, total_seats)`
- `bookings (id, event_id, user_id, created_at)`

**Ключевой эндпоинт:**
- `POST /api/bookings/reserve`

---

## 🗂️ Переменные окружения

Файл `.env.example` содержит возможные переменные:

```dotenv
PORT=3000
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB=booking_db
NODE_ENV=development
```
---
## 🚀 Запуск
### 🔹 Вариант A — Локально (без Docker)
 1) Установка зависимостей
```bash
npm install
```

 2) Миграции и сиды
```bash
npx knex migrate:latest
npx knex seed:run
```

 3) Запуск API
```bash
npm run dev
```
### Ожидаемый вывод в консоль:

`API running on http://localhost:3000`

### 🔹 Вариант B — Через Docker Compose
 1) Сборка и запуск
```bash
docker compose up --build
```
 2) Прогнать миграции и сиды (если не выполняются автоматически)
```bash
docker compose exec app npx knex migrate:latest
docker compose exec app npx knex seed:run
```
### Ожидаемый вывод в консоль:

```
Migrations applied successfully
Seeds completed successfully
API running on http://localhost:3000
```
---

## 🧪 Тестирование через curl
```
-----------------------------------------
 🧩 Seat Reservation API — единый сценарий тестирования (по фактическому коду)
-----------------------------------------
Требования к API из кода:
- GET  /health -> 200 {"ok": true}
- POST /api/bookings/reserve
    ✓ 201 {"success": true, "booking": {...}}
    ✗ 400 {"error": "event_id and user_id required"}            — если нет полей
    ✗ 404 {"error": "Event not found"}                           — если события нет
    ✗ 409 {"error": "User already booked this event"}            — повторная бронь
    ✗ 400 {"error": "No seats available"}                        — нет свободных мест
    ✗ 500 {"error": "Internal server error"}                     — прочие ошибки
Сиды (по файлам 001_events.js и 002_bookings.js):
- Событие #1: total_seats=3, уже занято 2 места (user123, user456) → остаётся 1 место
- Событие #2: total_seats=2, уже занято 1 место (user123)          → остаётся 1 место

Ниже — скрипт из последовательных curl-запросов с ожидаемыми результатами.
```

### 0) Health-check
```http request
curl -sS -w "\nHTTP_STATUS:%{http_code}\n" "$BASE_URL/health"
```
#### ОЖИДАЕМО: 200 и тело: {"ok":true}

### 1) Успешное бронирование свободного места для события #1
```http request
curl -sS -X POST "$BASE_URL/api/bookings/reserve" \
-H "Content-Type: application/json" \
-d "{\"event_id\": $EVENT_1, \"user_id\": \"test_user_ok\"}" \
-w "\nHTTP_STATUS:%{http_code}\n"
```
#### ОЖИДАЕМО: 201 и тело: {"success": true, "booking": {...}}

### 2) Повторная попытка тем же пользователем и событием #1 (дубликат)
```http request
curl -sS -X POST "$BASE_URL/api/bookings/reserve" \
-H "Content-Type: application/json" \
-d "{\"event_id\": $EVENT_1, \"user_id\": \"test_user_ok\"}" \
-w "\nHTTP_STATUS:%{http_code}\n"
```http request
```
#### ОЖИДАЕМО: 409 и тело: {"error":"User already booked this event"}

### 3) Попытка забронировать на несуществующее событие
```http request
curl -sS -X POST "$BASE_URL/api/bookings/reserve" \
-H "Content-Type: application/json" \
-d "{\"event_id\": 999999, \"user_id\": \"ghost_user\"}" \
-w "\nHTTP_STATUS:%{http_code}\n"
```
#### ОЖИДАЕМО: 404 и тело: {"error":"Event not found"}

### 4) Переполнение вместимости события #1
После шага (1) событие #1 полностью занято (3/3), следующая попытка с другим пользователем должна вернуть 'No seats available'
```http request
curl -sS -X POST "$BASE_URL/api/bookings/reserve" \
-H "Content-Type: application/json" \
-d "{\"event_id\": $EVENT_1, \"user_id\": \"another_user\"}" \
-w "\nHTTP_STATUS:%{http_code}\n"
```
#### ОЖИДАЕМО: 400 и тело: {"error":"No seats available"}

### 5) Ошибка валидации: отсутствуют обязательные поля
```http request
curl -sS -X POST "$BASE_URL/api/bookings/reserve" \
-H "Content-Type: application/json" \
-d "{}" \
-w "\nHTTP_STATUS:%{http_code}\n"
```
#### ОЖИДАЕМО: 400 и тело: {"error":"event_id and user_id required"}

### 6) Контрольный успешный кейс для события #2 (у него 1 место свободно)
```http request
curl -sS -X POST "$BASE_URL/api/bookings/reserve" \
-H "Content-Type: application/json" \
-d "{\"event_id\": $EVENT_2, \"user_id\": \"user_for_event2\"}" \
-w "\nHTTP_STATUS:%{http_code}\n"
```
#### ОЖИДАЕМО: 201 и тело: {"success": true, "booking": {...}}