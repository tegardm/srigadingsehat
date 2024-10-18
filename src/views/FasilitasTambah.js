import React, { useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { db } from '../firebase/firebase'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

const FasilitasTambah = () => {
    const [fasilitasBaru, setFasilitasBaru] = useState({
        nama: "",
        alamat: "",
        cp_petugas: "",
        deskripsi: "",
        jam_operasional: {
            waktuBuka: "",
            waktuTutup: "",
            hariBuka: []
        },
        layanan: [],
        dusun: "", // Tambahkan properti dusun di sini
        thumbnail: ""
    });
    

    const [layananBaru, setLayananBaru] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null); // For storing the image file
    const [selectedHari, setSelectedHari] = useState(''); // State for selected day
    const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFasilitasBaru((prev) => ({ ...prev, [name]: value }));
    };

    const handleLayananChange = (e) => {
        setLayananBaru(e.target.value);
    };

    const handleLayananAdd = (e) => {
        e.preventDefault();
        if (layananBaru) {
            setFasilitasBaru((prev) => ({
                ...prev,
                layanan: [...prev.layanan, layananBaru],
            }));
            setLayananBaru('');
        }
    };

    const handleLayananRemove = (index) => {
        setFasilitasBaru((prev) => ({
            ...prev,
            layanan: prev.layanan.filter((_, i) => i !== index),
        }));
    };

    const handleThumbnailChange = (e) => {
        setThumbnailFile(e.target.files[0]);
    };

    const handleJamOperasionalChange = (e) => {
        const { name, value } = e.target;
        setFasilitasBaru((prev) => ({
            ...prev,
            jam_operasional: {
                ...prev.jam_operasional,
                [name]: value,
            }
        }));
    };

    // Function to handle day selection
    const handleDaySelect = () => {
        if (selectedHari && !fasilitasBaru.jam_operasional.hariBuka.includes(selectedHari)) {
            setFasilitasBaru((prev) => ({
                ...prev,
                jam_operasional: {
                    ...prev.jam_operasional,
                    hariBuka: [...prev.jam_operasional.hariBuka, selectedHari],
                }
            }));
            setSelectedHari(''); // Reset selected day
        }
    };

    // Function to handle removal of selected days
    const handleDayRemove = (hari) => {
        setFasilitasBaru((prev) => ({
            ...prev,
            jam_operasional: {
                ...prev.jam_operasional,
                hariBuka: prev.jam_operasional.hariBuka.filter(h => h !== hari),
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (thumbnailFile) {
                const storage = getStorage();
                const storageRef = ref(storage, `thumbnails/${thumbnailFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, thumbnailFile);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // You can add a progress bar or loading indicator here
                    },
                    (error) => {
                        console.error("Error uploading thumbnail: ", error);
                        alert("Terjadi kesalahan saat mengunggah thumbnail.");
                    },
                    async () => {
                        // Get the image URL after upload completion
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        await addDoc(collection(db, "fasilitas"), { ...fasilitasBaru, thumbnail: downloadURL });
                        alert("Fasilitas berhasil ditambahkan!");
                        // Reset form after data added
                        setFasilitasBaru({
                            nama: "",
                            alamat: "",
                            cp_petugas: "",
                            deskripsi: "",
                            jam_operasional: {
                                waktuBuka: "",
                                waktuTutup: "",
                                hariBuka: []
                            },
                            layanan: [],
                            thumbnail: ""
                        });
                        setThumbnailFile(null);
                    }
                );
            } else {
                alert("Silakan pilih thumbnail.");
            }
        } catch (error) {
            console.error("Error menambahkan fasilitas: ", error);
            alert("Terjadi kesalahan saat menambahkan fasilitas.");
        }
    };

    return (
        <>
        <br></br><br></br><br></br>
        <Container className="mt-4">
            <h2>Tambah Fasilitas Kesehatan</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNama">
                    <Form.Label>Nama Fasilitas</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Masukkan Nama Fasilitas"
                        name="nama"
                        value={fasilitasBaru.nama}
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
                        value={fasilitasBaru.alamat}
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
                        value={fasilitasBaru.cp_petugas}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <br></br>
                                <Form.Group controlId="formDusun">
                    <Form.Label>Dusun</Form.Label>
                    <Form.Control
                        as="select"
                        name="dusun"
                        value={fasilitasBaru.dusun}
                        onChange={handleInputChange}
                    >
                        <option value="">Pilih Dusun</option>
                        <option value="Krajan">Krajan</option>
                        <option value="Gading">Gading</option>
                        <option value="Mendek">Mendek</option>
                        <option value="Jeruk">Jeruk</option>
                    </Form.Control>
                                </Form.Group>
                <br />
                
                <Form.Group controlId="formJamOperasional">
                    <Form.Label>Jam Operasional</Form.Label>
                    <Form.Control
                        type="time"
                        name="waktuBuka"
                        value={fasilitasBaru.jam_operasional.waktuBuka}
                        onChange={handleJamOperasionalChange}
                    />
                    <Form.Control
                        type="time"
                        name="waktuTutup"
                        value={fasilitasBaru.jam_operasional.waktuTutup}
                        onChange={handleJamOperasionalChange}
                        className="mt-2"
                    />
                    <div className="mt-3">
                        <Form.Label>Hari Buka</Form.Label>
                        <div className="d-flex">
                            <Form.Control
                                as="select"
                                value={selectedHari}
                                onChange={(e) => setSelectedHari(e.target.value)}
                            >
                                <option value="">Pilih Hari</option>
                                {hariList.map((hari, index) => (
                                    <option key={index} value={hari} disabled={fasilitasBaru.jam_operasional.hariBuka.includes(hari)}>
                                        {hari}
                                    </option>
                                ))}
                            </Form.Control>
                            <Button variant="success" onClick={handleDaySelect} className="ml-2">
                                Tambah
                            </Button>
                        </div>
                        <ListGroup className="mt-2">
                            {fasilitasBaru.jam_operasional.hariBuka.map((hari, index) => (
                                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                    {hari}
                                    <Button variant="danger" size="sm" onClick={() => handleDayRemove(hari)}>
                                        Hapus
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Form.Group>
                <br />
                <Form.Group controlId="formDeskripsi">
                    <Form.Label>Deskripsi</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Masukkan Deskripsi"
                        name="deskripsi"
                        value={fasilitasBaru.deskripsi}
                        onChange={handleInputChange}
                    />
                    </Form.Group>
                               
<br />

                <br />
                <Form.Group controlId="formThumbnail">
                    <Form.Label>Thumbnail</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                    />
                </Form.Group>
                <br />
                <Form.Group controlId="formLayanan">
                    <Form.Label>Layanan Tersedia</Form.Label>
                    <ListGroup className="mb-3">
                        {fasilitasBaru.layanan.map((layanan, index) => (
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
                        placeholder="Masukkan Layanan"
                        value={layananBaru}
                        onChange={handleLayananChange}
                    />
                    <Button variant="primary" onClick={handleLayananAdd} className="mt-2">
                        Tambah Layanan
                    </Button>
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    Simpan Fasilitas
                </Button>
            </Form>
        </Container>
        </>
    );
};

export default FasilitasTambah;
