import React, { useState, useEffect } from 'react';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase'; // Import Storage from Firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import { useNavigate, useParams } from 'react-router-dom';

const ModifikasiSekolah = () => {
    const { idkegiatan, idsekolah } = useParams(); // Mengambil parameter dari URL
    const [formData, setFormData] = useState({
        alamat: '',
        dusun: '',
        idkegiatan: '',
        kegiatan: {
            additionalInfo: '',
            contactPerson: {
                name: '',
                no: '',
            },
            description: '',
            locationGmaps: '',
            schedule: '',
            thumbnail: '',
            title: '',
        },
        nama: '',
    });
    const [thumbnailFile, setThumbnailFile] = useState(null); // State untuk file gambar
    const [uploading, setUploading] = useState(false); // State untuk mengindikasikan proses upload
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!idkegiatan || !idsekolah) {
            console.error('idkegiatan atau idsekolah tidak valid');
            return;
        }

        const fetchData = async () => {
            try {
                const docRef = doc(db, 'sekolahs', idsekolah);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        alamat: data.alamat || '',
                        dusun: data.dusun || '',
                        idkegiatan: data.idkegiatan || '',
                        kegiatan: {
                            additionalInfo: data.kegiatan?.additionalInfo || '',
                            contactPerson: {
                                name: data.kegiatan?.contactPerson?.name || '',
                                no: data.kegiatan?.contactPerson?.no || '',
                            },
                            description: data.kegiatan?.description || '',
                            locationGmaps: data.kegiatan?.locationGmaps || '',
                            schedule: data.kegiatan?.schedule || '',
                            thumbnail: data.kegiatan?.thumbnail || '',
                            title: data.kegiatan?.title || '',
                        },
                        nama: data.nama || '',
                    });
                } else {
                    console.log('Dokumen tidak ditemukan');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchData();
    }, [idkegiatan, idsekolah]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('kegiatan.contactPerson')) {
            const field = name.split('.')[2];
            setFormData((prevData) => ({
                ...prevData,
                kegiatan: {
                    ...prevData.kegiatan,
                    contactPerson: {
                        ...prevData.kegiatan.contactPerson,
                        [field]: value,
                    },
                },
            }));
        } else if (name.includes('kegiatan')) {
            const field = name.split('.')[1];
            setFormData((prevData) => ({
                ...prevData,
                kegiatan: {
                    ...prevData.kegiatan,
                    [field]: value,
                },
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleThumbnailChange = (e) => {
        if (e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setUploading(true); // Set uploading to true

        try {
            let thumbnailURL = formData.kegiatan.thumbnail; // Simpan URL thumbnail yang sudah ada
            
            // Jika ada file thumbnail baru, upload file ke Firebase Storage
            if (thumbnailFile) {
                const thumbnailRef = ref(storage, `thumbnails/${idsekolah}-${thumbnailFile.name}`);
                
                // Upload thumbnail baru
                await uploadBytes(thumbnailRef, thumbnailFile);

                // Mendapatkan URL download thumbnail baru
                thumbnailURL = await getDownloadURL(thumbnailRef);
            }

            // Update data di Firestore
            const docRef = doc(db, 'sekolahs', idsekolah);
            await updateDoc(docRef, {
                ...formData,
                kegiatan: {
                    ...formData.kegiatan,
                    thumbnail: thumbnailURL, // Simpan URL thumbnail yang baru atau tetap
                },
            });

            alert('Data berhasil diperbarui');
            navigate('-1'); // Kembali ke halaman sebelumnya
        } catch (error) {
            console.error('Error updating document:', error);
            alert('Gagal memperbarui data');
        } finally {
            setUploading(false); // Set uploading ke false setelah proses selesai
        }
    };

    return (
       <>
       <br/><br/><br/>
        <div className="container mt-4">
            <h2 className="mb-4">Modifikasi Kegiatan Sekolah {formData.nama}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>ID Kegiatan:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="idkegiatan"
                        value={formData.idkegiatan}
                        readOnly // Make it readonly
                    />
                </div>
                <div className="form-group">
                    <label>Nama Sekolah:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Alamat:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Dusun:</label>
                    <input
                        readOnly
                        type="text"
                        className="form-control"
                        name="dusun"
                        value={formData.dusun}
                        onChange={handleChange}
                    />
                </div>
                <h3 className="mt-4">Kegiatan</h3>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="kegiatan.title"
                        value={formData.kegiatan.title}
                        readOnly // Make it readonly
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        className="form-control"
                        name="kegiatan.description"
                        value={formData.kegiatan.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Additional Info:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="kegiatan.additionalInfo"
                        value={formData.kegiatan.additionalInfo}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Contact Person Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="kegiatan.contactPerson.name"
                        value={formData.kegiatan.contactPerson.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Contact Person No:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="kegiatan.contactPerson.no"
                        value={formData.kegiatan.contactPerson.no}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label>Location (Google Maps):</label>
                    <input
                        type="text"
                        className="form-control"
                        name="kegiatan.locationGmaps"
                        value={formData.kegiatan.locationGmaps}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Schedule:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="kegiatan.schedule"
                        value={formData.kegiatan.schedule}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Thumbnail:</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleThumbnailChange} // Handle file upload
                    />
                </div>
              
                <button type="submit" className="btn btn-primary mt-3" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Simpan Perubahan'}
                </button>
            </form>
        </div>
       </>
    );
};

export default ModifikasiSekolah;
