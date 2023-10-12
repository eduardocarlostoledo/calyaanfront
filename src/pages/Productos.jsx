import React, { lazy, useEffect, useState } from "react";
import { servicesLandingPage } from "../data/index";
import Header2 from "../components/Header";
import Footer from "../components/Footer";
import { Row, Col, Card, Button } from "antd";
import { Link } from "react-router-dom";

const Productos = () => {
  window.scrollTo(0, 0);
  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8">
  {/* Utilizamos una clase 'container' para centrar el contenido y limitar su ancho. Las clases 'sm', 'md', etc., se utilizan para definir el ancho en diferentes tamaños de pantalla. */}

  <Header2 />
  <hr></hr>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {/* Utilizamos una cuadrícula (grid) para organizar los elementos en filas y columnas. Las clases 'grid-cols-X' definen el número de columnas en diferentes tamaños de pantalla. 'gap-4' agrega espacio entre los elementos. */}

    {servicesLandingPage.map((serv, index) => (
      <div key={index} className="mb-4 mt-8 text-center" >
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img
            src={serv.image}
            alt={serv.text}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold">{serv.text}</h3>
            <p className="text-gray-700">{serv.precio}</p>
            <Link to={`/servicio?id=${serv.id}`}>
              <button
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-full mt-8"
                target={serv.link}
              >
                Reservar
              </button>
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>

  <Footer />
</section>

    // <section>
    //   <Header2 />
    //   <hr></hr>
    //   <Row className="w-4/5 m-auto my-3">
    //     {servicesLandingPage.map((serv, index) => (
    //       <Col key={index} className="m-auto my-4" span={8}>
    //         <Card hoverable className="ant-card my-card m-auto w-2/3">
    //           <div className="ant-card-cover my-card-image-container">
    //             <img
    //               src={serv.image}
    //               alt={serv.text}
    //               className="ant-card-cover-img my-card-image h-2/3"
    //             />
    //           </div>
    //           <div className="ant-card-body my-card-content text-center"> {/* Añade la clase text-center */}
    //             <h3>{serv.text}</h3>
    //             <h3 className="text-gray-700">{serv.precio}</h3>
    //             <Link to={`/servicio?id=${serv.id}`}>
    //               <Button
    //                 type="primary"
    //                 className="w-full bg-primary hover:bg-secondary"
    //                 target={serv.link}
    //               >
    //                 Reservar
    //               </Button>
    //             </Link>
    //           </div>
    //         </Card>
    //       </Col>
    //     ))}
    //   </Row>
    //   <Footer />
    // </section>
  );
};

export default Productos;

// import React, { lazy, useEffect, useState } from "react";
// import { servicesLandingPage } from "../data/index";
// import Header2 from "../components/Header";
// import Footer from "../components/Footer";
// import { Row, Col, Card, Button } from "antd";
// import { Link } from "react-router-dom";

// const Productos = () => {
//   window.scrollTo(0, 0);
//   return (
//     <section>
//       <Header2 />
//       <hr></hr>
//       <Row className="w-4/5 m-auto my-3">
//         {servicesLandingPage.map((serv, index) => (
//           <Col key={index} className="m-auto my-4" span={8}>
//             <Card hoverable className="ant-card my-card m-auto w-2/3">
//               <div className="ant-card-cover my-card-image-container">
//                 <img
//                   src={serv.image}
//                   alt={serv.text}
//                   className="ant-card-cover-img my-card-image h-2/3"
//                 />
//               </div>
//               <div className="ant-card-body my-card-content">
//                 <h3>{serv.text}</h3>
//                 <h3 className="text-gray-700">{serv.precio}</h3>
//                 <Link to={`/servicio?id=${serv.id}`}>
//                   <Button
//                     type="primary"
//                     className="w-full bg-primary hover:bg-secondary"
//                     target={serv.link}
//                   >
//                     Reservar
//                   </Button>
//                 </Link>
//               </div>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//       <Footer />
//     </section>
//   );
// };

// export default Productos;
