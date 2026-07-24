# Tabla de Pruebas Manuales de Calidad - CocinaCero
*Evidencia de validación de flujos de negocio y lógica de control*

Las siguientes pruebas manuales fueron ejecutadas sobre la versión web local y el dispositivo físico Android compilado para verificar la consistencia del sistema:

| ID | Módulo Evaluado | Entrada / Acción Realizada | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Semáforo de Vencimiento | Alimento ingresado con fecha de vencimiento menor a hoy (ej: ayer). | El estado del producto debe marcarse como `EXPIRED` (Vencido) con color rojo. | El producto muestra una alerta roja con el texto "VENCIDO HACE 1 DÍA". | **Éxito (PASSED)** |
| **02** | Semáforo de Vencimiento | Alimento ingresado con vencimiento en 2 días. | El estado debe ser `CRITICAL` (Crítico) con color naranja y animación pulsante. | Muestra la tarjeta con borde naranja y la animación de urgencia. | **Éxito (PASSED)** |
| **03** | Motor de Recetas | Despensa vacía. | El panel de recetas debe indicar que no hay recetas que se puedan cocinar al 100%. | El sistema muestra recetas indicando "Falta todo" y 0% de coincidencia. | **Éxito (PASSED)** |
| **04** | Motor de Recetas | Despensa contiene: Pollo fresco (Crítico, vence mañana) y Huevos (Óptimo, vence en 15 días). | La receta "Tortilla de Pollo" debe aparecer primera por el Zero-Waste Score alto del pollo. | La receta se posiciona en primer lugar con un Zero-Waste Score de 105 puntos. | **Éxito (PASSED)** |
| **05** | Conversión de Unidades | Receta pide 200g de carne. Inventario tiene registrado 0.5kg de carne. | El motor debe convertir la cantidad y validar que la carne es suficiente. | El ingrediente se marca en verde como disponible y suficiente. | **Éxito (PASSED)** |
| **06** | Escáner QR Local | Escaneo de QR conteniendo: `name=Yogur&quantity=2&unit=unidad&category=lacteos`. | El formulario del modal `AddFoodModal` debe autocompletarse con esos valores. | El modal se abre con los campos de nombre, cantidad, unidad y categoría rellenos. | **Éxito (PASSED)** |
| **07** | Incremento de Cantidades | Presionar botón `+` en un producto medido en kilogramos (`kg`). | El valor debe aumentar exactamente de 0.1 en 0.1 sin errores de decimales. | Aumenta en fracciones limpias (ej: 1.5 kg, 1.6 kg, 1.7 kg). | **Éxito (PASSED)** |
| **08** | Permisos de Cámara | Apertura inicial de la app en celular Android por primera vez. | Debe dispararse el diálogo nativo de permisos de cámara del sistema operativo. | Aparece el diálogo de Android preguntando: "¿Permitir que CocinaCero use la cámara?". | **Éxito (PASSED)** |
| **09** | Barra de Búsqueda | Escribir la letra "p" en la barra de búsqueda de la despensa. | El icono de la lupa debe ocultarse de inmediato para no traslaparse con el texto. | La lupa desaparece y el texto ingresado se muestra perfectamente alineado. | **Éxito (PASSED)** |
