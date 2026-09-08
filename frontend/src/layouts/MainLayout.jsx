import { Header, Footer } from '../components/Navigation';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow pt-[72px] lg:pt-[80px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
