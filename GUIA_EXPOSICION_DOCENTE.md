# GUÍA DE EXPOSICIÓN ACADÉMICA: COCINACERO
*Estructura de diapositivas, puntos clave de defensa técnica y guion para la presentación frente al docente*

---

## Ficha del Proyecto para Evaluación
*   **Título del Proyecto**: CocinaCero
*   **Categoría**: Aplicación Móvil Híbrida / Gestión de Inventarios Inteligentes.
*   **Enfoque Académico**: Ingeniería de Software, Patrones de Arquitectura, Algoritmos de Optimización.
*   **Objetivo de la Exposición**: Demostrar la viabilidad del software, justificar las decisiones tecnológicas y detallar la resolución de desafíos lógicos (desperdicio, precisión, hardware).

---

## Estructura de la Presentación (Diapositiva por Diapositiva)

---

### Diapositiva 1: Portada y Presentación General
*   **Título**: CocinaCero: Gestión de Despensa Inteligente y Reducción del Desperdicio.
*   **Subtítulo**: Solución tecnológica híbrida basada en React, Ionic y Capacitor para incentivar la cocina *Zero-Waste*.
*   **Puntos Clave a Explicar**:
    *   Presentación de los integrantes y el propósito principal de la app: combatir el desperdicio de comida doméstico usando un motor lógico que conecta lo que el usuario tiene con lo que puede cocinar.

---

### Diapositiva 2: El Problema de Investigación (Justificación)
*   **Título**: El Problema del Desperdicio Alimentario.
*   **Contenido Visual**: Gráfica o lista de puntos sobre el desperdicio en hogares.
*   **Puntos Clave a Explicar**:
    *   **Pérdida Económica**: Las familias compran alimentos que terminan olvidando y desechando.
    *   **Falta de Información**: Los usuarios no tienen un registro visual claro de qué vence primero.
    *   **Inacción**: A veces el usuario tiene ingredientes, pero al no saber qué receta preparar con ellos, prefiere comprar comida nueva o comer algo rápido, dejando vencer lo guardado.

---

### Diapositiva 3: La Solución Propuesta: CocinaCero
*   **Título**: Arquitectura de la Solución.
*   **Contenido Visual**: Capturas de pantalla del Dashboard y la Despensa.
*   **Puntos Clave a Explicar**:
    *   **Dashboard Inteligente**: Indicadores clave de rendimiento (KPIs) sobre valor rescatado, total de ítems y alerta rápida.
    *   **Semáforo de Vencimiento**: Clasificación dinámica por colores: *Crítico* (0-2 días), *Advertencia* (3-5 días), *Óptimo* (buen estado) y *Vencido*.
    *   **Ingreso Agilizado**: Escáner de cámara integrado capaz de leer códigos de barra comerciales (API de Open Food Facts) y códigos QR rápidos.

---

### Diapositiva 4: Arquitectura y Decisiones Tecnológicas (Defensa Técnica)
*   **Título**: Pila Tecnológica (Stack) y Arquitectura de Software.
*   **Contenido Visual**: Diagrama de bloques (Cliente Híbrido -> Capacitor Bridge -> APIs Nativas).
*   **Puntos Clave a Explicar (Preguntas Frecuentes del Docente)**:
    *   **¿Por qué React + TypeScript?**: Renderizado dinámico, reutilización de componentes y tipado estricto que reduce errores en producción.
    *   **¿Por qué Ionic React?**: Ofrece componentes visuales listos para simular el comportamiento y look nativo de iOS y Android en una WebView.
    *   **¿Por qué Capacitor 6?**: En lugar de usar soluciones como Flutter que requieren reescribir todo, Capacitor envuelve nuestra web React en un contenedor WebView Android nativo de alto rendimiento. Permite usar APIs puras de JavaScript y acceder a la cámara mediante TypeScript sin wrappers complejos.

---

### Diapositiva 5: El Algoritmo Central: Recipe Matcher (El Cerebro de la App)
*   **Título**: Motor de Recomendación y Puntuación Zero-Waste.
*   **Contenido Visual**: Fórmulas matemáticas del algoritmo.
*   **Puntos Clave a Explicar**:
    *   **Normalización de Texto**: El motor elimina tildes, mayúsculas y plurales (ej. "Zanahorias" -> "zanahoria") para cruzar ingredientes sin errores gramaticales.
    *   **Conversión de Unidades**: Convierte automáticamente unidades compatibles (ej. kilogramos a gramos) antes de evaluar disponibilidad.
    *   **Fórmula del Zero-Waste Score**:
        $$\text{Puntaje} = \sum (\text{Puntaje de Urgencia del Ingrediente})$$
        *Donde un ingrediente Crítico aporta +50 puntos, uno en Advertencia +20, y uno Óptimo +5.*
    *   **Criterio de Ordenamiento**: El sistema ordena primero las recetas 100% cocinables, y dentro de ellas, prioriza las que tienen mayor puntaje Zero-Waste, obligando al usuario a consumir primero lo que está por vencer.

---

### Diapositiva 6: Flujos de Datos e Integración de Escaneo
*   **Título**: Lector Multiprotocolo de Códigos de Barras y QR.
*   **Contenido Visual**: Flujo de decodificación QR (Query String vs JSON).
*   **Puntos Clave a Explicar**:
    *   **Integración Comercial**: Consulta asíncrona mediante Fetch a la base de datos mundial de Open Food Facts.
    *   **Inferencia Semántica**: La app lee el nombre o las etiquetas y deduce a qué categoría pertenece (ej. si la etiqueta dice "queso", deduce que es *lacteos* y asigna automáticamente 7 días sugeridos de vida útil).
    *   **Códigos QR Rápidos**: Formatos simplificados de Query String (ej. `name=Leche&quantity=1&unit=l&expirationDays=7`) pensados para que comercios locales puedan imprimir etiquetas autocompletables para el usuario.

---

### Diapositiva 7: Desafíos Técnicos Resueltos (Debugging & Calidad)
*   **Título**: Control de Calidad y Solución de Bugs.
*   **Contenido Visual**: Antes y Después de los bugs solucionados.
*   **Puntos Clave a Explicar**:
    *   **Bug de Incremento de Cantidades**: Corregimos un fallo donde la cantidad se modificaba un 25% exponencialmente. Lo cambiamos por incrementos fijos inteligentes basados en la unidad de medida (100g para gramos, 0.1kg para kilos, 1 para unidades) y aplicamos redondeos a 2 decimales para eliminar errores de precisión flotante de JavaScript.
    *   **Permiso Preventivo de Cámara**: Solucionamos la falta de permisos de cámara en Android disparando la solicitud 1 segundo después de iniciar la aplicación en segundo plano. Esto asegura que la cámara arranque instantáneamente cuando el usuario abra el lector.
    *   **Fallo Visual en Búsqueda**: Corregimos el solapamiento del texto sobre la lupa ocultándola dinámicamente al escribir y usando una clase CSS `.search-input` para forzar el padding correcto.

---

### Diapositiva 8: Estrategia de Pruebas Unitarias
*   **Título**: Aseguramiento de Calidad (Testing).
*   **Contenido Visual**: Lista de pruebas ejecutadas con Vitest.
*   **Puntos Clave a Explicar**:
    *   Se implementó una suite de pruebas automatizadas con **Vitest**.
    *   **Pruebas de Vencimiento**: Verifican que el cálculo de días y el semáforo arrojen el estado correcto (ej. si la fecha fue ayer, el estado debe ser estrictamente `EXPIRED`).
    *   **Pruebas del Recomendador de Recetas**: Validan que las conversiones de kilogramos a gramos funcionen y que las recetas se ordenen correctamente por urgencia de ingredientes.
    *   *Muestra de Éxito*: 16 pruebas unitarias integradas y pasando con éxito (0 fallos).

---

### Diapositiva 9: Conclusión y Trabajo Futuro
*   **Título**: Conclusiones y Escalabilidad.
*   **Puntos Clave a Explicar**:
    *   **Viabilidad**: La combinación de tecnologías híbridas es viable y reduce los tiempos de desarrollo para startups y proyectos académicos.
    *   **Trabajo Futuro**:
        1.  Persistencia local usando Capacitor SQLite para evitar la volatilidad de la memoria React.
        2.  Sincronización en la nube mediante Supabase (PostgreSQL) para cuentas compartidas.
        3.  Notificaciones push locales en Android cuando un alimento entre en estado crítico.

---

## Consejos para Defender el Proyecto Frente al Docente

1.  **Enfócate en la Lógica**: Los docentes de informática valoran más la lógica detrás de la aplicación que el diseño estético. Explica con orgullo el algoritmo de **Zero-Waste Score** y cómo funciona la comparación e indexación mediante `Map` en TypeScript para mejorar el rendimiento ($O(1)$ frente a $O(N^2)$).
2.  **Muestra las Pruebas Unitarias**: Correr los tests en vivo (`npm test`) demuestra profesionalismo y que la aplicación ha sido diseñada con metodologías de desarrollo de software modernas.
3.  **Justifica la APK nativa**: Explica que el compilador se automatizó en un script `.bat` y que Capacitor empaqueta de forma directa, permitiendo el despliegue nativo físico en celulares Android mediante Gradle de forma transparente.
