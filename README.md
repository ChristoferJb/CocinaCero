# CocinaCero - Arquitectura y Núcleo Lógico 🍳🌱

> *Innovación en la gestión del hogar inteligente para la erradicación del desperdicio alimentario.*

**CocinaCero** es una plataforma tecnológica que combina la gestión de inventarios en tiempo real, alertas lógicas de caducidad y un motor de sugerencia de recetas centrado en el *"Aprovechamiento Máximo" (Zero-Waste Engine)*.

---

## 🏗️ 1. Modelado de Entidades (`src/models/types.ts`)

El modelo de dominio está diseñado en TypeScript bajo principios de tipado estricto y alta cohesión.

### Entidades Principales:
* **`FoodItem`**: Representa el ítem de inventario en el hogar. Almacena `id`, `name`, `normalizedName` (sin acentos, en minúsculas para comparaciones O(1)), `quantity`, `unit`, `expirationDate`, y `category`.
* **`Recipe` & `RecipeIngredient`**: Define las recetas culinarias. `RecipeIngredient` incluye `isOptional: boolean`, crucial para no penalizar recetas que solo carecen de especias decorativas u opcionales.
* **`ConsumptionLog`**: Trazabilidad del destino del alimento (`CONSUMED` vs `DISCARDED`) con motivos técnicos y valoración económica para reportes de impacto medioambiental/ahorro.
* **`ExpirationAlert`**: Estructura de salida preparada para disparar push notifications o feeds de alertas in-app con niveles de prioridad (1 = Vencido/Urgente, 2 = Crítico/Hoy-Mañana, 3 = Advertencia).

---

## 🔍 2. Algoritmo de Matching ("Zero-Waste Engine") (`src/services/recipeMatcherService.ts`)

A diferencia de los buscadores de recetas tradicionales que solo buscan coincidencias exactas o filtran en modo "todo o nada", **CocinaCero Engine** soluciona tres grandes retos de ingeniería:

1. **Normalización Lingüística (`normalizeText`)**: Limpia mayúsculas, espacios diacríticos y tildes (`"Tomates Maduros"` $\rightarrow$ `"tomate"`).
2. **Compatibilidad de Unidades (`isQuantitySufficient`)**: Convierte dinámicamente magnitudes afines (`kg` a `g`, `l` a `ml`) para no descartar una receta que pide `500g` si el inventario tiene `1kg`.
3. **Puntuación de Rescate (`zeroWasteScore`)**:
   * Cada ingrediente de la receta que coincide con un alimento del inventario en estado **`CRITICAL` (vence hoy/mañana)** otorga **+50 puntos de rescate**.
   * Si coincide con un alimento en estado **`WARNING` (vence en 3-5 días)** otorga **+20 puntos**.
   * **Resultado:** Las recetas sugeridas se ordenan priorizando primero aquellas 100% cocinables con el inventario actual y, en segundo lugar, por la cantidad de alimentos a punto de pudrirse que salvan.

---

## 🧪 3. Pruebas Unitarias (`tests/`)

Se ha configurado un suite de pruebas determinista utilizando **Vitest**:

* **`tests/expirationService.test.ts`**:
  * Verifica el cálculo de días de diferencia (`calculateDaysRemaining`) con fechas fijas (`normalizeToMidnightUTC`).
  * Valida las fronteras de decisión de estado (`EXPIRED < 0`, `CRITICAL 0..2`, `WARNING 3..5`, `GOOD > 5`).
  * Comprueba que la cola de notificaciones (`getExpirationAlerts`) ordene por urgencia (Prioridad 1 $\rightarrow$ 2 $\rightarrow$ 3).
* **`tests/recipeMatcherService.test.ts`**:
  * Valida conversiones de unidades y tolerancias (`isQuantitySufficient`).
  * Comprueba que los ingredientes opcionales no bloqueen la viabilidad de una receta (`canBeCooked`).
  * Asegura la asignación de puntajes `zeroWasteScore`.

---

## 🚀 Cómo Ejecutar en el Entorno Local

```bash
# Instalar dependencias (si se requiere desarrollar/probar en un entorno Node/TypeScript)
npm install

# Compilar TypeScript a JavaScript
npm run build

# Ejecutar la suite de pruebas unitarias
npm test
```
