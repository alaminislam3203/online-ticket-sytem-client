import { createBrowserRouter } from 'react-router';
import Root from './Root';
import AdminRoute from './AdminRoute';
import VendorRoute from './VendorRoute.jsx';
import Error from '../error/Error';
import Home from '../Pages/Home';
import Login from '../user/Login';
import Register from '../user/Register';
import AllTickets from '../Pages/AllTickets';

import PrivateRoute from './PrivateRoute';
import TransactionHistory from '../dashboard/userDashborad/TransactionHistory';
import UserProfile from '../dashboard/userDashborad/UserProfile';
import BookedTickets from '../dashboard/userDashborad/BookedTickets';

import AdminProfile from '../dashboard/adminDashborad/AdminProfile';
import ManageUsers from '../dashboard/adminDashborad/ManageUsers';
import ManageTickets from '../dashboard/adminDashborad/ManageTickets';
import AdminPayments from '../dashboard/adminDashborad/AdminPayments.jsx';

import ManuVendor from '../dashboard/vendorDashboard/ManuVendor.jsx';
import AddTicket from '../dashboard/vendorDashboard/AddTicket.jsx';
import MyAddedTickets from '../dashboard/vendorDashboard/MyAddedTickets.jsx';
import RequestedBookings from '../dashboard/vendorDashboard/RequestedBookings.jsx';
import RevenueOverview from '../dashboard/vendorDashboard/RevenueOverview.jsx';

import Success from '../stripe/Success.jsx';
import Cancel from '../stripe/Cancel.jsx';
import DashboardLayout from '../layout/DashboardLayout';
import ManuAdmin from '../dashboard/adminDashborad/ManuAdmin';
import SearchResults from '../home/SearchResults.jsx';
import ContactForm from '../home/Contact.jsx';
import About from '../home/About.jsx';
import CityTickets from '../ticket/CityTickets.jsx';
import TicketDetails from '../Pages/TicketDetails.jsx';
import MyBookings from '../dashboard/userDashborad/BookedTickets';
import AdvertiseTickets from '../dashboard/adminDashborad/Advertisetickets .jsx';
import VendorProfile from '../dashboard/vendorDashboard/VendorProfile.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    errorElement: <Error />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'search',
        Component: SearchResults,
      },
      {
        path: 'contact',
        Component: ContactForm,
      },
      {
        path: 'about',
        Component: About,
      },
      {
        path: 'tickets',
        element: (
          <PrivateRoute>
            <AllTickets />
          </PrivateRoute>
        ),
      },
      {
        path: 'tickets/:cityName',
        element: (
          <PrivateRoute>
            <CityTickets />
          </PrivateRoute>
        ),
      },
      {
        path: 'tickets/:cityName/:ticketId',
        element: (
          <PrivateRoute>
            <TicketDetails />
          </PrivateRoute>
        ),
      },

      // ─── Dashboard ─────────────────────────────────────────
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          // ── User Routes ──────────────────────────────────

          {
            path: 'bookings',
            element: <MyBookings />,
          },
          {
            path: 'user-profile',
            element: <UserProfile />,
          },
          {
            path: 'history',
            element: <TransactionHistory />,
          },

          // ── Admin Routes ─────────────────────────────────
          {
            path: 'admin-profile',
            element: (
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            ),
          },
          {
            path: 'manage-users',
            element: (
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            ),
          },
          {
            path: 'manage-tickets',
            element: (
              <AdminRoute>
                <ManageTickets />
              </AdminRoute>
            ),
          },
          {
            path: 'admin-payments',
            element: (
              <AdminRoute>
                <AdminPayments />
              </AdminRoute>
            ),
          },
          {
            path: 'advertise-tickets',
            element: (
              <AdminRoute>
                <AdvertiseTickets />
              </AdminRoute>
            ),
          },
          {
            path: 'manu-admin',
            element: (
              <AdminRoute>
                <ManuAdmin />
              </AdminRoute>
            ),
          },

          // ── Vendor Routes ────────────────────────────────
          {
            path: 'vendor-dashboard',
            children: [
              {
                path: 'vendor-profile',
                element: (
                  <VendorRoute>
                    <VendorProfile />
                  </VendorRoute>
                ),
              },
              {
                path: 'manu-vendor',
                element: (
                  <VendorRoute>
                    <ManuVendor />
                  </VendorRoute>
                ),
              },
              {
                path: 'add-ticket',
                element: (
                  <VendorRoute>
                    <AddTicket />
                  </VendorRoute>
                ),
              },
              {
                path: 'my-tickets',
                element: (
                  <VendorRoute>
                    <MyAddedTickets />
                  </VendorRoute>
                ),
              },
              {
                path: 'requested-bookings',
                element: (
                  <VendorRoute>
                    <RequestedBookings />
                  </VendorRoute>
                ),
              },
              {
                path: 'revenue',
                element: (
                  <VendorRoute>
                    <RevenueOverview />
                  </VendorRoute>
                ),
              },
            ],
          },
        ],
      },

      // ─── Auth ───────────────────────────────────────────────
      {
        path: '/login',
        Component: Login,
      },
      {
        path: '/register',
        Component: Register,
      },

      // ─── Stripe ─────────────────────────────────────────────
      {
        path: '/stripe/success',
        element: <Success />,
      },
      {
        path: '/stripe/cancel',
        element: <Cancel />,
      },
    ],
  },
]);
