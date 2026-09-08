# Debugging Session: Network Error

## Symptoms
- Frontend shows multiple "Network error. Please check your connection." toasts.
- Backend logs show `SQLSTATE[HY000] [2002] Connection refused`.

## Hypotheses
1. **Hypothesis 1 (Confirmed)**: The Laravel backend server was not running. (Resolved by starting `php artisan serve`).
2. **Hypothesis 2 (Confirmed)**: The MySQL database server is not running. (Confirmed via `netstat` and `artisan migrate:status`).
3. **Hypothesis 3**: The frontend is attempting to connect to the wrong API URL. (Checked `.env`, seems correct).
4. **Hypothesis 4**: CORS issues are preventing the frontend from reaching the backend. (Checked `cors.php`, seems correct).

## Evidence Collected
- `netstat -ano | findstr :3306` returned no results.
- `php artisan migrate:status` failed with connection refused.
- `netstat -ano | findstr :8000` shows server is listening.

## Current Status
Waiting for user to start MySQL or authorize switch to SQLite.
