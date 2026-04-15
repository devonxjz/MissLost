# Project Overview

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [OVERVIEW.md](file://OVERVIEW.md)
- [backend/src/main.ts](file://backend/src/main.ts)
- [backend/src/app.module.ts](file://backend/src/app.module.ts)
- [backend/src/modules/ai-matches/ai-matches.module.ts](file://backend/src/modules/ai-matches/ai-matches.module.ts)
- [backend/src/modules/ai-matches/ai-matches.service.ts](file://backend/src/modules/ai-matches/ai-matches.service.ts)
- [backend/src/modules/chat/chat.module.ts](file://backend/src/modules/chat/chat.module.ts)
- [backend/src/modules/chat/chat.service.ts](file://backend/src/modules/chat/chat.service.ts)
- [backend/src/modules/storage/storage.module.ts](file://backend/src/modules/storage/storage.module.ts)
- [backend/src/modules/storage/storage.service.ts](file://backend/src/modules/storage/storage.service.ts)
- [backend/src/modules/handovers/handovers.module.ts](file://backend/src/modules/handovers/handovers.module.ts)
- [backend/src/modules/handovers/handovers.service.ts](file://backend/src/modules/handovers/handovers.service.ts)
- [backend/src/modules/lost-posts/lost-posts.module.ts](file://backend/src/modules/lost-posts/lost-posts.module.ts)
- [backend/src/modules/lost-posts/lost-posts.service.ts](file://backend/src/modules/lost-posts/lost-posts.service.ts)
- [frontend/app/layout.tsx](file://frontend/app/layout.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
MissLost is a blog-style web application designed to support the University of Economics and Technology (UEH) campus community by helping students and staff report lost items and find found items. It integrates modern features such as AI-powered matching, real-time chat, centralized storage management, and a training points system to encourage responsible handover and community participation. The platform aims to streamline item recovery, reduce administrative overhead, and foster trust and collaboration among community members.

The application’s purpose aligns with the university’s mission to build a connected and supportive campus life. It provides a structured workflow for reporting, reviewing, matching, communicating, storing, and completing handovers, while rewarding positive contributions through a points system.

**Section sources**
- [README.md:1-10](file://README.md#L1-L10)

## Project Structure
The project follows a modular backend architecture built with NestJS and a Next.js frontend. The backend exposes RESTful APIs organized by domain modules (authentication, posts, AI matching, chat, storage, handovers, notifications, uploads, triggers). The frontend organizes pages and components under an app directory, with routing, theming, and guard mechanisms to manage access and UX.

```mermaid
graph TB
subgraph "Backend (NestJS)"
MAIN["main.ts<br/>Bootstrap server, CORS, Swagger"]
APPMOD["app.module.ts<br/>Root module wiring"]
MOD_AUTH["Auth Module"]
MOD_USERS["Users Module"]
MOD_CATEGORIES["Categories Module"]
MOD_LOST["Lost Posts Module"]
MOD_FOUND["Found Posts Module"]
MOD_AI["AI Matches Module"]
MOD_STORAGE["Storage Module"]
MOD_CHAT["Chat Module"]
MOD_HANDOVER["Handovers Module"]
MOD_NOTIF["Notifications Module"]
MOD_UPLOAD["Upload Module"]
MOD_TRIGGERS["Triggers Module"]
end
subgraph "Frontend (Next.js)"
LAYOUT["layout.tsx<br/>Theme, route guard, shell"]
end
MAIN --> APPMOD
APPMOD --> MOD_AUTH
APPMOD --> MOD_USERS
APPMOD --> MOD_CATEGORIES
APPMOD --> MOD_LOST
APPMOD --> MOD_FOUND
APPMOD --> MOD_AI
APPMOD --> MOD_STORAGE
APPMOD --> MOD_CHAT
APPMOD --> MOD_HANDOVER
APPMOD --> MOD_NOTIF
APPMOD --> MOD_UPLOAD
APPMOD --> MOD_TRIGGERS
LAYOUT --> APPMOD
```

**Diagram sources**
- [backend/src/main.ts:1-41](file://backend/src/main.ts#L1-L41)
- [backend/src/app.module.ts:1-67](file://backend/src/app.module.ts#L1-L67)
- [frontend/app/layout.tsx:1-44](file://frontend/app/layout.tsx#L1-L44)

**Section sources**
- [backend/src/main.ts:1-41](file://backend/src/main.ts#L1-L41)
- [backend/src/app.module.ts:1-67](file://backend/src/app.module.ts#L1-L67)
- [frontend/app/layout.tsx:1-44](file://frontend/app/layout.tsx#L1-L44)

## Core Components
This section outlines the primary functional domains and their responsibilities:

- Authentication and Authorization
  - Handles user registration, login, role-based access, and session management.
  - Integrates JWT and role guards for protected routes.

- Lost and Found Posts
  - Supports creation, querying, editing, deletion, and admin review of posts.
  - Implements status lifecycle (pending, approved, rejected, matched, closed).

- AI-Powered Matching
  - Computes text similarity between lost and found posts to propose matches.
  - Tracks match outcomes and supports manual confirmation by parties.

- Real-Time Chat
  - Manages conversations and messages between parties associated with a match.
  - Enforces participant checks and marks messages as read.

- Storage Management
  - Tracks items stored on campus, assigns item codes, and manages claims.
  - Links found posts to storage records and updates statuses accordingly.

- Handover and Training Points
  - Coordinates verified handovers with offline verification codes.
  - Automatically grants training points upon successful completion and closes related posts.

- Notifications
  - Emits real-time notifications for key events such as approvals, matches, messages, and completions.

- Uploads and Triggers
  - Provides upload capabilities and database triggers for operational automation.

Practical examples:
- Item registration: A user submits a lost post with title, description, images, and category; the post transitions to approved immediately or pending depending on policy.
- Matching process: The system computes text similarity against approved found posts and proposes matches; both parties confirm to finalize.
- Handover procedure: Parties coordinate offline using a verification code; upon confirmation, the system awards points and closes the posts.

**Section sources**
- [OVERVIEW.md:42-62](file://OVERVIEW.md#L42-L62)
- [backend/src/modules/lost-posts/lost-posts.service.ts:19-43](file://backend/src/modules/lost-posts/lost-posts.service.ts#L19-L43)
- [backend/src/modules/ai-matches/ai-matches.service.ts:45-96](file://backend/src/modules/ai-matches/ai-matches.service.ts#L45-L96)
- [backend/src/modules/chat/chat.service.ts:12-36](file://backend/src/modules/chat/chat.service.ts#L12-L36)
- [backend/src/modules/storage/storage.service.ts:53-78](file://backend/src/modules/storage/storage.service.ts#L53-L78)
- [backend/src/modules/handovers/handovers.service.ts:12-32](file://backend/src/modules/handovers/handovers.service.ts#L12-L32)

## Architecture Overview
The system architecture is layered and event-driven:

- Presentation Layer (Next.js)
  - Renders UI, enforces route protection, and orchestrates user interactions.
- Application Layer (NestJS)
  - Exposes REST endpoints via domain modules; applies guards, interceptors, and filters.
- Data Access Layer
  - Uses Supabase client for database operations and triggers for automation.
- Database Layer (PostgreSQL)
  - Maintains normalized schemas for users, posts, matches, storage, handovers, and notifications with row-level security and indexes.

```mermaid
graph TB
FE["Frontend (Next.js)<br/>layout.tsx"]
BE["Backend (NestJS)<br/>main.ts, app.module.ts"]
AUTH["Auth Module"]
POSTS["Posts Modules<br/>Lost/Found"]
AI["AI Matches Module"]
CHAT["Chat Module"]
STORE["Storage Module"]
HAND["Handovers Module"]
NOTIF["Notifications Module"]
DB["PostgreSQL<br/>RLS, indexes, triggers"]
FE --> BE
BE --> AUTH
BE --> POSTS
BE --> AI
BE --> CHAT
BE --> STORE
BE --> HAND
BE --> NOTIF
AUTH --> DB
POSTS --> DB
AI --> DB
CHAT --> DB
STORE --> DB
HAND --> DB
NOTIF --> DB
```

**Diagram sources**
- [backend/src/main.ts:1-41](file://backend/src/main.ts#L1-L41)
- [backend/src/app.module.ts:1-67](file://backend/src/app.module.ts#L1-L67)
- [frontend/app/layout.tsx:1-44](file://frontend/app/layout.tsx#L1-L44)

## Detailed Component Analysis

### AI Matching Workflow
The AI matching service computes text similarity between lost and found posts to propose matches. It supports:
- Retrieving existing matches for a lost post
- Running a new matching computation
- Confirming matches by either party
- Aggregating statistics for admin dashboards

```mermaid
sequenceDiagram
participant User as "User"
participant API as "AI Matches Service"
participant DB as "PostgreSQL"
User->>API : "Run match for lost post"
API->>DB : "Fetch lost post details"
DB-->>API : "Lost post data"
API->>DB : "Find approved found posts (same category)"
DB-->>API : "Candidate found posts"
API->>API : "Compute text similarity"
API->>DB : "Upsert matches with scores"
DB-->>API : "Match records"
API-->>User : "Match results"
```

**Diagram sources**
- [backend/src/modules/ai-matches/ai-matches.service.ts:45-96](file://backend/src/modules/ai-matches/ai-matches.service.ts#L45-L96)

**Section sources**
- [backend/src/modules/ai-matches/ai-matches.service.ts:15-40](file://backend/src/modules/ai-matches/ai-matches.service.ts#L15-L40)
- [backend/src/modules/ai-matches/ai-matches.service.ts:101-141](file://backend/src/modules/ai-matches/ai-matches.service.ts#L101-L141)
- [backend/src/modules/ai-matches/ai-matches.module.ts:1-11](file://backend/src/modules/ai-matches/ai-matches.module.ts#L1-L11)

### Chat and Conversation Flow
The chat service enables secure messaging between parties involved in a potential handover. It ensures participants are legitimate and automatically marks messages as read.

```mermaid
sequenceDiagram
participant UserA as "Party A"
participant UserB as "Party B"
participant API as "Chat Service"
participant DB as "PostgreSQL"
UserA->>API : "Create or get conversation"
API->>DB : "Check existing conversation"
DB-->>API : "Existing or none"
API->>DB : "Insert new conversation"
DB-->>API : "Conversation record"
UserA->>API : "Send message"
API->>DB : "Insert message"
DB-->>API : "Message record"
API->>DB : "Mark others' messages as read"
DB-->>API : "Read updates"
API-->>UserA : "Sent message"
```

**Diagram sources**
- [backend/src/modules/chat/chat.service.ts:38-66](file://backend/src/modules/chat/chat.service.ts#L38-L66)
- [backend/src/modules/chat/chat.service.ts:102-126](file://backend/src/modules/chat/chat.service.ts#L102-L126)

**Section sources**
- [backend/src/modules/chat/chat.service.ts:12-36](file://backend/src/modules/chat/chat.service.ts#L12-L36)
- [backend/src/modules/chat/chat.module.ts:1-11](file://backend/src/modules/chat/chat.module.ts#L1-L11)

### Storage and Item Lifecycle
Storage management links found items to physical storage locations and tracks claims. It also updates the associated found post to reflect storage status.

```mermaid
flowchart TD
Start(["Create Storage Item"]) --> Validate["Validate item code uniqueness"]
Validate --> InsertItem["Insert storage item record"]
InsertItem --> UpdateFound["Update found post is_in_storage=true"]
UpdateFound --> Return["Return created item"]
Return --> End(["Done"])
```

**Diagram sources**
- [backend/src/modules/storage/storage.service.ts:53-78](file://backend/src/modules/storage/storage.service.ts#L53-L78)

**Section sources**
- [backend/src/modules/storage/storage.service.ts:21-36](file://backend/src/modules/storage/storage.service.ts#L21-L36)
- [backend/src/modules/storage/storage.module.ts:1-11](file://backend/src/modules/storage/storage.module.ts#L1-L11)

### Handover and Points Automation
The handover service coordinates offline verification and automates point granting and post closure upon completion.

```mermaid
sequenceDiagram
participant Owner as "Owner"
participant Finder as "Finder"
participant API as "Handovers Service"
participant DB as "PostgreSQL"
Owner->>API : "Create handover"
API->>DB : "Insert handover (pending)"
DB-->>API : "Handover record"
Owner->>API : "Confirm with verification code"
API->>DB : "Update status to owner_confirmed"
DB-->>API : "Updated record"
Finder->>API : "Confirm with verification code"
API->>DB : "Update status to completed"
DB-->>API : "Updated record"
API->>DB : "RPC grant_training_points"
DB-->>API : "Points granted"
API->>DB : "Close related posts"
DB-->>API : "Posts closed"
```

**Diagram sources**
- [backend/src/modules/handovers/handovers.service.ts:12-32](file://backend/src/modules/handovers/handovers.service.ts#L12-L32)
- [backend/src/modules/handovers/handovers.service.ts:50-84](file://backend/src/modules/handovers/handovers.service.ts#L50-L84)
- [backend/src/modules/handovers/handovers.service.ts:86-115](file://backend/src/modules/handovers/handovers.service.ts#L86-L115)
- [backend/src/modules/handovers/handovers.service.ts:117-131](file://backend/src/modules/handovers/handovers.service.ts#L117-L131)

**Section sources**
- [backend/src/modules/handovers/handovers.service.ts:133-147](file://backend/src/modules/handovers/handovers.service.ts#L133-L147)
- [backend/src/modules/handovers/handovers.module.ts:1-11](file://backend/src/modules/handovers/handovers.module.ts#L1-L11)

### Lost Posts Lifecycle
Lost posts are created with a status and tracked through approval, matching, and closure after a successful handover.

```mermaid
flowchart TD
Submit(["Submit Lost Post"]) --> Policy{"Approved immediately?"}
Policy --> |Yes| Approved["Set status=approved"]
Policy --> |No| Pending["Set status=pending"]
Approved --> Match["AI Matching runs"]
Pending --> Review["Admin review"]
Review --> Approved
Match --> Chat["Initiate chat"]
Chat --> Storage["Optionally store item"]
Storage --> Handover["Coordinate handover"]
Handover --> Close["Close posts and award points"]
```

**Diagram sources**
- [backend/src/modules/lost-posts/lost-posts.service.ts:19-43](file://backend/src/modules/lost-posts/lost-posts.service.ts#L19-L43)
- [backend/src/modules/lost-posts/lost-posts.service.ts:139-171](file://backend/src/modules/lost-posts/lost-posts.service.ts#L139-L171)

**Section sources**
- [backend/src/modules/lost-posts/lost-posts.service.ts:45-73](file://backend/src/modules/lost-posts/lost-posts.service.ts#L45-L73)
- [backend/src/modules/lost-posts/lost-posts.module.ts:1-11](file://backend/src/modules/lost-posts/lost-posts.module.ts#L1-L11)

## Dependency Analysis
The backend module graph demonstrates how features depend on shared infrastructure and each other.

```mermaid
graph LR
AppModule["AppModule"]
Auth["AuthModule"]
Users["UsersModule"]
Categories["CategoriesModule"]
Lost["LostPostsModule"]
Found["FoundPostsModule"]
Ai["AiMatchesModule"]
Storage["StorageModule"]
Chat["ChatModule"]
Handovers["HandoversModule"]
Notif["NotificationsModule"]
Upload["UploadModule"]
Triggers["TriggersModule"]
AppModule --> Auth
AppModule --> Users
AppModule --> Categories
AppModule --> Lost
AppModule --> Found
AppModule --> Ai
AppModule --> Storage
AppModule --> Chat
AppModule --> Handovers
AppModule --> Notif
AppModule --> Upload
AppModule --> Triggers
```

**Diagram sources**
- [backend/src/app.module.ts:28-44](file://backend/src/app.module.ts#L28-L44)

**Section sources**
- [backend/src/app.module.ts:1-67](file://backend/src/app.module.ts#L1-L67)

## Performance Considerations
- Database indexing and full-text search
  - Indexes on status, timestamps, and full-text vectors improve query performance for feeds and searches.
- Efficient pagination
  - Services implement range-based pagination to limit payload sizes.
- Asynchronous operations
  - View count increments and status history logging are fire-and-forget to avoid blocking responses.
- RLS and row-level policies
  - Policies ensure minimal data exposure and efficient filtering per user context.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Authentication failures
  - Ensure proper JWT bearer tokens and role guards are applied to protected routes.
- Permission errors
  - Verify user ownership or admin privileges when modifying posts or performing admin actions.
- Validation errors
  - Check DTO constraints and required fields for posts, chats, storage, and handovers.
- Notification delivery
  - Confirm notification types and references are correctly populated for events.

**Section sources**
- [backend/src/modules/lost-posts/lost-posts.service.ts:105-125](file://backend/src/modules/lost-posts/lost-posts.service.ts#L105-L125)
- [backend/src/modules/chat/chat.service.ts:102-126](file://backend/src/modules/chat/chat.service.ts#L102-L126)
- [backend/src/modules/storage/storage.service.ts:53-78](file://backend/src/modules/storage/storage.service.ts#L53-L78)
- [backend/src/modules/handovers/handovers.service.ts:12-32](file://backend/src/modules/handovers/handovers.service.ts#L12-L32)

## Conclusion
MissLost enhances campus life at UEH by providing a robust, transparent, and community-focused platform for reporting and recovering lost items. Its modular backend, real-time communication, intelligent matching, and automated points system collectively promote trust, efficiency, and engagement. By integrating seamlessly with university workflows—such as storage and administrative oversight—the platform strengthens the broader ecosystem of campus support services.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices
- System-wide status lifecycle
  - Posts progress through pending, approved, matched, closed with audit trails and notifications.
- Training points mechanics
  - Points are awarded automatically upon successful handover completion and recorded for transparency.

**Section sources**
- [OVERVIEW.md:183-189](file://OVERVIEW.md#L183-L189)
- [OVERVIEW.md:526-555](file://OVERVIEW.md#L526-L555)