const limpiarHorarios = (horarios) => {
  const hoursWithAmPm = horarios.map((h) => {
    const time = h.split(" - ")[0];
    const [hour, minute] = time.split(":");
    const amPm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12}:${minute} ${amPm}`;
  });

  return hoursWithAmPm
};

export default limpiarHorarios;



