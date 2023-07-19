import { lazy, useEffect } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";

const ServicesLayout = lazy(() => import("./layout/ServicesLayout"));
const ProfileLayout = lazy(() => import("./layout/ProfileLayout"));
const DashboardLayout = lazy(() => import("./layout/DashboardLayout"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Services = lazy(() => import("./pages/Services"));
const ConfirmAccount = lazy(() => import("./pages/ConfirmAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NewPassword = lazy(() => import("./pages/NewPassword"));
const Settings = lazy(() => import("./pages/private/Settings"));
const Dashboard = lazy(() => import("./pages/private/dashboard/Dashboard"));
const Schedule = lazy(() => import("./pages/private/professional/Schedule"));
const RegisterProfessional = lazy(() => import("./pages/RegisterProfessional"));
const Service = lazy(() => import("./pages/Service"));
const Address = lazy(() => import("./pages/private/Address"));
const HistoryServicesProfessional = lazy(() =>
  import("./pages/private/professional/HistoryServicesProfessional")
);
const CalendarProfesional = lazy(() =>
  import("./pages/private/professional/CalendarProfesional")
);
const Favorites = lazy(() => import("./pages/private/Favorites"));
const HistoryServices = lazy(() => import("./pages/private/HistoryServices"));
const UpdateProfile = lazy(() =>
  import("./pages/private/professional/UpdateProfile")
);
const ScheduleUsers = lazy(() =>
  import("./pages/private/dashboard/pages/ScheduleUsers")
);
const Users = lazy(() => import("./pages/private/dashboard/pages/Users"));
const Professionals = lazy(() =>
  import("./pages/private/dashboard/pages/Professionals")
);
const Customers = lazy(() =>
  import("./pages/private/dashboard/pages/Customers")
);
const Administrators = lazy(() =>
  import("./pages/private/dashboard/pages/Administrators")
);

import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";

import { ROLES } from "./helpers/Logic/roles";
import RoutesWithNotFound from "./helpers/Components/RoutesWithNotFound";

import "react-toastify/dist/ReactToastify.css";
import Wordpress from "./pages/Wordpress";
import Reservation from "./components/ReservatioSteps/Reservation";
import ScheduleByProfessionalForm from "./components/ScheduleByProfessionalForm";
import ScheduleByDateForm from "./components/ScheduleByDateForm";
import Reservas from "./pages/private/dashboard/pages/Reservas";
import Pages from "./pages/Pages";
import Sumary from "./pages/Sumary";
import SumaryProfesional from "./pages/SumaryProfesional";
import SumaryAdmin from "./pages/SumaryAdmin";
import Fidelidad from "./pages/private/Fidelidad";
import FidelidadProfesional from "./pages/private/professional/FidelidadProfesional";
import Referencias from "./pages/private/Referencias";
import { useDispatch, useSelector } from "react-redux";
import { removeMessage } from "./redux/features/notificationsSlice";
import Ver from "./pages/ver";
import PageReferred from "./helpers/Components/PageReferred";
import CalendarDashboard from "./pages/private/dashboard/pages/Calendar";
import ProfessionalProfile from "./pages/private/dashboard/pages/ProfessionalProfile";
import CalendarWeek from "./pages/private/dashboard/pages/CalendarWeek";
import CalendarDay from "./pages/private/dashboard/pages/CalendarDay";
import Transactions from "./pages/private/dashboard/pages/Transactions";
import CustomerProfile from "./pages/private/dashboard/pages/CustomerProfile";
import HistoryServicesCustomer from "./pages/private/dashboard/pages/HistoryServicesCustomer";
import AdminProfile from "./pages/private/dashboard/pages/AdminProfile";
import ScheduledReservationsAdmin from "./pages/private/dashboard/pages/ScheduledReservationsAdmin";
import CreateReservation from "./pages/private/dashboard/pages/CreateReservation";
import HistoryScheduledProfessional from "./pages/private/dashboard/pages/HistoryScheduledProfessional";
import OrdenesAntDesing from "./pages/private/dashboard/pages/Ordenesantd";
import FacturacionAntDesing from "./pages/private/dashboard/pages/Facturacionantd";
import LiquidacionAntDesing from "./pages/private/dashboard/pages/Liquidacionantd";
import HorarioProfessionalAntDesing from "./pages/private/dashboard/pages/HorariosProfesionales";
import Tools from "./pages/private/dashboard/pages/Tools";
import CardsProfessionalAntDesing from "./pages/CardsProfesionales";
import OrdenDetails from "./pages/private/dashboard/pages/OrderDetails"
import LiquidacionAllAntDesing from "./pages/private/dashboard/pages/liquidacionesAll";
import clienteAxios from "./config/axios";

function App() {
  const { message } = useSelector((state) => ({ ...state.notifications }));

  const dispatch = useDispatch();

  useEffect(() => {
    message.type === "error"
      ? toast.error(message.text)
      : message.type === "successful" && toast.success(message.text);

    setTimeout(() => {
      dispatch(removeMessage());
    }, 2000);
  }, [message]);

  useEffect(() => {
   const obtenerUsuario = async ()=>{
    try{
      const token = JSON.parse(localStorage.getItem("profile"))?.token;
      if(token){
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await clienteAxios.get("api/usuarios/obtener-usuario",headers);
    
        dispatch(setUser(response.data))
      }
    }catch(err){
        console.log(err)
    }
   }
   obtenerUsuario()
  }, [dispatch]);

  return (
    <Router>
      <ToastContainer limit={1} autoClose={2000} />

      <RoutesWithNotFound>
        <Route path="/ver" element={<Ver />} />
        {/* Public Routes */}
        <Route element={<ServicesLayout />}>
          <Route index path="/servicios" element={<Services />} />
          <Route path="/servicio" element={<Service />} />
        </Route>

        <Route path="/" element={<Login />} />

        <Route path="/registro" element={<PageReferred />} />

        <Route
          path="/Proximos-Horarios"
          element={<CardsProfessionalAntDesing />}
        />

        <Route
          path="/registro/confirmar/:idtoken"
          element={<ConfirmAccount />}
        />
        <Route path="/olvide-password" element={<ForgotPassword />} />
        <Route path="/nueva-password/:idtoken" element={<NewPassword />} />
        <Route
          path="/registro/profesional"
          element={<RegisterProfessional />}
        />

        <Route path="/wordpress" element={<Wordpress />} />

        {/* Private Routes */}
        <Route element={<AuthGuard />}>
          <Route element={<ServicesLayout />}>
            <Route path="/reserva" element={<Reservation />} />
            <Route
              path="/reserva/profesional"
              element={<ScheduleByProfessionalForm />}
            />
            <Route path="/reserva/fecha" element={<ScheduleByDateForm />} />
            <Route path="/pago" element={<Pages />} />
            <Route path="/resumen/:id" element={<Sumary />} />
          </Route>

          <Route element={<ProfileLayout />}>
            <Route path="/ajustes" element={<Settings />} />
            <Route path="/direcciones" element={<Address />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/historial" element={<HistoryServices />} />
            <Route path="/fidelidad" element={<Fidelidad />} />
            <Route
              path="/fidelidad-profesional"
              element={<FidelidadProfesional />}
            />
            <Route path="/referidos" element={<Referencias />} />
          </Route>
        </Route>

        {/* Private Routes - Professional */}
        <Route element={<RoleGuard rol={[ROLES.PROFESSIONAL, ROLES.ADMIN]} />}>
          <Route element={<ProfileLayout />}>
            <Route
              path="/historial-servicios"
              element={<HistoryServicesProfessional />}
            />
            <Route path="/horarios" element={<Schedule />} />
            <Route path="/calendario" element={<CalendarProfesional />} />
            <Route path="/perfil-profesional" element={<UpdateProfile />} />
          </Route>

          <Route element={<ServicesLayout />}>
            <Route
              path="/resumen-profesional/:id"
              element={<SumaryProfesional />}
            />
          </Route>
        </Route>

        {/* Private Routes - Admin */}
        <Route element={<RoleGuard rol={[ROLES.ADMIN]} />}>
          <Route element={<ServicesLayout />}>
            <Route path="/resumen-admin/:id" element={<SumaryAdmin />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/herramientas" element={<Tools />} />
            <Route path="/detalles-orden" element={<OrdenDetails />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/profesionales" element={<Professionals />} />
            <Route path="/clientes" element={<Customers />} />
            <Route path="/administradores" element={<Administrators />} />
            <Route path="/horarios-usuarios" element={<ScheduleUsers />} />
            <Route
              path="/horarios-profesionales"
              element={<HorarioProfessionalAntDesing />}
            />
            <Route path="/reservas" element={<Reservas />} />
            <Route
              path="/calendario-reservas"
              element={<CalendarDashboard />}
            />
            <Route path="/calendario-semanal/:id" element={<CalendarWeek />} />
            <Route path="/calendario/diario/:id" element={<CalendarDay />} />
            <Route
              path="/dashboard/perfil-profesional/:id"
              element={<ProfessionalProfile />}
            />
            <Route
              path="/dashboard/perfil-cliente/:id"
              element={<CustomerProfile />}
            />
            <Route
              path="/dashboard/perfil-admin/:id"
              element={<AdminProfile />}
            />
            <Route path="/transacciones" element={<Transactions />} />
            <Route
              path="/historial-servicios/cliente/:id"
              element={<HistoryServicesCustomer />}
            />
            <Route
              path="/historial-servicios/profesional/:id"
              element={<HistoryScheduledProfessional />}
            />
            <Route
              path="/historial-servicios/admin/:id"
              element={<ScheduledReservationsAdmin />}
            />
            <Route path="/reservar" element={<CreateReservation />} />
            <Route path="/ordenesantdesing" element={<OrdenesAntDesing />} />
            <Route
              path="/facturacionantdesing"
              element={<FacturacionAntDesing />}
            />
            <Route
              path="/liquidacionantdesing"
              element={<LiquidacionAntDesing />}
            />
            <Route
              path="/liquidacionestotales"
              element={<LiquidacionAllAntDesing />}
            />
          </Route>
        </Route>
      </RoutesWithNotFound>
    </Router>
  );
}

export default App;

//https://source.unsplash.com/random
