import React, { useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';

const FasilitasModifikasi = () => {
    // Dummy data untuk fasilitas kesehatan
    const [fasilitas, setFasilitas] = useState({
        nama: "Puskesmas Srigading",
        alamat: "Jl. Raya No.123, Desa Srigading",
        cp_petugas: "0812-3456-7890",
        deskripsi: "Puskesmas Srigading menyediakan berbagai layanan kesehatan masyarakat.",
        jam_operasional: "Senin - Jumat: 08:00 - 16:00",
        layanan: ["Pengobatan Umum", "Imunisasi", "Konsultasi Gizi", "Pemeriksaan Kehamilan", "Pelayanan Kesehatan Jiwa"],
        thumbnail: null,
    });

    const [layananBaru, setLayananBaru] = useState('');

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
        // Menghapus layanan berdasarkan index
        setFasilitas((prev) => ({
            ...prev,
            layanan: prev.layanan.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logika untuk menyimpan perubahan data fasilitas
        console.log("Data Fasilitas yang dimodifikasi:", fasilitas);
        // Tambahkan logika penyimpanan di sini (misalnya, panggilan API)
        if (fasilitas.thumbnail) {
            console.log("Thumbnail file:", fasilitas.thumbnail);
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
                    <Form.Control
                        type="text"
                        placeholder="Masukkan Jam Operasional"
                        name="jam_operasional"
                        value={fasilitas.jam_operasional}
                        onChange={handleInputChange}
                    />
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
