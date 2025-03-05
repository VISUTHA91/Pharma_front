import React from 'react'
import { Outlet } from 'react-router';
// import Footer from '../Components/Footer';

function RootLayout() {
  return (
    <>
    <div> {/* Adjust this based on the height of your Nav */}
    <Outlet />
    </div>
    {/* <Footer /> */}
    </>
  )
}

export default RootLayout