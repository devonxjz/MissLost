from pathlib import Path

readme = r'''<div align="center">

# 🎒 MissLost

### UEH Lost & Found Platform for Students

**MissLost** is a UEH-focused Lost & Found web platform that helps students post lost items, search for belongings, chat in real time, and support verified return activities through training-point integration.

<br />

![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?style=for-the-badge&logo=nextdotjs)
![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=for-the-badge&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time_Chat-4B5563?style=for-the-badge)
![UEH](https://img.shields.io/badge/UEH-Student_Platform-red?style=for-the-badge)

</div>

---

## 📌 Overview

**MissLost** is designed as a dedicated Lost & Found system for **UEH students**.  
Instead of relying on scattered social media posts or manual announcements, the platform provides a centralized place where students can:

- Report lost items.
- Post found items.
- Search and filter item posts.
- Contact others through real-time messaging.
- Return items safely through a managed workflow.
- Connect verified return activities with the student training-point system.

The project is built with a modern full-stack architecture using **Next.js**, **NestJS**, **PostgreSQL**, and **WebSocket**.

---

## ✨ Key Features

### 🔎 Lost & Found Posts

Students can create posts for lost or found items with important details such as:

- Item name
- Description
- Category
- Location
- Time
- Images
- Contact status

This helps make item searching clearer, faster, and more organized.

---

### 💬 Real-time Chat

MissLost supports real-time messaging using **WebSocket**, allowing users to quickly communicate when they find a matching item.

Use cases:

- A student finds a lost wallet and contacts the owner.
- The owner confirms item details privately.
- Both sides agree on a safe return location.
- Admins can monitor reports or suspicious activities if needed.

---

### 🔐 UEH Gmail Login

The system supports Gmail authentication and restricts access to UEH student accounts.

```text
Allowed email domain: @ueh.edu.vn
