# MAD-NewsReader

**Student Name:** Asadul Haque
**Student ID:** 22-12345-1
**Course:** Mobile Application Development — Fall 26-27
**Lab:** Week 3 — Navigation with Expo Router

---

## About

NewsReader is a two-tab React Native app built with Expo Router. The Home tab shows a list of news articles using a Stack navigator — tapping an article opens a full detail screen. The Bookmarks tab is a placeholder for a future week.

### Features
- Two tabs: Home (newspaper icon) and Bookmarks (bookmark icon)
- ArticleList screen with FlatList of 8 articles
- **Exercise 1:** Horizontal category filter pills (All / Tech / Policy / Research / etc.)
- ArticleDetail screen with full article body rendered as paragraphs
- **Exercise 2:** Bookmark toggle button in the header (filled/outlined icon)
- Dynamic route `[id].tsx` with `useLocalSearchParams()`
- Stack header title updates to article title via `useEffect`

---

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
