import { useEffect } from 'react'
import { FaServer, FaShip, FaBook, FaFolder, FaDollarSign, FaOpencart } from 'react-icons/fa'
import Logo from '../image/logo-abb.png';
import { Link } from 'react-router-dom';

import $ from 'jquery';

import './SideMenu.css';

const SideMenu = (prop) => {

    useEffect(() => {
        if (window.innerWidth < 768) {
            $('.content').removeClass('active');
            $('.sidebar').removeClass('active');
            $('.toggle').removeClass('active');
        }
    }, []);

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            $('.content').addClass('active');
            $('.sidebar').addClass('active');
            $('.toggle').addClass('active');
        } else {
            $('.content').removeClass('active');
            $('.sidebar').removeClass('active');
            $('.toggle').removeClass('active');
        }
    });

    return (
        <div className="sidebar active">
            <div className='logo-container'>
                <img src={Logo} alt="ABB" />
            </div>
            <div className="pb-1 ps-3 pt-3">
                <div className="align-items-center px-0 row">
                    <FaFolder className="col-auto" />
                    <p className="col col-form-label fw-bold text-size-3 text-secondary p-0">Dashboard</p>
                </div>
                <hr className="m-0" />
            </div>
            <div id="dashboard-item" className={`item ${prop.menu === 'dashboard' ? 'active' : ''}`}>
                <Link to={{ pathname: "/dashboard" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaShip className="col-auto" />
                        <p className="col fw-bold m-0">Dashboard</p>
                    </div>
                </Link>
            </div>
            <div className="pb-1 ps-3 pt-3">
                <div className="align-items-center px-0 row">
                    <FaFolder className="col-auto" />
                    <p className="col col-form-label fw-bold text-size-3 text-secondary p-0">Master</p>
                </div>
                <hr className="m-0" />
            </div>
            <div id="akun-item" className={`item ${prop.menu === 'akun' ? 'active' : ''}`}>
                <Link to={{ pathname: "/master/akun" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaServer className="col-auto" />
                        <p className="col fw-bold m-0">Akun</p>
                    </div>
                </Link>
            </div>
            <div id="customer-item" className={`item ${prop.menu === 'customer' ? 'active' : ''}`}>
                <Link to={{ pathname: "/master/customer" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaServer className="col-auto" />
                        <p className="col fw-bold m-0">Customer</p>
                    </div>
                </Link>
            </div>
            <div id="jasa-item" className={`item ${prop.menu === 'jasa' ? 'active' : ''}`}>
                <Link to={{ pathname: "/master/jasa" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaServer className="col-auto" />
                        <p className="col fw-bold m-0">Jasa</p>
                    </div>
                </Link>
            </div>
            <div id="vendor-item" className={`item ${prop.menu === 'vendor' ? 'active' : ''}`}>
                <Link to={{ pathname: "/master/vendor" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaServer className="col-auto" />
                        <p className="col fw-bold m-0">Vendor</p>
                    </div>
                </Link>
            </div>
            <div className="pb-1 ps-3 pt-3">
                <div className="align-items-center px-0 row">
                    <FaFolder className="col-auto" />
                    <p className="col col-form-label fw-bold text-size-3 text-secondary p-0">Transaksi</p>
                </div>
                <hr className="m-0" />
            </div>
            <div id="operasional-item" className={`item ${prop.menu === 'operasional' ? 'active' : ''}`}>
                <Link to={{ pathname: "/transaksi/operasional" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaOpencart className="col-auto" />
                        <p className="col fw-bold m-0">Operasional</p>
                    </div>
                </Link>
            </div>
            <div id="detail-transaksi-item" className={`item ${prop.menu === 'detail-transaksi' ? 'active' : ''}`}>
                <Link to={{ pathname: "/transaksi/detail-transaksi" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaOpencart className="col-auto" />
                        <p className="col fw-bold m-0">Detail Transaksi</p>
                    </div>
                </Link>
            </div>
            <div id="daftar-transaksi-item" className={`item ${prop.menu === 'daftar-transaksi' ? 'active' : ''}`}>
                <Link to={{ pathname: "/transaksi/daftar-transaksi" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaOpencart className="col-auto" />
                        <p className="col fw-bold m-0">Daftar Transaksi</p>
                    </div>
                </Link>
            </div>
            <div id="invoice-item" className={`item ${prop.menu === 'invoice' ? 'active' : ''}`}>
                <Link to={{ pathname: "/transaksi/invoice" }}>
                    <div className="align-items-center menu px-0 row" >
                        <FaOpencart className="col-auto" />
                        <p className="col fw-bold m-0">Invoice</p>
                    </div>
                </Link>
            </div>
            <div id="piutang-item" className={`item ${prop.menu === 'piutang' ? 'active' : ''}`}>
                <Link to={{ pathname: "/transaksi/piutang" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaOpencart className="col-auto" />
                        <p className="col fw-bold m-0">Piutang</p>
                    </div>
                </Link>
            </div>
            <div id="utang-item" className={`item ${prop.menu === 'utang' ? 'active' : ''}`}>
                <Link to={{ pathname: "/transaksi/utang" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaOpencart className="col-auto" />
                        <p className="col fw-bold m-0">Utang</p>
                    </div>
                </Link>
            </div>
            <div className="pb-1 ps-3 pt-3">
                <div className="align-items-center px-0 row">
                    <FaFolder className="col-auto" />
                    <p className="col col-form-label fw-bold text-size-3 text-secondary p-0">Laporan</p>
                </div>
                <hr className="m-0" />
            </div>
            <div id="laporan-profitabilitas-item" className={`item ${prop.menu === 'laporan-profitabilitas' ? 'active' : ''}`}>
                <Link to={{ pathname: "/laporan/profitabilitas" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaBook className="col-auto" />
                        <p className="col fw-bold m-0">Profitabilitas</p>
                    </div>
                </Link>
            </div>
            <div id="laporan-pengeluaran-kas-item" className={`item ${prop.menu === 'laporan-pengeluaran-kas' ? 'active' : ''}`}>
                <Link to={{ pathname: "/laporan/pengeluaran-kas" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaBook className="col-auto" />
                        <p className="col fw-bold m-0">Pengeluaran Kas</p>
                    </div>
                </Link>
            </div>
            <div id="laporan-piutang-item" className={`item ${prop.menu === 'laporan-piutang' ? 'active' : ''}`}>
                <Link to={{ pathname: "/laporan/piutang" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaBook className="col-auto" />
                        <p className="col fw-bold m-0">Piutang</p>
                    </div>
                </Link>
            </div>
            <div id="laporan-utang-item" className={`item ${prop.menu === 'laporan-utang' ? 'active' : ''}`}>
                <Link to={{ pathname: "/laporan/utang" }} >
                    <div className="align-items-center menu px-0 row">
                        <FaBook className="col-auto" />
                        <p className="col fw-bold m-0">Utang</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default SideMenu
