import React, { lazy, useEffect, useState } from "react";
import { servicesLandingPage } from "../data/index";
import Header2 from "../components/Header";
import Footer from "../components/Footer";
import { Row, Col, Card, Button } from "antd";
import { Link } from "react-router-dom";

const Productos = () => {
  return (
    <section>
      <Header2 />
      <hr></hr>
      <Row className="w-4/5 m-auto my-3">
        {servicesLandingPage.map((serv, index) => (
          <Col key={index} className="m-auto my-4" span={8}>
            <Card hoverable className="ant-card my-card m-auto w-2/3">
              <div className="ant-card-cover my-card-image-container">
                <img
                  src={serv.image}
                  alt={serv.text}
                  className="ant-card-cover-img my-card-image h-2/3"
                />
              </div>
              <div className="ant-card-body my-card-content">
                <h3>{serv.text}</h3>
                <h3 className="text-gray-700">{serv.precio}</h3>
                <Link to={`/servicio?id=${serv.id}`}>
                  <Button
                    type="primary"
                    className="w-full bg-primary hover:bg-secondary"
                    target={serv.link}
                  >
                    Reservar
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Footer />
    </section>
  );
};

export default Productos;
