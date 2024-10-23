// CustomNavbar.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    <Navbar bg="transparent" variant="light" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand href="#home" className="font-weight-bold text-success">Srigading Sehat</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/" className="text-dark">Home</Nav.Link>
            <Nav.Link href="/penduduk" className="text-dark">Penduduk</Nav.Link>
            <Nav.Link href="/kesehatan" className="text-dark">Kesehatan Desa</Nav.Link>
            <Nav.Link href="/kesehatan-sekolah" className="text-dark">Kesehatan Sekolah</Nav.Link>
            <Nav.Link href="/fasilitas" className="text-dark">Fasilitas</Nav.Link>

            <Nav.Link href="/lingkungan" className="text-dark">Lingkungan</Nav.Link>
            {localStorage.getItem('isLoggedIn') ? (
              <Nav.Link href="/login" className="text-dark">{localStorage.getItem('userName')} (Admin)</Nav.Link>
            ) : <Nav.Link href="/login" className="text-dark">Login</Nav.Link>}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
