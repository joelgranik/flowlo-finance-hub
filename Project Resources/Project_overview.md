# FloLo Finance Hub: Developer Project Overview

## 1. Introduction

FloLo Finance Hub is an **internal cash flow tracking** and **membership management** tool for FloLo Holistic. The goal is to provide staff (and potentially partners) with:

- A **data entry** interface to record bank balances, incoming/outgoing funds, and membership counts.
- A **dashboard** to visualize the company’s financial status (future feature).
- An **admin** section to manage categories, tags, and membership tiers.

## 2. Technology & Project Structure

- **Front End**: React (Vite), Tailwind CSS, React Router.
- **Backend**: Supabase (PostgreSQL, Auth).
- **Authentication**: Supabase Auth (email/password).  
- **Project Layout**:
  - **`App.tsx`**: Sets up React Router routes, protected routes, and the main layout.
  - **`contexts/AuthContext.tsx`**: Manages user authentication state, user roles, etc.
  - **`components`**: Shared UI elements (Navbar, Layout, ProtectedRoute, etc.).
  - **`pages/`**: Each major screen in the app (LoginPage, SignupPage, DataEntryPage, DashboardPage, NotFound, etc.).
    - **`pages/data-entry/`**: Sub-pages for Bank Balance, Inflows, Outflows, Membership updates.
    - **`pages/admin/`**: Sub-pages for Admin tasks (Categories, Tags, Users, Membership Tiers).
- **Database Schema** (Simplified):
  - **`bank_balances`**: Tracks daily/weekly end-of-day balances for Chase bank.
  - **`scheduled_items`**: Upcoming inflows or outflows.  
  - **`membership_tiers`** & **`current_membership_counts`**: For membership management.  
  - **`categories`**: For transaction categories, e.g. `'Income'` or `'Expense'`.  
  - **`tags`**: For tagging transactions (many-to-many with transactions).
  - **`auth.users`**: Users managed by Supabase (login info).

## 3. Current Features

- **Login/Signup**: Basic Supabase Auth.
- **Navbar**: Links to Dashboard, Data Entry, Admin (conditional).
- **Data Entry**:
  - Bank balances (Chase end-of-day), Inflows (type='Income'), Outflows (type='Expense'), Membership page to update member counts.
- **Admin**:
  - Manage Categories, Tags, and Membership Tiers (creation, editing, toggling active).
  - (Placeholder) Users page to show `auth.users`.
- **Role-based** “ProtectedRoute” logic (some pages require `'Staff'` or `'Partner'`).

## 4. Known Issues & Tasks

Below is the **task list** of bugs and enhancements we need to address. **Cursor** should reference this list as it proposes fixes or new code.

1. **Membership Count Not Updating Properly**  
   - When we change the `active_members` field in Membership, the UI shows a success message but reverts to the old number. Sometimes it inserts duplicate rows in `current_membership_counts`. Possibly an insert vs. update mismatch or incorrectly referencing `membership_tier_id`.
   - **Goal**: Use a single row per tier, truly update `active_members`, and refresh the UI to show the new value.

2. **Short Session / Forced Logout**  
   - Sometimes after logging in, the app bounces users back to the login screen.
   - Possibly related to role checks in `ProtectedRoute` or short session tokens. We want any logged-in user to remain logged in unless they explicitly log out.

3. **Dashboard vs. Data Entry**  
   - Right now, both “Dashboard” and “Data Entry” routes often lead to the same or similar screen. We want a **distinct** `/dashboard` page that might show summary info or is at least a placeholder for future dashboards. `/data-entry` is where forms live.

4. **Remove (or Loosen) Role Restrictions**  
   - We currently have `requiredRole="Partner"` for `/dashboard` and `requiredRole="Staff"` for `/admin`. We actually want **everyone** to see Admin for now, and we want the Dashboard to be accessible to any authenticated user.

5. **Category & Tag Integration**  
   - The forms do not display categories or tags from the admin tables. We have an `admin` UI for categories/tags, but the data entry forms still rely on static placeholders or show incomplete dropdowns. 
   - **Goal**: The forms’ “Category” dropdown should fetch from the `categories` table. The “Tags” field should do a multi-select from the `tags` table. We want them to match exactly what’s in the DB, not some fallback list.

6. **User Admin**  
   - The “Users” admin page is currently placeholder. We want it to list real data from `auth.users`. If possible, show email, created_at, etc.

7. **Auth & Nav Flow**  
   - On login, we prefer users to land on `/dashboard` by default (or whichever page we decide). Right now, they might get forcibly navigated to `/data-entry` or log out immediately. 
   - The top nav sometimes disappears if the user is recognized as not having the correct role. We want the nav to remain for all logged-in users.

## 5. Additional Notes

- We’re open to removing or simplifying role checks altogether for now. The original plan was to differentiate `'Staff'` vs. `'Partner'`, but that’s caused confusion. 
- We use **Cursor** to refine code. The goal is to fix these issues step by step, verifying each fix in the dev environment or by reviewing supabase logs and network requests.
- If we encounter repeated AI fixes that don’t work, we’ll rely on more detailed logs (console logs, supabase logs) to see what’s happening behind the scenes.

---

**End of File**  
