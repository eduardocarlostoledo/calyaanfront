import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "./features/authSlice";
import professionalReducer from "./features/professionalSlice";
import notificationsReducer from "./features/notificationsSlice";
import ordenesReducer from "./features/ordenesSlice";

export default configureStore({
  reducer: {
    auth: AuthReducer,
    professional: professionalReducer,
    notifications: notificationsReducer,
    ordenes: ordenesReducer,
  },
});