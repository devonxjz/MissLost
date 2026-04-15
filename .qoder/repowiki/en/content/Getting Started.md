# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [docker-compose.yml](file://docker-compose.yml)
- [backend/package.json](file://backend/package.json)
- [frontend/package.json](file://frontend/package.json)
- [backend/src/main.ts](file://backend/src/main.ts)
- [backend/src/config/supabase.config.ts](file://backend/src/config/supabase.config.ts)
- [backend/src/utils/supabase/client.ts](file://backend/src/utils/supabase/client.ts)
- [backend/Dockerfile](file://backend/Dockerfile)
- [frontend/Dockerfile](file://frontend/Dockerfile)
- [backend/sql/triggers_migration.sql](file://backend/sql/triggers_migration.sql)
- [backend/sql/triggers_permissions.sql](file://backend/sql/triggers_permissions.sql)
- [backend/sql/update_trigger_points.sql](file://backend/sql/update_trigger_points.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites and System Requirements](#prerequisites-and-system-requirements)
3. [Development Environment Setup](#development-environment-setup)
4. [Database Setup](#database-setup)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Running the Application Locally with Docker Compose](#running-the-application-locally-with-docker-compose)
7. [Initial Project Structure Walkthrough](#initial-project-structure-walkthrough)
8. [Basic Usage Examples](#basic-usage-examples)
9. [Dependency Analysis](#dependency-analysis)
10. [Performance Considerations](#performance-considerations)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Conclusion](#conclusion)

## Introduction
MissLost is a full-stack web application designed to help users report lost items and connect with people who found them. It includes user authentication, post creation for lost and found items, real-time chat, administrative dashboards, and a trigger-based handover system with training points. The platform integrates with Supabase for authentication and real-time features, and uses PostgreSQL for data persistence with advanced extensions.

This guide provides a complete getting started experience for beginners and experienced developers alike, covering prerequisites, environment setup, database configuration, environment variables, local deployment via Docker Compose, and basic usage examples.

## Prerequisites and System Requirements
- Operating system: Windows, macOS, or Linux
- Docker Desktop installed and running
- Git for cloning the repository
- A modern browser for accessing the frontend
- Optional: Node.js and npm for local development outside Docker

Minimum hardware recommendation:
- CPU: Quad-core processor
- RAM: 8 GB minimum (16 GB recommended)
- Disk space: 20 GB free for containers and databases

**Section sources**
- [README.md:1-10](file://README.md#L1-L10)

## Development Environment Setup
Install Docker Desktop for your operating system and ensure it is running. Verify installation by opening a terminal and running:
- docker --version
- docker compose version

Clone the repository and navigate to the project root directory. The project includes two applications:
- Backend: NestJS application (TypeScript)
- Frontend: Next.js application (React)

Install dependencies inside each application:
- Backend: npm install
- Frontend: npm install

Build images for both applications:
- Backend: npm run build
- Frontend: npm run build

Note: The provided Dockerfiles build the applications and expose the appropriate ports. For local development without Docker, you can run the applications directly using npm scripts defined in each package.json.

**Section sources**
- [backend/package.json:8-21](file://backend/package.json#L8-L21)
- [frontend/package.json:5-10](file://frontend/package.json#L5-L10)
- [backend/Dockerfile:1-14](file://backend/Dockerfile#L1-L14)
- [frontend/Dockerfile:1-14](file://frontend/Dockerfile#L1-L14)

## Database Setup
The application requires PostgreSQL with the following extensions enabled:
- pg_trgm
- uuid-ossp
- vector (if using vector embeddings)

Configure the database in docker-compose.yml:
- Image: postgres:15
- Environment variables: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- Port mapping: 5432:5432
- Persistent volume: pgdata

After starting the database container, connect to the database and enable the required extensions:
- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
- CREATE EXTENSION IF NOT EXISTS "pg_trgm";
- CREATE EXTENSION IF NOT EXISTS "vector";

Run the migration scripts to set up the triggers system:
- Apply triggers_migration.sql to create tables, enums, indexes, and functions
- Apply triggers_permissions.sql to enable RLS and grant permissions
- Optionally apply update_trigger_points.sql to adjust default points awarded

These scripts define the triggers table, related functions for creating, confirming, and cancelling triggers, and policies for row-level security.

**Section sources**
- [docker-compose.yml:27-47](file://docker-compose.yml#L27-L47)
- [backend/sql/triggers_migration.sql:1-338](file://backend/sql/triggers_migration.sql#L1-L338)
- [backend/sql/triggers_permissions.sql:1-57](file://backend/sql/triggers_permissions.sql#L1-L57)
- [backend/sql/update_trigger_points.sql:1-132](file://backend/sql/update_trigger_points.sql#L1-L132)

## Environment Variables Configuration
Configure environment variables for Supabase, JWT, and AI services. The backend reads the following variables:
- SUPABASE_URL: Supabase project URL
- SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY: Supabase keys for authentication
- FRONTEND_URL: Origin for CORS configuration
- PORT: Backend server port (default 3001)

The frontend reads:
- NEXT_PUBLIC_SUPABASE_URL: Public Supabase URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Public Supabase anonymous key

Ensure these variables are set in the respective .env files referenced by docker-compose.yml:
- Backend env_file: ./backend/.env
- Frontend env_file: ./frontend/.env.local

The backend also exposes Swagger documentation at /api-docs for API exploration.

**Section sources**
- [backend/src/config/supabase.config.ts:7-23](file://backend/src/config/supabase.config.ts#L7-L23)
- [backend/src/utils/supabase/client.ts:9-18](file://backend/src/utils/supabase/client.ts#L9-L18)
- [backend/src/main.ts:20-33](file://backend/src/main.ts#L20-L33)
- [docker-compose.yml:12-25](file://docker-compose.yml#L12-L25)

## Running the Application Locally with Docker Compose
Start the stack using Docker Compose:
- docker-compose up -d

This command starts:
- Backend service (NestJS): port 3001
- Frontend service (Next.js): port 3000
- Database (PostgreSQL): port 5432
- Cache (Redis): port 6379

Access the applications:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger documentation: http://localhost:3001/api-docs

To stop the stack:
- docker-compose down

Logs:
- View logs for a specific service: docker-compose logs -f <service-name>

**Section sources**
- [docker-compose.yml:3-25](file://docker-compose.yml#L3-L25)
- [backend/src/main.ts:35-39](file://backend/src/main.ts#L35-L39)

## Initial Project Structure Walkthrough
High-level structure:
- backend/: NestJS application with modules for auth, posts, chat, triggers, uploads, and AI matches
- frontend/: Next.js application with pages for auth, feeds, chats, settings, and admin panels
- docker-compose.yml: Multi-service orchestration for backend, frontend, PostgreSQL, and Redis
- SQL scripts under backend/sql/: Database migrations and permissions for the triggers system

Key backend entry points:
- src/main.ts: Bootstraps the NestJS application, sets CORS, registers validation pipes, and initializes Swagger

Key frontend entry points:
- frontend/app/: Next.js app directory with pages, components, and shared utilities

**Section sources**
- [backend/src/main.ts:6-39](file://backend/src/main.ts#L6-L39)

## Basic Usage Examples
Below are step-by-step instructions for common tasks. Replace placeholders with your environment values.

1) User Registration
- Endpoint: POST /api/auth/register
- Required fields: email, password, full_name
- Response: user profile and authentication token
- Notes: Ensure Supabase authentication is configured and accessible

2) Post Creation (Lost or Found)
- Lost post endpoint: POST /api/lost-posts
- Found post endpoint: POST /api/found-posts
- Required fields: title, description, location, date_found/date_lost, media
- Response: created post object
- Notes: Media uploads handled by the upload module

3) Matching Process (Triggers)
- Create a trigger: POST /api/triggers (requires authenticated user)
- Confirm a trigger: PATCH /api/triggers/{id}/confirm (target user)
- Cancel a trigger: PATCH /api/triggers/{id}/cancel (creator)
- Responses: trigger status and notifications
- Notes: Triggers require approved posts and enforce expiration logic

4) Real-Time Chat
- Access chat interface at /messages
- Messages are synchronized via Supabase real-time subscriptions
- Notifications are generated for trigger events

5) Administrative Functions
- Access admin dashboard at /admin
- Manage posts and users via admin pages

Swagger endpoints:
- Visit http://localhost:3001/api-docs for interactive API documentation

**Section sources**
- [backend/src/main.ts:26-33](file://backend/src/main.ts#L26-L33)

## Dependency Analysis
Runtime dependencies:
- Backend: NestJS, Supabase JS SDK, Passport, JWT, Bcrypt, Swagger
- Frontend: Next.js, React, Supabase JS SDK, TailwindCSS

Build-time dependencies:
- TypeScript, ESLint, Prettier, Jest for testing

Containerization:
- Both backend and frontend use Node.js 20 base images
- Backend exposes port 3001; frontend exposes port 3000
- Database and cache are provided as separate services

External integrations:
- Supabase for authentication, real-time, and storage
- PostgreSQL with required extensions for advanced text similarity and vector operations

**Section sources**
- [backend/package.json:22-44](file://backend/package.json#L22-L44)
- [frontend/package.json:11-17](file://frontend/package.json#L11-L17)
- [backend/Dockerfile:1-14](file://backend/Dockerfile#L1-L14)
- [frontend/Dockerfile:1-14](file://frontend/Dockerfile#L1-L14)

## Performance Considerations
- Enable database extensions (pg_trgm, uuid-ossp, vector) to optimize text similarity and embeddings queries
- Use indexes defined in triggers_migration.sql for efficient lookups on frequently queried columns
- Configure Redis for caching and session management
- Monitor container resource usage and scale horizontally if needed
- Use production builds for both backend and frontend to reduce startup overhead

## Troubleshooting Guide
Common issues and resolutions:

- Backend fails to start with CORS errors
  - Cause: FRONTEND_URL mismatch
  - Fix: Set FRONTEND_URL to http://localhost:3000 in backend .env

- Supabase client initialization errors
  - Cause: Missing SUPABASE_URL or SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY
  - Fix: Add required environment variables to backend .env

- Database connection refused
  - Cause: PostgreSQL container not running or wrong credentials
  - Fix: Start PostgreSQL service and verify credentials in docker-compose.yml

- Swagger not accessible
  - Cause: Port conflict or disabled CORS
  - Fix: Ensure port 3001 is free and CORS allows frontend origin

- Migration failures
  - Cause: Missing required extensions or insufficient privileges
  - Fix: Enable uuid-ossp, pg_trgm, and vector extensions; run triggers_permissions.sql after triggers_migration.sql

- Frontend not connecting to backend
  - Cause: Backend not reachable on port 3001
  - Fix: Verify backend container is healthy and port mapping is correct

Logs and diagnostics:
- View service logs: docker-compose logs -f <service-name>
- Inspect database: docker exec -it postgres_db psql -U admin -d mydb
- Rebuild images: docker-compose build --no-cache

**Section sources**
- [backend/src/config/supabase.config.ts:12-14](file://backend/src/config/supabase.config.ts#L12-L14)
- [backend/src/utils/supabase/client.ts:13-14](file://backend/src/utils/supabase/client.ts#L13-L14)
- [backend/src/main.ts:20-23](file://backend/src/main.ts#L20-L23)
- [docker-compose.yml:30-36](file://docker-compose.yml#L30-L36)
- [backend/sql/triggers_permissions.sql:6-17](file://backend/sql/triggers_permissions.sql#L6-L17)

## Conclusion
You now have the essentials to set up and run MissLost locally using Docker Compose. Ensure all environment variables are configured, database extensions are enabled, and migrations are applied. Explore the Swagger documentation for API endpoints and use the provided examples to register users, create posts, and manage triggers. For persistent development, install Node.js and npm and run the apps directly. For production deployments, secure environment variables, configure SSL termination, and monitor container health.