# 📊 Unit Economics Calculator

> ⚙️ **Интерактивный калькулятор юнит-экономики**  
> для расчёта ключевых показателей эффективности: **CPPU**, **LTV**, **PPPU**, **ARPU**, **Gross Profit** и др.

![Preview](./public/preview.png)

---

## 🚀 Технологии

- 🧩 **Next.js 14** (App Router)
- ⚛️ **React 18 + TypeScript**
- 🍃 **MongoDB / Mongoose**
- 🎨 **SCSS Modules**
- 🧠 **Next API Routes** — собственный backend для CRUD-операций
- 🐳 **Docker / Docker Compose**, **PM2**, **Nginx** — для продакшн-развёртывания

---

## 💡 Возможности

- 📈 Расчёт метрик в реальном времени  
- 💾 Сохранение и редактирование расчётов в MongoDB  
- 🗑 Удаление через API (`DELETE /api/calcs/[id]`)  
- ⚙️ Поддержка пользовательских коэффициентов (`CR1`, `CR2`, `RET`)  
- 🧮 Приведение числовых типов на бэкенде  
- 📱 Адаптивная верстка и аккуратное выравнивание (по макету JetStyle)

---

## 🧩 Структура проекта

```
project-root/
├── app/
│   ├── page.tsx                 # Главная страница с калькулятором
│   ├── layout.tsx               # Базовый Layout (Header / Footer)
│   └── api/
│       ├── calcs/route.ts       # POST/GET список расчётов
│       └── calcs/[id]/route.ts  # PATCH/DELETE один расчёт
│
├── components/
│   ├── FormulaCard.tsx
│   └── MetricsBlock.tsx
│
├── lib/
│   └── mongodb.ts               # Подключение к MongoDB с кэшем
│
├── server/
│   └── models/
│       └── Calc.ts              # Mongoose-модель
│
├── styles/
│   ├── globals.scss
│   └── formula.v2.module.scss
│
└── README.md
```

---

## 🧮 Формула расчёта

```
PPPU = ((AVP - COGS) × Ret) − (CPC / CR1 / CR2)
```

| Переменная | Значение |
|-------------|-----------|
| **CPC** | стоимость клика |
| **CR1**, **CR2** | конверсии по этапам (%) |
| **AVP** | средний чек |
| **COGS** | себестоимость |
| **Ret** | коэффициент возврата |
| **AU** | активные пользователи |

---

## 🧠 Работа с MongoDB

### Подключение (lib/mongodb.ts)

```ts
import mongoose from 'mongoose';

declare global {
  var _mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; uri: string | null }
    | undefined;
}

function makeUri() {
  const raw = process.env.MONGODB_URI;
  if (!raw) throw new Error('Missing MONGODB_URI');
  const db = (process.env.MONGODB_DB || 'jetstyle').trim();
  const hasDbAtEnd = /\/[^/?]+$/.test(raw);
  return hasDbAtEnd ? raw : `${raw.replace(/\/$/, '')}/${db}`;
}

const FINAL_URI = makeUri();
if (!global._mongoose) global._mongoose = { conn: null, promise: null, uri: FINAL_URI };

export async function dbConnect() {
  const cache = global._mongoose!;
  if (cache.conn && mongoose.connection.readyState === 1) return cache.conn;

  if (!cache.promise) {
    mongoose.set('strictQuery', true);
    cache.promise = mongoose.connect(cache.uri!, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
```

---

## 🐳 Docker / Docker Compose

### `.env`

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

MONGODB_URI=mongodb://mongo:27017
MONGODB_DB=jetstyle
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=secret
```

### `Dockerfile`

```Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
USER app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
```

### `docker-compose.yml`

```yaml
version: "3.9"

services:
  app:
    build: .
    image: unitcalc-app
    env_file: .env
    ports:
      - "3000:3000"
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:7
    container_name: unitcalc-mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
    volumes:
      - mongo_data:/data/db
      - ./backups:/backups
    ports:
      - "27017:27017"
    restart: unless-stopped

  mongo-express:
    image: mongo-express:1.0.2
    environment:
      - ME_CONFIG_MONGODB_SERVER=mongo
      - ME_CONFIG_MONGODB_ADMINUSERNAME=${MONGO_INITDB_ROOT_USERNAME}
      - ME_CONFIG_MONGODB_ADMINPASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
      - ME_CONFIG_BASICAUTH=false
    ports:
      - "8081:8081"
    depends_on:
      - mongo

volumes:
  mongo_data:
```

---

## 🧠 Автор

**Andrey Lysov**  
Full-stack разработчик / студия [PORT-443](https://p443.ru)

---

## 📄 Лицензия

MIT License © 2025 Andrey Lysov  
Разрешено использование в коммерческих и некоммерческих проектах  
при сохранении ссылки на автора.
