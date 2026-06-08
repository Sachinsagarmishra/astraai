# ASTRAI — FINAL_SYSTEM_ARCHITECTURE.MD

# PROJECT NAME

ASTRAI

Tagline:
“Your AI Spiritual Companion”

---

# MAIN DOMAIN STRUCTURE

Entire platform will run on:

https://ASTRAI.sachindesign.com

No multiple subdomains required.

Everything will exist inside one architecture.

---

# APPLICATION STRUCTURE

# MAIN WEBSITE

https://ASTRAI.sachindesign.com

Purpose:

* landing page
* product pages
* onboarding entry
* app download links
* marketing pages

---

# API ENDPOINTS

https://ASTRAI.sachindesign.com/api

Examples:

* /api/auth/login
* /api/chat
* /api/kundli
* /api/panchang
* /api/daily-guidance
* /api/palm-reading
* /api/aura

---

# SUPER ADMIN PANEL

https://ASTRAI.sachindesign.com/admin

Purpose:

* user management
* subscriptions
* analytics
* reports
* AI monitoring
* moderation
* memory monitoring
* payment management

---

# CORE TECH STACK

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Mobile App     | Expo React Native             |
| Frontend/Admin | NextJS                        |
| Backend API    | NestJS                        |
| Database       | MySQL                         |
| Hosting        | Hostinger VPS                 |
| AI Brain       | OpenAI / Claude / Gemini APIs |
| Vector Memory  | Pinecone                      |
| Embeddings     | OpenAI Embeddings             |
| Storage        | Cloudflare R2                 |
| Authentication | Firebase Auth                 |
| Notifications  | Firebase                      |
| Queue System   | BullMQ + Redis                |
| ORM            | Prisma                        |
| CDN & SSL      | Cloudflare                    |

---

# WHY NEXTJS?

NextJS will be used for:

* admin dashboard
* website frontend
* analytics UI
* reports UI
* SEO pages

Benefits:

* React ecosystem
* TypeScript support
* AI-friendly architecture
* excellent Codex/Cursor support
* scalable UI architecture

---

# WHY NESTJS?

NestJS will be used for:

* APIs
* authentication
* AI orchestration
* chat systems
* memory systems
* cron jobs
* queues
* backend logic

Benefits:

* TypeScript ecosystem
* scalable architecture
* modular backend
* excellent AI coding compatibility
* enterprise-grade structure

---

# WHY EXPO REACT NATIVE?

Expo React Native will be used for:

* Android app
* iOS app
* rapid testing
* cloud builds

Benefits:

* single codebase
* fast iteration
* Expo Go testing
* EAS cloud builds
* no Android Studio required locally

---

# EXPO DEVELOPMENT FLOW

# LOCAL DEVICE

Only required locally:

* VSCode
* NodeJS
* Expo Go app
* Git

No local backend setup required.

No local MySQL required.

No local Laravel/XAMPP/Docker required.

---

# TESTING FLOW

Run:

```bash
npx expo start
```

Then test using:
Expo Go app on physical mobile devices.

---

# APK / IPA BUILD FLOW

Use:
Expo EAS Build (Cloud)

This allows:

* Android APK generation
* iOS builds
* OTA updates
* cloud-native deployment

No local Android Studio required.

---

# HOSTING ARCHITECTURE

# HOSTINGER VPS

Everything backend-related runs on VPS.

Includes:

* NestJS backend
* NextJS frontend
* MySQL database
* Redis queues
* AI orchestration
* APIs
* cron jobs

---

# VPS SOFTWARE STACK

Install on VPS:

* Ubuntu 24
* NodeJS
* PM2
* Nginx
* MySQL
* Redis
* Git

---

# DATABASE ARCHITECTURE

# MYSQL

Used for structured data.

Stores:

* users
* subscriptions
* kundli data
* profiles
* settings
* streaks
* transactions
* raw chat logs

---

# VECTOR MEMORY SYSTEM

# PINECONE

Used for:

* emotional memory
* long-term AI memory
* semantic search
* emotional pattern retrieval
* contextual AI responses

---

# AI MEMORY SYSTEM

# SHORT TERM MEMORY

Storage:
MySQL / Redis

Stores:

* recent chats
* immediate context

---

# LONG TERM MEMORY

Storage:
Pinecone

Stores:

* emotional summaries
* recurring fears
* relationship patterns
* life events
* spiritual goals
* behavioral insights

---

# EMBEDDINGS SYSTEM

Use:
OpenAI Embeddings API

Model:
text-embedding-3-small

Purpose:
Convert conversations into vector memory.

---

# AI BRAIN SYSTEM

Supported AI Providers:

* OpenAI
* Claude
* Gemini

Architecture should support:
multi-provider AI switching.

---

# IMPORTANT SECURITY RULE

NEVER expose AI API keys inside frontend/mobile app.

All AI APIs must remain:

SERVER SIDE ONLY.

---

# AI REQUEST FLOW

User App
↓
NestJS Backend
↓
AI Provider APIs
↓
Response
↓
Memory Storage
↓
Future Retrieval

---

# API SECURITY ARCHITECTURE

# ALL AI API KEYS

Stored:

* server-side only
* inside VPS environment variables
* never exposed publicly

---

# SECURITY MEASURES

* JWT authentication
* Firebase auth validation
* encrypted user data
* API rate limiting
* Cloudflare protection
* secure environment variables
* request throttling

---

# STORAGE SYSTEM

# CLOUDFLARE R2

Used for:

* profile photos
* palm scans
* aura images
* generated reports
* spiritual cards
* uploads

---

# WHY CLOUDFLARE R2?

Benefits:

* cheap cloud storage
* scalable
* CDN integrated
* reduces VPS load
* global fast delivery
* low bandwidth cost

IMPORTANT:
Do NOT store heavy media directly on VPS.

---

# REDIS + BULLMQ

Used for:

* AI queues
* notification queues
* background processing
* memory summarization
* scheduled jobs

---

# CRON JOB SYSTEMS

Daily automated tasks:

* emotional summarization
* memory optimization
* daily horoscope generation
* spiritual reminders
* notification scheduling

---

# APP CORE FEATURES

# AI GUIDE

* emotional AI companion
* astrology-enhanced responses
* memory-aware chat
* voice support

---

# DAILY GUIDANCE

* personalized horoscope
* emotional guidance
* spiritual suggestions
* ritual recommendations

---

# ASTRO LAB

* AI palm reading
* aura scanner
* face energy analysis
* compatibility system

---

# JAAP SYSTEM

* digital mala
* streaks
* rituals
* affirmations
* meditation tracking

---

# LIFE MAP

* emotional timeline
* relationship cycles
* career cycles
* spiritual growth tracking

---

# MEMORY-FIRST AI EXPERIENCE

Astrai must feel like:
“An emotionally intelligent AI companion that remembers the user deeply over time.”

NOT:
a generic chatbot.

---

# DEVELOPMENT APPROACH

Entire development will be AI-assisted using:

* Cursor
* Codex
* AI coding workflows

Architecture should remain:

* modular
* typed
* scalable
* AI-friendly

---

# FINAL PRODUCT GOAL

ASTRAI should become:

* AI spiritual companion
* emotional intelligence platform
* daily guidance system
* relationship intelligence app
* spiritual habit platform

NOT merely an astrology app.