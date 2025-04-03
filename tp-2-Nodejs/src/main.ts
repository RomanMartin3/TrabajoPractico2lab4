import axios from 'axios';
import { pool } from './db';
import { Pais } from './pais';

const API_URL = 'https://restcountries.com/v3.1/alpha/';

async function obtenerPais(code: string): Promise<Pais | null> {
  try {
    const response = await axios.get(`${API_URL}${code}`);
    const data = response.data[0];
    
    if (!data || !data.ccn3) {
      return null;
    }

    const codigoPais = parseInt(data.ccn3 || code);
    const nombrePais = data.name?.common || 'N/A';
    const capital = data.capital?.[0] || 'N/A';
    const region = data.region || 'N/A';
    const subregion = data.subregion || 'N/A';
    const poblacion = data.population || 0;
    const lat = data.latlng?.[0] || 0.0;
    const lng = data.latlng?.[1] || 0.0;

    return {
      codigoPais,
      nombrePais,
      capitalPais: capital,
      region,
      subregion,
      poblacion,
      latitud: lat,
      longitud: lng
    };
  } catch (error) {
    return null;
  }
}

async function guardarEnBD(pais: Pais): Promise<void> {
  const conn = await pool.getConnection();
  try {
    const [rows]: any = await conn.execute(
      'SELECT COUNT(*) AS total FROM Pais WHERE codigoPais = ?',
      [pais.codigoPais]
    );
    const existe = rows[0].total > 0;

    if (existe) {
      await conn.execute(
        `UPDATE Pais SET nombrePais=?, capitalPais=?, region=?, subregion=?, poblacion=?, latitud=?, longitud=?
         WHERE codigoPais=?`,
        [
          pais.nombrePais,
          pais.capitalPais,
          pais.region,
          pais.subregion,
          pais.poblacion,
          pais.latitud,
          pais.longitud,
          pais.codigoPais
        ]
      );
    } else {
      await conn.execute(
        `INSERT INTO Pais (codigoPais, nombrePais, capitalPais, region, subregion, poblacion, latitud, longitud)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pais.codigoPais,
          pais.nombrePais,
          pais.capitalPais,
          pais.region,
          pais.subregion,
          pais.poblacion,
          pais.latitud,
          pais.longitud
        ]
      );
    }

    console.log(`✅ El país "${pais.nombrePais}" se guardó correctamente en la base de datos`);
  } catch (e) {
    console.error(`❌ Error al guardar el país con código ${pais.codigoPais}:`, e);
  } finally {
    conn.release();
  }
}

async function main() {
  console.log("✅ Conexión a la base de datos establecida correctamente.\n");

  for (let i = 1; i <= 999; i++) {
    const code = i.toString().padStart(3, '0');
    const pais = await obtenerPais(code);

    if (pais) {
      await guardarEnBD(pais);
    } else {
      console.log(`❌ No se encontró país con el código ${code}`);
    }
  }

  console.log("\n✅ Migración finalizada correctamente.");
}

main();