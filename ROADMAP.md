# NurseBot Next-Phase Roadmap (log2.md)

## Executive Summary
This document captures a focused, prioritized plan to take NurseBot from a solid UI prototype to a reliable, user-ready app. It emphasizes data persistence, correctness, authentication, and core medication flows (including marking doses as taken/missed), while keeping future backend and chat features decoupled.

---

## What Is MVP?
**MVP (Minimum Viable Product)** is the smallest set of features that delivers real value to users while being reliable and safe to use. For NurseBot, MVP means:
- Users can add medications, see them listed, and not lose data on app restart.
- Users can mark doses as **Taken** or **Missed** and view recent history.
- Users receive basic local reminders (notifications) for daily schedules.
- Users log in (Google/Apple) and are gated from the app if not authenticated.
- App is stable, with basic validation and error handling.

---

## Prioritized Plan (Highest → Lowest)

### P0 — Baseline Stability & Type Hygiene (In Progress)
- ✓ Implement proper UUID generation for medication IDs (Completed)
  - Using `uuidv4()` for all new medications
  - Added UUID validation utility
- ✓ Normalize date handling with serializer/deserializer (Completed)
  - Proper Date serialization to ISO strings
  - Robust deserialization with type safety
- Improve type system
  - Add proper discriminated unions for schedules
  - Remove any duplicate type definitions
  - Add stronger type guards
- Add ESLint and Prettier configuration
  - Configure code style rules
  - Add TypeScript-specific rules
- Add proper error boundaries and loading states
  - Implement error boundaries for critical components
  - Add loading states for async operations
- Confirm dependency alignment across frameworks

Acceptance Criteria:
- TypeScript compiles cleanly with no errors
- All medications have valid UUIDs
- No crashes when handling dates
- Code formatting is consistent
- Error handling is comprehensive

---

### P1 — Local Persistence for Medications (Partially Complete)
- ✓ Implement AsyncStorage service (Completed)
  - Proper storage service implementation
  - Type-safe serialization/deserialization
  - Error handling and logging
- ✓ Add state hydration on app start (Completed)
  - Load medications on MedicationContext mount
  - Auto-save on state changes
- Improve error handling and feedback
  - Add retry logic for storage operations
  - Implement proper error messages UI
  - Add loading indicators
- Add offline support
  - Cache frequently accessed data
  - Implement optimistic updates
  - Add conflict resolution
- Add data migration utilities
  - Version storage schema
  - Add migration functions
  - Handle storage upgrades

Acceptance Criteria:
- Medications persist reliably across app restarts
- Storage errors are handled gracefully with user feedback
- Performance remains good with large datasets
- Data migrations work smoothly

---

### P2 — Authentication & Navigation Gating (Google/Apple)
- Implement an `AuthContext` and gate the app: show `LoginPage` until authenticated.
- Add Google/Apple sign-in (Expo AuthSession or Firebase per feasibility), store session securely.
- Ensure the app no longer auto-skips to the main tabs when unauthenticated.

Acceptance Criteria:
- Unauthenticated users see the login screen.
- Successful Google/Apple login routes to tabs; logout returns to login.
- Auth state persists across app restarts.

---

### P3 — Form Validation & Data Integrity (RHF + Yup)
- Add `react-hook-form` + `yup` for robust validation.
- Per-step validation in the medication form.
- Sanitize inputs (trim strings, validate numeric dosage fields, ensure logical date ranges).

Acceptance Criteria:
- Users cannot submit incomplete/invalid medication data.
- Inline, consistent error messages appear per field.

---

### P4 — Medication Dose Tracking & History (UI + State)
- Add UI to mark doses **Taken** or **Missed** directly in the meds screen.
- Persist a simple recent history (e.g., last 30 days) per medication.
- Visual indicators on each medication card (today’s status, streaks optional).

Acceptance Criteria:
- Users can mark a dose Taken/Missed and see it reflected immediately.
- A basic history view exists (inline on card or a detail modal).

---

### P5 — Local Notifications & Reminder Engine (Daily First)
- Request notification permissions at startup.
- Schedule local notifications for daily medications.
- Cancel notifications on delete.
- Reconcile on app start (after hydration) to ensure schedules match current meds.

Acceptance Criteria:
- Notifications trigger at expected times for daily schedules.
- Deleting a medication cancels related notifications.
- Permission denied path is handled with user guidance.

---

### P6 — UX & Accessibility Improvements
- Replace ScrollView with FlatList for scalable lists.
- Add accessibility labels/hints for all interactive elements.
- Add basic haptics for confirmations and critical actions.
- Prepare dark mode with color tokens.

Acceptance Criteria:
- Screen reader accurately announces primary actions.
- List remains performant with 100+ items.

---

### P7 — Testing Infrastructure (Logic-First)
- Add Jest + React Native Testing Library.
- Prioritize tests for scheduling and storage logic; then critical UI flows.

Acceptance Criteria:
- >80% coverage in `utils/` and `services/`.
- Medication add/list/persist flows covered by integration tests.

---

### P8 — Performance & Polish
- Memoize heavy components (e.g., MedicationItem) and stabilize callbacks.
- Bundle analysis and dead dependency removal.

Acceptance Criteria:
- Smooth scrolling and interactions on mid/low devices.
- Reduced re-renders on list updates.

---

### P9 — Backend & Chat Foundations (Future)
- Stand up backend for chat, persistence sync, and provider integrations.
- Implement real-time messaging and history.

Acceptance Criteria:
- Backend is authenticated, reliable, and documented.
- Chat supports basic real-time conversations with disclaimers.

---

## Assumptions
- MVP remains **frontend-first** with local persistence; backend comes later.
- Time calculations operate in the **device’s local timezone**.
- Initial scope prioritizes **daily schedules** for notifications; weekly/monthly/custom can follow.
- Authentication uses **Google/Apple** first; email/password optional later.

---

## Open Questions (Minimized; defaults chosen)
- Do we want a detailed **medication detail screen** now or show history inline via modal? (Default: inline modal for MVP.)
- For authentication, prefer **Expo AuthSession** (lighter) or **Firebase Auth** (scalable)? (Default: Expo AuthSession for MVP.)
- Should we track **streaks/adherence rate** in MVP? (Default: not in MVP; add later.)

---

## Success Metrics
- Persistence: 100% retention of medications across restarts.
- Validation: 0 invalid submissions accepted.
- Notifications: >95% on-time firing for daily schedules.
- Stability: <1% crash rate; zero crashes in core flows.
- Accessibility: All core actions have labels and are screen reader friendly.

---

## Milestones (Indicative)
- Week 1–2: P0, P1
- Week 3–4: P2
- Week 5–6: P3, begin P4
- Week 7–8: Complete P4, P5
- Week 9–10: P6, P7
- Week 11–12: P8; plan P9

---

## Implementation Notes & Code Sketches

### Date Serialization Utilities
```ts
// utils/serialization.ts
import type { Medication } from "../types/medication";

type ISODate = string;

type SerializableMedication = Omit<Medication, "startDate" | "duration"> & {
  startDate: ISODate;
  duration?: Medication["duration"] extends infer D
    ? D extends { endDate?: Date }
      ? Omit<D, "endDate"> & { endDate?: ISODate }
      : D
    : never;
};

export const serializeMedication = (m: Medication): SerializableMedication => ({
  ...m,
  startDate: m.startDate.toISOString(),
  duration: m.duration && "endDate" in m.duration && m.duration.endDate
    ? { ...m.duration, endDate: m.duration.endDate.toISOString() }
    : m.duration,
});

export const deserializeMedication = (raw: SerializableMedication): Medication => ({
  ...raw,
  startDate: new Date(raw.startDate),
  duration: raw.duration && "endDate" in raw.duration && raw.duration?.endDate
    ? { ...raw.duration, endDate: new Date(raw.duration.endDate!) }
    : raw.duration,
});
```

### Storage Interface
```ts
// services/medicationStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Medication } from "../types/medication";
import { serializeMedication, deserializeMedication } from "../utils/serialization";

const KEY = "@nursebot:medications";

export const medicationStorage = {
  async saveMedications(medications: Medication[]) {
    const payload = medications.map(serializeMedication);
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
  },
  async loadMedications(): Promise<Medication[]> {
    const data = await AsyncStorage.getItem(KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map(deserializeMedication);
  },
  async clearMedications() {
    await AsyncStorage.removeItem(KEY);
  },
};
```

### Auth Gating (High-Level)
```tsx
// app/_layout.tsx (conceptual)
export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) return <SplashScreen />;
  return isAuthenticated ? <TabsLayout /> : <LoginPage />;
}
```

### Dose Tracking Shape
```ts
// types/history.ts (conceptual)
export interface DoseEvent {
  id: string;            // uuid
  medicationId: string;
  timestamp: Date;       // when the user marked the dose
  scheduled?: Date;      // optional: when the dose was scheduled
  status: "taken" | "missed";
}
```

### UI Sketch: Marking Doses
```tsx
// In MedicationItem or a Detail Modal
<Button title="Missed" variant="outline" onPress={() => onMissed(med.id)} />
<Button title="Taken" variant="primary" onPress={() => onTaken(med.id)} />
// Underneath: show the last event (e.g., "Taken 8:05 AM today")
```

---

## Notes Based on Your Preferences
- You prefer efficiency and user-first decisions: this plan prioritizes persistence, auth gating, and actionable medication flows.
- You want Google/Apple auth: included early (P2) with app gating so it doesn’t auto-jump into tabs.
- You want dose marking but don’t have UI yet: covered in P4 with a simple, incremental UI approach (inline actions + basic history modal).
- You trust judgment and will adjust while learning: each phase includes acceptance criteria and sketches to keep the work concrete and adaptable.

---

This roadmap keeps momentum high while building a reliable core experience. It’s structured to allow you to ship meaningful value quickly (P1) and layer in security and UX improvements steadily (P2–P7), with room for backend expansion later (P9).
