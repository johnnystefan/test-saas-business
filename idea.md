Quiero diseñar una aplicación SaaS integral para la gestión de un ecosistema deportivo, inicialmente enfocado en béisbol, pero que sea lo suficientemente flexible para adaptarse a otros tipos de negocios similares.

---

## 🎯 Objetivo del sistema

Construir una plataforma centralizada que permita administrar múltiples líneas de negocio dentro de una misma organización, incluyendo:

### 1. Club deportivo (niños)
- Gestión de alumnos
- Cobro de mensualidades
- Manejo de cuotas especiales
- Control de asistencia
- Gestión de entrenadores

### 2. Venta de productos (inventario)
- Control de stock (uniformes, implementos deportivos)
- Ventas (POS o ventas directas)
- Alertas de inventario bajo
- Historial de compras por cliente

### 3. Academia interna (casa de formación)
- Gestión de hospedaje de niños
- Cobro de mensualidades tipo pensión
- Control de gastos operativos:
  - Arriendo
  - Servicios públicos
  - Alimentación
  - Limpieza
  - Nómina
- Reportes financieros

### 4. Jaula de bateo (servicio por horas)
- Reserva de horarios
- Planes por tiempo (por horas, paquetes, membresías)
- Control de disponibilidad
- Facturación por uso

### 5. Finanzas generales
- Consolidación de ingresos y egresos
- Reportes por unidad de negocio
- Flujo de caja
- KPIs (rentabilidad, ocupación, crecimiento)

---

## 🧩 Enfoque del sistema

El sistema debe funcionar como una plataforma SaaS multi-negocio (multi-tenant o multi-módulo), donde cada unidad de negocio sea configurable.

Debe ser altamente:
- Escalable
- Modular
- Configurable
- Reutilizable para otros tipos de negocio

---

## 👥 Tipos de aplicaciones (IMPORTANTE)

El sistema debe dividirse en dos grandes soluciones:

### 1. Aplicación para usuarios (clientes)
- Registro/login
- Reservas (ej: jaula de bateo)
- Pagos (mensualidades, servicios, productos)
- Visualización de planes
- Historial de uso
- App web + versión mobile (Capacitor)

---

### 2. Dashboard administrativo (dueños / staff)

Un panel web completo donde los dueños del negocio puedan:

#### 👤 Gestión
- Usuarios (clientes, entrenadores, staff)
- Roles y permisos (RBAC)

#### 💰 Finanzas
- Ingresos vs egresos
- Flujo de caja
- Reportes por unidad de negocio
- KPIs (crecimiento, rentabilidad, ocupación)

#### 📦 Inventario
- Control de stock
- Ventas
- Alertas

#### 📅 Operación
- Reservas en tiempo real
- Gestión de horarios
- Administración de planes

#### 📊 Analítica
- Dashboard visual
- Métricas de negocio
- Comparativas mensuales

---

## 🏗️ Arquitectura y tecnologías base

- Typescript
- Monorepo: NX
- Frontend: React (última versión estable)
- Backend: NestJS
- Base de datos:
  - PostgreSQL (recomendado por alta relación entre entidades)
- ORM:
  - Prisma (opcional pero recomendado)
- Runtime:
  - Node.js (LTS)

---

## 📱 Mobile
- Capacitor (para empaquetar la app web como app nativa)

---

## 🧪 Testing
- Jest (unit + integration)
- Playwright (E2E)

---

## 🔐 Seguridad y autenticación
- JWT + Refresh Tokens
- OAuth (opcional)
- RBAC (roles y permisos)

---

## 💳 Pagos
- Integración con Stripe (suscripciones + pagos únicos)

---

## 📡 Tiempo real
- WebSockets (NestJS Gateways)
- Uso: reservas, disponibilidad en vivo

---

## 📊 Observabilidad y logging
- Winston (logging)
- OpenTelemetry (tracing y métricas)

---

## 🚀 Infraestructura
- Docker
- CI/CD (GitHub Actions)
- Kubernetes (opcional a futuro)

---

## 🧠 Lo que necesito que generes

1. Nombre del producto (branding SaaS moderno)
2. Arquitectura del sistema (alto nivel)
3. Diseño de módulos o microservicios
4. Modelo de datos inicial (entidades principales)
5. Justificación técnica de decisiones
6. Flujo principal de usuarios (cliente vs admin)
7. Diseño del dashboard administrativo
8. Roadmap de features futuras
9. Estrategia para multi-tenant
10. Cómo hacer este sistema reutilizable para otros negocios

---

## 🔄 Enfoque clave de reutilización

El sistema NO debe ser exclusivo para béisbol.

Debe poder adaptarse fácilmente a:
- Gimnasios
- Academias deportivas (fútbol, tenis, natación)
- Escuelas con internado
- Centros de entrenamiento
- Negocios con reservas por hora + inventario + membresías

El núcleo del sistema debe basarse en:

👉 Unidades de negocio configurables que incluyan:
- Ingresos (suscripciones, reservas, ventas)
- Egresos
- Inventario
- Clientes