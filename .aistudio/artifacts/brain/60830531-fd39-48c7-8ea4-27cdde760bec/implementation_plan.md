# Mzansi Dating - Flutter Mobile App Implementation Plan

Comprehensive architectural blueprint and implementation plan for building the complete, production-grade Flutter mobile application for **Mzansi Dating** ("Find Love E Mzansi"), replicating the exact design system, colors, components, and real-time Firebase capabilities across all 6 screens.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The Flutter architecture strictly mirrors the proven design system established in the web applet:
> - **Visual Identity**: Background romantic gradient (`#E9D5FF` ➔ `#FBCFE8` ➔ `#E8C4FF`), primary luxury gold gradient (`#C5A253` to `#B78E3E`), white cards with 24px rounded corners (`BorderRadius.circular(24)`), floating gold 4-leaf clover decorations, and Playfair Display serif typography.
> - **Mandatory Safety & 18+ VIP Standards**: Consensual adult meetup requests strictly in verified public venues, zero escort solicitation, and mandatory ID verification.

- **Confirmed Decision 1: Design System Faithfulness**: All 6 screens (Login, Sign Up, Verification, Discover, Chat, VIP) use identical color hex values, card geometry, and typography.
- **Confirmed Decision 2: Cross-Platform Firebase Integration**: Configured for `cloud_firestore: ^5.6.5` with real-time snapshot listeners for the typing indicator and instant WhatsApp-style chat bubbles.

---

## 1. Overview & Core Concept

**Mzansi Dating** is South Africa's premier, classy dating and companion discovery app. Designed specifically for Android & iOS via Flutter, it combines:
- A high-trust verification ecosystem (Blue Tick for email/phone, Purple Tick for 3D selfie liveness & ID document match).
- Rich local discovery with South African provinces (*Gauteng, Western Cape, KwaZulu-Natal, Mpumalanga / Mbombela*, etc.), wider Africa, and European diaspora filters.
- Real-time WhatsApp-style chat with voice notes, photo media gating, virtual gifts (King Protea, Golden Rose, Solitaire Ring), and Firestore snapshot typing indicators.
- A VIP Creators hub for 18+ consensual experiences, cultural tours, fine dining, and private chats powered by Mzansi Gold Coins and monthly passes.

---

## 2. User Experience & Visual Design

### Design Tokens
- **Background Gradient**: `LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFFE9D5FF), Color(0xFFFBCFE8), Color(0xFFE8C4FF)])`
- **Primary Gold Gradient**: `LinearGradient(colors: [Color(0xFFC5A253), Color(0xFFB78E3E)])`
- **Card Surfaces**: Pure white `Color(0xFFFFFFFF)` with `BorderRadius.circular(24)`, `BoxShadow(color: Color(0x1A4A0E4E), blurRadius: 16, offset: Offset(0, 6))`
- **Typography**: `Playfair Display` bold for hero headlines and titles; `Plus Jakarta Sans` for clean, high-legibility inputs and body prose.

### 6 Screen Layout Specifications
1. **Screen 1 — Login**:
   - Small gold clover logo + *"Mzansi Dating"* in gold serif.
   - Large white serif headline *"Find Love E Mzansi"*, sub: *"Welcome back! Log in to continue your journey"*.
   - White card with email input [envelope icon], password input [lock/eye toggle], remember me checkbox, gold *"Forgot password?"* link, gold gradient *"Log In"* button, divider *"or continue with"*, Google & Apple OAuth buttons, and gold *"Sign Up"* link.
2. **Screen 2 — Sign Up**:
   - Full Name, Email, Phone number with country calling code picker (+27 SA, +234 NG, +254 KE, +44 UK, etc.), Password, 18+ age confirmation checkbox, SA province or African/European country selector, Gender, and *"I am looking for"*.
3. **Screen 3 — Verification**:
   - 3D Selfie liveness check with camera oval guidance (center face, turn head right, smile), ID document upload with POPIA privacy mask for sensitive numbers, and Purple Verified badge unlock.
4. **Screen 4 — Discover**:
   - Header *"Find Love E Mzansi"* top left, search icon top right, filter chips (*All, Nearby Mbombela, Verified Purple, Africa, Europe, Online Now*).
   - 2-Column responsive grid: 20px rounded photo cards, bottom black-to-transparent gradient, bold white name/age, flag location, Purple Verified pill, and gold heart like button with pull-to-refresh.
5. **Screen 5 — Chat**:
   - Header on white card (Back arrow, Thandeka avatar, name + *"Purple Verified • Online"* in green, gold call/video icons, 3-dots menu with Report/Block).
   - Chat bubbles: My messages in gold gradient right; their messages in white left with soft shadow.
   - Real-time Firestore snapshot typing indicator (*"Thandeka is typing..."*).
   - Gated photo preview with *"Unlock with VIP R149/mo"* gold button.
   - Safety banner: *"Mandatory Safety: Public venues only • 100% Consensual • Report button available"*.
   - White pill input bar: attachment, text input, gold gift button, and gold circular paper plane send button.
6. **Screen 6 — VIP (18+)**:
   - Safety & legal consent banner, R149/month VIP subscription card, 18+ verified creators grid with coin rates, consensual public meetup request modal (escrow deposit), and report/block actions.

---

## 3. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Mzansi Dating Flutter App                │
│                 (lib/main.dart - Material3)                 │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       ┌───────▼────────┐             ┌────────▼────────┐
       │ Presentation   │             │ Core & Services │
       │ (6 Screens)    │             │ (State & Audio) │
       └───────┬────────┘             └────────┬────────┘
               │                               │
               ├─ 1. LoginScreen               ├─ AuthService
               ├─ 2. SignUpScreen              ├─ FirestoreService
               ├─ 3. VerificationScreen        ├─ TypingListener
               ├─ 4. DiscoverScreen            └─ WalletManager
               ├─ 5. ChatScreen (Real-Time)
               └─ 6. VIPScreen (18+ Consensual)
               │
       ┌───────▼────────────────────────────────────────┐
       │         Firebase Cloud Services                │
       │  • FirebaseAuth (Google / Email Auth)          │
       │  • Cloud Firestore (/typing_status, /messages) │
       │  • Firebase Storage (Selfie & ID Scans)        │
       └────────────────────────────────────────────────┘
```

### Firestore Real-Time Typing Schema
- Path: `/typing_status/{conversationId}_{userId}`
- Schema:
  - `conversationId`: String
  - `userId`: String
  - `userName`: String
  - `isTyping`: Boolean
  - `lastTypedAt`: ISO Timestamp

---

## 4. Implementation Artifacts Generated

The accompanying artifacts deliver the complete Flutter source code for the application:
1. `pubspec.yaml`: Ready-to-build Flutter project dependencies.
2. `lib/main.dart`: Complete Flutter entry point with full theme, routes, state management, and all 6 production screens in Dart.
3. `lib/firebase_options.dart`: Firebase initialization parameters wired to `synthetic-diorama-ct86m`.
