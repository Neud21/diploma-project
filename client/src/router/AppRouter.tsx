import "@/styles/main.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "@/components/AdminLayout";
import CourierLayout from "@/components/CourierLayout";
import Layout from "@/components/Layout";
import { RequireAuth } from "@/components/RequireAuth";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import About from "@/pages/About";
import AddItem from "@/pages/admin/AddItem";
import AddRestaurant from "@/pages/admin/AddRestaurant";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminRestaurant from "@/pages/admin/AdminRestaurant";
import Cart from "@/pages/Cart";
import Contacts from "@/pages/Contacts";
import CourierMain from "@/pages/CourierMain";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Registration from "@/pages/Registration";
import Restaurant from "@/pages/Restaurant";

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTRATION,
    element: <Registration />,
  },
  {
    path: ROUTES.ROOT,
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.RESTAURANT,
        element: <Restaurant />,
      },

      {
        path: ROUTES.CART,
        element: <Cart />,
      },
      {
        path: ROUTES.ABOUT,
        element: <About />,
      },
      {
        path: ROUTES.CONTACTS,
        element: <Contacts />,
      },
    ],
  },
  {
    path: ROUTES.ADMIN_ROOT,
    element: (
      <RequireAuth allowedRole={ROLES.ADMIN}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: ROUTES.ADMIN_RESTAURANT,
        element: <AdminRestaurant />,
      },
      {
        path: ROUTES.ITEM_ADD,
        element: <AddItem />,
      },
      {
        path: ROUTES.RESTAURANT_ADD,
        element: <AddRestaurant />,
      },
    ],
  },
  {
    path: ROUTES.COURIER_ROOT,
    element: (
      <RequireAuth allowedRole={ROLES.COURIER}>
        <CourierLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <CourierMain />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
