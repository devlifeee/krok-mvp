# Krok Nodes Backend

Backend API для управления настройками узлов в системе Krok.

## Установка

1. Создайте виртуальное окружение:

```bash
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
```

2. Установите зависимости:

```bash
pip install -r requirements.txt
```

## Запуск

1. Запустите сервер разработки:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. Откройте браузер и перейдите по адресу:
   - API документация: http://localhost:8000/docs
   - Альтернативная документация: http://localhost:8000/redoc

## API Endpoints

### Узлы (Nodes)

- `GET /api/v1/nodes/` - Получить все узлы
- `GET /api/v1/nodes/{node_id}` - Получить узел по ID
- `POST /api/v1/nodes/` - Создать новый узел
- `PUT /api/v1/nodes/{node_id}` - Обновить узел
- `DELETE /api/v1/nodes/{node_id}` - Удалить узел

### Потоки (Flows)

- `GET /api/v1/flows/` - Получить все потоки
- `GET /api/v1/flows/{flow_id}` - Получить поток по ID
- `POST /api/v1/flows/` - Создать новый поток
- `PUT /api/v1/flows/{flow_id}` - Обновить поток
- `DELETE /api/v1/flows/{flow_id}` - Удалить поток

## Структура проекта

```
backend2/
├── app/
│   ├── api/
│   │   └── endpoints/
│   │       ├── nodes.py
│   │       └── flows.py
│   ├── core/
│   │   ├── config.py
│   │   └── database.py
│   ├── crud/
│   │   ├── node.py
│   │   └── flow.py
│   ├── models/
│   │   ├── node.py
│   │   └── flow.py
│   └── schemas/
│       ├── node.py
│       └── flow.py
├── main.py
├── requirements.txt
└── README.md
```

## База данных

По умолчанию используется SQLite база данных `krok_nodes.db`. Для изменения настройки базы данных отредактируйте `DATABASE_URL` в файле `app/core/config.py`.
