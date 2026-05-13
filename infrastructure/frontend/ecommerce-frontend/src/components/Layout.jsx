import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div 
      className="min-h-screen font-inter flex flex-col"
      style={{
        background:'linear-gradient(to bottom right, #401008, #210703, #E80000)',
      }}
    >
      <Navbar />
      
    <main className="flex-grow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Outlet />
      </div>
    </main>

      <Footer />
    </div>
  );
};

export default Layout;