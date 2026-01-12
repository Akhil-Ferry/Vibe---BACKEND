@echo off
cd /d %~dp0\..
echo ========================================
echo Testing Vibe Check Polling API
echo ========================================
echo.

echo 1. Creating a poll...
echo.
curl -X POST http://localhost:3000/polls -H "Content-Type: application/json" -d "{\"question\":\"What is your favorite tech?\",\"options\":[\"Go\",\"Node.js\",\"Python\",\"Rust\"]}"
echo.
echo.

timeout /t 1 /nobreak >nul

echo 2. Getting poll details (Poll ID: 1)...
echo.
curl http://localhost:3000/polls/1
echo.
echo.

timeout /t 1 /nobreak >nul

echo 3. Casting vote - Alice votes for Node.js (option_id: 2)...
echo.
curl -X POST http://localhost:3000/polls/1/vote -H "Content-Type: application/json" -d "{\"option_id\":2,\"user_id\":\"alice\"}"
echo.
echo.

timeout /t 1 /nobreak >nul

echo 4. Casting vote - Bob votes for Node.js (option_id: 2)...
echo.
curl -X POST http://localhost:3000/polls/1/vote -H "Content-Type: application/json" -d "{\"option_id\":2,\"user_id\":\"bob\"}"
echo.
echo.

timeout /t 1 /nobreak >nul

echo 5. Casting vote - Charlie votes for Go (option_id: 1)...
echo.
curl -X POST http://localhost:3000/polls/1/vote -H "Content-Type: application/json" -d "{\"option_id\":1,\"user_id\":\"charlie\"}"
echo.
echo.

timeout /t 1 /nobreak >nul

echo 6. Testing duplicate vote - Alice tries to vote again (should fail)...
echo.
curl -X POST http://localhost:3000/polls/1/vote -H "Content-Type: application/json" -d "{\"option_id\":1,\"user_id\":\"alice\"}"
echo.
echo.

timeout /t 1 /nobreak >nul

echo 7. Getting final poll results...
echo.
curl http://localhost:3000/polls/1
echo.
echo.

echo ========================================
echo Tests completed!
echo ========================================
