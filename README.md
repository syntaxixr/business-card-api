# Цифровая визитка

GraphQL API с информацией обо мне: профиль, навыки, опыт работы и проекты.

Стек: TypeScript, NestJS 11, GraphQL (Apollo Server 5, code-first), Prisma 6, PostgreSQL, Docker.

## Запуск

```bash
docker compose up --build
```

Apollo Sandbox откроется на http://localhost:3000/graphql, сразу с примером запроса. При старте контейнер сам применяет миграции и заполняет базу.

Локально без сборки образа:

```bash
cp .env.example .env
npm ci
docker compose up -d db
npx prisma migrate dev
npm run start:dev
```

Тесты и линтер:

```bash
npm test
npm run test:e2e   # нужна база из docker compose
npm run lint
```

## Пример запроса

```graphql
query {
  profile {
    name
    description
    skills { name level }
    experience {
      company
      position
      period { start end months }
      projects { name }
    }
    projects {
      name
      url
      stack { name }
    }
  }
}
```

Полная схема в [schema.gql](schema.gql).

## Архитектура

```
src/
  profile/      Query.profile и поля профиля
  skills/       навыки и стек проектов
  experience/   опыт работы, расчёт периода
  projects/     проекты
  loaders/      DataLoader'ы для вложенных полей
  prisma/       PrismaService
prisma/
  schema.prisma, migrations/
  profile.data.ts   данные визитки
  seed.ts
```

Каждый модуль разбит на три слоя. Resolver описывает GraphQL и ничего не знает про базу. Service держит логику: группировку для загрузчиков, расчёт периода работы. Repository единственный работает с Prisma. Так логику можно тестировать без GraphQL и без базы, а запросы к базе собраны в одном месте.

Схема строится code-first из TypeScript-классов. `schema.gql` генерируется при запуске в dev-режиме и лежит в репозитории, чтобы изменения схемы были видны в диффе.

### Вложенные данные

Все вложенные поля (`links`, `skills`, `experience`, `projects`, `experience.projects`, `projects.stack`) грузятся через DataLoader. Он собирает id всех родителей и делает один запрос `WHERE ... IN (...)` на поле, а не запрос на каждый объект. Загрузчики создаются на каждый запрос, поэтому кэш не живёт дольше запроса.

Полный запрос из Sandbox выполняется за 8 SQL-запросов при любом количестве проектов и навыков, это проверяет e2e-тест. С `LOG_QUERIES=true` запросы видно в логе.

Вместо DataLoader можно было строить `include` по полям запроса, но тогда пришлось бы разбирать AST и поддерживать это при каждом изменении схемы. DataLoader работает на любой глубине и не тянет то, что не запросили.

### База данных

Все таблицы привязаны к `Profile` с каскадным удалением. Проекты и навыки связаны многие-ко-многим через `ProjectSkill`, поэтому навык хранится один раз и используется в стеке разных проектов. Проект может ссылаться на место работы, отсюда поле `experience.projects`. Достижения лежат массивом `text[]`: они всегда читаются вместе с записью опыта, отдельная таблица им не нужна. Порядок вывода задаётся полем `position`.

### Заполнение базы

Контейнер при старте выполняет `prisma migrate deploy`, затем сид, затем запускает приложение.

Данные лежат в `prisma/profile.data.ts`. Сид работает в одной транзакции и делает upsert по естественным ключам (slug профиля, название навыка, название проекта), а потом удаляет записи, которых больше нет в файле. Поэтому его можно запускать на каждом старте: id не меняются, дублей не появляется.

### Docker

Образ собирается в два этапа, в финальный попадают только prod-зависимости и собранный код. Приложение работает не от root, есть healthcheck на `/health`. В `docker compose` приложение ждёт, пока база будет готова.

