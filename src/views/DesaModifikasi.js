import React, { useState, useEffect } from 'react';
import { Form, Button, Container, ProgressBar, Card, Row, Col } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

import { storage, db } from '../firebase/firebase';
import {  addDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useParams } from 'react-router-dom';
const DesaModifikasi = () => {
    const { idkegiatan } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        thumbnail: '',
        description: '',
        schedule: '',
        additionalInfo: '',
        contactPerson: {
            name: '',
            no: '',
            description: '',
            dusun: ''
        },
        locationAddress: ''
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch data from Firebase when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(collection(db, 'kesehatans'), idkegiatan);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                    console.log(formData)
                } else {
                    setError('Data not found');
                }
            } catch (err) {
                console.error('Error fetching document:', err);
                setError('Failed to fetch data. Please try again.');
            }
        };
        console.log(idkegiatan)
        if (idkegiatan) {
            fetchData();
        }
    }, [idkegiatan]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested object (contactPerson)
        if (name.includes('contactPerson')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                contactPerson: {
                    ...formData.contactPerson,
                    [field]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
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
    
                        // Menyiapkan data yang akan disimpan ke Firestore
                        const updateData = {
                            ...formData,
                            thumbnail: url,
                            contactPerson: {
                                name: formData.contactPerson.name || '',  // Default ke string kosong jika undefined
                                no: formData.contactPerson.no || '',
                            },
                            dusun: formData.dusun || '', // Default ke string kosong jika undefined
                            locationAddress: formData.locationAddress || '', // Default ke string kosong
                            locationGmaps: formData.locationGmaps || '', // Default ke string kosong
                        };
    
                        // Menghapus field yang tidak perlu disimpan jika undefined atau null
                        Object.keys(updateData).forEach(key => {
                            if (updateData[key] === undefined || updateData[key] === null) {
                                delete updateData[key];
                            }
                        });
    
                        // Update dokumen di Firestore
                        const docRef = doc(collection(db, 'kesehatans'), idkegiatan);
                        await updateDoc(docRef, updateData);
    
                        alert('Data successfully updated!');
                        
                        // Reset form data setelah submit
                        setFormData({
                            title: '',
                            description: '',
                            schedule: '',
                            additionalInfo: '',
                            contactPerson: {
                                name: '',
                                no: '',
                                description: '', // Jika ada deskripsi
                            },
                            dusun: '',
                            locationAddress: '',
                            locationGmaps: '',
                            thumbnail: '',
                        });
                        setThumbnailFile(null);
                        setUploadProgress(0);
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
        <br></br><br></br><br></br>
        <Container className="mt-4">
            <Card className="p-4 shadow-sm">
                <h2 className="text-center mb-4">Modifikasi Data Kegiatan Kesehatan</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
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
                            </Form.Group>
                        </Col>
                    </Row>
                    <br></br>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Enter description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <br></br>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formSchedule">
                                <Form.Label>Schedule</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter schedule"
                                    name="schedule"
                                    value={formData.schedule}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formContactPersonName">
                                <Form.Label>Contact Person Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter contact person name"
                                    name="contactPerson.name"
                                    value={formData.contactPerson.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formContactPersonNo">
                                <Form.Label>Contact Person Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter contact person number"
                                    name="contactPerson.no"
                                    value={formData.contactPerson.no}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formContactPersonDusun">
                                <Form.Label>Dusun</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    placeholder="Enter dusun"
                                    name="contactPerson.dusun"
                                    value={formData.dusun}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <br></br>

                 

                    <Form.Group controlId="formAdditionalInfo">
                        <Form.Label>Additional Information</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter additional information"
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br></br>

                    <Form.Group controlId="formLocationAddress">
                        <Form.Label>Location Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter location address"
                            name="locationAddress"
                            value={formData.locationAddress}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br></br>

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

export default DesaModifikasi;
