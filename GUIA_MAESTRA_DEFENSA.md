# GUÍA MAESTRA DE DEFENSA TÉCNICA Y EXPOSICIÓN: COCINACERO
*Manual integral paso a paso: Dispositivas, Explicación Oral, Fragmentos de Código Reales y Respuestas a Preguntas del Docente*

---

## ÍNDICE DE NAVEGACIÓN RÁPIDA
1. **Módulo 1**: Justificación y Contexto de Negocio (Zero-Waste)
2. **Módulo 2**: Arquitectura por Capas y Selección de Frameworks (React + Ionic + Capacitor)
3. **Módulo 3**: Modelado de Datos y Tipado de Dominio (`types.ts`)
4. **Módulo 4**: Subsistema de Escaneo (Cámara, Open Food Facts y Parser de QR)
5. **Módulo 5**: Motor de Expiración y Categorización Inteligente
6. **Módulo 6**: El Algoritmo Estrella: Motor de Recetas y *Zero-Waste Score*
7. **Módulo 7**: Ingeniería de UI y Corrección de Bugs Críticos
8. **Módulo 8**: Pruebas Automatizadas (Vitest) y Pipeline de Compilación Nativa (`build-apk.bat`)
9. **Módulo 9**: Almacenamiento Actual y Plan de Escalabilidad en la Nube

---

# MÓDULO 1: JUSTIFICACIÓN Y CONTEXTO DE NEGOCIO

### 📺 En la Diapositiva:
* **Título**: CocinaCero — Inventario de Alimentos Inteligente & Recetas Zero-Waste.
* **Problema**: 
  * Los hogares desperdician hasta un 30% de los alimentos que compran por falta de visibilidad de fechas de vencimiento.
  * Inacción del usuario: "Tengo comida, pero no sé qué cocinar con lo que se va a vencer".
* **Solución**:
  * Visibilidad en tiempo real mediante semáforo de colores (*Crítico*, *Advertencia*, *Óptimo*, *Vencido*).
  * Motor de sugerencia de recetas priorizadas por impacto ecológico/económico.

### 🗣️ Lo que debes decir (Guion de Exposición):
> "Buenas tardes profesor y compañeros. Presentamos **CocinaCero**, un sistema híbrido diseñado para resolver una problemática real en los hogares: el desperdicio de comida. 
> Muchas veces compramos alimentos, los guardamos en el fondo del refrigerador o alacena, y cuando los recordamos ya están vencidos. CocinaCero ataca este problema en dos frentes: primero, ofrece un registro ágil con escáner de cámara; segundo, utiliza un motor algorítmico que no solo te dice qué recetas puedes hacer con lo que tienes, sino que **reordena las recetas para recomendarte primero aquellas que salvan los alimentos que vencen hoy o mañana**."

### ❓ Posible pregunta del docente:
> **Docente**: *"¿En qué se diferencia esto de una app de listas de compras convencional o de notas?"*

### 💡 Respuesta técnica basada en código:
> **Tú**: *"Una lista convencional es pasiva. CocinaCero es un sistema dinámico y reactivo. Posee un motor matemático (`recipeMatcherService.ts`) que cruza semánticamente ingredientes, convierte unidades físicas de medida automáticamente (como de kg a gramos) y calcula un puntaje denominado **Zero-Waste Score** para priorizar el consumo preventivo."*

---

# MÓDULO 2: ARQUITECTURA POR CAPAS Y SELECCIÓN DE FRAMEWORKS

### 📺 En la Diapositiva:
* **Arquitectura**: Cliente Híbrido Desacoplado (Offline-First) organizado en 5 Capas de Software.
* **Stack**: React 18 + TypeScript + Ionic React + Capacitor 6.0 + Vite.

```text
+-------------------------------------------------------------------------+
|  1. CAPA DE PRESENTACIÓN (Vistas, Modales, JSX/Ionic)                   |
|     Ubicación: src/components/* y App.tsx                               |
+-------------------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------------------+
|  2. CAPA DE GESTIÓN DE ESTADO (React Hooks: useState, useMemo)          |
|     Ubicación: App.tsx (Estado unidireccional de inventario)            |
+-------------------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------------------+
|  3. CAPA DE LÓGICA DE NEGOCIO / SERVICIOS (Algoritmos Puros)            |
|     Ubicación: src/services/* (recipeMatcher, expiration, barcode)      |
+-------------------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------------------+
|  4. CAPA DE DATOS E INFRAESTRUCTURA (API Rest & Data Mock)              |
|     Ubicación: src/data/initialData.ts & Open Food Facts HTTP            |
+-------------------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------------------+
|  5. CAPA DE ABSTRACCIÓN NATIVA (Puente Capacitor & Android SDK)         |
|     Ubicación: capacitor.config.ts y Android Bridge                       |
+-------------------------------------------------------------------------+
```

### 🗣️ Lo que debes decir:
> "Elegimos una arquitectura híbrida desacoplada en 5 capas. El frontend está desarrollado con **React 18** y **TypeScript**. La interfaz se apoya en **Ionic React** para simular la navegación y componentes nativos de móvil, mientras que **Capacitor 6** actúa como puente de comunicación (Native Bridge) entre la web y el sistema operativo Android."

### ❓ Posible pregunta del docente:
> **Docente**: *"¿Por qué usaron Capacitor y no React Native o Flutter?"*

### 💡 Respuesta técnica y Código de Soporte:
> **Tú**: *"React Native y Flutter requieren compilar componentes gráficos nativos propios (Widgets), lo que dificulta integrar librerías de renderizado directo de imágenes web. Capacitor toma nuestra web compilada en React y la envuelve en una WebView nativa de alto rendimiento (`androidScheme: 'https'`). Esto nos permitió usar librerías puras de procesamiento gráfico en navegador como `html5-qrcode` directamente en TypeScript sin tener que escribir adaptadores complejos en Java/Kotlin."*

#### 💻 Código de Soporte — `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cocinacero.app',
  appName: 'CocinaCero',
  webDir: 'dist',
  server: {
    androidScheme: 'https' // Garantiza soporte de peticiones HTTP seguras y cámara en Android 9+
  }
};

export default config;
```

---

# MÓDULO 3: MODELADO DE DATOS Y TIPADO DE DOMINIO (`types.ts`)

### 📺 En la Diapositiva:
* **Entidades Principales**: `FoodItem`, `Recipe`, `RecipeIngredient`, `ConsumptionLog`, `RecipeMatchResult`.
* **Seguridad de Tipado**: TypeScript descarta incongruencias de datos antes de compilar.

### 🗣️ Lo que debes decir:
> "Todo el sistema está fuertemente tipado en `src/models/types.ts`. Definimos unidades de medida estandarizadas (`g`, `kg`, `ml`, `l`, `unidad`, `taza`, `cucharada`, `cucharadita`) y categorías alimenticias estrictas. La entidad `FoodItem` almacena tanto el nombre visual como un `normalizedName` para comparaciones insensibles a caracteres especiales."

#### 💻 Código de Soporte — `src/models/types.ts`:
```typescript
export type UnitOfMeasure = 'g' | 'kg' | 'ml' | 'l' | 'unidad' | 'taza' | 'cucharada' | 'cucharadita';

export type FoodCategory = 'lacteos' | 'vegetales' | 'frutas' | 'carnes_pescados' | 'despensa' | 'panaderia' | 'congelados' | 'otros';

export type ExpirationStatus = 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'GOOD';

export interface FoodItem {
  id: string;
  name: string;
  normalizedName: string; // Ejemplo: "tomate" (en minúsculas, sin tildes, singular)
  quantity: number;
  unit: UnitOfMeasure;
  expirationDate: string | Date;
  category: FoodCategory;
  createdAt: string | Date;
  status?: ExpirationStatus;
}
```

---

# MÓDULO 4: SUBSISTEMA DE ESCANEO (CÁMARA, OPEN FOOD FACTS Y PARSER DE QR)

### 📺 En la Diapositiva:
* **Escaneo Dual**: 
  1. Códigos de Barra Comerciales (EAN-13/UPC) -> API REST `Open Food Facts`.
  2. Códigos QR Locales -> Parser de Query String & JSON instantáneo offline.
* **Librería de Cámara**: `html5-qrcode` aislada en modal reactivo.

### 🗣️ Lo que debes decir:
> "Para capturar productos usamos la cámara trasera mediante `html5-qrcode`. Cuando se escanea un código de barras de un producto de supermercado, realizamos un `fetch` a la API REST de Open Food Facts. Pero para productos locales o comprados a granel, implementamos un **Parser de QR personalizado** que soporta cadenas tipo Query String (`name=Pollo&quantity=500&unit=g&expirationDays=3`), autocompletando el formulario en 0 milisegundos sin requerir internet."

#### 💻 Código de Soporte — `src/services/barcodeService.ts`:
```typescript
export function parseLocalQRContent(content: string): Partial<FoodItem> | null {
  const cleanContent = content.trim();
  
  // 1. Decodificación de Formato JSON
  if (cleanContent.startsWith('{') && cleanContent.endsWith('}')) {
    try {
      const parsed = JSON.parse(cleanContent.replace(/'/g, '"'));
      return {
        name: parsed.name || parsed.nombre,
        quantity: parsed.quantity ? Number(parsed.quantity) : undefined,
        unit: parsed.unit || parsed.unidad,
        category: parsed.category || parsed.categoria,
        expirationDate: parsed.expirationDate
      };
    } catch (e) {
      console.warn("Error leyendo JSON del QR:", e);
    }
  }

  // 2. Decodificación de Formato Query String (ej: name=Arroz&quantity=1&unit=kg)
  if (cleanContent.includes('=') && (cleanContent.includes('&') || cleanContent.split('=').length === 2)) {
    try {
      const params = new URLSearchParams(cleanContent);
      return {
        name: params.get('name') || params.get('nombre') || undefined,
        quantity: params.get('quantity') ? Number(params.get('quantity')) : undefined,
        unit: (params.get('unit') || params.get('unidad')) as UnitOfMeasure,
        category: (params.get('category') || params.get('categoria')) as FoodCategory
      };
    } catch (e) {
      console.warn("Error leyendo Query String del QR:", e);
    }
  }

  return null;
}
```

### ❓ Posible pregunta del docente:
> **Docente**: *"¿Qué pasa si la cámara falla o el usuario no le da permisos a la app?"*

### 💡 Respuesta técnica y Código de Soporte:
> **Tú**: *"Para evitar bloqueos en Android, agregamos una solicitud preventiva de permisos en `App.tsx` que se dispara 1 segundo después del montaje inicial. Si el usuario rechaza la cámara, la aplicación atrapa la excepción gracefully (`try/catch`) y le permite ingresar el producto de forma totalmente manual mediante el formulario modal `AddFoodModal.tsx`."*

---

# MÓDULO 5: MOTOR DE EXPIRACIÓN Y CATEGORIZACIÓN INTELIGENTE

### 📺 En la Diapositiva:
* **Cálculo de Días Restantes**: Comparación por milisegundos y conversión a días enteros absolutos.
* **Semáforo Dinámico**:
  * `EXPIRED`: $< 0$ días restantes.
  * `CRITICAL`: $0 \le \text{días} \le 2$ días (Alerta naranja pulsante).
  * `WARNING`: $3 \le \text{días} \le 5$ días (Advertencia amarilla).
  * `GOOD`: $> 5$ días (Estado verde óptimo).

#### 💻 Código de Soporte — `src/services/expirationService.ts`:
```typescript
export function calculateDaysRemaining(expirationDate: string | Date, referenceDate?: string | Date): number {
  const target = new Date(expirationDate);
  const now = referenceDate ? new Date(referenceDate) : new Date();
  
  // Normalización a medianoche para evitar desfases por horas
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateExpirationStatus(expirationDate: string | Date, referenceDate?: string | Date): ExpirationStatus {
  const days = calculateDaysRemaining(expirationDate, referenceDate);
  if (days < 0) return 'EXPIRED';
  if (days <= 2) return 'CRITICAL';
  if (days <= 5) return 'WARNING';
  return 'GOOD';
}
```

---

# MÓDULO 6: EL ALGORITMO ESTRELLA: MOTOR DE RECETAS Y *ZERO-WASTE SCORE*

### 📺 En la Diapositiva:
* **Tres Pasos del Engine**:
  1. Normalización de Cadenas (`normalizeText`).
  2. Matriz de Conversión de Unidades Equivales (`UNIT_CONVERSION_TO_BASE`).
  3. Cálculo de Puntuación *Zero-Waste Score* y ordenamiento tripartito.

#### 💻 Código de Soporte — Normalización y Conversión (`src/services/recipeMatcherService.ts`):
```typescript
// 1. Remueve acentos diacríticos, convierte a minúsculas y limpia espacios
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// 2. Matriz de conversión física entre magnitudes
const UNIT_CONVERSION_TO_BASE: Record<UnitOfMeasure, { baseUnit: 'mass' | 'volume' | 'unit' | 'cup_tbsp', factor: number }> = {
  g: { baseUnit: 'mass', factor: 1 },
  kg: { baseUnit: 'mass', factor: 1000 },
  ml: { baseUnit: 'volume', factor: 1 },
  l: { baseUnit: 'volume', factor: 1000 },
  unidad: { baseUnit: 'unit', factor: 1 },
  taza: { baseUnit: 'cup_tbsp', factor: 240 },
  cucharada: { baseUnit: 'cup_tbsp', factor: 15 },
  cucharadita: { baseUnit: 'cup_tbsp', factor: 5 }
};
```

#### 💻 Código de Soporte — Asignación de Puntaje Zero-Waste y Ordenamiento:
```typescript
// Evaluación de Ingredientes y Puntaje Zero-Waste
if (status === 'CRITICAL') zeroWasteScore += 50;
else if (status === 'EXPIRED') zeroWasteScore += 30;
else if (status === 'WARNING') zeroWasteScore += 20;
else zeroWasteScore += 5;

// Ordenamiento de Resultados
return results.sort((a, b) => {
  // Criterio 1: Primero recetas que se pueden cocinar HOY al 100%
  if (a.canBeCooked !== b.canBeCooked) {
    return a.canBeCooked ? -1 : 1;
  }
  // Criterio 2: Recetas con mayor Zero-Waste Score (salvan comida crítica)
  if (a.zeroWasteScore !== b.zeroWasteScore) {
    return b.zeroWasteScore - a.zeroWasteScore;
  }
  // Criterio 3: Mayor porcentaje de coincidencia de ingredientes
  return b.matchPercentage - a.matchPercentage;
});
```

### 🗣️ Explicación de la Lógica frente al Docente:
> "Profesor, este es el componente lógico más importante. Cuando buscamos recetas, no hacemos una simple búsqueda por texto. El motor realiza lo siguiente:
> 1. Indexa la despensa en una tabla Hash (`Map`) para búsquedas en tiempo constante $O(1)$.
> 2. Convierte unidades automáticamente: si la receta pide 200g de pollo y tenemos 0.5kg en la despensa, la función `isQuantitySufficient` multiplica $0.5 \times 1000 = 500\text{g}$ y confirma que la cantidad alcanza.
> 3. Si la receta usa un ingrediente que está en estado `CRITICAL` (vence en $\le 2$ días), le otorga +50 puntos de premio a esa receta.
> 4. Al final, las recetas se ordenan situando en primer lugar las que se pueden cocinar inmediatamente y que salvan la mayor cantidad de alimento en riesgo."

---

# MÓDULO 7: INGENIERÍA DE UI Y CORRECCIÓN DE BUGS CRÍTICOS

### 📺 En la Diapositiva:
* **Refactorizaciones de Calidad**:
  1. *Bug de Incremento Exponencial*: Sustitución de multiplicación por pasos fijos lógicos (`getQuantityStep`).
  2. *Control de Flotantes*: Eliminación de imprecisiones de JavaScript (`1.50000000000002`).
  3. *Ajuste Estético de Búsqueda*: Ocultamiento reactivo de lupa e inyección de clase CSS `.search-input`.

#### 💻 Código de Soporte — Incrementos y Redondeos en `InventoryView.tsx`:
```typescript
const getQuantityStep = (unit: string): number => {
  switch (unit) {
    case 'g':
    case 'ml':
      return 100; // Incremento de 100g / 100ml
    case 'kg':
    case 'l':
      return 0.1; // Pasos finos de 0.1 kg (100g) que permiten valores como 1.56 kg
    case 'unidad':
    case 'taza':
    default:
      return 1; // Pasos de 1 en 1 para piezas
  }
};

// Ejemplo de actualización limpia sin desborde de decimales:
const newQuantity = Math.round((currentQty + delta) * 100) / 100;
```

#### 💻 Código de Soporte — Lupa Reactiva en `InventoryView.tsx` & `index.css`:
```tsx
// JSX en InventoryView.tsx
<div style={{ flex: '1 1 280px', position: 'relative' }}>
  {!searchTerm && (
    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
  )}
  <input
    type="text"
    className="search-input"
    placeholder="Buscar por nombre (ej. Pollo, Tomates)..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
```
```css
/* CSS en index.css */
.search-input {
  padding-left: 2.8rem !important;
}
```

---

# MÓDULO 8: PRUEBAS AUTOMATIZADAS (VITEST) Y PIPELINE DE COMPILACIÓN NATÍVA

### 📺 En la Diapositiva:
* **Suite de Tests**: 16 Pruebas unitarias ejecutadas con **Vitest** (100% exitosas).
* **Compilación Automatizada**: Script `build-apk.bat` que automatiza Vite + Capacitor Sync + Gradle Debug APK en Windows.

#### 💻 Código de Soporte — Test Ejemplo `tests/recipeMatcherService.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { findMatchingRecipes } from '../src/services/recipeMatcherService';

describe('Recipe Matcher Engine', () => {
  it('debe dar prioridad a recetas que salvan ingredientes CRÍTICOS', () => {
    const mockInventory = [
      { id: '1', name: 'Pollo', normalizedName: 'pollo', quantity: 500, unit: 'g', expirationDate: '2026-07-15', category: 'carnes_pescados', createdAt: new Date() }
    ];
    
    // Ejecución del matcher
    const results = findMatchingRecipes(mockInventory as any, mockRecipes as any);
    expect(results[0].zeroWasteScore).toBeGreaterThan(0);
    expect(results[0].canBeCooked).toBe(true);
  });
});
```

#### 💻 Código de Soporte — Script Batch `build-apk.bat`:
```cmd
@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.1
call npm run build
call npx cap sync android
cd android
call .\gradlew.bat assembleDebug
cd ..
copy android\app\build\outputs\apk\debug\app-debug.apk CocinaCero.apk /Y
```

---

# MÓDULO 9: ALMACENAMIENTO ACTUAL Y PLAN DE ESCALABILIDAD EN LA NUBE

### 📺 En la Diapositiva:
* **Estado Actual**: Memoria Volátil de React con estado reactivo centralizado en `App.tsx` y datos Mock Semilla (`initialData.ts`).
* **Hoja de Ruta de Escalabilidad**:
  * **Fase 1**: Persistencia Local en Dispositivo Móvil mediante `@capacitor/preferences` / Capacitor SQLite.
  * **Fase 2**: Backend Nube en **Supabase** (PostgreSQL) con autenticación y sincronización multiusuario para familias.

### 🗣️ Resumen de Cierre de Exposición:
> "En conclusión, profesor, CocinaCero demuestra cómo la combinación de una arquitectura híbrida limpia en React y TypeScript, junto con un motor de recomendación enfocado en prioridades ecológicas, puede ofrecer una solución nativa móvil robusta, testeada y de alto impacto para la reducción del desperdicio de comida en los hogares. Quedamos a su disposición para iniciar la sesión de preguntas y demostración en vivo."
