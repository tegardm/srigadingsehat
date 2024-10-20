import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { db, storage } from "../firebase/firebase";
import { doc, getDoc, collection, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const FasilitasModifikasi = () => {
    const { idFasilitas } = useParams();
    const navigate = useNavigate();

    const [fasilitas, setFasilitas] = useState({
        nama: '',
        alamat: '',
        cp_petugas: '',
        deskripsi: '',
        jam_operasional: {
            waktuBuka: '',
            waktuTutup: '',
            hariBuka: []
        },
        layanan: [],
        thumbnail: null,
    });

    const [layananBaru, setLayananBaru] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fasilitasDocRef = doc(db, 'fasilitas', idFasilitas);
                const fasilitasDoc = await getDoc(fasilitasDocRef);
                if (fasilitasDoc.exists()) {
                    setFasilitas(fasilitasDoc.data());
                } else {
                    console.log('Data fasilitas tidak ditemukan');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [idFasilitas]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFasilitas((prev) => ({ ...prev, [name]: value }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setFasilitas((prev) => ({ ...prev, thumbnail: file }));
    };

    const handleLayananChange = (e) => {
        setLayananBaru(e.target.value);
    };

    const handleLayananAdd = (e) => {
        e.preventDefault();
        if (layananBaru) {
            setFasilitas((prev) => ({
                ...prev,
                layanan: [...prev.layanan, layananBaru],
            }));
            setLayananBaru('');
        }
    };

    const handleLayananRemove = (index) => {
        setFasilitas((prev) => ({
            ...prev,
            layanan: prev.layanan.filter((_, i) => i !== index),
        }));
    };

    // Mengelola perubahan waktu buka dan tutup
    const handleJamOperasionalChange = (event) => {
        const { name, value } = event.target;
        setFasilitas((prevState) => ({
            ...prevState,
            jam_operasional: {
                ...prevState.jam_operasional,
                [name]: value,
            },
        }));
    };

    // Mengelola perubahan pada checkbox hari buka
    const handleHariBukaChange = (event) => {
        const { value, checked } = event.target;
        setFasilitas((prevState) => {
            const { hariBuka } = prevState.jam_operasional;

            const updatedHariBuka = checked
                ? [...hariBuka, value]
                : hariBuka.filter((hari) => hari !== value);

            return {
                ...prevState,
                jam_operasional: {
                    ...prevState.jam_operasional,
                    hariBuka: updatedHariBuka,
                },
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            let thumbnailUrl = null;

            // Jika ada thumbnail file yang diupload, lakukan proses upload ke storage
            if (fasilitas.thumbnail) {
                const storageRef = ref(storage, `thumbnails/${fasilitas.thumbnail.name}`);
                const uploadTask = uploadBytesResumable(storageRef, fasilitas.thumbnail);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setUploadProgress(progress);
                    },
                    (err) => {
                        console.error('Error uploading file:', err);
                        setError('File upload failed. Please try again.');
                        setIsSubmitting(false);
                    },
                    async () => {
                        thumbnailUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        await saveFasilitasData(thumbnailUrl);
                    }
                );
            } else {
                await saveFasilitasData(thumbnailUrl);
            }
        } catch (err) {
            console.error('Error saving data:', err);
            setError('Failed to save data. Please try again.');
            setIsSubmitting(false);
        }
    };

    const saveFasilitasData = async (thumbnailUrl) => {
        try {
            const updatedFasilitas = {
                ...fasilitas,
                thumbnail: thumbnailUrl || fasilitas.thumbnail // Gunakan URL baru atau yang sudah ada
            };

            const fasilitasDocRef = doc(db, 'fasilitas', idFasilitas);
            await updateDoc(fasilitasDocRef, updatedFasilitas);

            alert('Data Fasilitas berhasil diubah');
            navigate(-1);
        } catch (err) {
            console.error('Error saving to Firestore:', err);
            setError('Failed to save data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <br></br><br></br><br></br>
            <Container className="mt-4">
                <h2>Modifikasi Fasilitas Kesehatan</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNama">
                        <Form.Label>Nama Fasilitas</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Masukkan Nama Fasilitas"
                            name="nama"
                            value={fasilitas.nama}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formAlamat">
                        <Form.Label>Alamat</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Masukkan Alamat"
                            name="alamat"
                            value={fasilitas.alamat}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formCPPetugas">
                        <Form.Label>Kontak Petugas Kesehatan</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Masukkan Kontak"
                            name="cp_petugas"
                            value={fasilitas.cp_petugas}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formJamOperasional">
                        <Form.Label>Jam Operasional</Form.Label>
                        <div className="form-row">
                            <Form.Group className="col" controlId="formWaktuBuka">
                                <Form.Label>Waktu Buka</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="waktuBuka"
                                    value={fasilitas.jam_operasional.waktuBuka}
                                    onChange={handleJamOperasionalChange}
                                    placeholder="Masukkan Waktu Buka"
                                />
                            </Form.Group>
                            <Form.Group className="col" controlId="formWaktuTutup">
                                <Form.Label>Waktu Tutup</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="waktuTutup"
                                    value={fasilitas.jam_operasional.waktuTutup}
                                    onChange={handleJamOperasionalChange}
                                    placeholder="Masukkan Waktu Tutup"
                                />
                            </Form.Group>
                        </div>
                        <Form.Group controlId="formHariBuka" className="mt-3">
                            <Form.Label>Hari Buka</Form.Label>
                            <div>
                                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((hari) => (
                                    <div key={hari} className="custom-control custom-checkbox custom-control-inline">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id={`hari-${hari}`}
                                            value={hari}
                                            checked={fasilitas.jam_operasional.hariBuka.includes(hari)}
                                            onChange={handleHariBukaChange}
                                        />
                                        <label className="custom-control-label" htmlFor={`hari-${hari}`}>
                                            {hari}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Form.Group>
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formDeskripsi">
                        <Form.Label>Deskripsi</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Masukkan Deskripsi"
                            name="deskripsi"
                            value={fasilitas.deskripsi}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                <br />
                <Form.Group controlId="formThumbnail">
                    <Form.Label>Thumbnail</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleThumbnailChange}
                    />
                </Form.Group>
                <br />
                <Form.Group controlId="formLayanan">
                    <Form.Label>Layanan Tersedia</Form.Label>
                    <ListGroup className="mb-3">
                        {fasilitas.layanan.map((layanan, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                {layanan}
                                <Button variant="danger" size="sm" onClick={() => handleLayananRemove(index)}>
                                    Hapus
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Form.Control
                        type="text"
                        placeholder="Tambah Layanan Baru"
                        value={layananBaru}
                        onChange={handleLayananChange}
                    />
                    <Button variant="secondary" onClick={handleLayananAdd} className="mt-2">
                        Tambah Layanan
                    </Button>
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    Simpan Perubahan
                </Button>
            </Form>
        </Container>
     </>
    );
};

export default FasilitasModifikasi;
