# Gestor_Restaurantes-CCTEPT

**Nota:**

Este proyecto fue desarrollado con fines didácticos, orientado al aprendizaje y aplicación práctica de una arquitectura basada en microservicios. Forma parte de la aplicación **Savora**, la cual está compuesta por una serie de servicios independientes que se comunican entre sí, manteniendo autonomía y separación de responsabilidades conforme a los principios de arquitectura distribuida.


# Estructura del Proyecto

La solución está organizada bajo un enfoque de microservicios, donde cada servicio mantiene su propia estructura interna y responsabilidad claramente definida.

Raíz del Proyecto
.
├── authentication-service/
│   └── src/
│       ├── UserService.Api/
│       ├── UserService.Application/
│       ├── UserService.Domain/
│       └── UserService.Persistence/
│
├── restaurant-management/
│   ├── configs/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/

---

## authentication-service/

Microservicio desarrollado en ASP.NET Core bajo el enfoque de **Clean Architecture**.

### src/

Contiene los proyectos que conforman las distintas capas de la arquitectura.

### UserService.Api/

Capa de presentación.

Responsable de exponer los endpoints HTTP, manejar solicitudes y respuestas, configurar middlewares y definir el punto de entrada del servicio.

### UserService.Application/

Capa de aplicación.

Contiene los casos de uso, servicios de aplicación, interfaces y DTOs.

Aquí se orquesta la lógica del negocio sin depender de infraestructura.

### UserService.Domain/

Capa de dominio.

Define las entidades centrales, enumeraciones, constantes y contratos fundamentales del sistema.

Aquí residen las reglas de negocio puras.

### UserService.Persistence/

Capa de infraestructura y acceso a datos.

Incluye configuración del contexto de base de datos, migraciones y repositorios encargados de la persistencia.

---

## restaurant-management/

Microservicio desarrollado en Node.js con separación modular por responsabilidades.

### configs/

Contiene configuraciones del entorno, conexión a base de datos y parámetros globales del servicio.

### models/

Define los esquemas y estructuras de datos que representan las entidades del dominio (restaurantes, menús, categorías, etc.).

### routes/

Define las rutas de la API y la asociación con los controladores correspondientes.

### services/

Contiene la lógica de negocio y procesamiento de datos antes de interactuar con los modelos.

### utils/

Funciones auxiliares y utilidades reutilizables dentro del servicio.

**Objetivo del Sistema**

El objetivo del sistema es permitir el registro y gestión de distintos tipos de restaurantes, especialmente del segmento gourmet, dentro de una plataforma centralizada.

La aplicación permite que múltiples restaurantes se integren al sistema, mientras que los clientes pueden buscar establecimientos, realizar reservas y efectuar pedidos desde la plataforma.

El sistema actúa como una capa de supervisión y control, administrando la información operativa, los usuarios y la actividad generada dentro del ecosistema.

La aplicación contempla tres roles principales:

- **Cliente**
- **Administrador de Restaurante**
- **Administrador de Plataforma**

Cada rol posee responsabilidades y permisos específicos definidos según su nivel de acceso dentro del sistema.

---

## DESCRIPCION

## Servicio de Usuarios y Estadísticas

El Servicio de Usuarios y Estadísticas es responsable de la gestión de clientes y administradores dentro del sistema, incluyendo la definición de roles y permisos asociados a cada tipo de usuario.

Su objetivo principal es permitir el registro, autenticación y administración eficiente de usuarios, garantizando la correcta asignación de roles y el control de acceso según las responsabilidades definidas en la plataforma.

Este servicio está desarrollado bajo el enfoque de **Clean Architecture**, estructurado en las siguientes capas:

- **API:** Encargada de la exposición de endpoints y manejo de solicitudes HTTP.
- **Application:** Contiene la lógica de negocio y casos de uso del sistema.
- **Domain:** Define las entidades, reglas de negocio y contratos centrales.
- **Persistence:** Responsable del acceso a datos y la implementación de repositorios.

---

## Servicio de Gestión de Restaurantes y Menús

El Servicio de Gestión de Restaurantes y Menús es responsable de la administración integral de los establecimientos registrados dentro de la plataforma.

Su objetivo principal es permitir:

- Registro y administración de restaurantes
- Gestión de categorías
- Creación y mantenimiento de menús y platos
- Control de disponibilidad
- Administración de reservaciones asociadas a cada restaurante

Este servicio fue desarrollado en **Node.js**, utilizando librerías y frameworks que facilitan la estructuración de controladores, el manejo de rutas y la interacción con los modelos de datos.

Contempla la implementación de un **CRUD completo** orientado a los administradores de restaurantes, permitiéndoles gestionar su información operativa dentro de la plataforma de forma independiente y controlada.

La arquitectura del servicio está diseñada para mantener una separación clara entre controladores, lógica de negocio y modelos, favoreciendo la escalabilidad y mantenibilidad del sistema.

---

## Arquitectura General

La plataforma está diseñada bajo una **arquitectura basada en microservicios**, donde cada servicio cumple una responsabilidad específica dentro del sistema, respetando el principio de **responsabilidad única** y favoreciendo la separación de dominios.

Este enfoque permite mejorar la **escalabilidad horizontal**, facilitar el mantenimiento y reducir el acoplamiento entre componentes. De esta manera, si un microservicio presenta fallas, el impacto sobre el resto del sistema se minimiza, garantizando mayor resiliencia y disponibilidad.

El **microservicio de Usuarios** fue desarrollado utilizando ASP.NET Core, aprovechando su robustez, seguridad y facilidad de integración con mecanismos de autenticación y autorización.

Por otro lado, el microservicio de **Gestión de Restaurantes y Menús** fue implementado con Node.js, lo que permite una gestión eficiente de operaciones asincrónicas y mejora el rendimiento en escenarios con alta concurrencia, contribuyendo a una arquitectura más flexible y escalable.

---

## Gestion de Datos

Cada microservicio dispone de su **base de datos independiente**, siguiendo el principio de *Database per Service*, lo que garantiza un **aislamiento completo del dominio y de la persistencia de datos**. Esta separación evita el acoplamiento a nivel de almacenamiento y permite que cada servicio pueda evolucionar, escalar o modificarse sin afectar directamente a los demás.

La comunicación entre microservicios se realiza exclusivamente a través de **APIs bien definidas**, generalmente mediante protocolos HTTP/REST, asegurando contratos claros y controlados entre servicios.

Este enfoque fortalece la **autonomía de los servicios**, mejora la resiliencia del sistema y contribuye a una arquitectura más robusta, mantenible y alineada con buenas prácticas de diseño distribuido.

---

## Tecnologías Utilizadas

### Backend

Para el desarrollo del backend se adoptó un enfoque **políglota**, seleccionando tecnologías según las necesidades específicas de cada dominio.

El microservicio de usuarios fue implementado con ASP.NET Core, aprovechando su alto rendimiento, tipado fuerte y facilidad para integrar mecanismos de autenticación, autorización y validaciones robustas. Esta tecnología resulta especialmente adecuada para dominios donde la seguridad y la integridad de datos son críticas.

Por otro lado, el microservicio de gestión de restaurantes y menús fue desarrollado con Node.js. Su modelo de ejecución basado en eventos y su arquitectura no bloqueante permiten manejar múltiples conexiones concurrentes de manera eficiente, lo que lo hace idóneo para operaciones con alta interacción en tiempo real.

Este enfoque permite que cada microservicio utilice la tecnología más adecuada según su contexto funcional, manteniendo independencia tecnológica entre dominios.

---

### Bases de Datos

Siguiendo el principio **Database per Service**, cada microservicio cuenta con su propio motor de base de datos, garantizando aislamiento de datos y reducción de acoplamiento.

Para el microservicio de usuarios desarrollado en .NET, se utilizó una base de datos relacional desplegada mediante contenedores de Docker en el entorno de desarrollo, lo que permite consistencia entre entornos, facilidad de despliegue y portabilidad.

En el microservicio de gestión de restaurantes y menús se empleó MongoDB, una base de datos NoSQL orientada a documentos. Esta elección facilita la flexibilidad en la estructura de datos, especialmente útil para manejar catálogos de menús, configuraciones dinámicas y estructuras que pueden evolucionar con el tiempo.

La separación de motores de base de datos no solo mejora la independencia de los servicios, sino que también permite optimizar el almacenamiento según el tipo de datos y las necesidades del dominio.

---

Instalacion y Ejecucion:

# Instalación y Ejecución

## Requisitos Previos

Antes de ejecutar el sistema, asegúrese de contar con lo siguiente:

### Entorno Backend (.NET)

- **.NET SDK 8.0 o superior**
    
    Versión verificada:
    
    ```
    dotnet--version8.0.417
    ```
    

### Entorno Backend (Node.js)

- **Node.js v24.13.1 o superior**
    
    Versión verificada:
    
    ```
    node -v
    v24.13.1
    ```
    

### Base de Datos

- **PostgreSQL 13 o superior**

### Servicios Externos (Opcional)

- Cuenta de **Cloudinary** para almacenamiento de imágenes.
- Cuenta de **Gmail** con App Password para envío de correos electrónicos.

---

# Configuración del Servicio de Usuarios (.NET)

## Variables de Configuración

Crear el archivo:

```
src/AuthService.Api/appsettings.Development.json
```

Con la siguiente estructura base:

```json
{
"ConnectionStrings": {
"DefaultConnection": "Host=localhost;Port=5432;Database=AuthServiceDb;Username=postgres;Password=tu_password"
},
"JwtSettings": {
"SecretKey": "tu_clave_secreta",
"Issuer": "AuthService",
"Audience": "AuthServiceUsers",
"ExpirationInMinutes": 60
},
"CloudinarySettings": {
"CloudName": "tu_cloud_name",
"ApiKey": "tu_api_key",
"ApiSecret": "tu_api_secret"
},
"EmailSettings": {
"SmtpServer": "[smtp.gmail.com](http://smtp.gmail.com/)",
"Port": 587,
"SenderEmail": "[tu_correo@gmail.com](mailto:tu_correo@gmail.com)",
"AppPassword": "tu_app_password"
}
}
```

## Pasos de Instalación

### Clonar el repositorio

```bash
gitclone <url-repositorio>cd auth-service
```

---

### Restaurar dependencias

```bash
dotnet restore
```

---

### Aplicar migraciones a la base de datos

```bash
cd src/AuthService.Api
dotnet ef database update
```

> Asegúrese de que PostgreSQL esté en ejecución antes de aplicar las migraciones.
> 

---

### Ejecutar el servicio

```bash
dotnet run
```

El servicio estará disponible en:

```
https://localhost:
```

# nstalación y Ejecución del Servicio de Restaurantes (Node.js)

Desde la carpeta raíz del servicio:

### Instalar dependencias

```bash
npm install
```

---

### Configurar variables de entorno

Crear archivo `.env` en la raíz del servicio:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cctept_db
DB_USER=postgres
DB_PASSWORD=tu_password

---

### Ejecutar el servicio

```bash
npm run dev
```

O en caso de no contar con script dev:

```bash
node index.js
```

Disponible en:

```
http://localhost:3000
```

## Estado Actual del Proyecto

El proyecto se encuentra actualmente en fase de desarrollo activo. La arquitectura base de microservicios ya ha sido definida e implementada parcialmente, estableciendo la separación de responsabilidades y el aislamiento de datos por servicio.

---

**Créditos Académicos**

Este microservicio fue desarrollado utilizando como base código académico proporcionado por el profesor Braulio Echeverría para el curso **IN6AM – Centro Educativo Tecnico Laboral Kinal**

El código fue adaptado y extendido por **CCTEPT** para cumplir con los requerimientos de Savoro.

Se respeta la licencia MIT original.
