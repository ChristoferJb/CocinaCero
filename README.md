# CocinaCero — Inventario Inteligente y Recetas Zero-Waste

CocinaCero es una aplicación móvil híbrida desarrollada con **React 18**, **Ionic React** y **Capacitor 6**. Su objetivo principal es combatir el desperdicio de comida en el hogar, proporcionando un control visual e interactivo de los alimentos y sugiriendo preparaciones basadas en la urgencia de consumo de los ingredientes disponibles.

---

## 1. Descripción del Problema y Enfoque de Usuario

### El Problema
El desperdicio de alimentos es un problema doméstico que impacta negativamente en la economía de los hogares y en el medio ambiente. En la rutina diaria, los alimentos se pierden por dos factores:
1. **Invisibilidad**: La comida se almacena y se olvida al fondo de la alacena o refrigerador.
2. **Bloqueo Creativo**: El usuario tiene ingredientes aislados, pero no sabe qué cocinar con ellos antes de que se venzan.

### Usuario y Alcance No Universitario
La aplicación está diseñada para **familias, jefes de hogar y personas que cocinan a diario en casa**. El lenguaje, los iconos y los flujos son sencillos y visuales, asegurando que cualquier usuario sin conocimientos tecnológicos o académicos pueda escanear un producto, ver qué está por vencer en un semáforo de colores y presionar un botón para saber qué almorzar hoy.

---

## 2. Instalación y Ejecución

### Requisitos Previos
* **Node.js** (Versión 18 o superior).
* **npm** (Instalado junto con Node.js).
* **Java Development Kit (JDK) 17** (Solo si deseas compilar la APK de Android nativa).

### Ejecución Local en Navegador
1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible por defecto en [http://localhost:5173/](http://localhost:5173/).*

### Ejecución de Pruebas Unitarias
El proyecto cuenta con una suite de pruebas automatizadas con Vitest para validar la lógica del motor:
```bash
npm test
```

### Compilación de APK de Android
Para generar la aplicación nativa de Android, ejecuta el script automatizado en Windows:
```bash
./build-apk.bat
```
*Este comando compilará el frontend, sincronizará Capacitor y llamará a Gradle para generar el archivo `CocinaCero.apk` en la raíz del proyecto.*

---

## 3. Organización Técnica del Proyecto

El código está estructurado de manera modular y por capas para separar la interfaz de usuario de la lógica de negocio:

```text
Proyecto-Cocina/
├── src/
│   ├── components/                 # CAPA DE PRESENTACIÓN (Vistas e Interfaces)
│   │   ├── DashboardOverview.tsx   # Panel de control con estadísticas y alertas de vencimiento.
│   │   ├── InventoryView.tsx       # Inventario de despensa con semáforo y filtros.
│   │   ├── RecipesView.tsx         # Recomendador de recetas ordenadas por Zero-Waste Score.
│   │   ├── HistoryView.tsx         # Historial de alimentos aprovechados y desechados.
│   │   ├── BarcodeScannerModal.tsx # Lector de cámara integrado con Html5Qrcode.
│   │   └── AddFoodModal.tsx        # Formulario de registro de alimentos.
│   ├── services/                   # CAPA LÓGICA DE NEGOCIO (Servicios puros en TS)
│   │   ├── barcodeService.ts       # Conexión externa a Open Food Facts y parser offline de QR.
│   │   ├── expirationService.ts    # Algoritmo de cálculo de días de vida útil y semáforos.
│   │   └── recipeMatcherService.ts # Motor de emparejamiento de ingredientes y recetas.
│   ├── models/
│   │   └── types.ts                # CAPA DE DATOS: Tipados e interfaces TypeScript del dominio.
│   ├── data/
│   │   └── initialData.ts          # Semillas de datos simulados (Mock Data).
│   ├── App.tsx                     # Orquestador del estado global de la aplicación.
│   └── index.css                   # Diseño visual Dark Mode y variables CSS globales.
├── tests/                          # CAPA DE CALIDAD (Tests unitarios automatizados)
│   ├── expirationService.test.ts
│   └── recipeMatcherService.test.ts
```

---

## 4. Datos Simulados de Prueba
De acuerdo con las políticas de uso responsable de IA, la aplicación **no utiliza datos sensibles reales de usuarios**. La base inicial se nutre de datos de prueba simulados que puedes ver y modificar en `src/data/initialData.ts`:
* **Inventario de Alimentos**: Yogur, Pechuga de Pollo, Tomates, Queso Mozzarella, Espinacas y Huevos, todos con fechas de vencimiento calculadas dinámicamente en base al día de hoy para poder probar el semáforo en vivo.
* **Recetas Semilla**: Wok de Pollo, Ensalada Caprese, Tortilla de Espinacas y Queso, y Arroz con Pollo.
* **Historial Inicial**: Un log de consumos y desechos previos para que el Dashboard muestre estadísticas financieras desde el primer inicio.
