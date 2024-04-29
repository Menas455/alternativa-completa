const express = require('express');
const routers = express.Router();
const upload = require('../controller/control-multer');
const conexion = require('../server/server');
const fs = require('fs');

routers.get('/', (req, res) => {
    // Consulta para obtener todas las imágenes
    const sql = 'SELECT imagen_blob FROM images';
    // Ejecuta la consulta
    conexion.query(sql, (err, result) => {
        if (err) {
            console.error('Error al recuperar las imágenes:', err);
            return res.status(500).send('Error al recuperar las imágenes de la base de datos');
        }
        // Convertir las imágenes a base64 antes de pasarlas a la plantilla
        result.forEach(image => {
            image.imagen_base64 = image.imagen_blob.toString('base64');
        });
        // Pasa las imágenes convertidas a base64 a la plantilla hbs
        res.render('index', { imagenes: result });
    });
});



routers.post('/', upload.single('imagen'), (req, res) => {
    const imagenPath = req.file.path; // Ruta temporal de la imagen
    // Supongamos que ya tienes la imagen en formato binario (por ejemplo, desde un formulario de carga)
const binaryImage = fs.readFileSync(imagenPath); // Lee la imagen desde el archivo

// Inserta la imagen en la base de datos
const sql = 'INSERT INTO images (imagen_blob) VALUES (?)';
conexion.query(sql, [binaryImage], (err, result) => {
    if (err) {
        console.error('Error al insertar la imagen:', err);
        return res.status(500).send('Error al guardar la imagen en la base de datos');
    }
    console.log('Imagen guardada correctamente en la base de datos');
    res.redirect('/'); // Redirige a la página de galería
});

});


module.exports = routers;