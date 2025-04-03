console.log("ESTO ES main.ts");

import axios from 'axios';
import { MongoClient } from 'mongodb';
import {
    mostrarPaisesDeAmerica,
    mostrarPaisesAmericaConAltaPoblacion,
    mostrarPaisesFueraDeAfrica,
    actualizarNombreYpoblacionDeEgipto,
    eliminarPaisConCodigo258,
    mostrarPaisesConPoblacionEntre50y150Millones,
    mostrarPaisesOrdenadosPorNombre,
    mostrarPaisesSaltandoLosPrimeros,
    crearIndicePorCodigoPais
  } from './queries';
  


const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'paises_db';

async function migrarPaises() {
  try {
    // Coneccion Base de datos
    await client.connect();
    const db = client.db(dbName);
    const paises = db.collection('paises');

    console.log("✅ Conexión a la base de datos establecida correctamente.\n");

    for (let codigo = 1; codigo <= 999; codigo++) {
      const formatoCodigo = codigo.toString().padStart(3, '0');
      const url = `https://restcountries.com/v3.1/alpha/${formatoCodigo}`;

      try {
        const response = await axios.get(url);
        const data = response.data[0];
        if (!data) {
          console.log(`❌ No se encontró país con el código ${formatoCodigo}`);
          continue;
        }

        const pais = {
          codigoPais:parseInt(data.ccn3 || formatoCodigo),
          nombrePais: data.name?.common || '',
          capitalPais: data.capital?.[0] || '',
          region: data.region || '',
          subregion: data.subregion || '',
          poblacion: data.population || 0,
          latitud: data.latlng?.[0] || 0,
          longitud: data.latlng?.[1] || 0,
          superficie: data.area || 0
        };

        const existe = await paises.findOne({ codigoPais: pais.codigoPais });
        if (existe) {
          await paises.updateOne({ codigoPais: pais.codigoPais }, { $set: pais });
        } else {
          await paises.insertOne(pais);
        }

        console.log(`✅ El país "${pais.nombrePais}" se guardó correctamente en la base de datos`);
      } catch (error) {
        console.log(`❌ No se encontró país con el código ${formatoCodigo}`);
      }
    }

    console.log("\n✅ Migración finalizada correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  } finally {
    await client.close();
  }
}

async function main() {
  await migrarPaises(); 
  //await mostrarPaisesDeAmerica();
   //await mostrarPaisesAmericaConAltaPoblacion();
   //await mostrarPaisesFueraDeAfrica();
  // await actualizarNombreYpoblacionDeEgipto();
  // await eliminarPaisConCodigo258();
  // await mostrarPaisesConPoblacionEntre50y150Millones();
   //await mostrarPaisesOrdenadosPorNombre();
   //await mostrarPaisesSaltandoLosPrimeros(5);
    //await crearIndicePorCodigoPais();
}

main();
