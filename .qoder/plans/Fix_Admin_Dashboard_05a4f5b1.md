# Fix Admin Dashboard - Data Display, Post Approval UI, and Training Points Management

## Problem Summary

1. **Data not loading**: The `ResponseInterceptor` wraps all backend responses in `{ data: ... }`, but the frontend admin pages don't unwrap this correctly -- causing statistics, posts, and user data to show as 0 or empty.
2. **Unnecessary post approval UI**: The app does not require admin post approval, but the Post Management page has approve/reject buttons and pending review handling.
3. **Missing training points management**: No admin page exists for viewing/managing training points and point transaction logs.

---

## Task 1: Fix data unwrapping in Admin Overview page

**File**: `frontend/app/admin/admin-overview/AdminOverview.tsx`

The `apiFetch()` returns the full response body. The `ResponseInterceptor` wraps non-paginated responses as `{ data: { ... } }`. The code currently does:

```ts
const [dashData, enhancedData, usersData] = await Promise.all([
    apiFetch<DashboardStats>("/admin/dashboard"),        // returns { data: { total_users: ... } }
    apiFetch<EnhancedStats>("/admin/dashboard/enhanced"), // returns { data: { posts: ..., users: ... } }
    apiFetch<{ data: UserRow[] }>("/admin/users?page=1&limit=5"), // returns { data: [...], meta: {...} }
]);
setStats(dashData);         // WRONG: dashData is { data: {...} }, not {...}
setEnhanced(enhancedData);  // WRONG: same issue
setUsers(usersData.data);   // WRONG: usersData.data is the actual array only if interceptor passes through
```

**Fix**: Unwrap the `data` property correctly:

```ts
const dashRes = dashData as any;
setStats(dashRes?.data ?? dashRes);

const enhancedRes = enhancedData as any;
setEnhanced(enhancedRes?.data ?? enhancedRes);

const usersRes = usersData as any;
setUsers(usersRes?.data ?? []);
```

Apply the same pattern (check for `.data` wrapper) for all three API responses.

---

## Task 2: Fix data unwrapping in Post Management page

**File**: `frontend/app/admin/post-management/PostManagement.tsx`

Two API calls need fixing:

1. `loadPosts()` calls `/admin/posts` -- the backend returns `{ data: [...], meta: {...} }` which the interceptor passes through (since it already has `data` + `meta`). This one should work correctly.

2. `loadStats()` calls `/admin/dashboard/enhanced` -- the interceptor wraps this as `{ data: { posts: ..., users: ... } }`. The code does `setStats(res)` but then accesses `stats?.posts` which would be undefined.

**Fix**: Unwrap `res.data` for the enhanced stats:

```ts
const loadStats = useCallback(async () => {
    const res = await apiFetch<any>("/admin/dashboard/enhanced");
    setStats(res?.data ?? res);
}, []);
```

Also remove the approve/reject/pending functionality (see Task 4).

---

## Task 3: Fix data unwrapping in User Management page

**File**: `frontend/app/admin/user-management/UserManagement.tsx`

The `loadUsers()` function calls `/admin/users` which returns `{ data: [...], meta: {...} }`. The interceptor sees both `data` and `meta` and passes it through unchanged. So this should already work.

**BUT** the stats computed on line 74-78 calculate from the current page only (20 users max), not from the total database. This gives misleading numbers.

**Fix**: Use the enhanced dashboard endpoint for accurate totals:

```ts
// Fetch real stats from /admin/dashboard/enhanced for accurate counts
const enhancedRes = await apiFetch<any>("/admin/dashboard/enhanced");
const usersStats = (enhancedRes?.data ?? enhancedRes)?.users;
// usersStats.active, usersStats.suspended, usersStats.pending_verify, usersStats.total
```

---

## Task 4: Remove post approval/rejection UI from Post Management

**File**: `frontend/app/admin/post-management/PostManagement.tsx`

Since this app does NOT require admin to approve posts, remove:

1. The "Chờ duyệt" (pending) summary card and pending count
2. The `handleApprove()` and `handleReject()` functions
3. The approve/reject action buttons in the post table rows
4. Keep only the `handleDelete()` function for admin to delete posts if needed
5. Keep the status filter dropdown but remove "pending" as a filter option if posts are auto-approved

Also update the summary cards to show more relevant stats:
- Total posts | Lost posts | Found posts | Matched/Closed posts

---

## Task 5: Create Training Points Management page

### 5a. Backend: Add training points endpoints

**File**: `backend/src/modules/users/users.controller.ts` (add new endpoints)
**File**: `backend/src/modules/users/users.service.ts` (add new service methods)

New endpoints:
- `GET /admin/training-points` -- List all users with their training points, sortable, with pagination
- `GET /admin/training-points/logs` -- List training point transaction logs from `training_point_logs` table
- `PATCH /admin/training-points/:userId` -- Manually adjust a user's training points (add/subtract with reason)

Service methods:
- `getTrainingPointsOverview(page, limit, sort)` -- Query users table sorted by training_points desc, with pagination
- `getTrainingPointLogs(page, limit, userId?)` -- Query `training_point_logs` table with optional user filter
- `adjustTrainingPoints(userId, pointsDelta, reason, adminId)` -- Update user's points and insert log entry

### 5b. Frontend: Create training points management page

**New files**:
- `frontend/app/admin/training-points/page.tsx` -- Page wrapper
- `frontend/app/admin/training-points/TrainingPointsManagement.tsx` -- Main component

Page layout:
1. **Summary cards**: Total points awarded, Number of users with points > 0, Average points per user
2. **Users leaderboard table**: User name, Email, Current points, Last updated -- with pagination and sort by points
3. **Recent point logs table**: User, Points delta (+5/-3), Reason, Date -- from `training_point_logs`
4. **Manual adjustment**: Button to open modal for admin to add/subtract points for a specific user with reason

### 5c. Add to admin sidebar navigation

**File**: `frontend/app/components/AdminSideNavBar.tsx`

Add new nav item between "Quan ly nguoi dung" and "Cai dat":
```ts
{ href: "/admin/training-points", icon: "school", label: "Diem ren luyen" }
```

---

## Task 6: Verify and test

- Restart backend server
- Test admin overview loads all statistics correctly
- Test post management shows posts without approval UI
- Test user management shows accurate stats
- Test training points page loads and displays data
- Test manual point adjustment works

---

## Files to modify:
- `frontend/app/admin/admin-overview/AdminOverview.tsx` (fix data unwrapping)
- `frontend/app/admin/post-management/PostManagement.tsx` (fix unwrapping + remove approval UI)
- `frontend/app/admin/user-management/UserManagement.tsx` (fix stats accuracy)
- `frontend/app/components/AdminSideNavBar.tsx` (add training points nav)
- `backend/src/modules/users/users.controller.ts` (add training points endpoints)
- `backend/src/modules/users/users.service.ts` (add training points service methods)

## New files to create:
- `frontend/app/admin/training-points/page.tsx`
- `frontend/app/admin/training-points/TrainingPointsManagement.tsx`
