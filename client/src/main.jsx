import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "@/components/ui/toaster"
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import Layout from './Layout'
import Listings from './components/Listings/Listings'
import { ThemeProvider } from "@/components/theme-provider"

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './lib/redux/store';
import { checkAuthSession } from './lib/redux/features/authSlice'
import UserListings from './components/UserListings/UserListings'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Listings />,
      },
      {
        path: "/my-garage",
        element: <UserListings />
      }
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignupForm />,
  },
]);

export default function AppWrapper() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);
  

  // if (loading) {
  //   return <div  className="flex items-center justify-center h-screen w-screen" ><LoaderCircle size={128} className='animate-spin'/></div>;
  // }

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppWrapper />
        <Toaster />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
