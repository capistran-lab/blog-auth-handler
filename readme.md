# 🚀 blog-auth-handler

Este repositorio contiene la lógica de la función **AWS Lambda** encargada de gestionar la autenticación del blog. Está diseñada para procesar registros, inicios de sesión e integraciones sociales.

## 🏗️ Arquitectura de Integración

Este componente es invocado por el API Gateway y se comunica con servicios de identidad y bases de datos.

```mermaid
graph TD
    %% Definición de Nodos
    User["💻 User / Frontend"]
    GW["⛩️ API Gateway (blog-api)"]
    L["⚡ Lambda: blog-auth-handler"]
    Cog["🆔 Cognito User Pool"]
    DB["💎 Neon PostgreSQL"]
    Sec["🔐 Secrets Manager"]

    %% Flujo de Llamada
    User -- "HTTPS Request" --> GW
    GW -- "Trigger" --> L

    %% Acciones de la Lambda
    L -- "Fetch DB_URL" --> Sec
    L -- "Admin Actions" --> Cog
    L -- "Read/Write User" --> DB

    %% Estilos (Corregidos para evitar Parse Error)
    style L fill:#000,stroke:#ff0000,stroke-width:3px,color:#ff0000
    style GW fill:#1a1a1a,stroke:#f44336,stroke-width:1px,color:#ffffff
    style Cog fill:#1a1a1a,stroke:#ffffff,stroke-width:1px,color:#ffffff
    style DB fill:#1a1a1a,stroke:#ffffff,stroke-width:1px,color:#ffffff
    style User fill:#1a1a1a,stroke:#ffffff,stroke-width:1px,color:#ffffff
    style Sec fill:#1a1a1a,stroke:#fbc02d,stroke-width:1px,color:#ffffff
```
