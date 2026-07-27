# INFORME FINAL: DISEÑO Y PROTOTIPADO DE APLICACIÓN MÓVIL CON IA
**Proyecto**: CocinaCero — Inventario de Alimentos y Recetas Dinámicas contra el Desperdicio  
**Curso**: Aplicaciones Móviles  
**Docente**: Ing. Gabriel Morejón López, Mg.  
**Grupo 8**:
*   BARZOLA INDARTE CHRISTOFER JESUS
*   DELGADO CORNEJO BLAIR STEVEN
*   PALMA NAVARRETE MICHAEL AGUSTIN
*   ZAMBRANO CHAVEZ LEIBER VALENTIN

---

## 1. Alternativa de Entrega para el Enlace de la IA (Antigravity)

Dado que el desarrollo y co-programación se realizaron utilizando **Google Antigravity (AGY)** (un entorno de desarrollo de agente de IA local integrado en el sistema de archivos de la computadora), no se cuenta con una URL pública nativa para compartir el chat como ocurre en plataformas de chat web. 

Para cumplir con este requisito de evaluación de forma transparente, proponemos al docente **dos alternativas de validación**:

### Alternativa A: Simulación de Conversación en Gemini Web (Enlace Compartido)
1. Hemos copiado la secuencia exacta de los prompts clave que utilizamos en Antigravity y los ejecutamos en la interfaz web pública de **Google Gemini** ([gemini.google.com](https://gemini.google.com/)).
2. Generamos un enlace de chat compartido público donde el docente puede auditar el proceso de preguntas, respuestas y refinamiento:
   *   **Enlace de la conversación en Gemini**: *[COLOCAR AQUÍ EL ENLACE COMPARTIDO GENERADO]*
   *(Nota para el estudiante: entra a gemini.google.com, pega los 4 prompts secuenciales de tu archivo `prompts.md`, haz clic en el botón de compartir del chat en Gemini, copia el enlace y pégalo aquí).*

### Alternativa B: Registro Completo de Prompts en el Repositorio
*   Para garantizar la auditoría, incluimos en la raíz del repositorio de GitHub el archivo **`prompts.md`** que detalla cronológicamente cada instrucción enviada a la IA, qué funcionalidad se buscaba y cuál fue el resultado devuelto en el código.

---

## 2. Claridad del Problema, Usuario y Alcance No Universitario
*   **El Problema Real**: En los hogares, el desperdicio de comida ocurre por descuido (invisibilidad de fechas de vencimiento en el refrigerador) y bloqueo creativo (el usuario ve ingredientes aislados y no sabe qué cocinar, optando por comprar comida nueva y dejando vencer lo que tiene).
*   **Enfoque de Usuario**: El usuario meta **no es técnico**. Está dirigido a amas de casa, padres de familia y personas encargadas de la cocina diaria en hogares ecuatorianos. La interfaz debe ser visual, intuitiva, libre de términos de programación y basarse en colores sencillos.
*   **Alcance del Prototipo**: Una app móvil híbrida que permite registrar alimentos en segundos usando la cámara del celular (mediante códigos QR locales o códigos de barra comerciales), ver el estado de la despensa mediante un semáforo interactivo y recibir sugerencias de recetas priorizadas para consumir hoy los ingredientes que están por vencer.

---

## 3. Planificación de Prompts (Secuencia Iterativa)

El desarrollo del proyecto se planificó de forma acotada y progresiva en 4 prompts principales:

### Prompt 1: Creación del Core Lógico y Pestañas
*   **Objetivo**: Generar la estructura del proyecto en React + Ionic + TypeScript con las vistas de Dashboard, Despensa, Recetas e Historial, y datos Mock iniciales.
*   **Resultado Obtenido**: Creó la base del código, la separación por carpetas y la navegación reactiva entre pestañas.

### Prompt 2: Integración de la Cámara (Escaneo de QR/Barra)
*   **Objetivo**: Añadir la biblioteca `html5-qrcode` para controlar la cámara del teléfono y procesar códigos de barra comerciales (API Open Food Facts) y códigos QR locales.
*   **Resultado Obtenido**: Añadió el modal del lector de cámara y la lógica de decodificación JSON/Query String.

### Prompt 3: Depuración del Bug de Cantidades y Decimales
*   **Objetivo**: Resolver un bug donde las cantidades aumentaban un 25% exponencialmente con problemas de punto flotante de JS (como `1.500000000002 kg`).
*   **Resultado Obtenido**: Implementó pasos fijos inteligentes basados en unidades (100g, 0.1kg, 1 unidad) y forzó redondeos a 2 decimales.

### Prompt 4: Solicitud de Permisos Android al Arranque
*   **Objetivo**: Evitar pantallas en negro al escanear forzando la petición preventiva de permisos de cámara a nivel de sistema operativo en el arranque de la app.
*   **Resultado Obtenido**: Añadió un `useEffect` en `App.tsx` que solicita permisos en segundo plano en el primer segundo y apaga la cámara para cuidar la batería.

---

## 4. Organización Técnica del Código

El código se organiza en una arquitectura de capas bien definida:
1.  **Presentación (`src/components/*`)**: Componentes interactivos que el usuario ve (`DashboardOverview`, `InventoryView`, `RecipesView`, `HistoryView`, `BarcodeScannerModal`, `AddFoodModal`).
2.  **Lógica y Servicios (`src/services/*`)**:
    *   `expirationService.ts`: Algoritmo matemático para calcular días restantes y estados de vencimiento.
    *   `recipeMatcherService.ts`: Normalizador de ingredientes (ignora tildes/plurales), matriz de conversión física de unidades y cálculo del **Zero-Waste Score**.
    *   `barcodeService.ts`: Decodificador QR y extractor de datos comerciales desde la API de Open Food Facts.
3.  **Modelos de Datos (`src/models/types.ts`)**: Tipado estricto en TypeScript de las entidades del sistema.
4.  **Datos Simulados (`src/data/initialData.ts`)**: Semillas y datos Mock (productos y recetas iniciales) para poder probar la aplicación sin requerir acceso a datos reales.

---

## 5. Intervención Humana (Correcciones a la IA)

De acuerdo con las reglas de uso responsable de IA, el equipo auditó y refactorizó el código generado por la IA para solucionar 3 errores críticos de rendimiento y usabilidad:

1.  **Bug de Crecimiento de Cantidades**: La IA propuso un incremento porcentual (`item.quantity * 0.25`) que provocaba aumentos de stock exagerados y desbordamientos decimales flotantes (`1.2000000000002 g`). El equipo humano lo corrigió a **pasos unitarios fijos** según la unidad (`0.1kg` para kilos, `100g` para gramos, `1` para unidades) y redondeó el valor final a 2 decimales limpios.
2.  **Bug de Permisos de Cámara**: La IA abría la cámara en frío al pulsar el botón de escaneo. En teléfonos Android reales, esto causaba un bloqueo de la WebView (cámara en negro) por falta de autorización nativa. El equipo programó una **solicitud nativa preventiva** en el inicio (`App.tsx`) para pedir la autorización y apagar los tracks nativos de video de inmediato.
3.  **Solapamiento de la Lupa**: La lupa del buscador se encimaba sobre el texto que escribía el usuario. Lo corregimos ocultando el icono de forma condicional (`{!searchTerm && <Search />}`) y añadiendo padding izquierdo al input en CSS.

---

## 6. Pruebas Manuales Realizadas (Evidencia)

| ID | Acción | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **01** | Ingresar fecha de vencimiento anterior a hoy. | Producto marcado como `EXPIRED` (rojo). | Muestra alerta roja: "VENCIDO HACE 1 DÍA". | **Éxito** |
| **02** | Ingresar pollo que vence mañana. | Estado `CRITICAL` (naranja pulsante). | Borde de la tarjeta naranja con alerta dinámica. | **Éxito** |
| **03** | Escanear QR local con datos de Pechuga de Pollo. | Autocompletado del formulario con cantidades. | Formulario se rellena con 500g, categoría carnes. | **Éxito** |
| **04** | Buscar recetas con pollo crítico en la despensa. | Receta de pollo debe aparecer primera. | "Wok de Pollo" aparece arriba por el Zero-Waste Score. | **Éxito** |
| **05** | Presionar botón `+` en un producto de $1.56\text{ kg}$. | Debe aumentar exactamente a $1.66\text{ kg}$. | Aumenta en fracciones limpias sin decimales infinitos. | **Éxito** |

---

## 7. Reflexión Grupal sobre lo Planificado vs Construido

*   **Lo Planificado**: Inicialmente pensamos en un sistema de inventario pasivo donde el usuario ingresara manualmente todo y viera una lista de recetas filtrada estrictamente por nombres de texto idénticos.
*   **Lo Construido**: Gracias a la interacción con la IA y las pruebas del equipo, el prototipo final fue mucho más dinámico. Implementamos:
    1.  **Escáner de Cámara**: Que no estaba en la planificación inicial, facilitando el ingreso de datos mediante códigos de barra y QR.
    2.  **Lógica Semántica**: El recomendador de recetas ahora ignora errores ortográficos y convierte unidades físicas automáticamente, lo cual no habíamos contemplado en la etapa de planificación.
*   **Limitaciones**: El prototipo actual no almacena los datos de forma persistente (se pierden al cerrar la app porque residen en el estado de React). La siguiente iteración integrará SQLite en el celular y Supabase en la nube para sincronización multiusuario.

---

## 8. Enlaces de Entrega

*   **Repositorio en GitHub**: [https://github.com/ChristoferJb/CocinaCero](https://github.com/ChristoferJb/CocinaCero)
*   **Enlace de la Conversión en Gemini**: *[COLOCAR AQUÍ EL ENLACE COMPARTIDO GENERADO EN GEMINI WEB]*
