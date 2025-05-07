import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>
      <HorizontalCardProduct category={"jute-bags"} heading={"Featured Jute Bags"}/>
      <HorizontalCardProduct category={"home-decor"} heading={"Popular Home Decor"}/>
      <VerticalCardProduct category={"jute-rugs"} heading={"Jute Rugs Collection"}/>
      <VerticalCardProduct category={"jute-mats"} heading={"Eco-friendly Mats"}/>
      <VerticalCardProduct category={"wall-hangings"} heading={"Wall Decor"}/>
      <VerticalCardProduct category={"accessories"} heading={"Jute Accessories"}/>
      <VerticalCardProduct category={"stationery"} heading={"Eco Stationery"}/>
      <VerticalCardProduct category={"fashion"} heading={"Jute Fashion"}/>
      <VerticalCardProduct category={"crafts"} heading={"Handcrafted Items"}/>
      <VerticalCardProduct category={"furniture"} heading={"Jute Furniture"}/>
    </div>
  )
}

export default Home