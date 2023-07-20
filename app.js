// Importar las bibliotecas necesarias
import express from 'express';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Jimp from 'jimp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import hbs from "hbs";

// Calcular __dirname en ES6
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Crear la aplicación Express
const app = express();

//view engine motor de vistas
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views'));

// Configurar Yargs
const argv = yargs(hideBin(process.argv))
  .option('key', {
    alias: 'k',
    description: 'Key para arrancar el servidor',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .argv;

// Verificar la clave
if (argv.key !== '123') {
  console.log('Key incorrecta. El servidor no se iniciará.');
  process.exit();
}

// Ruta para servir los archivos estáticos (CSS)
app.use(express.static('public'));

// Ruta principal con el formulario
app.get('/', (req, res) => {
  res.render("vista");
});

// Ruta para procesar la imagen
app.get('/process', async (req, res) => {
  const imageUrl = req.query.url;

  const image = await Jimp.read(imageUrl);
  await image
    .greyscale() // hacer la imagen en blanco y negro
    .quality(60) // establecer la calidad de la imagen a 60
    .resize(350, Jimp.AUTO) // redimensionar la imagen
    .writeAsync('newImg.jpg'); // guardar la imagen

  res.sendFile(path.join(__dirname, '/newImg.jpg'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
