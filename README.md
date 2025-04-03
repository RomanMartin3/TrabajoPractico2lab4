# TP2 - Node.js + TypeScript + MySQL

Este proyecto migra datos de países desde la API pública de RestCountries a una base de datos MySQL llamada `paisesbd`.

## 🚀 Cómo ejecutar

1. Asegurate de tener MySQL corriendo y creado el esquema `paisesbd`.
2. Instalá las dependencias:

```bash
npm install
```

3. Ejecutá el script principal:

```bash
npm start
```

## 🧩 Tecnologías utilizadas

- Node.js
- TypeScript
- Axios
- MySQL
- mysql2

## 📂 Estructura del proyecto

- `main.ts`: inicia la migración.
- `pais.ts`: define la interfaz del país.
- `db.ts`: conexión a la base de datos.
- `queries.ts`: operaciones SQL para insertar datos.

## 📝 Notas

- La conexión a MySQL usa usuario `root` y contraseña `mysql` por defecto.
- Se recorren códigos del 001 al 999 y se almacenan solo los países válidos.

- # 🌍 TP2 - Parte B: Migración de Países a MongoDB

Este proyecto realiza la migración de datos de países desde la API pública [restcountries.com](https://restcountries.com/) hacia una base de datos local MongoDB.

Se recorren los códigos del 001 al 999, y si el país existe:

- ✅ Se guarda en la colección `paises` de la base `paises_db`.
- ⚠️ Se sobrescribe si ya existe.
- ❌ Se informa si no se encontró país con ese código.

---

## ▶️ Cómo ejecutar el proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar el script principal:

```bash
npx ts-node main.ts
```

---

Este comando conectará con MongoDB, recorrerá los códigos de países del 001 al 999, y migrará los datos encontrados a la base de datos.

