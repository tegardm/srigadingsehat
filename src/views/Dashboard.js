import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import { db } from "../firebase/firebase"; // Import Firestore configuration
import {
  collection,
  getDocs,
} from "firebase/firestore";

function Dashboard() {
  const [data, setData] = useState({
    totalPenduduk: 0,
    totalFasilitasKesehatan: 0,
    totalSekolah: 0,
    totalKegiatanKesehatan: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const pendudukSnapshot = await getDocs(collection(db, "penduduks"));
      const sekolahSnapshot = await getDocs(collection(db, "sekolahs"));
      const fasilitasSnapshot = await getDocs(collection(db, "fasilitas"));
      const kesehatanSnapshot = await getDocs(collection(db, "kesehatans"));

      setData({
        totalPenduduk: pendudukSnapshot.size,
        totalSekolah: sekolahSnapshot.size,
        totalFasilitasKesehatan: fasilitasSnapshot.size,
        totalKegiatanKesehatan: kesehatanSnapshot.size,
      });
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Jumlah Data Penduduk</p>
                      <CardTitle tag="p">{data.totalPenduduk}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Jumlah Fasilitas Kesehatan Desa</p>
                      <CardTitle tag="p">{data.totalFasilitasKesehatan}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Jumlah Sekolah Desa</p>
                      <CardTitle tag="p">{data.totalSekolah}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Jumlah Kegiatan Kesehatan</p>
                      <CardTitle tag="p">{data.totalKegiatanKesehatan}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
