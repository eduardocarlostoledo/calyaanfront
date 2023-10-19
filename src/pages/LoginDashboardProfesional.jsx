import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteError,
  googleSignIn,
  login,
  setLogout,
} from "../redux/features/authSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-toastify";
import ButtonSpinner from "../components/ButtonSpinner";
import bg1 from "../assets/bg-1-auth.jpg";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import clienteAxios from "../config/axios";

const logindashboardProfesional = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    rol: "PROFESIONAL",
  });

  const { email, password } = userForm;

  function handleGoogleLoginSuccess(tokenResponse) {
    const accessToken = tokenResponse.access_token;
    dispatch(googleSignIn({ accessToken, navigate, toast, rute: "/ajustes" }));
  }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
  });

  useEffect(() => {
    dispatch(setLogout());
  }, []);

  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      return toast.error("Todos los campos son obligatorios");
    }

    dispatch(login({ userForm, navigate, toast, rute: "/ajustes" }));

    setUserForm({ email: "", password: "" });
  };

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-gray-700">Correo electrónico</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={email}
                placeholder="Ingresa tu dirección de correo electrónico"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover focus:bg-white focus:outline-none"
                autoFocus
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={password}
                placeholder="••••••••"
                minLength="6"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover focus:bg-white focus:outline-none"
              />
            </div>

            <div className="text-right mt-2">
              <Link
                to="/olvide-password"
                className="text-sm font-semibold text-gray-700 hover:text-bgHover focus:text-bgHover"
              >
                ¿Has olvidado tu contraseña?
              </Link>
            </div>

            {loading ? (
              <ButtonSpinner />
            ) : (
              <button
                type="submit"
                className="w-full block bg-gray-800 hover:bg-gray-900 focus:bg-gray-900 text-white font-semibold rounded-lg px-4 py-3 mt-6"
              >
                Acceder al Panel
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default logindashboardProfesional;

// import React, { lazy, useEffect, useState } from "react";

// import { Link, useNavigate, useParams } from "react-router-dom";

// import { useDispatch, useSelector } from "react-redux";
// import {
//     deleteError,
//     googleSignIn,
//     login,
//     setLogout,
// } from "../redux/features/authSlice";

// import { LazyLoadImage } from "react-lazy-load-image-component";
// import { toast } from "react-toastify";

// // const ButtonSpinner = lazy(() => import('../components/ButtonSpinner'))
// import ButtonSpinner from "../components/ButtonSpinner";

// import bg1 from "../assets/bg-1-auth.jpg";
// import { FcGoogle } from "react-icons/fc";
// import { useGoogleLogin } from "@react-oauth/google";
// import clienteAxios from "../config/axios";

// const LoginDashboard = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const { loading, error } = useSelector((state) => ({ ...state.auth }));

//     const [userForm, setUserForm] = useState({
//         email: "",
//         password: "",
//     });

//     const { email, password } = userForm;

//     function handleGoogleLoginSuccess(tokenResponse) {
//         const accessToken = tokenResponse.access_token;

//         dispatch(googleSignIn({ accessToken, navigate, toast }));
//     }

//     const logincongoogle = useGoogleLogin({
//         onSuccess: handleGoogleLoginSuccess,
//     });

//     useEffect(() => {
//         dispatch(setLogout());
//     }, []);

//     const handleChange = (e) => {
//         setUserForm({
//             ...userForm,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if ([email, password].includes("")) {
//             return toast.error("Todos los campos son obligatorios");
//         }

//         dispatch(login({ userForm, navigate, toast }));

//         setUserForm({ email: "", password: "" });
//     };

//     return (
//         <section className="flex flex-col md:flex-row h-screen items-center">

//             <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
//             flex items-center justify-center">

//                 <div className="w-full h-100">

//                     <form className="mt-6" onSubmit={handleSubmit}>
//                         <div className="mt-4">
//                             <label className="block text-gray-700">Correo electrónico</label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 onChange={handleChange}
//                                 value={email}
//                                 placeholder="Ingresa tu dirección de correo electrónico"
//                                 className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover focus:bg-white focus:outline-none"
//                                 autoFocus
//                             />
//                         </div>

//                         <div className="mt-4">
//                             <label className="block text-gray-700">Contraseña</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 onChange={handleChange}
//                                 value={password}
//                                 placeholder="••••••••"
//                                 minLength="6"
//                                 className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover
//                   focus:bg-white focus:outline-none"
//                             />
//                         </div>

//                         <div className="text-right mt-2">
//                             <Link
//                                 to="/olvide-password"
//                                 className="text-sm font-semibold text-gray-700 hover:text-bgHover focus:text-bgHover"
//                             >
//                                 ¿Has olvidado tu contraseña?
//                             </Link>
//                         </div>

//                         {loading ? (
//                             <ButtonSpinner />
//                         ) : (
//                             <button
//                                 type="submit"

//                                 className="w-full block bg-gray-800 hover:bg-gray-900 focus:bg-gray-900 text-white font-semibold rounded-lg px-4 py-3 mt-6"
//                             >
//                                 Acceder al Panel
//                             </button>
//                         )}
//                     </form>

//                 </div>
//             </div>
//         </section>
//     );
// };

// export default LoginDashboard;
