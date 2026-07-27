# DOCUMENTACIÓN TÉCNICA Y ESPECIFICACIÓN: ACTIVIDAD 14
**Proyecto**: CocinaCero — Sistema de Inventario Inteligente y Recomendador de Recetas con Impacto Zero-Waste  
**Asignatura**: Aplicaciones Móviles  
**Estudiantes**: Grupo 8 (Barzola C., Delgado B., Palma M., Zambrano L.)  
**Docente**: Ing. Gabriel Morejón López, Mg.  

---

## MÓDULO 1: PLANIFICACIÓN DE LA ARQUITECTURA Y DISEÑO DE PROMPTS

### A. Idea del Proyecto y Funcionalidades Clave
**CocinaCero** es un prototipo funcional móvil híbrido diseñado bajo la filosofía *Zero-Waste* (Cero Desperdicio de Alimentos). La aplicación automatiza el control de caducidad en el hogar y mitiga el desperdicio mediante tres dinámicas:
1.  **Semáforo de Caducidad**: Detección dinámica de vida útil por diferencia de fechas y clasificación visual reactiva.
2.  **Lector Multiprotocolo**: Escaneo offline de códigos QR locales y consumo asíncrono de la base de datos comercial *Open Food Facts API* para códigos de barras.
3.  **Algoritmo de Priorización (Zero-Waste Score)**: Recomendador de recetas que prioriza platos que salvan ingredientes críticos en peligro de caducidad.

### B. Stack Tecnológico Seleccionado
*   **Lenguaje**: TypeScript + TSX (React 18).
*   **Framework de UI**: Ionic React (componentes nativos adaptativos).
*   **Puente Nativo de Hardware**: Capacitor 6.0 (WebView optimizado e integración de permisos Android).
*   **Motor de Escaneo**: `Html5Qrcode` (captura de cámara y decodificación directa en WebView).
*   **Entorno de Compilación**: Vite 5.
*   **Pruebas Unitarias**: Vitest (suite de tests unitarios de lógica pura).

### C. Plan de Prompts de Inteligencia Artificial (Estrategia Iterativa)
El desarrollo del prototipo se dividió de forma modular siguiendo el principio de prompts específicos y contextualizados:

```text
+-----------------------+      +-----------------------+      +-----------------------+
|  Prompt 1: Core App   | ---> | Prompt 2: Camera & QR | ---> | Prompt 3: Bug Fixing  |
|  (Estructura y UI)    |      | (Lector html5-qrcode) |      | (Precisión y Permisos)|
+-----------------------+      +-----------------------+      +-----------------------+
```

---

## MÓDULO 2: ARQUITECTURA Y ORGANIZACIÓN DEL CÓDIGO (CAPAS)

El prototipo utiliza una **Arquitectura de Software por Capas (N-Tier)** adaptada a WebViews móviles para garantizar el desacoplamiento de componentes y la facilidad de pruebas locales.

### Estructura de Directorios del Código
```text
Proyecto-Cocina/
├── android/                        # Proyecto nativo de Android (Gradle)
├── tests/                          # Suite de Pruebas Unitarias (Vitest)
│   ├── expirationService.test.ts   # Pruebas de cálculo de días y semáforos
│   └── recipeMatcherService.test.ts# Pruebas de coincidencia de ingredientes y score
├── src/
│   ├── models/
│   │   └── types.ts                # Capa de Datos: Interfaces y Tipos del dominio
│   ├── services/                   # Capa de Lógica de Negocio (TypeScript puro)
│   │   ├── barcodeService.ts       # Integración Open Food Facts y parser QR
│   │   ├── expirationService.ts    # Motor de fechas y semáforo dinámico
│   │   └── recipeMatcherService.ts # Motor de conversión y Zero-Waste Score
│   ├── components/                 # Capa de Presentación (React / Ionic UI)
│   │   ├── DashboardOverview.tsx   # Panel principal y KPIs monetarios
│   │   ├── InventoryView.tsx       # Despensa y controles de cantidad
│   │   ├── RecipesView.tsx         # Listado de recetas sugeridas
│   │   └── BarcodeScannerModal.tsx # Lector de cámara físico
│   ├── App.tsx                     # Capa de Gestión de Estado Unidireccional
│   └── index.css                   # Estilos y variables CSS Dark Mode
```

---

## MÓDULO 3: ESPECIFICACIÓN DETALLADA DE ALGORITMOS NÚCLEO

### A. Algoritmo del Motor de Recetas y Zero-Waste Score
El motor empareja los ingredientes disponibles en el inventario con los requeridos por cada receta, realizando:
1.  **Normalización Fonética**: Remoción de tildes y mayúsculas, y eliminación de plurales para evitar fallas tipográficas (ej. *"Zanahorias"* $\rightarrow$ *"zanahoria"*).
2.  **Conversión de Magnitudes**: Conversión automática a unidades base cuando difieren las unidades de la despensa y la receta (ej. kg a gramos).
3.  **Cálculo del Score**: Suma de puntos por usar ingredientes propensos a dañarse:
    *   Si el ingrediente es **`CRITICAL`** (vence en $\le 2$ días): $+50$ puntos.
    *   Si el ingrediente es **`WARNING`** (vence en $3$-$5$ días): $+20$ puntos.
    *   Si está en estado **`GOOD`**: $+5$ puntos.

```typescript
// Fragmento clave: recipeMatcherService.ts
export function matchSingleRecipe(recipe: Recipe, inventory: FoodItem[], currentDate?: string | Date): RecipeMatchResult {
  // Indexación en Hash Map para búsquedas O(1)
  const inventoryMap = new Map<string, FoodItem>();
  for (const item of inventory) {
    inventoryMap.set(normalizeText(item.normalizedName || item.name), item);
  }
  // ... Lógica de validación de cantidades suficentes ...
  if (isQuantitySufficient(foundItem.quantity, foundItem.unit, req.quantity, req.unit)) {
    if (status === 'CRITICAL') zeroWasteScore += 50;
    else if (status === 'WARNING') zeroWasteScore += 20;
    else zeroWasteScore += 5;
  }
  // ... Ordenamiento de resultados: canBeCooked -> zeroWasteScore -> matchPercentage
}
```

### B. Parser de Códigos QR Locales (Offline)
Decodifica datos embebidos en el QR en formato Query String, permitiendo autocompletar formularios sin requerir red de internet.
```typescript
// Fragmento clave: barcodeService.ts
export function parseLocalQRContent(content: string): Partial<FoodItem> | null {
  const cleanContent = content.trim();
  if (cleanContent.includes('=') && (cleanContent.includes('&') || cleanContent.split('=').length === 2)) {
    const params = new URLSearchParams(cleanContent);
    return {
      name: params.get('name') || undefined,
      quantity: params.get('quantity') ? Number(params.get('quantity')) : undefined,
      unit: params.get('unit') as UnitOfMeasure,
      category: params.get('category') as FoodCategory
    };
  }
  return null;
}
```

---

## MÓDULO 4: INTERVENCIÓN HUMANA Y REFACTORIZACIONES CLAVE

El equipo humano corrigió fallos críticos generados por la IA para asegurar que la app sea instalable y utilizable en teléfonos móviles:

1.  **Bug de Cantidades y Flotantes (Lógica de UI)**: 
    *   *Fallo de IA*: Incrementaba o reducía stock en pasos del 25% de la cantidad actual, generando crecimientos descontrolados y números irracionales de punto flotante (`1.20000000000002 kg`).
    *   *Corrección Humana*: Implementamos pasos unitarios fijos según la unidad de medida (`getQuantityStep`) y un redondeo a dos decimales (`Math.round(val * 100) / 100`).
2.  **Fallo de Inicialización de Cámara en Android (Capacitor Native Flow)**:
    *   *Fallo de IA*: Inicializaba la cámara de forma directa al pulsar el botón del escáner, lo que provocaba pantallas en negro en celulares porque no se solicitaba la confirmación nativa de permisos a nivel de sistema operativo.
    *   *Corrección Humana*: Diseñamos un despachador preventivo con `useEffect` en el arranque de la app (`App.tsx`) para solicitar preventivamente el acceso a `getUserMedia` y detener el hardware inmediatamente para no gastar batería de fondo.

---

## MÓDULO 5: SUITE DE PRUEBAS UNITARIAS AUTOMATIZADAS
Utilizamos **Vitest** como motor de ejecución para validar el comportamiento lógico antes de empaquetar el APK nativo. Las pruebas validan de forma aislada:
*   La conversión de días restantes y clasificación semántica de caducidad.
*   El ordenamiento de recetas basado en el puntaje de desperdicio.
*   La conversión física de unidades compatibles de masa y volumen.

```bash
# Comando de ejecución de suite de tests en la terminal del proyecto
npm test
```
*Resultado*: 16 pruebas unitarias exitosas (0 fallos).
