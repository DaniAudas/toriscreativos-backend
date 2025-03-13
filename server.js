require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

//Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error al conectar a MongoDB", err));

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Definir un modelo de datos
const FormularioSchema = new mongoose.Schema({
    name: String,
    message: String,
    date: String,
    validated: Boolean
});

// Model de la base de datos
const Dedicatoria = mongoose.model('dedicatoria', FormularioSchema);

// Ruta para guardar los datos del formulario
app.post('/api/form', async (req, res) => {
    try {
        const dedicatoria = new Dedicatoria(req.body);
        await dedicatoria.save();
        res.status(200).send('Datos guardados correctamente');
    }catch (error) {
        res.status(400).send('Error al guardar los datos');
    }
});

// Ruta para obtener documentos
app.get('/api/dedicatorias', async (req, res) => {
    try {
      const items = await Dedicatoria.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los datos' });
    }
  });

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});