
Образ docker - vadimdzh@maxbotapp

# StudyApp Monorepo

В репозитории находятся два приложения:
- `studyapp/` — фронтенд на React (CRA).
- `studyappserver/` — Node.js/Express backend c MAX бот-интеграцией.

## Предварительные требования
1. Node.js 20+ и npm.
2. Самоподписанный сертификат для фронтенда (`localhost+1.pem` и `localhost+1-key.pem`) в каталоге `studyapp/`. Проще всего создать через [mkcert](https://github.com/FiloSottile/mkcert):
   ```bash
   mkcert -install
   cd studyapp
   mkcert localhost 127.0.0.1 ::1
   ```
   В результате появятся файлы, которые ожидает CRA при запуске по HTTPS.
3. Ознакомьтесь с зависимостями в `Requirements.txt`.

## Локальный запуск без Docker
1. **Backend**
   ```bash
   cd studyappserver
   npm install
   npm run start        # поднимет сервер на http://localhost:3001
   ```
2. **Frontend (в отдельном терминале)**
   ```bash
   cd studyapp
   npm install
   REACT_APP_API_BASE_URL=http://localhost:3001 \
   HTTPS=true \
   SSL_CRT_FILE=./localhost+1.pem \
   SSL_KEY_FILE=./localhost+1-key.pem \
   PORT=443 \
   npm run start
   ```
   После старта приложение будет доступно по https://localhost/.

## Docker образ
В корне репозитория уже есть `Dockerfile`, который устанавливает оба приложения и стартует их через `start.sh`.

### Сборка
```bash
docker build -t studyapp-full .
```

### Запуск
```bash
docker run --rm -p 443:3001 studyapp-full
```
Фронтенд продолжит работать по HTTPS на 443 порту, backend — на 3001. Убедитесь, что сертификаты `localhost+1.pem` и `localhost+1-key.pem` находятся в каталоге `studyapp/` **до** сборки контейнера, иначе CRA не сможет стартовать по HTTPS.

### Использование готового образа
Сборку можно пропустить и воспользоваться опубликованным образом `vadimdzh/maxbotapp`:
```bash
docker pull vadimdzh/maxbotapp
docker run --rm -p 443:443 -p 3001:3001 vadimdzh/maxbotapp
```

## Содержимое
- `Dockerfile` — сборка образа (Node 20, установка зависимостей, запуск двух сервисов).
- `start.sh` — запускает backend и frontend c требуемыми переменными окружения.
- `Requirements.txt` — список библиотек и версий для обоих проектов.
- `studyapp/` и `studyappserver/` — исходный код приложений.

При необходимости внесите дополнительные настройки (например, переменные окружения backend), объявив их через `.env` или параметры запуска Docker.


Также перед запуском приложения требуется занести BOT_TOKEN в .env-файл по пути studyappserver/.env
