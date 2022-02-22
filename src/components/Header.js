import React, { Component } from 'react'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import './Header.css'

export class Header extends Component {

    componentDidMount = () => {
        let elementItemMenu = document.querySelectorAll('.header .item');
        
        elementItemMenu.forEach(item => {
            item.addEventListener('click', () => {
                item.querySelector('.menu').classList.toggle('active');
            });
        });
    }

    LogOut = () => {
        localStorage.clear();
    }

    render() {
        return (
            <div className="header">
                <div className="align-items-center d-flex h-100 justify-content-end">
                    <ul>
                        <li className="item">
                            <FaUser className="px-0" style={{ height: '20px', width: '20px' }} />
                            <p className="col-form-label py-0 fw-bold px-2 text-secondary text-size-3">{(JSON.parse(localStorage.getItem('login'))) ? JSON.parse(localStorage.getItem('login')).Role : null}</p>
                            <div className='menu'>
                                <Link to={'/login'} onClick={this.LogOut}><FaSignOutAlt className='me-2' /> Keluar</Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Header
