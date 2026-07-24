# INFORME TÉCNICO DE IMPLEMENTACIÓN: COCINACERO
*Análisis detallado de características, estructuras de datos, justificación de frameworks y decisiones arquitectónicas*

---

## 1. Características Principales del Sistema

**CocinaCero** ha sido diseñada como una herramienta proactiva que no solo registra datos, sino que guía activamente al usuario para cambiar sus hábitos de consumo. Sus características principales son:

*   **Lector de Códigos Multiprotocolo**:
    *   *Comercial*: Escanea códigos de barras EAN-13/UPC y recupera la información de forma asíncrona desde la base de datos mundial de Open Food Facts.
    *   *Local/QR*: Escanea códigos QR personalizados y los decodifica instantáneamente en formato Query String o JSON, autocompletando campos como cantidad, unidad, categoría y días sugeridos de vencimiento.
*   **Semáforo de Alerta de Caducidad (Sistema de Almacenamiento Inteligente)**:
    *   Recalcula de forma dinámica en cada inicio los días restantes de vida útil de cada alimento.
    *   Clasifica los ítems en cuatro estados con colores reactivos: **Vencido** (rojo), **Crítico** (naranja pulsante, vence en 0-2 días), **Advertencia** (amarillo, vence en 3-5 días) y **Óptimo** (verde, vence en más de 5 días).
*   **Motor de Recetas Zero-Waste**:
    *   Cruza ingredientes requeridos en las recetas con alimentos disponibles en el inventario.
    *   Ordena las recetas dando prioridad a las que se pueden cocinar inmediatamente.
    *   Aplica un sistema de puntuación (**Zero-Waste Score**) que premia aquellas preparaciones que salvan los ingredientes que están más próximos a vencer en el inventario.
*   **Historial de Impacto Ecológico y Económico**:
    *   Registra transacciones de alimentos consumidos o descartados.
    *   Presenta estadísticas detalladas de ahorro monetario estimado e ingredientes salvados del tacho de basura.

---

## 2. Decisiones Arquitectónicas y Flujo de Datos

### Arquitectura de Cliente Desacoplado (Híbrido)
El sistema implementa una arquitectura híbrida donde todo el procesamiento lógico y el renderizado visual ocurre en el cliente (dentro del dispositivo móvil o navegador). Esto garantiza una respuesta instantánea sin latencia de red, factor crítico para la experiencia de usuario en una cocina.

```text
+-------------------------------------------------------------+
|                      CAPA DE PRESENTACIÓN                   |
|   Vistas en React (Dashboard, Inventario, Recetas, Logs)    |
+-------------------------------------------------------------+
                              |
                              v  (React Hooks / State)
+-------------------------------------------------------------+
|                      CAPA LÓGICA DE NEGOCIO                 |
|   recipeMatcherService | expirationService | barcodeService |
+-------------------------------------------------------------+
                              |
                              v  (Capacitor Native Bridge)
+-------------------------------------------------------------+
|                 APIS NATIVAS / WEBVIEW (Cámara)             |
|          Html5Qrcode Scanner / Permisos de Android          |
+-------------------------------------------------------------+
```

---

## 3. Elementos que más Influencian e Impactan el Código

El diseño del código fuente de CocinaCero está fuertemente estructurado alrededor de tres pilares fundamentales que determinan el comportamiento del sistema:

### A. Tipado Estricto de Dominio (`types.ts`)
Toda la lógica de la aplicación está influenciada por la definición del modelo de datos. Si un campo en `FoodItem` (como `expirationDate` o `unit`) cambia, se desencadena una actualización en cascada sobre los motores de recetas y vencimientos. Esto previene errores de integración en tiempo de compilación.

### B. Algoritmo de Normalización Fonética y Plurales (`normalizeText`)
El motor de búsqueda y cruce de recetas se apoya fuertemente en la normalización de texto. Sin ella, si el usuario tiene registrado *"Huevos"* y la receta pide *"Huevo"*, o si el inventario dice *"Limon"* (sin tilde) y la receta pide *"Limón"*, el sistema fallaría en conectarlos. 
*   El método remueve acentos ortográficos, convierte todo a minúsculas y remueve terminaciones en "s" y "es" para simplificar la comparación.

### C. Sistema de Conversión y Normalización de Magnitudes
Permite cruzar ingredientes medidos en distintas magnitudes físicas (Masa vs Volumen vs Unidades discretas) gracias a una matriz de conversión a base (`UNIT_CONVERSION_TO_BASE`), posibilitando comparar dinámicamente gramos contra kilogramos o tazas contra mililitros.

---

## 4. Estructuras de Datos y Persistencia

### Estructura de Datos Principal (En Memoria)
La aplicación almacena la información estructurada en colecciones nativas de JavaScript:
*   **Inventario (`FoodItem[]`)**: Una matriz de objetos JSON estructurados. Para búsquedas rápidas en el algoritmo de emparejamiento, esta matriz se indexa dinámicamente en un objeto `Map<string, FoodItem>` logrando búsquedas con complejidad temporal $O(1)$ en lugar de realizar barridos costosos de $O(N^2)$.
*   **Historial de Logs (`ConsumptionLog[]`)**: Un arreglo secuencial ordenado por fecha que guarda el registro histórico de operaciones.

### Persistencia de Datos
*   **Estado Actual**: Los datos residen en el estado de React (`useState`) alimentado por datos Mock iniciales (`initialData.ts`). Esto permite probar la aplicación de inmediato sin configuraciones complejas.
*   **Enfoque de Producción**: La arquitectura está diseñada para integrar fácilmente un adaptador de almacenamiento local como `@capacitor/preferences` (para guardar los datos en el almacenamiento interno del dispositivo mediante clave-valor) o Capacitor SQLite (para consultas relacionales SQL locales).

---

## 5. Implementación de Frameworks y Justificaciones Técnicas

### A. React 18 & TypeScript
*   **¿Por qué se eligió?**: React permite construir interfaces web declarativas y eficientes basadas en componentes reutilizables. El uso de TypeScript añade una capa de tipado estricto que elimina el $90\%$ de los errores de asignación de variables en tiempo de escritura.
*   **Cómo se implementó**: Se gestionó un flujo de estado unidireccional centralizado en `App.tsx` que fluye hacia las pestañas mediante propiedades (*Props*). Se usó `useMemo` para optimizar los cálculos del motor de recetas, asegurando que el algoritmo de matching solo se ejecute cuando el inventario de la despensa o la lista de recetas cambie.

### B. Ionic React (`@ionic/react`)
*   **¿Por qué se eligió?**: Ionic provee componentes de UI listos para usar que imitan el comportamiento nativo de los sistemas operativos iOS y Android (botones, barras de navegación, transiciones de pantalla deslizantes). Esto evita tener que diseñar elementos móviles desde cero con CSS.
*   **Cómo se implementó**: Los componentes de Ionic (`IonApp`, `IonContent`, `IonTabs`, `IonTabBar`, `IonTabButton`) estructuran la arquitectura visual de pestañas inferiores, aislando el ciclo de vida de cada vista de forma eficiente.

### C. Capacitor 6 (`@capacitor/core`)
*   **¿Por qué se eligió?**: A diferencia de frameworks como Flutter o React Native, que requieren compilar el código web a widgets nativos propios, Capacitor envuelve la aplicación web estándar (HTML5/CSS/React) dentro de un contenedor WebView nativo ultra optimizado. Esto permite usar bibliotecas de JavaScript puras (como `Html5Qrcode` para la cámara) sin necesidad de adaptadores complejos de Java/Swift, acelerando exponencialmente el tiempo de desarrollo.
*   **Cómo se implementó**: Se configuró en el archivo `capacitor.config.ts` y actúa como puente para inyectar permisos de hardware en Android Studio, compilando la carpeta de distribución web (`dist`) directamente en los recursos nativos del teléfono.

---
*Fin del Informe Técnico.*
