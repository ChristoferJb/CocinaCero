@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.1
echo ===================================================
echo   Compilando CocinaCero y Generando APK
echo ===================================================

echo [1/4] Compilando recursos web...
call npm run build
if %errorlevel% neq 0 (
    echo Error al compilar recursos web.
    pause
    exit /b %errorlevel%
)

echo [2/4] Sincronizando con Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Error al sincronizar con Capacitor.
    pause
    exit /b %errorlevel%
)

echo [3/4] Compilando APK nativo con Gradle...
cd android
call .\gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo Error al compilar el APK nativo.
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo [4/4] Copiando APK resultante al directorio raiz...
if not exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo El archivo APK no fue encontrado en la ruta de salida de Gradle.
    pause
    exit /b 1
)
copy /Y android\app\build\outputs\apk\debug\app-debug.apk CocinaCero.apk
if %errorlevel% neq 0 (
    echo No se pudo copiar el APK. Revisa la ruta de salida.
    pause
    exit /b %errorlevel%
)

echo ===================================================
echo   ^^[!] ¡APK GENERADO CON EXITO! ^^[!]
echo   El archivo esta disponible en: %cd%\CocinaCero.apk
echo ===================================================
pause
