import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Movies from './components/Movies/Movies'
import './styles.scss'


const Admin = () => {

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <Movies />
      </div>
    </div>
  )
}

export default Admin