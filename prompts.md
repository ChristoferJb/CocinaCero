# Registro de Prompts de Inteligencia Artificial
*Evidencia del flujo de trabajo iterativo para la creación y depuración de CocinaCero*

Este documento registra los prompts clave utilizados durante el ciclo de vida del proyecto para la generación de código, adición de funcionalidades y corrección de errores mediante Inteligencia Artificial.

---

## 1. Prompt Inicial (Creación del Núcleo)
* **Objetivo**: Generar la estructura base de la aplicación React + Ionic con lógica de semáforo de fechas e ingredientes.
* **Prompt Utilizado**:
  > *"Actúa como un arquitecto frontend. Genera una SPA en React 18 utilizando Ionic React y TypeScript. La aplicación se llamará CocinaCero y servirá para gestionar el inventario de despensa doméstico y reducir el desperdicio. 
  > Debe tener 4 vistas principales en pestañas inferiores: Resumen/Dashboard (con estadísticas en dinero de desperdicio), Despensa (con semáforo de colores según vencimiento), Recetas (sugerencias ordenadas por ingredientes disponibles) e Historial. 
  > Estructura la aplicación dividiendo la interfaz de la lógica de negocio en archivos TS puros. Crea datos simulados iniciales (Yogur, Pollo, Huevos) para poder usar la app de inmediato."*

---

## 2. Prompt Iterativo (Integración del Escáner de Cámara y QR)
* **Objetivo**: Integrar el lector de cámara web nativo usando `html5-qrcode` y configurar el soporte de códigos QR con datos autocompletables.
* **Prompt Utilizado**:
  > *"Agrega una funcionalidad de escaneo de cámara trasera a la aplicación. Utiliza la librería html5-qrcode. 
  > Si el usuario escanea un código de barras de supermercado, realiza una llamada fetch a la API pública de Open Food Facts para buscar el producto. 
  > Si escanea un código QR, debes decodificarlo localmente offline. El QR puede venir en formato JSON o en formato Query String (ej: name=Pollo&quantity=500&unit=g&category=carnes_pescados). 
  > Si la decodificación tiene éxito, autocompleta el formulario del modal de registro de alimento."*

---

## 3. Prompt de Depuración (Corrección de Bug de Cantidad y Punto Flotante)
* **Objetivo**: Corregir el bug donde la cantidad crecía un 25% exponencialmente con errores de desbordamiento de decimales.
* **Prompt Utilizado**:
  > *"Hay un problema crítico al actualizar cantidades con los botones '+' y '-' en el inventario. El código actual calcula el cambio con 'item.quantity * 0.25', lo que provoca que los números aumenten demasiado rápido de forma exponencial. Además, hay errores de punto flotante en JavaScript (como 1.20000000000002). 
  > Modifica la lógica para que los incrementos sean de paso fijo según la unidad de medida: 100g para gramos/mililitros, 0.1kg para kilogramos/litros, y 1 para unidades discretas. Asegúrate de redondear el resultado a un máximo de 2 decimales para evitar problemas de precisión en pantalla."*

---

## 4. Prompt de Depuración (Cámara y Permisos en Android)
* **Objetivo**: Resolver el fallo en celulares donde la cámara no iniciaba debido a permisos denegados de inicio.
* **Prompt Utilizado**:
  > *"En la app instalada en el celular pasa un error: al abrir el escáner la cámara se queda en negro o falla porque no se solicitó el permiso del sistema operativo Android previamente. 
  > Modifica la app para que solicite el permiso de cámara preventivamente al abrir la aplicación por primera vez en segundo plano, y detenga el flujo de hardware inmediatamente después para no gastar batería de fondo."*
