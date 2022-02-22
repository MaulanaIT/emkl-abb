import { useEffect, useState } from 'react';
import { FaMoneyBill, FaPrint, FaFileAlt } from 'react-icons/fa';
import { disableMouseClick, enableMouseClick, getInputValue, getSelectValue, hargaFormat, today } from '../../components/Helper';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import axios from 'axios';

const DaftarTransaksi = () => {
    const [daftarTransaksi, setDaftarTransaksi] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [piutang, setPiutang] = useState([]);
    const [table, setTable] = useState([]);

    const cetakData = (nomor) => {
        sessionStorage.setItem('nomor', nomor);
    }

    const chooseType = (event) => {
        if (event.target.value === "Periode") {
            document.getElementById("field-periode").classList.remove('d-none');
            document.getElementById("field-periode").classList.add('d-flex');
            document.getElementById("field-customer").classList.add('d-none');
            document.getElementById("field-job").classList.add('d-none');
        } else if (event.target.value === "Customer") {
            document.getElementById("field-customer").classList.remove('d-none');
            document.getElementById("field-customer").classList.add('d-flex');
            document.getElementById("field-periode").classList.add('d-none');
            document.getElementById("field-job").classList.add('d-none');
        } else if (event.target.value === "Job") {
            document.getElementById("field-job").classList.remove('d-none');
            document.getElementById("field-job").classList.add('d-flex');
            document.getElementById("field-customer").classList.add('d-none');
            document.getElementById("field-periode").classList.add('d-none');
        } else {
            document.getElementById("field-periode").classList.add('d-none');
            document.getElementById("field-customer").classList.add('d-none');
            document.getElementById("field-job").classList.add('d-none');
        }
    }

    const filterTable = () => {
        generateTable(getSelectValue('select-filter'));
    }

    const generateTable = (filter) => {
        let dataTable = [];
        let stateDaftarTransaksi = [];

        $('#table-data').DataTable().destroy();

        if (filter === 'Periode') stateDaftarTransaksi = daftarTransaksi.filter(item => {
            let tanggalAwal = (new Date(getInputValue('input-tanggal-awal'))).getTime();
            let tanggalAkhir = (new Date(getInputValue('input-tanggal-akhir'))).getTime();

            if ((new Date(item.tanggal)).getTime() >= tanggalAwal && (new Date(item.tanggal)).getTime() <= tanggalAkhir) return item;
        });
        else if (filter === 'Customer') stateDaftarTransaksi = daftarTransaksi.filter(item => item.customer === getSelectValue('select-customer'));
        else if (filter === 'Job') stateDaftarTransaksi = daftarTransaksi.filter(item => item.nomor === getSelectValue('select-job-nomor').replace(new RegExp('/', 'g'), '-'));
        else stateDaftarTransaksi = daftarTransaksi;

        stateDaftarTransaksi.map((data, index) => {
            let dataPiutang = piutang.find(item => item.nomor === data.nomor);

            dataTable.push(
                <tr key={data.id}>
                    <td>{data.nomor.replace(new RegExp('-', 'g'), '/')}</td>
                    <td>{data.invoice}</td>
                    <td>{data.tanggal}</td>
                    <td>{data.customer}</td>
                    <td>{data.booking_number}</td>
                    <td>{data.license_export}</td>
                    <td>{data.consignee}</td>
                    <td>{data.destination}</td>
                    <td>{data.feeder}</td>
                    <td>{data.forwarding_shipline}</td>
                    <td>{data.jumlah_party} x {data.ukuran_party}</td>
                    <td>{(data.container_seal_1 !== null ? (data.container_seal_1) : ('Tidak ada data'))}</td>
                    <td>{data.stuffing_date}</td>
                    <td>{data.stuffing_place}</td>
                    <td className="text-end">{(dataPiutang) ? hargaFormat(dataPiutang.jumlah_piutang) : hargaFormat('0')}</td>
                    <td className="text-end">{(dataPiutang) ? hargaFormat(dataPiutang.terima_piutang) : hargaFormat('0')}</td>
                    <td className="text-end">{(dataPiutang) ? hargaFormat(dataPiutang.sisa_piutang) : hargaFormat('0')}</td>
                    <td className="text-center">{data.tanggal}</td>
                    <td>
                        <Link to={{ pathname: '/transaksi/detail-transaksi' }} id={`btn-lihat-transaksi-${data.nomor}`} className="btn primary-color text-white me-2" onClick={() => transaksiData(`${data.nomor}`)} ><FaFileAlt /> Lihat Transaksi</Link>
                        <Link to={{ pathname: '/transaksi/piutang' }} id={`btn-lihat-piutang-${data.nomor}`} className="btn btn-warning mx-2" ><FaMoneyBill /> Lihat Piutang</Link>
                        <Link to={{ pathname: '/transaksi/invoice' }} id={`btn-cetak-invoice-${data.nomor}`} className="btn btn-success ms-2" onClick={() => cetakData(`${data.nomor}`)} ><FaPrint /> Cetak Invoice</Link>
                    </td>
                </tr>
            );
        });

        setTable(dataTable);
    }

    const transaksiData = (nomor) => {
        sessionStorage.setItem('nomor', nomor);
    }

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/detail-transaksi.php').then(response => {
            if (response.data.length > 0)
                setDaftarTransaksi(response.data);

            axios.get('http://emkl-abb.virtusrox.me/api/select/customer.php').then(responseCustomer => {
                if (responseCustomer.data.length > 0)
                    setCustomer(responseCustomer.data);

                axios.get('http://emkl-abb.virtusrox.me/api/select/piutang.php').then(responsePiutang => {
                    if (responsePiutang.data.length > 0)
                        setPiutang(responsePiutang.data);

                    $(document).ready(function () {
                        $('#table-data').DataTable();

                        $('input').on('input', function () {
                            $(this).val($(this).val().replace(/['"]/gi, ''));
                        });
                    });

                    generateTable('');

                    enableMouseClick();
                });
            });
        });
    }, []);

    useEffect(() => {
        $('#table-data').DataTable();
    }, [table])

    return (
        <div className="active content overflow-auto">
            <p className="fw-bold text-secondary text-size-10">Daftar Transaksi</p>
            <p className="text-secondary">Transaksi / <span className="fw-bold primary-text-color">Daftar Transaksi</span></p>
            <form className="card-form">
                <div className="p-4">
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="select-filter" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Laporan Berdasarkan</label>
                        <div className="col col-lg-3 col-md-6" >
                            <select name="select-filter" id="select-filter" className="form-select" onChange={chooseType}>
                                <option value="">Pilih Daftar Transaksi Berdasarkan</option>
                                <option value="Periode">Periode</option>
                                <option value="Customer">Customer</option>
                                <option value="Job">Job No</option>
                            </select>
                        </div>
                    </div>
                    <div id="field-periode" className="align-items-center d-none flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-tanggal-awal" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Tanggal</label>
                        <div className="col col-lg-2 col-md-4">
                            <input type="date" id="input-tanggal-awal" name="input-tanggal-awal" className="form-control" placeholder="dd/mm/yyyy" defaultValue={today()} required />
                        </div>
                        <label htmlFor="input-tanggal-akhir" className="col-auto px-4 pb-2 pb-md-0 text-center text-nowrap">s/d</label>
                        <div className="col col-lg-2 col-md-4">
                            <input type="date" id="input-tanggal-akhir" name="input-tanggal-akhir" className="form-control" placeholder="dd/mm/yyyy" defaultValue={today()} required />
                        </div>
                    </div>
                    <div id="field-customer" className="align-items-center d-none flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="select-customer" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nama Customer</label>
                        <div className="col-12 col-lg-4">
                            <select name="select-customer" id="select-customer" className="form-select">
                                {customer.length > 0 ? customer.map(data =>
                                    <option key={data.id} value={data.nama}>{data.nama}</option>
                                ) :
                                    <option value="">-- Tidak Ada Data Customer --</option>
                                }
                            </select>
                        </div>
                    </div>
                    <div id="field-job" className="align-items-center d-none flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="select-job-nomor" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Job Nomor</label>
                        <div className="col-lg-4 col-12">
                            <select id="select-job-nomor" name="select-job-nomor" className="form-select">
                                {daftarTransaksi.length > 0 ? daftarTransaksi.map(data =>
                                    <option key={data.id} value={data.nomor.replace(new RegExp('-', 'g'), '/')}>{data.nomor.replace(new RegExp('-', 'g'), '/')}</option>
                                ) :
                                    <option value="">-- Tidak Ada Data Transaksi --</option>
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Tampilkan" onClick={filterTable} />
                    <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Bersihkan" />
                </div>
            </form>
            <div className="card-form mt-5 p-4">
                <div className="table-responsive">
                    <table id="table-data" className="table table-bordered table-hover table-striped text-nowrap w-100">
                        <thead className="align-middle text-center text-nowrap">
                            <tr>
                                <th>Job Nomor</th>
                                <th>Invoice No.</th>
                                <th>Invoice Date</th>
                                <th>Customer</th>
                                <th>Booking No.</th>
                                <th>License Export</th>
                                <th>Consignee</th>
                                <th>Destination</th>
                                <th>Feeder</th>
                                <th>Fowarding - Shipline</th>
                                <th>Party</th>
                                <th>Container / Seal</th>
                                <th>Stuffing Date</th>
                                <th>Stuffing Place</th>
                                <th>Nilai Piutang</th>
                                <th>Nilai Diterima</th>
                                <th>Sisa Piutang</th>
                                <th>Due Date</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle text-center">
                            {table}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DaftarTransaksi
