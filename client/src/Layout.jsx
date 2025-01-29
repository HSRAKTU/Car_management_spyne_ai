import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'


function Layout() {
 

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout