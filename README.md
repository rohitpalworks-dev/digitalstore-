# RohitX Store

## Run the local website and account system

1. Install Node.js 22.13 or newer if it is not already installed.
2. Double-click `start.bat`, or open a terminal in this folder and run:

   ```text
   node server.js
   ```

3. Keep the terminal window open and visit <http://127.0.0.1:3000>.
4. Use **Sign in** to create an account or sign in. Press `Ctrl+C` in the terminal to stop the server.

The account service uses Node.js's built-in SQLite database and does not need npm packages. Account data is created in `data/rohitx-store.sqlite`; passwords are stored as salted scrypt hashes. Sessions use a seven-day, HttpOnly, SameSite cookie. Back up the `data` folder if you need to keep local accounts.

This is a local learning setup, not a production-ready public store. The server listens only on `127.0.0.1`; accounts stay on this computer. There is no email verification, password reset, or public hosting configuration. Do not expose this server to the internet or use it for real customer accounts. The product cart, checkout, and newsletter remain demo features.
