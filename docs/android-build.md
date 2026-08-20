# Android build

O aplicativo Android usa Capacitor sobre o frontend React/Vite.

## Gerar APK de debug

```bash
npm install --legacy-peer-deps
npm run build:web
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

O APK é gerado em `android/app/build/outputs/apk/debug/app-debug.apk`.

A workflow `Android APK` executa esse processo automaticamente no GitHub Actions.
