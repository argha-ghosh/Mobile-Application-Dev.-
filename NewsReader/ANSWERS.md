# Output Tracing — Week 3 Quiz Answers

---

## Q1: What does the Stack history look like after this?

```js
router.push({ pathname: '/(home)/[id]', params: { id: '3' } });
```

**Answer:**

Before the push, the Stack history was:
```
[(home)/index]
```

After `router.push()`, a new screen is pushed ON TOP of the existing one:
```
[(home)/index, (home)/[id]?id=3]
```

`router.push()` always adds to the stack — it does not replace the current screen.

---

## Q2: What happens after calling router.back() on the detail screen?

**Answer:**

`router.back()` pops the top screen off the Stack. The Stack history goes from:
```
[(home)/index, (home)/[id]?id=3]
```
back to:
```
[(home)/index]
```

The user returns to the ArticleList screen (`(home)/index`). The detail screen is unmounted and its local state (e.g. `bookmarked`) is reset.

---

## Q3: If router.replace() is used instead of router.push() in Q1, what is different about the Stack history?

**Answer:**

`router.replace()` **replaces** the current screen instead of pushing on top of it.

With `router.push()`:
```
[(home)/index, (home)/[id]?id=3]   ← two screens, back button works
```

With `router.replace()`:
```
[(home)/[id]?id=3]                 ← only one screen, no back button
```

The key difference: after `router.replace()`, pressing back will NOT return to the ArticleList. The `(home)/index` screen is removed from the history. This is useful for login flows where you don't want the user to go back to the login screen after signing in.

---

## Q4: What does useLocalSearchParams() return on [id].tsx when navigated with params: { id: '3' }?

**Answer:**

```js
const { id } = useLocalSearchParams<ArticleParams>();
// id === "3"   (a string, always — even if you passed a number)
```

`useLocalSearchParams()` returns an object where all values are **strings** (or arrays of strings for repeated params). The full return value would be:

```js
{ id: "3" }
```

This is why in `[id].tsx` we compare `a.id === id` — both sides are strings, so it works correctly. If `id` were typed as a number and compared with `===`, it would never match and `article` would always be `undefined`.
