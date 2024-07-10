const mongoose =  require('mongoose')

const mhsSchema =  new mongoose.Schema({
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

})

module.exports = mongoose.model('Mahasiswa', mhsSchema,'mahasiswa')