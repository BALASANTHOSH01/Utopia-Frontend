import React from 'react';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import DashboardComponent from '../components/Dashboard/DashboardComponent';

const Dashboard = () => {
  return (
    <>
        <div className="w-full flex flex-col items-center">
            <Navbar />
            <DashboardComponent />
            <Footer />
        </div>
    </>
  )
}

export default Dashboard