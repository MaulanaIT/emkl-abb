import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MasterAkun from './pages/master/Akun';
import MasterCustomer from './pages/master/Customer';
import MasterJasa from './pages/master/Jasa';
import MasterVendor from './pages/master/Vendor';
import TransaksiDaftarTransaksi from './pages/transaksi/DaftarTransaksi';
import TransaksiDetailTransaksi from './pages/transaksi/DetailTransaksi';
import TransaksiCetakOperasional from './pages/transaksi/CetakOperasional';
import TransaksiOperasional from './pages/transaksi/Operasional';
import TransaksiCetakInvoice from './pages/transaksi/CetakInvoice';
import TransaksiInvoice from './pages/transaksi/Invoice';
// import TransaksiMarketing from './pages/transaksi/Marketing';
import TransaksiPiutang from './pages/transaksi/Piutang';
import TransaksiUtang from './pages/transaksi/Utang';
import LaporanProfitabilitas from './pages/laporan/Profitabilitas';
import LaporanPengeluaranKas from './pages/laporan/PengeluaranKas';
import LaporanPiutang from './pages/laporan/Piutang';
import LaporanUtang from './pages/laporan/Utang';
// import TransaksiPersetujuanMarketing from './pages/transaksi/PersetujuanMarketing';

import Header from './components/Header';
import SideMenu from './components/SideMenu';
import ToggleSideMenu from './components/ToggleSideMenu';
import LoadingScreen from './components/LoadingScreen';

import 'datatables.net-bs5/css/dataTables.bootstrap5.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import 'jquery/dist/jquery.min.js';
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js';

import './pages/Style.css';

import axios from 'axios';
import { data } from 'jquery';
import moment from 'moment';
import { FaTimes } from 'react-icons/fa';

export default function App() {

    const [useLogin, setLogin] = useState(false);
    const [useNotification, setNotification] = useState([]);

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/login') return;

        let storage = JSON.parse(localStorage.getItem('login'));

        if (!storage || storage.length === 0) window.location.href = '/login';

        axios.get('http://emkl-abb.virtusrox.me/api/select/users.php').then(responseUsers => {
            if (responseUsers.data.length === 0) window.location.href = '/login';

            let checkUsername = responseUsers.data.find(item => item.username.toLowerCase() === storage.Username.toLowerCase());

            if (!checkUsername) return;

            let checkPassword = checkUsername.password === storage.Password.toString();

            if (!checkPassword) window.location.href = '/login';

            setLogin(true);
        });
    }, []);

    useEffect(() => {
        let dataUtang = [];
        let htmlNotification = [];

        axios.get('http://emkl-abb.virtusrox.me/api/select/utang.php').then(responseUtang => {
            if (responseUtang.data.length > 0) {
                dataUtang = responseUtang.data;

                dataUtang.map((item, index) => {
                    if (moment(moment().format('YYYY-MM-DD')).diff(item.jatuh_tempo, 'days') < 3) {
                        htmlNotification.push(
                            <div key={index} id={`notification-${index}`} className='bg-light p-3 position-relative mt-4' style={{ boxShadow: '0px 0px 10px #dddddd', minHeight: '100px', width: '250px' }}>
                                <FaTimes className='cursor-pointer position-absolute text-black' style={{ top: '10px', right: '10px' }} onClick={() => RemoveNotification(index)} />
                                <p className='fw-bold mb-2 text-danger text-size-2'>Jatuh Tempo Utang</p>
                                <p className='text-size-1'>Utang {item.nama_cost} pada nomor {item.nomor.replace(new RegExp('-', 'g'), '/')} akan memasuki jatuh tempo dalam waktu kurang dari 3 hari.</p>
                            </div>
                        )
                    }
                });

                setNotification(htmlNotification);
            }
        });
    }, []);

    const RemoveNotification = (index) => {
        document.getElementById(`notification-${index}`).remove();
    }

    return (
        <>
            <div className='d-flex flex-column-reverse h-100 overflow-auto position-absolute px-2' style={{ bottom: '20px', right: '20px', paddingTop: '40px', zIndex: '100' }}>
                <div className='py-4'>
                    {useNotification}
                </div>
            </div>
            <LoadingScreen />
            <Routes>
                <Route path="/" element={<Navigate to={'/login'} />} />
                <Route path="/login" element={<>
                    <Login />
                </>} />
                {(useLogin) ? <>
                    <Route path="/dashboard" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="dashboard" />
                        <Header />
                        <Dashboard />
                    </>} />
                    <Route path="/master/akun" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="akun" />
                        <Header />
                        <MasterAkun />
                    </>} />
                    <Route path="/master/customer" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="customer" />
                        <Header />
                        <MasterCustomer />
                    </>} />
                    <Route path="/master/jasa" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="jasa" />
                        <Header />
                        <MasterJasa />
                    </>} />
                    <Route path="/master/vendor" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="vendor" />
                        <Header />
                        <MasterVendor />
                    </>} />
                    <Route path="/transaksi/daftar-transaksi" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="daftar-transaksi" />
                        <Header />
                        <TransaksiDaftarTransaksi />
                    </>} />
                    <Route path="/transaksi/detail-transaksi" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="detail-transaksi" />
                        <Header />
                        <TransaksiDetailTransaksi />
                    </>} />
                    <Route path="/transaksi/cetak-invoice" element={<>
                        <TransaksiCetakInvoice />
                    </>} />
                    <Route path="/transaksi/invoice" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="invoice" />
                        <Header />
                        <TransaksiInvoice />
                    </>} />
                    <Route path="/transaksi/cetak-operasional" element={<>
                        <TransaksiCetakOperasional />
                    </>} />
                    <Route path="/transaksi/operasional" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="operasional" />
                        <Header />
                        <TransaksiOperasional />
                    </>} />
                    <Route path="/transaksi/piutang" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="piutang" />
                        <Header />
                        <TransaksiPiutang />
                    </>} />
                    <Route path="/transaksi/utang" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="utang" />
                        <Header />
                        <TransaksiUtang />
                    </>} />
                    <Route path="/laporan/profitabilitas" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="laporan-profitabilitas" />
                        <Header />
                        <LaporanProfitabilitas />
                    </>} />
                    <Route path="/laporan/pengeluaran-kas" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="laporan-pengeluaran-kas" />
                        <Header />
                        <LaporanPengeluaranKas />
                    </>} />
                    <Route path="/laporan/piutang" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="laporan-piutang" />
                        <Header />
                        <LaporanPiutang />
                    </>} />
                    <Route path="/laporan/utang" element={<>
                        <ToggleSideMenu />
                        <SideMenu menu="laporan-utang" />
                        <Header />
                        <LaporanUtang />
                    </>} />
                    <Route path="/" element={<>
                        <Navigate to="/login" />
                    </>} />
                </> : null}
            </Routes>
        </>
    );
}
