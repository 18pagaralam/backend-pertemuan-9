const express = require('express');
const routerMhs = express.Router();
const connection = require('../db/db')
const ctrMhsm = require('../controllers/mahasiswa')

routerMhs.post('/mahasiswa', ctrMhsm.insert)
routerMhs.get('/mahasiswa', ctrMhsm.getMahasiswa)
routerMhs.get('/mahasiswa/:nim', ctrMhsm.getMahasiswaByNim)
routerMhs.put('/mahasiswa/:nim', ctrMhsm.update)
routerMhs.delete('/mahasiswa/:nim', ctrMhsm.delete)

module.exports = routerMhs

// const express = require("express")
// const routerMahasiswa = express.Router()

// const controllerMahasiswa = require('../controllers/mahasiswa')

// routerMahasiswa.route('/mahasiswa')
//     .post(controllerMahasiswa.insert)
//     .get(controllerMahasiswa.getMahasiswa)

// routerMahasiswa.route('/mahasiswa/:nim')
//     .get(controllerMahasiswa.getMahasiswaByNim)
//     .put(controllerMahasiswa.update)
//     .delete(controllerMahasiswa.delete)

// routerMahasiswa.route('/mahasiswa/nilai/:nim')
//     .get(controllerMahasiswa.getNilaiByNim)
//     .put(controllerMahasiswa.insertNilai)

// module.exports = routerMahasiswa