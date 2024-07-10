const mongoose = require('mongoose')

const mhsEmbeddedSchema = new mongoose.Schema({
    nim:{
        required: true,
        type: String
    },
    nama:{
        required: true,
        type: String
    },
    angkatan:{
        required: true,
        type: String
    },
    prodi:{
        required: true,
        type: String
    },
    nilai:[{
        kdMk : String,
        matakuliah : String,
        dosen : String,
        semester : Number,
        nilai : String
    }]
})

module.exports = mongoose.model('Mahasiswa',mhsEmbeddedSchema,'mahasiswa')