import React from 'react'
import Navbar from '../components/Common/Navbar';
import HeroSection from '../components/HomePage/HeroSection'; 
import Deals from '../components/HomePage/Deals';
import Features from '../components/HomePage/Features';
import Packages from '../components/HomePage/Packages';
import Quality from '../components/HomePage/Quality';
import Articles from '../components/HomePage/Articles';
import Footer from '../components/Common/Footer';
import hero1 from "../assets/hero1.jpeg";

const Home = () => {
  
  return (
    <>
      <div className="w-full flex items-center flex-col">
        <Navbar />
        <HeroSection image={"https://ik.imagekit.io/vsn/hero1.jpeg"} title={'ADVENTURE'} tagline={'UNFORGETTABLE TRAVEL AWAITS THE'} description={"Experience the thrill of exploring the world's most fascinating destinations with our expertly curated travel packages."}/>
        <Deals />
        {/* <Features /> */}
        <Packages />
        <Quality />
        <Articles />
        <Footer />
      </div>
    </>
  )
}

export default Home;