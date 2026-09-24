# Mission: Build a Real Backend for the Habit Tracker

You are working on an existing **React + Vite** habit tracker project.

Your goal is to complete the backend/authentication mission so that:

* Users can create accounts and sign in.
* Each user can only see and modify their own habits.
* Habits persist after refreshing the page.
* Users can add, edit, toggle, and delete habits.
* Deleting a habit also deletes its related daily logs.
* Unauthenticated users cannot access the habit tracker.
* Supabase Row Level Security (RLS) protects the database.

---

# Tech Stack Requirements

The project MUST use:

* React
* Vite
* **TypeScript**
* Supabase
* **shadcn/ui** for UI components
* Tailwind CSS if it is already part of the project or required by shadcn/ui
* React Router if routing is already used or needed for the protected routes

For UI components, use **shadcn/ui**:

https://ui.shadcn.com/

Follow the official shadcn/ui approach for the existing Vite project rather than creating a separate custom component library.

Use shadcn/ui components whenever an appropriate component exists, such as:

* Button
* Input
* Label
* Card
* Dialog
* Alert
* Badge
* Checkbox
* Dropdown Menu
* Skeleton
* Spinner
* Toast / Sonner
* Form-related components

Do not install another UI component library unless absolutely necessary.

---

# Important Development Rules

## 1. Inspect the existing project first

Before making changes:

* Inspect the existing folder structure.
* Check `package.json`.
* Check whether Tailwind is already configured.
* Check whether React Router is already installed.
* Check whether shadcn/ui is already configured.
* Check whether the project already uses TypeScript.

Reuse the existing architecture where possible.

Do NOT rewrite the entire project unnecessarily.

---

## 2. TypeScript is mandatory

Use TypeScript for all new React/application files.

Prefer:

```text
.ts
.tsx
```

instead of:

```text
.js
.jsx
```

For example:

```text
src/lib/supabase.ts
```

instead of:

```text
src/lib/supabase.js
```

Create proper types for:

* User
* Habit
* DailyLog
* Auth state
* Form data
* Loading states
* Error states
* Supabase responses where useful

Avoid using:

```ts
any
```

unless there is a specific technical reason.

Use TypeScript to catch incorrect data access and component props.

---

# 3. shadcn/ui

If shadcn/ui is not configured yet, configure it using the official installation approach for the existing Vite project.

Use:

```bash
npx shadcn@latest init
```

Then add only the components actually needed.

For example:

```bash
npx shadcn@latest add button input label card dialog alert badge checkbox skeleton spinner
```

Use the generated components from:

```text
src/components/ui/
```

For example:

```tsx
import { Button } from "@/components/ui/button"
```

Do not manually recreate shadcn components if the official component already exists.

Reference:

https://ui.shadcn.com/

---

# 4. Supabase Configuration

Create a Supabase project.

Add the following to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Make sure `.env` is included in `.gitignore`.

Never expose the Supabase service-role key in the frontend.

Create:

```text
src/lib/supabase.ts
```

Example:

```ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
```

If TypeScript complains about the Vite environment variables, create the appropriate Vite environment type declaration rather than using `any`.

Install:

```bash
npm install @supabase/supabase-js
```

if it is not already installed.

---

# 5. Database Schema

Use the Supabase SQL Editor.

Create two tables:

```text
habits
daily_logs
```

## habits

The table should contain at minimum:

```text
id
user_id
name
created_at
```

`user_id` must reference:

```text
auth.users(id)
```

---

## daily_logs

The table should contain at minimum:

```text
id
habit_id
log_date
completed
created_at
```

The relationship must be:

```text
auth.users
    │
    └── habits
          │
          └── daily_logs
```

The foreign key from `daily_logs.habit_id` to `habits.id` MUST use:

```sql
ON DELETE CASCADE
```

Therefore:

```text
Delete Habit
     ↓
Delete related Daily Logs automatically
```

Add appropriate indexes where useful.

---

# 6. TypeScript Database Types

Create a type definition file, for example:

```text
src/types/database.ts
```

Define types for:

```ts
export interface Habit {
  id: string
  user_id: string
  name: string
  created_at: string
}
```

and:

```ts
export interface DailyLog {
  id: string
  habit_id: string
  log_date: string
  completed: boolean
  created_at: string
}
```

Adapt these types to the actual database schema.

If useful, create separate types for:

```text
HabitInsert
HabitUpdate
DailyLogInsert
DailyLogUpdate
```

Do not duplicate types unnecessarily.

---

# 7. Authentication

Implement:

* Sign up
* Sign in
* Sign out
* Session persistence

Create pages/components for:

```text
/login
/signup
```

Use shadcn/ui components for the forms.

For example:

```text
Card
 ├── CardHeader
 ├── CardTitle
 ├── CardDescription
 └── CardContent
      ├── Label
      ├── Input
      └── Button
```

The forms should have:

* Email input
* Password input
* Submit button
* Loading state
* Error message
* Link between login and signup

Use proper TypeScript types for form values.

---

# 8. Authentication Session

Use:

```ts
supabase.auth.onAuthStateChange(...)
```

The application should:

1. Get the current session when the application starts.
2. Listen for authentication changes.
3. Update the authentication state.
4. Clean up the listener when appropriate.

Create a reusable authentication context/provider if that fits the existing architecture.

For example:

```text
src/
├── components/
├── contexts/
│   └── AuthContext.tsx
├── hooks/
├── lib/
│   └── supabase.ts
├── pages/
├── types/
└── ...
```

Do not fetch the authentication session independently in every component.

---

# 9. ProtectedRoute

Create:

```text
ProtectedRoute.tsx
```

The habit tracker must only be accessible to authenticated users.

Expected behavior:

```text
Not authenticated
        ↓
     /login
```

```text
Authenticated
        ↓
   Habit Tracker
```

While checking the initial authentication state, show an appropriate loading UI.

Use shadcn/ui `Skeleton` or `Spinner` where appropriate.

Do NOT briefly render private tracker content before authentication is known.

---

# 10. Habit CRUD

Implement complete CRUD using Supabase.

## List habits

Fetch habits belonging to the currently authenticated user.

Display the habits using shadcn/ui components.

Possible structure:

```text
Card
 ├── Habit name
 ├── Completion status
 ├── Edit button
 └── Delete button
```

Use:

```text
Button
Card
Badge
Checkbox
Skeleton
Alert
```

where appropriate.

Show:

* Loading state
* Empty state
* Error state

---

# 11. Add Habit

Create an "Add Habit" UI.

A Dialog is preferred:

```text
Add Habit
    ↓
Dialog
    ↓
Input
    ↓
Create
```

Use:

```text
Dialog
Input
Label
Button
```

The inserted habit must use the authenticated user's ID.

Do not allow the user to specify an arbitrary `user_id` from the UI.

Show:

```text
Adding...
```

while the request is running.

Disable the submit button while saving.

After successful creation, update the displayed habit list without requiring a page refresh.

---

# 12. Edit Habit

Allow users to edit an existing habit.

A shadcn/ui `Dialog` can be used.

Show:

```text
Saving...
```

while updating.

The update must only affect the authenticated user's habit.

Use proper TypeScript types for the edit form.

---

# 13. Toggle Habit

Allow users to mark a habit as completed/not completed.

Use the `daily_logs` table.

For the current date:

```text
Habit
  ↓
Daily Log
  ↓
completed = true/false
```

Avoid creating duplicate daily logs for the same habit/date.

If a log does not exist:

```text
Create log
```

If it exists:

```text
Update log
```

The UI should immediately reflect the new completion state after a successful request.

Show an appropriate loading state while toggling.

---

# 14. Delete Habit

Allow the user to delete a habit.

Use a shadcn/ui confirmation dialog before deletion:

```text
AlertDialog
```

Example flow:

```text
Delete
  ↓
Are you sure?
  ↓
Cancel / Delete
```

When the habit is deleted:

```text
Habit
   ↓
daily_logs
   ↓
CASCADE DELETE
```

Do NOT manually delete the daily logs from the frontend if the database cascade already handles this.

Show:

```text
Deleting...
```

while the request is running.

---

# 15. Row Level Security

This is a critical security requirement.

Enable RLS on:

```text
habits
daily_logs
```

---

## habits policies

Create policies for:

```text
SELECT
INSERT
UPDATE
DELETE
```

Users may only access their own habits.

The ownership condition must use:

```sql
auth.uid() = user_id
```

Conceptually:

```text
User A
 ├── Habit A1
 └── Habit A2

User B
 ├── Habit B1
 └── Habit B2
```

User A must never be able to access User B's habits.

---

# 16. daily_logs RLS

Protect `daily_logs` separately.

A user must only be able to access daily logs belonging to their own habits.

The relationship should effectively enforce:

```text
daily_logs.habit_id
        ↓
habits.id
        ↓
habits.user_id
        ↓
auth.uid()
```

Create appropriate:

```text
SELECT
INSERT
UPDATE
DELETE
```

policies.

Do not rely on React route protection for database security.

RLS must enforce the security boundary.

---

# 17. Seed Data

Seed a few test habits and daily logs.

Make sure the seeded rows have valid authenticated user IDs.

Do not create fake `user_id` values that don't exist in `auth.users`.

If necessary:

1. Create a test account.
2. Obtain its user ID.
3. Seed habits using that ID.
4. Seed daily logs using the corresponding habit IDs.

---

# 18. UI/UX Requirements

The UI should feel like a clean modern habit tracker.

Use shadcn/ui rather than building custom versions of common components.

Recommended structure:

```text
┌─────────────────────────────────────┐
│ Habit Tracker             User Menu │
├─────────────────────────────────────┤
│                                     │
│ Good morning 👋                     │
│ Track your habits today.            │
│                                     │
│              + Add Habit             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Morning Exercise        ✓          │
│  Read 20 Minutes         ○          │
│  Drink Water             ✓          │
│                                     │
└─────────────────────────────────────┘
```

Keep the design:

* Clean
* Responsive
* Mobile-friendly
* Simple
* Accessible
* Consistent with shadcn/ui

Do not over-design the application.

---

# 19. Loading and Error States

Every asynchronous operation must have proper feedback.

## Authentication

```text
Signing in...
Signing up...
```

## Loading habits

Use:

```text
Skeleton
```

or:

```text
Spinner
```

## Creating

```text
Adding...
```

## Updating

```text
Saving...
```

## Deleting

```text
Deleting...
```

## Errors

Use an appropriate shadcn/ui:

```text
Alert
```

or:

```text
Sonner
```

if configured.

Do not display raw technical errors unnecessarily.

---

# 20. Type Safety

Before considering the mission complete, run:

```bash
npm run build
```

and/or:

```bash
npx tsc --noEmit
```

Fix all TypeScript errors.

Do not solve TypeScript errors by adding:

```ts
any
```

unless genuinely necessary.

Check:

* Component props
* Supabase responses
* Authentication state
* Habit objects
* Daily log objects
* Form values
* Route components
* Event handlers

---

# 21. Testing

Perform these tests.

## Test 1 — Sign up

Create:

```text
User A
```

Sign in.

Create several habits.

Refresh the browser.

Expected:

```text
Habits are still there.
```

---

## Test 2 — User isolation

Create:

```text
User B
```

Sign in as User B.

Expected:

```text
User B cannot see User A's habits.
```

Create a habit as User B.

Sign out.

Sign in as User A.

Expected:

```text
User A sees only User A's habits.
```

---

## Test 3 — CRUD

Test:

```text
Create
 ↓
Read
 ↓
Edit
 ↓
Toggle
 ↓
Delete
```

Verify every operation.

---

## Test 4 — Cascade Delete

Create:

```text
Habit A
 ├── Daily Log 1
 ├── Daily Log 2
 └── Daily Log 3
```

Delete Habit A.

Verify:

```text
Habit A → deleted
Daily Logs → automatically deleted
```

Verify this in the database, not only through the UI.

---

## Test 5 — Protected Route

Sign out.

Directly visit the habit tracker route.

Expected:

```text
Redirect → /login
```

---

## Test 6 — RLS

Using two different authenticated accounts:

```text
User A
User B
```

Verify User A cannot:

* SELECT User B's habits
* UPDATE User B's habits
* DELETE User B's habits
* INSERT a habit belonging to User B
* SELECT User B's daily logs
* UPDATE User B's daily logs
* DELETE User B's daily logs

---

# 22. Final Project Structure

Aim for a clean structure similar to:

```text
src/
├── components/
│   ├── ui/
│   │   └── ...shadcn components
│   ├── habits/
│   │   ├── HabitCard.tsx
│   │   ├── HabitList.tsx
│   │   ├── AddHabitDialog.tsx
│   │   └── EditHabitDialog.tsx
│   └── ProtectedRoute.tsx
│
├── contexts/
│   └── AuthContext.tsx
│
├── hooks/
│   └── ...
│
├── lib/
│   ├── supabase.ts
│   └── utils.ts
│
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   └── Dashboard.tsx
│
├── types/
│   ├── database.ts
│   └── auth.ts
│
├── App.tsx
└── main.tsx
```

Adapt this structure to the existing project instead of blindly creating every file.

---

# 23. Final Verification

Before saying the mission is complete, verify:

### Backend

* [ ] Supabase project configured
* [ ] `VITE_SUPABASE_URL` configured
* [ ] `VITE_SUPABASE_ANON_KEY` configured
* [ ] `.env` gitignored
* [ ] Supabase client created
* [ ] `habits` table created
* [ ] `daily_logs` table created
* [ ] Foreign key created
* [ ] `ON DELETE CASCADE` configured
* [ ] Seed data created

### Authentication

* [ ] Sign up works
* [ ] Sign in works
* [ ] Sign out works
* [ ] `onAuthStateChange` implemented
* [ ] Session persists after refresh
* [ ] ProtectedRoute implemented
* [ ] Unauthenticated users redirected to `/login`

### CRUD

* [ ] List habits
* [ ] Add habit
* [ ] Edit habit
* [ ] Toggle habit
* [ ] Delete habit
* [ ] Loading states
* [ ] Error states

### Security

* [ ] RLS enabled on `habits`
* [ ] RLS enabled on `daily_logs`
* [ ] SELECT protected
* [ ] INSERT protected
* [ ] UPDATE protected
* [ ] DELETE protected
* [ ] Users cannot access another user's data
* [ ] No service-role key exposed

### Frontend

* [ ] TypeScript used for new code
* [ ] No unnecessary `any`
* [ ] shadcn/ui used for UI components
* [ ] Responsive UI
* [ ] Accessible forms
* [ ] Clean component structure

### Type checking

Run:

```bash
npx tsc --noEmit
```

Fix all errors.

Then run:

```bash
npm run build
```

Fix any build errors.

---

# Final Response

When everything is complete, provide a concise report with:

## Completed

List the major features implemented.

## Files Changed

List important created/modified files.

## Database

Show:

```text
auth.users
    │
    └── habits
          │
          └── daily_logs
```

Mention that:

```text
daily_logs.habit_id
        ↓
ON DELETE CASCADE
```

is configured.

## Security

Confirm:

* RLS enabled on both tables.
* CRUD policies enforce ownership.
* `.env` is gitignored.
* No service-role key is exposed.

## UI

Mention the shadcn/ui components used.

## Type Safety

Report the result of:

```bash
npx tsc --noEmit
```

and:

```bash
npm run build
```

## Testing

Report the results of:

* Authentication
* Session persistence
* Protected route
* CRUD
* User isolation
* Daily-log cascade deletion
* RLS
