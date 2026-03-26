# AskO - Viral Anonymous Messaging App

**AskO** is a viral, no-auth, link-based anonymous messaging application inspired by NGL. It allows users to receive anonymous questions and reply to them with pretty cards shared directly to Instagram Stories.

## 🚀 Features

- **Anonymous Inbox**: Receive messages without any registration (only a unique username needed).
- **Instagram Story Integration**: Custom-built flow to guide users through adding the "Link Sticker" on Instagram.
- **Story Card Sharing**: Capture beautiful, shareable cards of your messages to reply on social media.
- **Push Notifications**: Get notified instantly when someone sends you a secret message.
- **Pro Features**: Unlock "Who sent this?" hints like location and device info.
- **Username Recovery**: Reinstall the app and reclaim your name instantly on the same or new devices.

## 🛠️ Tech Stack

### Monorepo Structure

- **`apps/mobile`**: React Native (Expo SDK 55) mobile application.
- **`apps/web`**: Next.js 16 application for sending messages and serving user profiles.
- **`packages/api`**: Shared Prisma database schema and API logic.

### Frameworks & Libraries

- **Mobile**: `react-native`, `expo`, `lucide-react-native`, `expo-clipboard`, `react-native-view-shot`.
- **Backend**: `PostgreSQL`, `Prisma ORM`.
- **Frontend**: `TailwindCSS`, `Next.js`.

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/asko.git
   cd asko
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Create a `.env` in the root and add your `DATABASE_URL`.

4. Sync the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Running the App

- **Mobile**:
  ```bash
  cd apps/mobile
  npx expo start
  ```
- **Web**:
  ```bash
  cd apps/web
  npm run dev
  ```

## 📸 Screenshots

*(Add screenshots here manually after running the app)*

## 📄 License

MIT
