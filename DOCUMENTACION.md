# DOCUMENTACIÓN OFICIAL DE COCINACERO
*Inventario de Alimentos Inteligente & Motor de Recetas Zero-Waste*

---

## 1. Resumen del Proyecto

**CocinaCero** es una aplicación móvil e híbrida de tipo web-app cuyo propósito central es **reducir el desperdicio de alimentos en el hogar (Zero-Waste)** y facilitar la gestión inteligente del inventario de despensa. 

El sistema permite a los usuarios:
*   **Registrar Alimentos Rápidamente**: A través de un lector integrado de códigos de barras (que consulta la base de datos mundial *Open Food Facts*) y códigos QR personalizados (con autocompletado instantáneo).
*   **Monitorear el Estado de Vencimiento**: Clasifica los alimentos de forma gráfica y en tiempo real usando un semáforo de urgencia (*Crítico*, *Por vencer*, *Óptimo*, *Vencido*).
*   **Motor de Búsqueda de Recetas Inteligente**: Analiza los ingredientes de la despensa y sugiere qué platos se pueden cocinar. Prioriza automáticamente las recetas que aprovechan los alimentos que están más cerca de vencer, y detalla qué ingredientes faltan o son insuficientes.
*   **Historial de Impacto y Consumo**: Registra estadísticas sobre alimentos consumidos o descartados, calculando métricas de ahorro económico y huella de desperdicio reducida.

---

## 2. Arquitectura y Tecnologías

La aplicación está diseñada bajo una arquitectura moderna de cliente desacoplado, empaquetada como una aplicación híbrida nativa móvil.

| Capa / Componente | Tecnología Utilizada | Propósito |
| :--- | :--- | :--- |
| **Framework Core** | React 18 (TypeScript) | Gestión del estado local mediante React Hooks y componentes funcionales. |
| **Diseño y Contenedor** | Ionic React (`@ionic/react`) | Estructura responsive móvil, transiciones de vistas y sistema de pestañas nativas. |
| **Capa de Abstracción Nativa** | Capacitor 6 (`@capacitor/core`) | Interfaz puente con las APIs de Android (cámara, almacenamiento local, permisos). |
| **Motor de Escaneo** | `Html5Qrcode` | Captura y decodificación de códigos de barras y QR directamente desde el WebView. |
| **Estilos** | CSS Vanilla (index.css) | Diseño visual personalizado, dark mode con glassmorphism, degradados vibrantes y micro-animaciones. |
| **Iconografía** | Lucide React & IonIcons | Iconos vectoriales consistentes y estéticos. |
| **Servicios Externos** | Open Food Facts API | API REST pública para consultar información nutricional e ingredientes de códigos de barras comerciales. |
| **Entorno de Compilación** | Vite 5 | Bundler ultra rápido para desarrollo local y empaquetado optimizado de producción. |
| **Automatización** | Gradle & Script Batch | Compilación automatizada de la APK nativa de desarrollo (`CocinaCero.apk`). |
| **Testing** | Vitest | Pruebas unitarias automatizadas para los motores de recetas y fechas. |

---

## 3. Estructura de Carpetas del Proyecto

A continuación se detalla la organización de los archivos del workspace:

```text
Proyecto-Cocina/
├── android/                        # Proyecto nativo generado por Capacitor para Android (Gradle)
│   └── app/src/main/
│       ├── AndroidManifest.xml     # Declaración de permisos de hardware (Cámara, red)
│       └── assets/public/          # Activos compilados de la web app inyectados en la WebView
├── src/                            # Código fuente de la aplicación en React/TypeScript
│   ├── components/                 # Componentes interactivos y modales
│   │   ├── AddFoodModal.tsx        # Formulario de alta de alimento con disparador de cámara
│   │   ├── BarcodeScannerModal.tsx # Lector de cámara integrado con Html5Qrcode
│   │   ├── DashboardOverview.tsx   # Panel de control: estadísticas, accesos rápidos y alertas
│   │   ├── HistoryView.tsx         # Historial de alimentos consumidos y desechados (logs)
│   │   ├── InventoryView.tsx       # Inventario de despensa con filtros, búsquedas y controles de cantidad
│   │   ├── RecipeDetailModal.tsx   # Vista detallada de preparación y cocción de una receta
│   │   └── RecipesView.tsx         # Lista de recetas emparejadas con filtros de "cocinables"
│   ├── data/
│   │   └── initialData.ts          # Semilla inicial (Mock) de alimentos, recetas e historial
│   ├── models/
│   │   └── types.ts                # Interfaces y tipos TypeScript del dominio
│   ├── services/
│   │   ├── barcodeService.ts       # Integración con Open Food Facts API y parser de QR
│   │   ├── expirationService.ts    # Motor de cálculo de días de vida útil y semáforo de alerta
│   │   └── recipeMatcherService.ts # Algoritmo de emparejamiento semántico de recetas e ingredientes
│   ├── App.tsx                     # Componente principal que orquesta el estado global y las pestañas
│   ├── index.css                   # Sistema de diseño, CSS global, variables y clases de utilidad
│   ├── main.tsx                    # Punto de entrada de la aplicación React
│   └── index.ts                    # Exportador general de servicios
├── tests/                          # Suite de pruebas unitarias
│   ├── expirationService.test.ts   # Pruebas para la lógica de fechas y estados de vencimiento
│   └── recipeMatcherService.test.ts# Pruebas para el algoritmo de emparejamiento de ingredientes
├── build-apk.bat                   # Script de automatización de compilación de APK en Windows
├── capacitor.config.ts             # Configuración del servidor interno de Capacitor
├── package.json                    # Dependencias de desarrollo, producción y scripts de ejecución
├── vite.config.ts                  # Parámetros del bundler Vite
└── tsconfig.json                   # Reglas de compilación y tipado de TypeScript
```

---

## 4. API y Lógica Principal

### A. Modelado de Datos (`types.ts`)
Define las estructuras principales de la aplicación para garantizar un tipado estricto.

*   `FoodItem`:
    ```typescript
    export interface FoodItem {
      id: string;
      name: string;
      normalizedName: string;
      quantity: number;
      unit: UnitOfMeasure; // 'g' | 'kg' | 'ml' | 'l' | 'unidad' | 'taza' | 'cucharada' | 'cucharadita'
      expirationDate: string | Date;
      category: FoodCategory; // 'lacteos' | 'vegetales' | 'frutas' | 'carnes_pescados' | 'despensa' | 'panaderia' | 'congelados' | 'otros'
      createdAt: string | Date;
    }
    ```
*   `Recipe`: Representa las recetas y sus ingredientes requeridos (`RecipeIngredient`), que pueden marcarse como opcionales (`isOptional: boolean`).
*   `ConsumptionLog`: Registra transacciones de alimentos con acciones (`CONSUMED` o `DISCARDED`) y razones asociadas para medir el impacto financiero de las pérdidas.
*   `RecipeMatchResult`: Objeto dinámico calculado que contiene el porcentaje de ingredientes poseídos, si puede ser cocinado hoy (`canBeCooked`), ingredientes faltantes, ingredientes insuficientes, y un puntaje de desperdicio cero (`zeroWasteScore`).

### B. Servicio de Escaneo y Categorización (`barcodeService.ts`)
*   **Parser Multiprotocolo de QR**: Permite leer información directamente de códigos QR locales en formato JSON (ej. `{"name":"Leche","quantity":1}`) o Query String simplificado (ej. `name=Leche&quantity=1&unit=l&category=lacteos`).
*   **Búsqueda y Clasificación Inteligente**:
    *   `lookupProductByBarcode`: Busca el código primero en una base de datos estática interna y, si no lo encuentra, consulta la API mundial de Open Food Facts.
    *   `inferCategory`: Analiza semánticamente tanto el nombre del producto como sus etiquetas (en español e inglés) para clasificarlo automáticamente en su categoría culinaria correspondiente (ej. un producto que contenga "queso" se asigna a "lácteos").
    *   `getSuggestedDaysByCategory`: Sugiere de forma inteligente los días que faltan para el vencimiento de acuerdo a su tipo de alimento (ej. carne dura 3 días, lácteos 7 días, despensa/granos dura 180 días).

### C. Servicio de Fechas y Vencimientos (`expirationService.ts`)
*   `calculateDaysRemaining`: Obtiene los días enteros de vida útil restantes restando la fecha de vencimiento a la fecha actual del sistema.
*   `calculateExpirationStatus`: Determina el semáforo visual de alertas:
    *   `EXPIRED` (Menor a 0 días) -> Alerta roja.
    *   `CRITICAL` (De 0 a 2 días) -> Alerta naranja pulsante.
    *   `WARNING` (De 3 a 5 días) -> Alerta amarilla.
    *   `GOOD` (Más de 5 días) -> Estado verde estable.

### D. Motor de Emparejamiento de Recetas (`recipeMatcherService.ts`)
*   `normalizeText`: Normaliza las cadenas (remueve tildes, convierte a minúsculas, elimina plurales "s" y "es") para cruzar semánticamente los nombres de la despensa con las recetas sin importar faltas gramaticales.
*   `findMatchingRecipes`: El algoritmo principal realiza los siguientes pasos:
    1. Filtra los ingredientes obligatorios de la receta.
    2. Compara cada ingrediente con el inventario del usuario (usando nombres normalizados).
    3. Si la unidad de medida difiere, realiza conversiones básicas (ej. de kilogramos a gramos).
    4. Identifica qué ingredientes faltan o qué cantidades son insuficientes.
    5. Calcula el `matchPercentage` de la receta.
    6. Calcula el `zeroWasteScore`: un puntaje que le da prioridad a las recetas que aprovechan ingredientes en estado crítico (`CRITICAL` o `WARNING`) para impulsar al usuario a cocinar con lo que se va a vencer primero.

---

## 5. Herramientas y Comandos Utilizados

Durante el ciclo de desarrollo se configuraron y utilizaron herramientas para garantizar la estabilidad y el despliegue automático del software:

### A. Entorno de Ejecución Local
*   **Servidor Web Local**: Vite ejecuta el servidor rápido recargando en tiempo real ante cambios.
    ```powershell
    npm run dev
    ```
*   **Pruebas Unitarias (Vitest)**: Ejecución de la batería de pruebas lógicas.
    ```powershell
    npm test
    ```

### B. Compilación de la Aplicación Android (`build-apk.bat`)
Para facilitar la generación del archivo instalador móvil, se utiliza el script automatizado en la raíz del proyecto. Este script realiza los siguientes pasos de forma secuencial:
1.  Establece localmente la variable `JAVA_HOME` a la versión 17 necesaria para Android (`C:\Program Files\Java\jdk-17.0.1`).
2.  Compila los activos de React con Vite (`npm run build`).
3.  Sincroniza y copia los archivos web generados dentro de la carpeta pública del proyecto Android de Capacitor (`npx cap sync android`).
4.  Llama al compilador de Gradle (`.\gradlew.bat assembleDebug`) para generar los binarios de la aplicación.
5.  Extrae el ejecutable resultante (`app-debug.apk`) y lo copia en la raíz del proyecto renombrado como **`CocinaCero.apk`** para su fácil instalación.

---
*Fin del documento oficial de especificaciones de CocinaCero.*
