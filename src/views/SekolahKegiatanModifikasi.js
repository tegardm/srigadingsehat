import React, { useState, useEffect } from 'react';
import { Form, Button, Container, ProgressBar, Card } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebase/firebase';
import { collection, doc, updateDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate, useParams } from 'react-router-dom';

const SekolahKegiatanModifikasi = () => {
    const { idkegiatan } = useParams(); // Mengambil idkegiatan dari URL
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Fetch existing data from Firestore
    useEffect(() => {
        const fetchKegiatanData = async () => {
            try {
                const kegiatanDocRef = doc(db, 'kegiatansekolahs', idkegiatan); // Ambil data berdasarkan idkegiatan
                const kegiatanSnap = await getDoc(kegiatanDocRef);
                if (kegiatanSnap.exists()) {
                    setFormData(kegiatanSnap.data()); // Set data yang didapat dari Firestore ke form
                } else {
                    setError("Data kegiatan tidak ditemukan");
                }
            } catch (err) {
                setError('Gagal mengambil data. Silakan coba lagi.');
            } finally {
                setLoading(false); // Matikan loading ketika proses selesai
            }
        };

        fetchKegiatanData();
    }, [idkegiatan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const storage = getStorage(); // Mendapatkan instance dari Firebase Storage

        try {
            let thumbnailUrl = formData.thumbnail;

            if (thumbnailFile) {
                const storageRef = ref(storage, `thumbnails/${thumbnailFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, thumbnailFile);

                await new Promise((resolve, reject) => {
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
                            reject(err);
                        },
                        async () => {
                            thumbnailUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            // Update data ke Firestore
            const kegiatanDocRef = doc(db, 'kegiatansekolahs', idkegiatan);
            await updateDoc(kegiatanDocRef, {
                ...formData,
                thumbnail: thumbnailUrl,
            });

            alert('Data successfully updated!');
            navigate(-1); // Navigasi ke halaman sebelumnya
        } catch (err) {
            console.error('Error updating document:', err);
            setError('Failed to update data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
        <br /><br /><br />
        <Container className="mt-4">
            <Card className="p-4 shadow-sm">
                <h4 className="text-center mb-4">Edit Informasi Kegiatan Kesehatan Sekolah Srigading</h4>
                {error && <p className="text-danger text-center">{error}</p>}
                <Form onSubmit={handleSubmit}>
                    {/* Input for Title */}
                    <Form.Group controlId="formTitle">
                        <Form.Label>Judul Kegiatan</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Masukkan Judul Kegiatan"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <br />

                    {/* Input for Description */}
                    <Form.Group controlId="formDescription">
                        <Form.Label>Deskripsi Kegiatan</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Masukkan Deskripsi Kegiatan"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <br />

                     {/* Input for Thumbnail */}
                    <Form.Group controlId="formThumbnail">
                        <Form.Label>Thumbnail</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                        />
                        {uploadProgress > 0 && (
                            <ProgressBar
                                now={uploadProgress}
                                label={`${uploadProgress}%`}
                                className="mt-2"
                            />
                        )}
                        {formData.thumbnail && (
                            <div className="mt-3">
                                <p>Current Thumbnail:</p>
                                <img src={formData.thumbnail} alt="Thumbnail" style={{ width: '200px' }} />
                            </div>
                        )}
                    </Form.Group>
                    <br />

                    {/* Submit Button */}
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-100 mt-3"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </Form>
            </Card>
        </Container>
        </>
    );
};

export default SekolahKegiatanModifikasi;
