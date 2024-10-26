import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, query, where, writeBatch, getFirestore, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap"; // Import React Bootstrap components

function Sekolah() {
  const [kegiatanData, setKegiatanData] = useState([]);
  const [error, setError] = useState(null);

  const { namadusun } = useParams();

  useEffect(() => {
    // Fetch data from Firestore
    const fetchKegiatanData = async () => {
      try {
        const kegiatanCollection = collection(db, "kegiatansekolahs");
        const kegiatanSnapshot = await getDocs(kegiatanCollection);
        const kegiatanList = kegiatanSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setKegiatanData(kegiatanList);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching kegiatan data: ", err);
      }
    };

    fetchKegiatanData();
  }, []);

  // Fungsi untuk menghapus kegiatan
  // Fungsi untuk menghapus kegiatan
// Fungsi untuk menghapus kegiatan
const truncateText = (text, maxWords) => {
  const words = text.split(' ');
  if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
};
// Function to delete a kegiatan
const handleDelete = async (id) => {
  if (window.confirm("Apakah Anda yakin ingin menghapus kegiatan ini ? jika menghapus maka semua data sekolah yang berkaitan dengan data kegiatan ini akan terhapus.")) {
    try {
      // Delete the kegiatan from the 'kegiatansekolahs' collection
      await deleteDoc(doc(db, "kegiatansekolahs", id));

      // Get Firestore instance
      const firestore = getFirestore();

      // Find documents in 'sekolahs' collection where 'idkegiatan' matches 'id'
      const sekolahsQuery = query(collection(firestore, "sekolahs"), where("idkegiatan", "==", id));
      const sekolahsSnapshot = await getDocs(sekolahsQuery);

      if (!sekolahsSnapshot.empty) {
        // Create a batch
        const batch = writeBatch(firestore);

        sekolahsSnapshot.forEach((sekolahDoc) => {
          const sekolahRef = doc(firestore, "sekolahs", sekolahDoc.id);
          batch.delete(sekolahRef);
        });

        // Commit the batch
        await batch.commit();
      }

      // Update the state after deletion
      setKegiatanData((prevData) => prevData.filter((kegiatan) => kegiatan.id !== id));
      alert("Kegiatan dan data terkait berhasil dihapus!");
    } catch (err) {
      console.error("Error deleting kegiatan: ", err);
      setError("Gagal menghapus kegiatan. Silakan coba lagi.");
    }
  }
};




  return (
    <div className="content">
      <Link to={`/admin/sekolah/tambah`}>
        <Button variant="success" className="mr-2">Tambah Kegiatan</Button>
      </Link>
      <h2 className="mb-4">Data Kegiatan Kesehatan Sekolah</h2>
      {error && <p>Error: {error}</p>}
      
      <Row>
        {kegiatanData && kegiatanData.length > 0 ? (
          kegiatanData.map((kegiatan, index) => (
            <Col md={6} key={index} className="mb-4">
              <Card>
                {/* Display thumbnail if available, otherwise use a placeholder */}
                <Card.Img 
                  variant="top"  style={{ width: '600px', height: '300px', objectFit: 'cover' }}
                  src={kegiatan.thumbnail || "https://via.placeholder.com/300x200?text=Kegiatan+Kesehatan+Sekolah"} 
                  alt="Kegiatan Kesehatan Sekolah" 
                />
                <Card.Body>
                  <Card.Title>{kegiatan.title || "Nama kegiatan tidak diketahui"}</Card.Title>
                  <Card.Text>
                    {truncateText(kegiatan.description, 20) || "Deskripsi tidak tersedia"}
                  </Card.Text>
                  <Link to={`/admin/sekolah/${kegiatan.id}`}>
                    <Button variant="success" className="mr-2">Lihat Kegiatan</Button>
                  </Link>
                  <Link to={`/admin/sekolah/${kegiatan.id}/modifikasi`}>
                    <Button variant="warning" className="mr-2">Modifikasi Kegiatan</Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDelete(kegiatan.id)}>Hapus Kegiatan</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Data tidak tersedia.</p>
        )}
      </Row>
    </div>
  );
}

export default Sekolah;
