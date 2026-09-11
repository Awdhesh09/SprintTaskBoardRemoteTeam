# Sprint Task Board

An internal task board for a remote software team. The application provides a small ASP.NET Core API and an Angular client for creating, viewing, editing, paging through, and deleting sprint tasks.

## Current Implementation Status

### Implemented

- ASP.NET Core Web API targeting .NET 10.
- SQL Server persistence using Dapper and stored procedures.
- Angular 22 standalone frontend.
- Task create, read, update, and delete operations.
- Server-side pagination with `pageNumber`, `pageSize`, `TotalCount`, and `TotalPages`.
- Task fields: ID, title, description, assignee, status, due date, completion date, sprint, and creation date.
- Basic backend logging and HTTP error responses for validation, missing records, and unexpected failures.
- Angular success/error messages using SweetAlert2 and an error alert area.
- Responsive table layout using Bootstrap.
- Seed script containing the table, stored procedures, and sample tasks.
- Angular component tests covering initialization, pagination, payload construction, and invalid date input.
- Development Swagger/OpenAPI UI.

### Not Yet Implemented or Incomplete

These items are important gaps against the original challenge requirements and should be completed before calling the application production-ready:

- Board filters by assignee, status, and overdue state are not implemented.
- Title search is not implemented.
- Backend validation does not yet enforce all business rules:
  - due dates in the past are allowed when creating non-completed tasks;
  - blocked tasks do not require a reason in the description;
  - delete is not restricted to `Not Started` and `Done` tasks;
  - DTO status values are not restricted to the four supported statuses.
- The frontend status is a free-text input instead of a controlled list.
- The frontend `isValidTaskForm()` method currently does not perform validation itself.
- No loading indicator or disabled state is shown while an async operation is running.
- Delete does not currently ask for confirmation in the UI.
- The frontend API URL is hardcoded to `https://localhost:7127`.
- CORS currently allows every origin, method, and header; this is unsuitable for production.
- There is no authentication or authorization.
- The connection string contains a machine-specific local SQL Server name in `appsettings.json`.
- There is no database migration mechanism; setup currently depends on running `Data/seeddata.sql` manually.
- There is no backend unit or integration test project.
- Change history/audit history and soft-delete/archive are not implemented.

## Technology Stack

| Area              | Technology                       |
| ----------------- | -------------------------------- |
| Backend           | ASP.NET Core Web API, .NET 10    |
| Data access       | Dapper, Microsoft.Data.SqlClient |
| Database          | Microsoft SQL Server             |
| Frontend          | Angular 22, TypeScript           |
| UI                | Bootstrap 5, SweetAlert2         |
| API documentation | Swagger/OpenAPI in Development   |

## Prerequisites

- .NET 10 SDK
- Node.js and npm compatible with Angular 22
- SQL Server or SQL Server Express
- A SQL Server client such as SQL Server Management Studio or Azure Data Studio

Check installed versions:

```powershell
dotnet --version
node --version
npm --version
```

## Database Setup

1. Create a SQL Server database named `SprintTaskBoardDb`, or choose another database name.
2. Open `STBWEBAPI/STBWEBAPI/Data/seeddata.sql` in SQL Server Management Studio or Azure Data Studio.
3. Execute the complete script against SQL Server. It creates the `dbo.Tasks` table, stored procedures, and sample data.
4. Configure the connection string before starting the API. The checked-in value is only a local development example and contains a machine-specific server name.

For a local Windows-authenticated SQL Server instance, set a user-specific value through user secrets or an environment variable instead of committing credentials:

```powershell
cd STBWEBAPI/STBWEBAPI
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Data Source=localhost;Initial Catalog=SprintTaskBoardDb;Integrated Security=True;Encrypt=True;TrustServerCertificate=True"
```

The application currently reads `ConnectionStrings:DefaultConnection` from configuration. Update the value for the SQL Server instance available on your machine.

## Run the Backend

```powershell
cd STBWEBAPI/STBWEBAPI
dotnet restore
dotnet run --launch-profile https
```

Configured development URLs:

- HTTPS API: `https://localhost:7127`
- HTTP API: `http://localhost:5177`
- Swagger UI: `https://localhost:7127/` while the environment is `Development`

The Angular service currently calls `https://localhost:7127/api/Tasks`. Trust the local HTTPS development certificate if the browser reports a certificate warning:

```powershell
dotnet dev-certs https --trust
```

## Run the Frontend

Open a second terminal:

```powershell
cd STBWEBAPP
npm install
npm start
```

Open `http://localhost:4200/` in a browser.

Useful frontend commands:

```powershell
npm run build
npm test
```

## API Endpoints

Base URL: `https://localhost:7127/api/Tasks`

### Get paged tasks

```http
GET /api/Tasks?pageNumber=1&pageSize=10
```

Example response shape:

```json
{
  "items": [
    {
      "id": 1,
      "title": "Prepare sprint review",
      "description": "Collect completed work and risks",
      "assignee": "Awdhesh",
      "status": "In Progress",
      "dueDate": "2026-09-27T00:00:00",
      "completedAt": null,
      "sprint": "Sprint 24",
      "createdAt": "2026-09-11T00:00:00"
    }
  ],
  "pageNumber": 1,
  "pageSize": 10,
  "totalCount": 1,
  "totalPages": 1
}
```

### Get one task

```http
GET /api/Tasks/{id}
```

Returns `200 OK` with the task or `404 Not Found` if the task does not exist.

### Create a task

```http
POST /api/Tasks
Content-Type: application/json
```

```json
{
  "title": "Prepare sprint review",
  "description": "Collect completed work and risks",
  "assignee": "Awdhesh",
  "status": "In Progress",
  "dueDate": "2026-09-27T00:00:00.000Z",
  "sprint": "Sprint 24"
}
```

Returns `201 Created` when the database operation succeeds. The API model requires a title and status and limits the title to 200 characters.

### Update a task

```http
PUT /api/Tasks/{id}
Content-Type: application/json
```

```json
{
  "id": 1,
  "title": "Prepare sprint review",
  "description": "Review completed work and risks",
  "assignee": "Awdhesh",
  "status": "Done",
  "dueDate": "2026-09-27T00:00:00.000Z",
  "sprint": "Sprint 24"
}
```

Returns `200 OK`, `400 Bad Request` for an ID mismatch, or `404 Not Found` when the task does not exist.

### Delete a task

```http
DELETE /api/Tasks/{id}
```

Returns `204 No Content` when the delete succeeds or `404 Not Found` when the task does not exist. The current implementation does not yet enforce the requirement that only `Not Started` and `Done` tasks can be deleted.

## Architecture and Design Decisions

- The API is organized into controllers, services, repositories, and a unit-of-work abstraction. This separates HTTP concerns from business logic and database access.
- Dapper and stored procedures keep the data access layer explicit and lightweight for the current relational schema.
- The paged response includes both items and metadata so the Angular client can render navigation without loading the entire sprint.
- The Angular task service centralizes HTTP calls, while the task component owns form state, paging state, and user feedback.
- The table highlights status with badges, making blocked and completed work easy to scan.
- `CompletedAt` is assigned by the service when a task is created or updated with status `Done`.
- The SQL script provides a repeatable local starting point with sample data.

## Reliability and Error Handling

- Backend exceptions are logged through `ILogger<TasksController>` and converted into HTTP responses.
- Missing tasks return `404` instead of silently succeeding.
- The frontend displays load and save/delete failures to the user.
- Successful create, update, and delete operations show a confirmation message.

The current implementation still needs operation-level loading state, retry guidance, server-side business validation, and automated API tests before production deployment.

## Trade-offs and Future Improvements

This version intentionally keeps the scope small: there is no login system, team-member table, audit trail, real-time collaboration, or drag-and-drop board. That keeps the core CRUD workflow understandable, but it also means the application is currently best treated as a local/internal prototype.

For a production iteration, I would prioritize:

1. Add query filters/search and indexed SQL queries for title, assignee, status, sprint, and overdue tasks.
2. Move validation into shared/domain rules and return consistent `ProblemDetails` responses.
3. Add database migrations, environment-based configuration, restricted CORS, authentication, and authorization.
4. Add backend unit/integration tests and end-to-end tests for the critical task workflows.
5. Add delete confirmation, loading states, controlled status selection, and overdue/blocked visual indicators.
6. Replace hard delete with soft delete or archival. This preserves history and prevents accidental loss while allowing normal users to keep the board clean.
7. Add audit events for status, assignee, due-date, and description changes.

## Known Issues

- The API and UI have no authentication or authorization.
- CORS is configured as `AllowAnyOrigin`, `AllowAnyMethod`, and `AllowAnyHeader`.
- The default connection string is machine-specific and should not be used as a deployment configuration.
- Search, filters, overdue highlighting, loading states, and delete confirmation are not complete.
- Backend tests and a formal migration pipeline are not included yet.

## Repository Hygiene

The root `.gitignore` excludes .NET build output, Angular dependencies/build output, Visual Studio files, and local environment files. Do not commit connection strings containing credentials, generated `bin`/`obj` content, or `node_modules`.
