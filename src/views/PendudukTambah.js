import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PendudukTambah = () => {
    const [formData, setFormData] = useState({
        nama: '',
        nik: '',
        alamat: '',
        jenisKelamin: '',
        usia: '',
        dusun: '',
        kategori: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here, you can add code to submit the form data to a server or perform other actions.
        console.log('Form Data:', formData);
        alert('Data penduduk berhasil ditambahkan!');
        // Clear form after submission
        setFormData({
            nama: '',
            nik: '',
            alamat: '',
            jenisKelamin: '',
            usia: '',
            dusun: '',
            kategori: ''
        });
    };

    return (
        <div className="container mt-5">
            <br></br><br></br>
            <h2>Tambah Data Penduduk</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nama</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>NIK</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nik"
                        value={formData.nik}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Alamat</label>
                    <input
                        type="text"
                        className="form-control"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Jenis Kelamin</label>
                    <select
                        className="form-control"
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Usia</label>
                    <input
                        type="number"
                        className="form-control"
                        name="usia"
                        value={formData.usia}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Dusun</label>
                    <input
                        type="text"
                        className="form-control"
                        name="dusun"
                        value={formData.dusun}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Kategori</label>
                    <select
                        className="form-control"
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Pilih Kategori</option>
                        <option value="Balita">Balita</option>
                        <option value="Anak-anak">Anak-anak</option>
                        <option value="Dewasa">Dewasa</option>
                        <option value="Lansia">Lansia</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Tambah Data
                </button>
            </form>
        </div>
    );
};

export default PendudukTambah;
