# INFORME TÉCNICO DE DESARROLLO Y FUNCIONAMIENTO: COCINACERO
**Proyecto**: CocinaCero — Sistema de Inventario y Recomendador de Recetas Inteligente  
**Materia**: Aplicaciones Móviles  
**Integrantes - Grupo 8**: Barzola C., Delgado B., Palma M., Zambrano L.

---

## PARTE 1: ESTRUCTURA GENERAL DEL PROYECTO (ARQUITECTURA)

La aplicación **CocinaCero** está construida sobre un stack híbrido utilizando **React 18**, **Ionic React**, y **Capacitor 6** para su despliegue en Android. El código sigue un modelo de arquitectura limpia desacoplada por capas:

```text
src/
├── models/
│   └── types.ts                # Capa de Tipos: interfaces estrictas para Alimentos y Recetas.
├── data/
│   └── initialData.ts          # Semillas de Datos: recetas iniciales e ingredientes de prueba.
├── services/                   # Capa de Lógica: algoritmos aislados testeables.
│   ├── expirationService.ts    # Motor matemático de cálculo de vencimiento y colores.
│   ├── recipeMatcherService.ts # Comparador de despensa, conversión física y Zero-Waste Score.
│   └── barcodeService.ts       # Consumo de la API de Open Food Facts y decodificación QR.
├── components/                 # Capa UI: vistas principales e interfaces modales.
│   ├── DashboardOverview.tsx   # Panel de control de desperdicios y métricas financieras.
│   ├── InventoryView.tsx       # Despensa interactiva y filtros.
│   ├── RecipesView.tsx         # Recomendador inteligente de platos.
│   ├── HistoryView.tsx         # Historial acumulado de consumo y desperdicio.
│   └── BarcodeScannerModal.tsx # Lector de hardware nativo de cámara trasera.
└── App.tsx                     # Gestor de Estado y flujos generales de la aplicación.
```

---

## PARTE 2: FUNCIONALIDADES Y FUNCIONAMIENTO DE LA APP

### A. Dashboard Informativo (Panel Resumen)
*   **Métricas Financieras de Desperdicio**: Estima el valor económico en dólares de los productos que se vencieron sin consumirse, motivando al usuario a salvar ingredientes.
*   **KPIs de Estado**: Agrupa visualmente el total de productos en inventario dividiéndolos en óptimos, próximos a vencer y vencidos.

### B. Despensa y Semáforo de Expiración Dinámico
El inventario utiliza un semáforo de colores inteligente basado en la fecha de vencimiento configurada:
*   🔴 **Rojo (Expired)**: El producto ya pasó su fecha de vencimiento. Aparece el tag *"Vencido hace X días"*.
*   🟠 **Naranja (Critical)**: Vence en 2 días o menos. La tarjeta adquiere una animación pulsante de advertencia para forzar su consumo.
*   🟡 **Amarillo (Warning)**: Vence entre 3 y 5 días. Indica consumo prioritario a mediano plazo.
*   🟢 **Verde (Good)**: Vence en más de 5 días. Estado óptimo.

### C. Escáner de Cámara Multiprotocolo (QR e Info Comercial)
*   **Escanear Códigos de Barras Comerciales**: El lector de cámara consulta la API internacional *Open Food Facts* de forma asíncrona. Si el producto existe, extrae el nombre comercial, peso y deduce automáticamente la categoría de comida y los días sugeridos de vida útil (ej: carnes = 3 días).
*   **Escanear Códigos QR Propios (Offline)**: Para alimentos que no tienen envase de supermercado (comida casera, granel), el lector decodifica cadenas de texto en formato *Query String* (ej. `name=Pollo&quantity=1.5&unit=kg&category=carnes_pescados&expirationDays=3`), autocompletando todo el formulario al instante sin requerir internet.

### D. Motor Recomendador con "Zero-Waste Score"
A diferencia de un buscador de recetas tradicional que solo filtra por coincidencia exacta de texto, el motor de CocinaCero realiza:
1.  **Limpieza Semántica**: Remueve tildes, convierte a minúsculas y singulariza las palabras (ej. *"Huevos"* se compara como *"huevo"*).
2.  **Conversión de Unidades**: Si una receta pide $200\text{ g}$ de carne y tienes $0.5\text{ kg}$, el servicio convierte los kilogramos a gramos matemáticamente y determina si tienes cantidad suficiente para cocinar el plato.
3.  **Puntaje de Rescate (Zero-Waste Score)**: Ordena las recetas no solo por porcentaje de ingredientes listos, sino por prioridad de urgencia. Las recetas que utilicen insumos en estado crítico (naranja) ganan $+50$ puntos extras, colocándose arriba en el listado para incentivar al usuario a cocinar ese plato hoy.

---

## PARTE 3: APORTES DE LA IA VS INTERVENCIÓN HUMANA (BUGS RESUELTOS)

Durante el ciclo de desarrollo, la Inteligencia Artificial facilitó la estructura de interfaces y plantillas de funciones. Sin embargo, el equipo de desarrollo humano tuvo que intervenir y reprogramar secciones críticas para solucionar fallos que impedían la usabilidad del software:

### 1. Control del Bug de Crecimiento de Cantidades y Decimales
*   **Qué hizo la IA**: Programó que los botones `+` y `-` del inventario modificaran la cantidad multiplicando por un $25\%$ del valor actual.
*   **Fallo causado**: Provocaba que los productos aumentaran exponencialmente y con números decimales de precisión infinita en JavaScript (como `1.50000000000002 kg`).
*   **Solución humana**: Reemplazamos la lógica por **pasos unitarios fijos** según el tipo de medida del producto (gramos/ml avanzan de $100$ en $100$; kilogramos/litros avanzan de $0.1$ en $0.1$; unidades avanzan de $1$ en $1$). Adicionalmente, forzamos un redondeo de sanitización `Math.round(newQty * 100) / 100` para asegurar que el peso decimal se muestre limpio (ej. `1.56 kg`).

### 2. Error de Bloqueo de Cámara (Pantalla en Negro en Celulares)
*   **Qué hizo la IA**: Programó la cámara para iniciarse directamente al abrir el modal de escaneo.
*   **Fallo causado**: En dispositivos Android reales, Capacitor no solicitaba los permisos de hardware a tiempo, provocando que la cámara se bloqueara con la pantalla en negro.
*   **Solución humana**: Programamos un activador preventivo asíncrono con `useEffect` que corre 1 segundo después del inicio general de la app (`App.tsx`), disparando la ventana nativa de solicitud de permisos y apagando inmediatamente los tracks nativos de video para evitar el drenaje de batería.

### 3. Solapamiento Estético del Buscador
*   **Qué hizo la IA**: Creó un buscador de texto estático con un icono de lupa flotante.
*   **Fallo causado**: Al escribir palabras largas, las letras se sobreponían al icono de la lupa por un conflicto de paddings y posicionamiento absoluto en CSS.
*   **Solución humana**: Modificamos el componente en `InventoryView.tsx` para ocultar dinámicamente la lupa cuando se detecta texto en el buscador (`{!searchTerm && <Search />}`) y creamos clases de padding específicos en el archivo `index.css`.

---

## PARTE 4: MANUAL DE COMPILACIÓN Y AUTOMATIZACIÓN DE APK

Para distribuir y probar el prototipo en celulares Android reales, el equipo implementó un pipeline de compilación automatizado:

### El script de construcción (`build-apk.bat`)
Para evitar ejecutar comandos repetitivos en terminales distintas, se programó un archivo script por lotes que realiza los siguientes pasos en secuencia:
1.  **`npm run build`**: Compila y optimiza el código de React en un bundle web de producción dentro de la carpeta `dist`.
2.  **`npx cap sync android`**: Sincroniza los recursos web compilados dentro del contenedor de la app nativa de Android de Capacitor.
3.  **`cd android && gradlew assembleDebug`**: Ejecuta el motor Gradle de Android en segundo plano para compilar los scripts Java/Kotlin nativos de Capacitor y empaquetar el ejecutable de desarrollo utilizando la JDK 17 instalada.
4.  **Copiado del Ejecutable**: Copia y renombra el archivo `app-debug.apk` resultante de la carpeta interna de Gradle a la raíz del proyecto como `CocinaCero.apk`.

---

## PARTE 5: ESTRATEGIA DE PRUEBAS Y VALIDACIÓN (TESTING AUTOMATIZADO)

El proyecto cuenta con una suite de pruebas unitarias automáticas mediante **Vitest** ubicadas en la carpeta `/tests` para garantizar que cambios futuros en el frontend no rompan la lógica matemática de la aplicación:

*   **`expirationService.test.ts`**: Valida que las diferencias en milisegundos de tiempo se mapeen al estado de semáforo adecuado y devuelvan las etiquetas de días correctas.
*   **`recipeMatcherService.test.ts`**: Valida que la normalización fonética ignore tildes, que el sistema de conversiones de unidades sume correctamente las fracciones de inventario y que la ordenación del score de desperdicio priorice los ingredientes en peligro de caducidad.
