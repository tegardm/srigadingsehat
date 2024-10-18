import React from 'react';
import { Navbar, Nav, Container, Button, Row, Col } from 'react-bootstrap';
import CustomNavbar from './utils/Navbar'; // Import komponen Navbar
const LandingPage = () => {

    // Fetch data from Firestore
 

  return (
    <div>
      {/* Header */}
      <CustomNavbar/>

      {/* Hero Section */}
      <section className="hero-section position-relative">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-left">
              <h1 className="display-4 font-weight-bold">Selamat Datang di <br /> Srigading Sehat</h1>
              <p className="lead mt-3">
                Informasi kesehatan dan layanan medis untuk masyarakat Desa Srigading. Kami siap membantu Anda dengan layanan terbaik.
              </p>
              <Button variant="success" href="#learn-more" className="mt-4 px-4 py-2" style={{ borderRadius: '30px' }}>
                Pelajari Lebih Lanjut
              </Button>
            </Col>
            <Col md={6} className="mt-4 mt-md-0">
              <img
                src="https://via.placeholder.com/500"
                alt="Kesehatan Desa"
                className="img-fluid rounded shadow-lg"
                style={{ borderRadius: '15px' }}
              />
            </Col>
          </Row>
        </Container>
        {/* Background Gradien */}
        <div className="hero-background"></div>
      </section>

      {/* Custom CSS */}
      <style jsx="true">{`
        .hero-section {
          background: linear-gradient(135deg, rgba(0, 123, 85, 0.7), rgba(102, 230, 184, 0.5)), url('https://via.placeholder.com/1600x900');
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
          color: #fff;
        }
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .navbar {
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
