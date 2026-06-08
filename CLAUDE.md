# CLAUDE.md — Agent & Developer Instruction Guide

This file provides the exact build, run, clean, and test commands for this lightweight Expo and React Native project. Any AI agent (like Antigravity) or IDE reading this will immediately understand the development environment.

---

## 🛠️ Build and Development Commands

*   **Start Local Dev Server (Expo Go)**:
    ```bash
    npx expo start --go
    ```
*   **Trigger Android Test APK Cloud Build**:
    ```bash
    npx eas-cli build --platform android --profile preview
    ```
*   **Trigger Android Production AAB Cloud Build**:
    ```bash
    npx eas-cli build --platform android --profile production
    ```
*   **Trigger iOS Production IPA Cloud Build**:
    ```bash
    npx eas-cli build --platform ios --profile production
    ```
*   **EAS Submit (Publish to Play Store/App Store)**:
    ```bash
    npx eas-cli submit --platform android
    npx eas-cli submit --platform ios
    ```

---

## 💾 Storage & Maintenance Commands (MacBook Optimization)

*   **Completely Reset & Re-install Project (Wipe Cache & node_modules)**:
    ```bash
    npm run clean
    ```
*   **Wipe System NPM Cache**:
    ```bash
    npm cache clean --force
    ```
*   **Clear Metro Bundler Cache**:
    ```bash
    npx expo start --clear
    ```

---

## 📁 Key File Configurations (Low-Storage Templates)

When creating a new project in the future, ensure these files are present:
1.  **`.npmrc`**: Configures npm to bypass audits and funding logs to save disk write cycles and bandwidth:
    ```ini
    audit=false
    fund=false
    prefer-offline=true
    loglevel=warn
    ```
2.  **`eas.json`**: Standard cloud build configuration for Android APKs and iOS apps.
3.  **`.gitignore`**: Ignores heavy cache folders (`.expo/`, `.eas/`, `node_modules/`, native project directories, and APK/AAB binaries).
