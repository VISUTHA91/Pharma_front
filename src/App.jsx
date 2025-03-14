import { useState } from 'react'
import './App.css'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import RootLayout from './Layouts/RootLayout'
import AdminLayout from './Layouts/AdminLayout'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import ScrollToTop from './Components/ScrollToTop'
import Home from './Home'
import Adminlogin from './Pages/Admin/Adminlogin'
import Registration from './Pages/Admin/Registration';
import AdminCategory from './Pages/Admin/AdminCategory'
import ProductCreation from './Pages/Admin/ProductCreation'
import Supplier from './Pages/Admin/Supplier'
import ReturnPage from './Pages/Admin/ReturnPage'
import Billing from './Pages/Admin/Billing'
import Income from './Pages/Admin/Income'
import Expense from './Pages/Admin/Expense'
import Invoice from './Pages/Admin/Invoice'
import SalesReport from './Pages/Admin/SalesReport'
import BinTable from './Pages/Admin/BinTable'
import Settings from './Pages/Admin/Settings'
import StockReport from './Pages/Admin/StockReport'
import MainContent from './Pages/Admin/MainContent'
import styled from 'styled-components'
import SupplierDetails from './Pages/Admin/SupplierDetails'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0)
  const HideScrollbar = styled.div`
  overflow: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
  display: none; 
  }`;
  
  return (
    <>
    <HideScrollbar >
    <ToastContainer position="top-right" autoClose={2500} />
<BrowserRouter >
  <ScrollToTop />
  <Routes>
          <Route element={<RootLayout />} >
            <Route index element={<Home />} />
            <Route path='/Home' element={<Home/>} />
            </Route>
            <Route path="/Dashboard" element={<AdminDashboard />}>
        <Route index element={<MainContent />} />
      <Route path='Registration' element= {<Registration />}/>
      <Route path='AdminCategory' element= {<AdminCategory/>} />
      <Route path='ProductCreation' element= {<ProductCreation/>} />
      <Route path='Supplier' element= {<Supplier/>} />
      <Route path='ReturnPage' element= {<ReturnPage/>} />
      <Route path='Billing' element= {<Billing/>} />
      <Route path='Income' element= {<Income />} />
      <Route path='Expense' element= {<Expense />} />
      <Route path='Income/Expense' element= {<Expense />} />
      <Route path='Invoice' element= {<Invoice />} />
      <Route path='SalesReport' element = {<SalesReport /> } />
      <Route path='StockReport' element = {<StockReport /> } />
      <Route path='BinTable' element = {<BinTable /> } />
      <Route path='Settings' element = {<Settings /> } />
      <Route path='Supplier/:supplierId' element={<SupplierDetails />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </HideScrollbar>
  </>
  )
}

export default App
