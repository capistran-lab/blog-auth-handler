# 🚀 blog-auth-handler

This repository contains the **AWS Lambda** logic responsible for managing the blog's authentication. It is designed to handle sign-ups, logins, and social integrations, acting as the bridge between the API Gateway and our identity services.

## 🏗️ Integration Architecture

This component is invoked via Proxy Integration by the API Gateway and communicates with critical AWS services and external databases.

```mermaid
graph TD
    %% Node Definitions
    User["💻 User / Frontend"]
    GW["⛩️ API Gateway (blog-api)"]
    L["⚡ Lambda: blog-auth-handler"]
    Cog["🆔 Cognito User Pool"]
    DB["💎 Neon PostgreSQL"]
    Sec["🔐 Secrets Manager"]

    %% Call Flow
    User -- "HTTPS Request" --> GW
    GW -- "Trigger (Proxy Integration)" --> L

    %% Lambda Actions
    L -- "Fetch DB_URL" --> Sec
    L -- "Admin Actions / Verify" --> Cog
    L -- "Read/Write User Data" --> DB

    %% Dark Mode Styles with Red Accents
    style L fill:#000,stroke:#ff0000,stroke-width:3px,color:#ff0000
    style GW fill:#1a1a1a,stroke:#f44336,stroke-width:1px,color:#ffffff
    style Cog fill:#1a1a1a,stroke:#ffffff,stroke-width:1px,color:#ffffff
    style DB
```
