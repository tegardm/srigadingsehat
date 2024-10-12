import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LingkunganModifikasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    tanggalLahir: '',
    pekerjaan: '',
    nomorTelepon: ''
  });

  useEffect(() => {
    const fetchDummyData = () => {
      const dummyData = {
        '1': {
          nama: 'John Doe',
          alamat: 'Jl. Contoh No. 1',
          tanggalLahir: '1990-01-01',
          pekerjaan: 'Pengembang',
          nomorTelepon: '08123456789'
        },
        '2': {
          nama: 'Jane Smith',
          alamat: 'Jl. Contoh No. 2',
          tanggalLahir: '1992-02-02',
          pekerjaan: 'Desainer',
          nomorTelepon: '08198765432'
        },
      };

      const data = dummyData[id] || {};
      setFormData(data);
    };

    fetchDummyData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Data penduduk berhasil diperbarui!');
    navigate('/penduduk');
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="col-md-6 p-4 bg-white shadow rounded">
        <h2 className="text-center mb-4">Edit Data Lingkungan</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nama">Nama Penduduk</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="alamat">Alamat</label>
            <input
              type="text"
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tanggalLahir">Tanggal Lahir</label>
            <input
              type="date"
              id="tanggalLahir"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pekerjaan">Pekerjaan</label>
            <input
              type="text"
              id="pekerjaan"
              name="pekerjaan"
              value={formData.pekerjaan}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nomorTelepon">Nomor Telepon</label>
            <input
              type="text"
              id="nomorTelepon"
              name="nomorTelepon"
              value={formData.nomorTelepon}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success btn-block"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
};

export default LingkunganModifikasi
