const Mahasiswa = require('../models/mhsEmbedded')



module.exports = {
    insert: async (req, res) => {
        const data = new Mahasiswa({
            nim: req.body.nim,
            nama: req.body.nama,
            angkatan: req.body.angkatan,
            prodi: req.body.prodi,
        })

        try {
            const dataToSave = await data.save();
            res.status(200).json(dataToSave)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },

    getMahasiswa: async (req, res) =>{
        try{
            const data = await Mahasiswa.find();
            res.json(data)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getMahasiswaByNim: async(req, res) =>{
        const nim = req.params.nim
        try {
            const data = await Mahasiswa.find().where('nim').equals(nim);
            res.json(data);
        }catch (error) {
            res.status(500).json({ message : error.message})
        }
    },

    update: async (req,res) => {
        const filter = { nim: req.params.nim }
        const updateData = {
            nim : req.params.nim,
            nama : req.params.nama,
            angkatan : req.params.angkatan,
            prodi : req.params.prodi
        }
        try {
            await Mahasiswa.updateOne(filter, updateData)
            res.status(200).json(updateData)
        }catch (error) {
            res.status(409).json({ message: error.message})
        }
    },

    delete: async (req, res) => {
        const filter = { nim: req.params.nim }
        try{
            await Mahasiswa.deleteOne(filter)
            res.send("data telah terhapus")
        }catch (error) {
            res.status(409).json({ message: error.message})
        }
    },

    insertNilai: async (req, res) => {
        const nim = req.params.nim

        try {
            await Mahasiswa.updateOne(
                { "nim": nim },
                {
                    $push: {
                        "nilai": {
                            "kdMk": req.body.kdMk,
                            "matakuliah": req.body.matakuliah,
                            "dosen": req.body.dosen,
                            "semester": req.body.semester,
                            "nilai": req.body.nilai
                        }
                    }
                })
            res.send('nilai telah di simpan')
        } catch (error) {
            res.status(409).json({ message: error.message })
        }
    },

    getNilaiByNim : async (req, res) => {
        const nim = req.params.nim;
        try {
            const result = await Mahasiswa.findOne({"nim" : nim},{"_id":0,"nilai" : 1})
            // let res2 = [];
            // for (let i = 0; i < result.lenght; i++) {
            //     res2.push(result[i])
            // }
            res.json(result)
        } catch (error) {
            this.res.status(500).json({ mesage : error.message})
        }
    },

    
}
