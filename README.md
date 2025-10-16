# 📊 Unit Economics Calculator

Интерактивный калькулятор для расчёта ключевых показателей юнит-экономики: **CPPU**, **LTV**, **PPPU**, **ARPU**, **Gross Profit** и других метрик.

![Preview](./public/preview.png)

---

## 🚀 Технологии

Проект создан на современном стеке:

- **Next.js** 14 (App Router)
- **React** 18
- **TypeScript**
- **MongoDB / Mongoose**
- **SCSS Modules**
- **Next API Routes** (для CRUD-операций)
- **PM2** и **Nginx** — для продакшн-развёртывания

---

## ⚙️ Функциональность

- 📈 Расчёт метрик в реальном времени:
  - `CPPU` — стоимость привлечения платящего пользователя  
  - `LTV` — доход с одного клиента за всё время  
  - `PPPU` — прибыль на пользователя  
  - `ARPU`, `Gross Profit`, `Operating Profit` и др.
- 💾 Сохранение и редактирование расчётов в MongoDB
- 🗑 Удаление расчёта через API
- 📉 Поддержка пользовательских коэффициентов (`CR1`, `CR2`, `RET`)
- 🧮 Удобная визуальная формула с пояснениями
- 🎨 Адаптивная верстка и аккуратное выравнивание элементов (по макету JetStyle)
- 🧠 Автоматическое приведение типов числовых данных (на бэкенде)

---

## 🧩 Структура проекта

```
project-root/
├── app/
│   ├── page.tsx              # Главная страница с калькулятором
│   ├── layout.tsx            # Базовый Layout (Header / Footer)
│   └── api/
│       └── calcs/[id]/route.ts  # PATCH / DELETE для MongoDB
│
├── components/
│   ├── FormulaCard.tsx       # Основной компонент формулы
│   └── MetricsBlock.tsx      # Дополнительные метрики
│
├── lib/
│   └── mongodb.ts            # Подключение к MongoDB
│
├── server/
│   └── models/
│       └── Calc.ts           # Mongoose модель расчёта
│
├── styles/
│   ├── globals.scss
│   └── formula.v2.module.scss
│
└── README.md
```

---

## 🔧 Установка и запуск

### 1. Клонировать репозиторий
```bash
git clone https://github.com/yourname/unit-economics-calculator.git
cd unit-economics-calculator
```

### 2. Установить зависимости
```bash
npm install
```

### 3. Настроить переменные окружения
Создай `.env.local` и добавь:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/calcs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Запуск проекта
```bash
npm run dev
```
или продакшн:
```bash
npm run build
npm start
```

---

## 🧮 Формула расчёта

```
PPPU = ( (AVP - COGS) × Ret ) − (CPC / CR1 / CR2)
```

где:
- **CPC** — стоимость клика  
- **CR1 / CR2** — конверсии по этапам  
- **AVP** — средний чек  
- **COGS** — себестоимость  
- **Ret** — коэффициент возврата  
- **AU** — активные пользователи  

---

## 🗂 API

### PATCH `/api/calcs/[id]`
Обновление расчёта.

```json
{
  "cpc": 14,
  "cr1": 2.43,
  "cr2": 53,
  "avp": 1050,
  "cogs": 250,
  "ret": 1.9,
  "au": 10000
}
```

### DELETE `/api/calcs/[id]`
Удаление расчёта.

Ответ:
```json
{ "ok": true }
```

---

## 🧠 Автор

**Andrey Lysov**  
Full-stack разработчик / студия [PORT-443](https://p443.ru)

---

## 📄 Лицензия
MIT License © 2025 Andrey Lysov  
Разрешено использование в коммерческих и некоммерческих проектах при сохранении ссылки на автора.
