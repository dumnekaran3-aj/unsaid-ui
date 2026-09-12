# Unsaid — Mobile App (React Native / Expo)

## What's already built (v1 skeleton)

- Auth flow: Login, Signup screens (wired to backend API)
- Connection Key screen: view your own key, share it, or paste partner's key to link
- Smart routing in `AppNavigator.js`:
  - Not logged in → Login/Signup
  - Logged in but not connected → Connection Key screen
  - Logged in + connected → Full app (Home, Chat, Memories, Profile tabs)
- Bottom tab navigation: Home / Chat / Memories / Profile
- Chatroom screen wired to Socket.io (send/receive real-time messages)
- Memories feed screen (grid layout, empty state — needs the fetch API connected)
- Profile, Settings, Breakup screens (UI + basic logic, ready to expand)
- Call screen UI shell (WebRTC not wired yet — signaling events already exist in backend)

## Prerequisites (install on your machine, not here)

1. **Node.js** (v18+)
2. **Expo Go app** on your Android phone (from Play Store) — easiest way to test without building an APK yet
3. **Android Studio** (only needed later, when you want to build a real standalone `.apk`)

## Setup Steps

```bash
cd mobile
npm install
```

Before running, open `src/config/api.js` and update:

```js
export const BASE_URL = "http://<YOUR_LAPTOP_LOCAL_IP>:5000/api";
export const SOCKET_URL = "http://<YOUR_LAPTOP_LOCAL_IP>:5000";
```

> Your phone and laptop must be on the **same WiFi network**. Find your laptop's local IP with `ipconfig` (Windows) or `ifconfig`/`ip a` (Mac/Linux) — something like `192.168.1.5`. `localhost` will NOT work from your phone.

Then start Expo:

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone → app opens instantly, no APK build needed for daily development.

## Testing the full flow

1. Make sure the backend (`npm run dev` in `/backend`) is running first
2. Signup on your phone with your account
3. Signup again with a second test account (use a browser-based tool like Postman, or a second phone/emulator) to get a second Connection Key
4. Paste one key into the other account's Connection Key screen → both accounts link → Home/Chat/Memories/Profile tabs unlock

## What's NOT built yet (next phases)

- Gift messages UI + emoji animations (Lottie)
- Media picker (image/video/audio) wired to R2 upload
- One-time media view logic
- Delete for me / delete for everyone (backend event exists, UI needs wiring)
- Chat PIN lock enforcement
- Theme switching (dark/normal/romantic — UI chips exist, logic pending)
- WebRTC audio/video calling
- Push notifications (FCM token registration + handling)

## Folder Structure

```
mobile/
├── App.js
├── app.json
├── src/
│   ├── config/          # API client, Socket.io client
│   ├── context/          # AuthContext (global login state)
│   ├── navigation/         # AppNavigator (tabs + stack)
│   ├── screens/             # All screens
│   └── components/           # (empty, for reusable UI pieces later)
```
