import React, { Component } from 'react';
import { FaBars } from 'react-icons/fa';

import $ from 'jquery';

import './ToggleSideMenu.css';

export class ToggleSideMenu extends Component {

    toggleMenu = () => {
        if ($('.toggle').hasClass('active')) {
            $('.content').removeClass('active');
            $('.sidebar').removeClass('active');
            $('.toggle').removeClass('active');
        } else {
            $('.content').addClass('active');
            $('.sidebar').addClass('active');
            $('.toggle').addClass('active');
        }
    }

    render() {
        return (
            <div className="toggle active" onClick={this.toggleMenu}>
                <FaBars />
            </div>
        )
    }
}

export default ToggleSideMenu
