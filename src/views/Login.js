import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { auth } from "../firebase/firebase"; // Import auth dari firebase.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation untuk pesan
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore
import CustomNavbar from "./frontend/utils/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const location = useLocation(); // Untuk menangkap pesan dari register
  const navigate = useNavigate();
  const db = getFirestore(); // Initialize Firestore

  // Pengecekan sesi login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      navigate("/admin/dashboard"); // Redirect ke dashboard jika sudah login
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Ambil informasi pengguna setelah login
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid)); // Replace "users" with your collection name and use uid as document id
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Simpan status login dan data pengguna ke localStorage
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userName", userData.name || ""); // Menyimpan nama pengguna
        localStorage.setItem("userEmail", user.email); // Menyimpan email dari Firebase Auth

        // Redirect ke dashboard setelah login
        navigate("/admin/dashboard");
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
   <>
   <CustomNavbar/>
   <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              
              {/* Pesan sukses setelah register */}
              {location.state && location.state.message && (
                <p className="text-success text-center">{location.state.message}</p>
              )}
              
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Login
                </Button>
              </Form>
              <div className="text-center mt-3">
                <small>
                  Don't have an account? <a href="/register">Register</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
   </>
  );
};

export default Login;
