import React from "react";
import TableUsers from "../components/TableUsers";

const Administrators = () => {
  return (
    <div>
      <TableUsers rol="ADMIN" />
    </div>
  );
};

export default Administrators;
