import React from 'react';
import Footer from '../../pages/admin/LayoutAdmin/TopBar';
import Header from './Header';
import SideBar from './AdminLayout/SideBar'
import { usePathname } from 'next/navigation';

const Layout = ({ children }) => {
  const current = usePathname();
  // console.log(current);
  // console.log(current.includes("Être"));
  // console.log(current.includes("/admin"));

  return (
    <>
      {current.includes("/admin") ? (
        <SideBar>
          {children}
        </SideBar>
      ) : (
        <>
          <Header />
          {children}
          <Footer />
        </>
      )}
    </>
  );
};

export default Layout;
