import React, { useState } from 'react';
import { Form, Button, Container, ProgressBar, Card } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate } from 'react-router-dom';

const SekolahTambah = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

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
    
        if (thumbnailFile) {
            const storageRef = ref(storage, `thumbnails/${thumbnailFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, thumbnailFile);
    
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
                    try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        
                        // Menyimpan data ke Firestore
                        await addDoc(collection(db, 'kegiatansekolahs'), {
                            ...formData,
                            thumbnail: url,
                        });
    
                        alert('Data successfully submitted!');
                        
                        setFormData({
                            title: '',
                            description: '',
                            thumbnail: '',
                        });
                        setThumbnailFile(null);
                        setUploadProgress(0);
                        navigate.back(-1)
                    } catch (err) {
                        console.error('Error saving to Firestore:', err);
                        setError('Failed to save data. Please try again.');
                    } finally {
                        setIsSubmitting(false);
                    }
                }
            );
        } else {
            setError('Please select a thumbnail image.');
            setIsSubmitting(false);
        }
    };
    

    return (
        <>
        <br /><br /><br />
        <Container className="mt-4">
            <Card className="p-4 shadow-sm">
                <h4 className="text-center mb-4">Tambah Informasi Kegiatan Kesehatan Sekolah Srigading</h4>
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
                            required
                        />
                        {uploadProgress > 0 && (
                            <ProgressBar
                                now={uploadProgress}
                                label={`${uploadProgress}%`}
                                className="mt-2"
                            />
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

export default SekolahTambah;
