import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, ProgressBar } from "react-bootstrap";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function SekolahListTambah() {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [dusun, setDusun] = useState("Krajan");
  const [thumbnail, setThumbnail] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const [contactPerson, setContactPerson] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [locationGmaps, setLocationGmaps] = useState("");
  const [schedule, setSchedule] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");

  const navigate = useNavigate();
  const { idkegiatan } = useParams();

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const kegiatanRef = doc(db, "kegiatansekolahs", idkegiatan);
        const docSnap = await getDoc(kegiatanRef);

        if (docSnap.exists()) {
          setNamaKegiatan(docSnap.data().title || "");
        } else {
          setError("Kegiatan tidak ditemukan.");
        }
      } catch (err) {
        setError("Gagal mengambil data kegiatan: " + err.message);
      }
    };

    fetchKegiatan();
  }, [idkegiatan]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      setError("Silakan pilih file thumbnail untuk di-upload.");
      return;
    }

    const storageRef = ref(storage, `thumbnails/${thumbnail.name}`);
    const uploadTask = uploadBytesResumable(storageRef, thumbnail);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (err) => {
        setError(err.message);
        console.error("Error uploading file: ", err);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        try {
          // Add the new school to the 'sekolahs' collection
          await addDoc(collection(db, "sekolahs"), {
            nama,
            alamat,
            dusun,
            thumbnail: downloadURL,
            idkegiatan, // Include the idkegiatan for filtering
            kegiatan: {
              contactPerson: {
                name: contactPerson,
                no: contactNo,
              },
              description: deskripsi,
              locationGmaps,
              schedule,
              additionalInfo,
              title: namaKegiatan,
              thumbnail: downloadURL,
            },
          });

          navigate(`/admin/sekolah/${idkegiatan}`);
        } catch (err) {
          setError(err.message);
          console.error("Error adding document: ", err);
        }
      }
    );
  };

  return (
    <Container>
      <br /><br /><br /><br /><br />
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3 className="mb-4">Tambah Data Sekolah dan Detail Kegiatan {namaKegiatan}</h3>
          {error && <p className="text-danger">Error: {error}</p>}
          <Form onSubmit={handleSubmit}>
            <h5>Informasi Sekolah</h5>
            <Form.Group controlId="formNama" className="mt-3">
              <Form.Label>Nama Sekolah</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama sekolah"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAlamat" className="mt-3">
              <Form.Label>Alamat Sekolah</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan alamat sekolah"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDusun" className="mt-3">
              <Form.Label>Dusun</Form.Label>
              <Form.Control
                as="select"
                value={dusun}
                onChange={(e) => setDusun(e.target.value)}
                required
              >
                <option value="krajan">Krajan</option>
                <option value="gading">Gading</option>
                <option value="mendek">Mendek</option>
                <option value="jeruk">Jeruk</option>
              </Form.Control>
            </Form.Group>
            <br /><br />
            <h5>Informasi Kegiatan</h5>
            <Form.Group controlId="formNamaKegiatan">
              <Form.Label>Nama Kegiatan</Form.Label>
              <Form.Control
                type="text"
                value={namaKegiatan}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formDeskripsi" className="mt-3">
              <Form.Label>Deskripsi Kegiatan</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Masukkan deskripsi kegiatan"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formContactPerson" className="mt-3">
              <Form.Label>Nama Kontak (CP)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Kontak"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formContactNo" className="mt-3">
              <Form.Label>Nomor Kontak</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nomor kontak"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formLocationGmaps" className="mt-3">
              <Form.Label>Link Google Maps</Form.Label>
              <Form.Control
                type="url"
                placeholder="Masukkan link Google Maps"
                value={locationGmaps}
                onChange={(e) => setLocationGmaps(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formSchedule" className="mt-3">
              <Form.Label>Jadwal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan jadwal kegiatan"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formAdditionalInfo" className="mt-3">
              <Form.Label>Informasi Tambahan</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Masukkan informasi tambahan"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formThumbnail" className="mt-3">
              <Form.Label>Thumbnail</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setThumbnail(e.target.files[0])}
                required
              />
              {progress > 0 && <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mt-2" />}
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4">
              Tambah Sekolah dan Kegiatan
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SekolahListTambah;
