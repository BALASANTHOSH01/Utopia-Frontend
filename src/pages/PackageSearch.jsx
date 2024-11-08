import React from 'react'
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import HeroSection from '../components/HomePage/HeroSection';
import Packages from '../components/PackagesPage/Packages';
import Faq from '../components/PackagesPage/Faq';

const PackageSearch = () => {
  return (
    <>
      <div className="w-full flex items-center flex-col">
        <Navbar />
        <HeroSection image={'https://ik.imagekit.io/vsn/packages2.jpeg'} title={'PACKAGES'} tagline={'Amazing adventure with our'} description={"Experience the thrill of exploring the world's most fascinatingdestinations with our expertly curated travel packages."}/>
        <Packages />
        <Faq />
        <Footer />
      </div>
    </>
  )
}

export default PackageSearch