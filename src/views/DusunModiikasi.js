import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../firebase/firebase';
import { useNavigate, useParams } from 'react-router-dom';

const DusunModifikasi = () => {
    const [formData, setFormData] = useState({
        nama: '',
        alamat: '',
        jumlah_penduduk: 0, // Inisialisasi dengan 0
        balita: '',
        anak: '',
        remaja: '',
        dewasa: '',
        lansia: '',
        gambar: '' // Tambahkan properti untuk menyimpan URL gambar
    });
    const [imageFile, setImageFile] = useState(null); // State untuk menyimpan file gambar yang dipilih
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documentId, setDocumentId] = useState(null);
    const navigate = useNavigate();
    const { namadusun } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dusunRef = collection(db, 'dusuns');
                const q = query(dusunRef, where('nama', '==', namadusun));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0];
                    const data = docData.data();
                    setDocumentId(docData.id);

                    // Ambil jumlah penduduk berdasarkan koleksi penduduks
                    const penduduksRef = collection(db, 'penduduks');
                    const penduduksQuery = query(penduduksRef, where('dusun', '==', namadusun));
                    const penduduksSnapshot = await getDocs(penduduksQuery);
                    const jumlahPenduduk = penduduksSnapshot.size; // Hitung jumlah dokumen

                    setFormData({
                        nama: data.nama || '',
                        alamat: data.alamat || '',
                        jumlah_penduduk: jumlahPenduduk, // Set jumlah penduduk
                        balita: data.balita || '',
                        anak: data.anak || '',
                        remaja: data.remaja || '',
                        dewasa: data.dewasa || '',
                        lansia: data.lansia || '',
                        gambar: data.gambar || ''
                    });
                } else {
                    setError('Data tidak ditemukan untuk dusun ini.');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Gagal mengambil data. Silakan coba lagi.');
            }
        };

        fetchData();
    }, [namadusun]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (documentId) {
            try {
                let imageUrl = formData.gambar;

                // Jika ada file gambar yang dipilih, unggah gambar ke Firebase Storage
                if (imageFile) {
                    const storage = getStorage();
                    const storageRef = ref(storage, `dusuns/${imageFile.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, imageFile);

                    // Tunggu hingga upload selesai dan dapatkan URL unduhan
                    await new Promise((resolve, reject) => {
                        uploadTask.on(
                            'state_changed',
                            null,
                            (error) => {
                                console.error('Error uploading image:', error);
                                reject(error);
                            },
                            async () => {
                                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                                resolve();
                            }
                        );
                    });
                }

                // Perbarui data di Firestore termasuk URL gambar yang baru
                const docRef = doc(db, 'dusuns', documentId);
                await updateDoc(docRef, {
                    ...formData,
                    gambar: imageUrl
                });

                alert('Data berhasil diperbarui!');
                navigate(-1)
            } catch (err) {
                console.error('Error updating document:', err);
                setError('Gagal memperbarui data. Silakan coba lagi.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setError('Dokumen tidak ditemukan.');
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <br /><br /><br />
        <Container className="mt-4">
            <Card className="p-4 shadow-sm">
                <h4 className="text-center mb-4">Modifikasi Data Dusun</h4>
                {error && <p className="text-danger text-center">{error}</p>}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formNama">
                                <Form.Label>Nama Dusun</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Masukkan nama dusun"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formAlamat">
                                <Form.Label>Alamat</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Masukkan alamat"
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col md={6}>
                            <Form.Group controlId="formJumlahPenduduk">
                                <Form.Label>Jumlah Penduduk</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="number"
                                    placeholder="Jumlah penduduk"
                                    name="jumlah_penduduk"
                                    value={formData.jumlah_penduduk}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {/* Tambahkan Input Gambar */}
                    <Row className="mt-3">
                        <Col md={6}>
                            <Form.Group controlId="formGambar">
                                <Form.Label>Gambar Dusun</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>
                            {formData.gambar && (
                                <img src={formData.gambar} alt="Gambar Dusun" className="mt-2" style={{ width: '100px', height: '100px' }} />
                            )}
                        </Col>
                    </Row>
                    {/* Kategori data yang lain tetap ada */}
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-100 mt-4"
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </Form>
            </Card>
        </Container>
        </>
    );
};

export default DusunModifikasi;
