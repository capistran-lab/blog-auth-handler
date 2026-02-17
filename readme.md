# 🚀 blog-auth-handler

Este repositorio contiene la función **AWS Lambda** (Python) que sirve como el "backend" de sincronización para **Better-Auth**. Se activa mediante disparadores de **Amazon Cognito** cuando un usuario se registra o inicia sesión.

## 🏗️ Arquitectura: Better-Auth + Cognito Integration

Esta Lambda asegura que cada vez que un usuario se autentique mediante Better-Auth en el frontend, sus datos queden persistidos en nuestra base de datos relacional.

```mermaid
graph TD
    %% Nodos
    User["💻 User (Next.js + Better-Auth)"]
    Cog["🆔 AWS Cognito (OAuth2 Provider)"]
    L["⚡ Lambda: blog-auth-handler"]
    DB["💎 Neon DB (PostgreSQL)"]

    %% Flujo
    User -- "Authenticates" --> Cog
    Cog -- "Post-Confirmation Trigger" --> L
    L -- "Upsert User Data" --> DB

    %% Estilos
    style L fill:#000,stroke:#ff0000,stroke-width:3px,color:#ff0000
    style Cog fill:#1a1a1a,stroke:#f44336,stroke-width:1px,color:#ffffff
    style DB fill:#1a1a1a,stroke:#ffffff,stroke-width:1px,color:#ffffff
    style User fill:#1a1a1a,stroke:#ffffff,stroke-width:1px,color:#ffffff
```
