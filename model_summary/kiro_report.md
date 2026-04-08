# Kiro Code Review Report

**Files Reviewed:** `tests/bad.js`, `tests/good.js`  
**Date:** April 8, 2026  
**Model:** Kiro (Auto)

---

## tests/bad.js — Errors & Issues Found

**1. Plain-text password storage**
`registerUser` pushes the raw password directly into the array with no hashing. A serious security vulnerability.

**2. SQL injection vulnerability**
`getUserFromDB` builds a query via string concatenation using unsanitized user input. Classic injection attack vector.

**3. Off-by-one error in loop**
```js
for (var i = 0; i <= users.length; i++)
```
Should be `<` not `<=`. When `i === users.length`, `users[i]` is `undefined`, causing a runtime crash on `.username`.

**4. Loose equality comparison**
```js
users[i].username == username && users[i].password == password
```
Uses `==` instead of `===`, which allows type coercion and unexpected matches.

**5. Sensitive data leak in logs**
`loginUser` logs the full user object including the password via `JSON.stringify(users[i])`.

**6. Missing return value**
`loginUser` has no `return false` at the end. If no match is found, it implicitly returns `undefined`, which is falsy but not explicit.

**7. Infinite loop in `resetAllUsers`**
```js
while (confirm = true)
```
This is an assignment (`=`), not a comparison (`===`). `confirm` is always set to `true`, so the loop never exits.

**8. `var` usage**
Uses `var` in multiple places instead of `let`/`const`, leading to function-scoped variables and potential hoisting bugs.

---

## tests/good.js — Issues Found

No logical, security, or runtime errors detected. The code correctly:
- Validates inputs before processing
- Checks for duplicate users
- Simulates password hashing
- Uses `===` for comparisons
- Returns structured responses
- Uses `const` and `Map` appropriately

Minor note: the "hashing" via `Buffer.from().toString("base64")` is encoding, not real hashing — acknowledged in the comment as a simulation placeholder.

---

## Summary

| File | Issues Found |
|------|-------------|
| bad.js | 8 (security, logic, runtime) |
| good.js | 0 |
