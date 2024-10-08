import React, { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import UserImg from '../assets/img/user_img.jpg'
import { FaBars } from 'react-icons/fa';
import { MdTask, MdBarChart, MdNotifications, MdHelp, MdMail, MdAccountCircle, MdExitToApp, MdSettings, MdSearch, MdGroup, MdDashboard } from 'react-icons/md';
import api from '../api/axios';

function Dashboard() {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuVisibility = () => {
    setShowMenu(!showMenu);
  };

  const [user, setUser] = useState(null); // State to hold user data

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token
      if (token) {
        try {
          const response = await api.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data); // Set the user data
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token

    try {
      // Make the request to the logout endpoint
      await api.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the token from localStorage
      localStorage.removeItem('token');

      // Redirect to the login page
      window.location.href = '/info/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <div className="row m-0">
        <div className="dashboard-menu vh-100 col-md-3 p-0 bg-info z-3" style={{right: showMenu ? '0' : '100%'}}>
          <div className="w-100 p-3 d-none d-md-flex align-items-center gap-2 bg-info-subtle" style={{height:'8rem'}}>
            <img src={UserImg} alt="User img" className='img' />
            <div className="d-flex flex-column">
              {user && <strong className='h5 m-0'>{user}</strong>}
              <strong className='h5 m-0'>John Doe</strong>
              <span className='text-success fw-bold'>Online</span>
            </div>
          </div>
          <div className="p-3 text-light border-bottom d-flex align-items-center justify-content-between">
            <h4 className='m-0'>Dashboard</h4>
            <button className='btn btn-close btn-close-white d-block d-md-none' onClick={handleMenuVisibility}></button>
          </div>
          <div className="p-3">
            <nav onFocus={handleMenuVisibility}>
              <NavLink to="/overview" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdDashboard size={30} color="#fff" /> Overview
              </NavLink>
              <NavLink to="/clubs" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdGroup size={30} color="#fff" /> Clubs
              </NavLink>
              <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdTask size={30} color="#fff" /> Tasks
              </NavLink>
              <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdSearch size={30} color="#fff" /> Search
              </NavLink>
              <NavLink to="/statistics" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdBarChart size={30} color="#fff" /> Statistics
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdSettings size={30} color="#fff" /> Settings
              </NavLink>
            </nav>
          </div>
        </div>

        <div className="vh-100 col-md-9 p-0">
          {/* Header */}
          <div className="w-100 px-3 d-flex align-items-center justify-content-between bg-info" style={{height:'4.5rem'}}>
            <div className="d-flex align-items-center gap-2">
              <button className='btn p-1 d-block d-md-none' onClick={handleMenuVisibility}>
                <FaBars size={30} color="#fff" />
              </button>
              <h2 className='m-0 text-blue'>The Forum</h2>
            </div>
            <div className="d-flex align-items-center gap-2">
              <NavLink
                className={({ isActive }) => isActive ? 'text-blue fs-5 active-icon' : 'text-blue fs-5'}
                to="/notifications"><MdNotifications size={30} color="#fff" className='icon' />
              </NavLink>
              <NavLink
                className={({ isActive }) => isActive ? 'text-blue fs-5 active-icon' : 'text-blue fs-5'}
                to="/info/help-support"><MdHelp size={30} color="#fff" className='icon' />
              </NavLink>
              <NavLink
                className={({ isActive }) => isActive ? 'text-blue fs-5 active-icon' : 'text-blue fs-5'}
                to="/messages"><MdMail size={30} color="#fff" className='icon' />
              </NavLink>
              <div className="dropdown">
                <button className="btn dropdown-toggle d-flex align-items-center gap-2 p-1" type='button' id='dropdownMenuButton' data-bs-toggle='dropdown' aria-expanded='false'>                    
                  <img src={UserImg} alt="" className='img' style={{width:'2.5rem'}} /> 
                  {user && <span className='d-none d-md-block'>{user.name.split(' ')[0]}</span>}
                  <span className='d-none d-md-block'>John</span>
                </button>
                <ul className="dropdown-menu" aria-labelledby='dropdownMenuButton'>
                  <li>
                    <NavLink to="/profile" className="dropdown-item d-flex align-items-center gap-2"><MdAccountCircle size={20} /> Profile</NavLink>
                    <button className="btn dropdown-item d-flex align-items-center gap-2" onClick={handleLogout}><MdExitToApp size={20} /> Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* This is where different dashboard pages will load */}
          <main className='cst-height overflow-auto'>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default Dashboard
