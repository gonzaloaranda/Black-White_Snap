const express = require("express");
const yargs = require("yargs");
const Jimp = require("jimp");

const app = express();
const argv = yargs.argv;

// Requisito 1: Comprobar si el valor de la propiedad 'key' es correcta (123)
const key = argv.key;
if (key !== 123) {
  console.error("Clave incorrecta. No se puede iniciar el servidor.");
  process.exit(1);
}

// Requisito 2: Ruta raíz que devuelve el formulario para ingresar la URL de la imagen
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Black and White Spa</h1>
        <form action="/processImage" method="post">
          <label for="imageUrl">Ingresa la URL de la imagen:</label>
          <input type="text" name="imageUrl" required>
          <button type="submit">Procesar Imagen</button>
        </form>
      </body>
    </html>
  `);
});

// Requisito 3: Servir archivo CSS alojado en el servidor
app.use("/styles.css", express.static(__dirname + "/styles.css"));

// Requisito 4: Ruta para procesar la imagen y devolverla en blanco y negro
app.post("/processImage", async (req, res) => {
  const imageUrl = req.body.imageUrl;

  try {
    const image = await Jimp.read(imageUrl);

    // Procesar imagen en escala de grises, con calidad 60% y redimensionada a 350px de ancho
    image.greyscale().quality(60).resize(350, Jimp.AUTO);

    // Guardar la imagen procesada en un archivo llamado 'newImg.jpg'
    await image.writeAsync("newImg.jpg");

    // Devolver la imagen procesada al cliente
    res.sendFile(__dirname + "/newImg.jpg");
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    res.status(500).send("Hubo un error al procesar la imagen.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en línea en http://localhost:${PORT}`);
});
