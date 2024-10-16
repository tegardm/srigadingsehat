import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { app } from '../firebase/firebase';
import { useNavigate } from "react-router-dom";

const PendudukModifikasi = () => {
    const { namadusun, kategori, nik } = useParams();
    const [formData, setFormData] = useState({
        nama: '',
        nik: '',
        alamat: '',
        jenisKelamin: '',
        usia: '',
        dusun: '',
        kategori: ''
    });

    const [documentId, setDocumentId] = useState(null); // State to store the Firestore document ID
    const db = getFirestore(app);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pendudukRef = collection(db, 'penduduks');
                const q = query(
                    pendudukRef,
                    where('dusun', '==', namadusun),
                    where('kategori', '==', kategori),
                    where('nik', '==', nik)
                );
                
                const querySnapshot = await getDocs(q);
                
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    setDocumentId(doc.id); // Store the document ID
                    setFormData({
                        nama: data.nama,
                        nik: data.nik,
                        alamat: data.alamat,
                        jenisKelamin: data.jenis_kelamin,
                        usia: data.usia,
                        dusun: data.dusun,
                        kategori: data.kategori
                    });
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [namadusun, kategori, nik]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const determineCategory = (age) => {
        if (age >= 0 && age <= 5) return 'balita';
        if (age >= 6 && age <= 12) return 'anak';
        if (age >= 13 && age <= 17) return 'remaja';
        if (age >= 18 && age <= 59) return 'dewasa';
        if (age >= 60) return 'lansia';
        if (age < 60) return 'dewasa';
        return 'lansia';
    };

    useEffect(() => {
        const category = determineCategory(formData.usia);
        setFormData(prevState => ({
            ...prevState,
            kategori: category
        }));
    }, [formData.usia]); // Update kategori whenever usia changes

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmUpdate = window.confirm('Apakah Anda yakin ingin mengubah data penduduk ini?');
        if (!confirmUpdate || !documentId) return; // Exit if user does not confirm or documentId is null

        try {
            const pendudukRef = doc(db, 'penduduks', documentId); // Use the documentId to reference the document
            await updateDoc(pendudukRef, {
                nama: formData.nama,
                alamat: formData.alamat,
                jenis_kelamin: formData.jenisKelamin,
                usia: formData.usia,
                dusun: formData.dusun,
                kategori: formData.kategori
            });

            alert('Data penduduk berhasil diubah!');
            navigate(-1);
        } catch (error) {
            console.error("Error updating document: ", error);
            alert('Terjadi kesalahan saat mengubah data penduduk.');
        }
    };

    return (
        <>
        <br></br><br></br>
        <div className="container mt-5">
            <h2>Modifikasi Data Penduduk</h2>
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
                    <select
                        className="form-control"
                        name="dusun"
                        value={formData.dusun}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Pilih Dusun</option>
                        <option value="krajan">Krajan</option>
                        <option value="gading">Gading</option>
                        <option value="mendek">Mendek</option>
                        <option value="jeruk">Jeruk</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Kategori</label>
                    <input
                        type="text"
                        className="form-control"
                        name="kategori"
                        value={formData.kategori}
                        readOnly // Disable the kategori field
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Ubah Data
                </button>
            </form>
        </div>
        </>
    );
};

export default PendudukModifikasi;
