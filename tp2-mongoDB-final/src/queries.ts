import { MongoClient } from 'mongodb';


const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'paises_db';

async function conectar() {
  await client.connect();
  const db = client.db(dbName);
  return db.collection('paises');
}

// 5.1
export async function mostrarPaisesDeAmerica() {
  const paises = await conectar();
  const resultado = await paises.find({ region: "Americas" }).toArray();
 
  console.log("Países en América:");
  
  resultado.forEach((pais)=>{

    console.log(`Pais: ${pais.nombrePais} - Region: ${pais.region} `);
    
  }); 


  await client.close();
}

// 5.2
export async function mostrarPaisesAmericaConAltaPoblacion() {
  const paises = await conectar();
  const resultado = await paises.find({
    region: "Americas",
    poblacion: { $gt: 100_000_000 }
  }).toArray();
  console.log(`los Paises con mas alta poblacion de America son: `)

  resultado.forEach(pais =>{
        console.log(`Pais: ${pais.nombrePais}- region: ${pais.region} - Poblacion: ${pais.poblacion} `);
  });
  await client.close();
}

// 5.3
export async function mostrarPaisesFueraDeAfrica() {
  const paises = await conectar();
  const resultado = await paises.find({ region: { $ne: "Africa" } }).toArray();
  console.log("Países que NO están en África:");
  
  resultado.forEach((pais)=>{

    console.log(`Pais: ${pais.nombrePais} - Region: ${pais.region} `);
    
  }); 


  await client.close();
}

// 5.4
export async function actualizarNombreYpoblacionDeEgipto() {
  const paises = await conectar();
  await paises.updateOne(
    { nombrePais: "Egypt" },
    { $set: { nombrePais: "Egipto", poblacion: 95000000 } }
  );
  console.log("Actualizado nombre a 'Egipto' y población a 95000000.");
  await client.close();
}

// 5.5
export async function eliminarPaisConCodigo258() {
  const paises = await conectar();
  await paises.deleteOne({ codigoPais: "258" });
  console.log("País con código 258 eliminado.");
  await client.close();
}

// 5.6
/*
codigoPais: "258"
- collection.drop(): elimina la colección completa, incluyendo todos sus documentos.
- db.dropDatabase(): elimina la base de datos entera.


*/

// 5.7
export async function mostrarPaisesConPoblacionEntre50y150Millones() {
  const paises = await conectar();
  const resultado = await paises.find({
    poblacion: { $gt: 50_000_000, $lt: 150_000_000 }
  }).toArray();
  console.log("Población entre 50M y 150M:");
  resultado.forEach(pais =>{
    console.log(`Pais: ${pais.nombrePais} - Poblacion: ${pais.poblacion} `);
});


  await client.close();
}

// 5.8
export async function mostrarPaisesOrdenadosPorNombre() {
  const paises = await conectar();
  const resultado = await paises.find().sort({ nombrePais: 1 }).toArray();
  console.log("Paises ordenados alfabéticamente:");

  resultado.forEach(pais =>{
    console.log(`Pais: ${pais.nombrePais} `);
});



  await client.close();
}

// 5.9
export async function mostrarPaisesSaltandoLosPrimeros(n: number) {
  const paises = await conectar();
  const resultado = await paises.find().sort({nombrePais:1}).skip(n).toArray();
  console.log(`Paises a partir del número ${n + 1}:`);

    resultado.forEach(pais =>{
      console.log(`Pais: ${pais.nombrePais} `);
  });
  
  await client.close();
}

// 5.10
/*
Descripción del punto 5.10:
- Las expresiones regulares permiten búsquedas flexibles en MongoDB, reemplazando el uso de LIKE de SQL.
- Ejemplo:
  { nombrePais: /Arg/ }
  Esto buscará todos los países cuyo nombre contenga la palabra "Arg" (como "Argentina", "Argelia", etc.).
*/

// 5.11
export async function crearIndicePorCodigoPais() {
  const paises = await conectar();
  await paises.createIndex({ codigoPais: 1 });
  console.log("Índice creado sobre el campo 'codigoPais'.");
  await client.close();
}

// 5.12
/*
Descripción del punto 5.12:
Para hacer un backup de la base de datos 'paises_db', se debe ejecutar en consola:

mongodump --db=paises_db --out=./backup

Esto crea una carpeta con el contenido exportado de la base de datos para restaurarlo posteriormente si es necesario.
*/
