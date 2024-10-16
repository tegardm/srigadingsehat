import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebase/firebase'; // Make sure your Firebase configuration is imported here
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters

const PendudukTambah = () => {
    const { namadusun } = useParams(); // Get the 'namadusun' parameter from the URL
    const [formData, setFormData] = useState({
        nama: '',
        nik: '',
        alamat: '',
        jenisKelamin: '',
        usia: '',
        dusun: namadusun || '', // Set initial value to 'namadusun' from URL
        kategori: ''
    });

    const db = getFirestore(app); // Get Firestore instance

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Determine the category automatically based on age
        let kategori = formData.kategori;
        if (name === 'usia') {
            const usia = parseInt(value, 10);
            if (usia >= 0 && usia <= 5) {
                kategori = 'balita';
            } else if (usia >= 6 && usia <= 12) {
                kategori = 'anak';
            } else if (usia >= 13 && usia <= 17) {
                kategori = 'remaja';
            } else if (usia >= 18 && usia <= 59) {
                kategori = 'dewasa';
            } else if (usia >= 60) {
                kategori = 'lansia';
            } else {
                kategori = '';
            }
        }

        setFormData({
            ...formData,
            [name]: value,
            kategori: kategori
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Add data to the 'penduduks' collection
            await addDoc(collection(db, 'penduduks'), {
                nama: formData.nama,
                nik: formData.nik,
                alamat: formData.alamat,
                jenis_kelamin: formData.jenisKelamin,
                usia: parseInt(formData.usia),
                dusun: formData.dusun,
                kategori: formData.kategori
            });
            alert('Data penduduk berhasil ditambahkan!');
            // Clear the form after submission
            setFormData({
                nama: '',
                nik: '',
                alamat: '',
                jenisKelamin: '',
                usia: '',
                dusun: namadusun.toLowerCase() || '', // Reset to the initial 'namadusun' value
                kategori: ''
            });
        } catch (error) {
            console.error('Error menambahkan data:', error);
            alert('Terjadi kesalahan saat menambahkan data');
        }
    };

    return (
        <div className="container mt-5">
            <br /><br />
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
                        readOnly
                        disabled // Disable the input field to prevent editing
                    />
                </div>
                <div className="form-group">
                    <label>Kategori (otomatis)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="kategori"
                        value={formData.kategori}
                        readOnly
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Tambah Data
                </button>
            </form>
        </div>
    );
};

export default PendudukTambah;
