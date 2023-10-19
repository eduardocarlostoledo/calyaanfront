import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Line,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    flexWrap: "wrap",
    display: "flex",
    width: "100%",
  },
  divFull: {
    flexGrow: 1,
    width: "100%",
    height: "100%",
    padding: 10,
    margin: "auto",
    border: "1px black solid",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    width: "95%",
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 14,
    marginBottom: 10,
    borderBottom: 1, // Línea divisoria en la parte inferior del subencabezado
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    borderBottom: 0.5,
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  divider: {
    marginTop: 15,
    borderBottom: 1, // Línea divisoria
  },
  nav: {
    backgroundColor: "#EDA598", // Color de fondo
    padding: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  navText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white", // Color del texto
  },
});

const MyDocument = ({ siigoResponse, Orden }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.divFull}>
        <View style={styles.nav}>
          <Text style={styles.navText}>Calyaan</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Información del Cliente</Text>
          <Text style={styles.label}>Cedula del Cliente:</Text>
          <Text style={styles.value}>
            {siigoResponse.customer.identification}
          </Text>
          {/* Agregar más campos según tus necesidades */}
        </View>
        <View style={styles.section}>
          <Text style={styles.subheader}>Items</Text>
          {siigoResponse.items.map((item, index) => (
            <View key={index}>
              <Text style={styles.label}>Producto: {item.description}</Text>

              <Text style={styles.label}>Cantidad: {item.quantity}</Text>

              <Text style={styles.label}>Valor del producto: {item.price}</Text>

              <Text style={styles.label}>Valor total: {item.total}</Text>

              {index < siigoResponse.items.length - 1 && (
                <Line style={styles.divider} />
              )}
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <View>
            <Text style={styles.subheader}>Factura</Text>
            <Text style={styles.label}>Nombre: {siigoResponse.name}</Text>
            <Text style={styles.label}>Fecha: {siigoResponse.date}</Text>
          </View>
          <View>
            <Text style={styles.label}>Prefixo: {siigoResponse.prefix}</Text>
            <Text style={styles.label}>
              Id del documento: {siigoResponse.document.id}
            </Text>
            <Text style={styles.label}>Total: ${siigoResponse.total}</Text>
            <Text style={styles.label}>Pagamiento:</Text>
            {siigoResponse.payments.map((pay) => (
              <View>
                <Text style={styles.value}>{pay.name}</Text>
                <Text style={styles.value}>${pay.value}</Text>
              </View>
            ))}

            <Text style={styles.label}>Email:</Text>
            <Text
              style={{
                ...styles.value,
                padding: 5,
                backgroundColor:
                  siigoResponse.mail.status === "sent"
                    ? "rgba(0, 128, 0, 0.5)"
                    : siigoResponse.mail.status === "not_sent"
                    ? "rgba(255, 0, 0, 0.5)"
                    : "rgba(255, 255, 0, 0.5)",
              }}
            >
              {siigoResponse.mail.status === "sent"
                ? "Enviado"
                : siigoResponse.mail.status === "not_sent"
                ? "No enviado"
                : "No Facturado"}
            </Text>

            <Text style={styles.label}>{siigoResponse.mail.observations}</Text>
          </View>
          <View>
            <Text style={styles.label}>
              hora del servicio: {Orden.hora_servicio}
            </Text>
            <Text style={styles.label}>
              Localidad del servicio: {Orden.localidad_servicio}
            </Text>
            <Text style={styles.label}>
              Numero de Facturacion {siigoResponse.number}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
