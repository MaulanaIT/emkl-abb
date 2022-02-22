import { useEffect, useState } from 'react';
import { FaMoneyBill } from 'react-icons/fa';
import { today, inputNumber, setInputValue, disableMouseClick, enableMouseClick, hargaFormat, getInputValue, setLoaderPercentage, showLoader, getSelectValue } from '../../components/Helper';

import $ from 'jquery';
import axios from 'axios';
import Loader from '../../components/Loader';

const Piutang = () => {

    const [akun, setAkun] = useState([]);
    const [piutang, setPiutang] = useState([]);

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/akun.php').then(responseAkun => {
            if (responseAkun.data.length > 0) setAkun(responseAkun.data);

            axios.get('http://emkl-abb.virtusrox.me/api/select/piutang.php').then(responsePiutang => {
                if (responsePiutang.data.length > 0)
                    setPiutang(responsePiutang.data);

                setInputValue('input-tanggal', today());

                $(document).ready(function () {
                    $('#table-data').DataTable();

                    $('input').on('input', function () {
                        $(this).val($(this).val().replace(/['"]/gi, ''));
                    });
                });

                enableMouseClick();
            });
        });
    }, []);

    const selectedBayarPiutang = (id) => {
        let selectedPiutang = piutang.find(item => item.id === id);

        setInputValue('input-job-nomor', selectedPiutang.nomor.replace(new RegExp('-', 'g'), '/'));
        setInputValue('input-kode-customer', selectedPiutang.kode_customer);
        setInputValue('input-nama-customer', selectedPiutang.nama_customer);
        setInputValue('input-sisa-piutang', selectedPiutang.sisa_piutang);
    }

    const simpanData = () => {
        showLoader();

        let sisaPiutang = parseInt(getInputValue('input-sisa-piutang')) - parseInt(getInputValue('input-terima-piutang'));

        let formData = new FormData();

        formData.append('nomor', getInputValue('input-job-nomor'));
        formData.append('tanggal', getInputValue('input-tanggal'));
        formData.append('kode_customer', getInputValue('input-kode-customer'));
        formData.append('nama_customer', getInputValue('input-nama-customer'));
        formData.append('sisa_piutang', sisaPiutang.toString());
        formData.append('kode_akun', getSelectValue('select-piutang-akun'));
        formData.append('terima_piutang', getInputValue('input-terima-piutang'));

        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencode, multipart/form-data'
            }
        };

        let formPiutang = new FormData();

        formPiutang.append('nomor', getInputValue('input-job-nomor'));
        formPiutang.append('kode_customer', getInputValue('input-kode-customer'));
        formPiutang.append('terima_piutang', getInputValue('input-terima-piutang'));

        axios.post('http://emkl-abb.virtusrox.me/api/update/piutang.php', formPiutang, config).then(response => {
            setLoaderPercentage('loader-percentage', 0, 50);

            axios.post('http://emkl-abb.virtusrox.me/api/insert/detail-piutang.php', formData, config).then(response => {
                setLoaderPercentage('loader-percentage', 50, 100);

                setTimeout(() => {
                    document.getElementById('loader-percentage').innerHTML = "Menyimpan Data Berhasil!";
                    window.location.reload();
                }, 1000);
            });
        });
    }

    return (
        <div className="active content overflow-auto">
            <Loader />
            <p className="fw-bold text-secondary text-size-10">Piutang</p>
            <p className="text-secondary">Transaksi / <span className="fw-bold primary-text-color">Piutang</span></p>
            <div className="card-form">
                <div className="p-4">
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <div className="align-items-center col-12 col-lg-6 d-flex flex-wrap">
                            <label htmlFor="input-tanggal" className="col-12 col-lg-4 col-md-6 pb-2 pb-md-0">Tanggal</label>
                            <div className="col col-lg-6 col-md-6">
                                <input type="date" id="input-tanggal" name="input-tanggal" className="form-control" required />
                            </div>
                        </div>
                        <div className="align-items-center col-12 col-lg-6 d-flex flex-wrap">
                            <label htmlFor="input-job-nomor" className="col-12 col-lg-4 col-md-6 pb-2 pb-md-0">Job Nomor</label>
                            <div className="col col-lg-6 col-md-6">
                                <input type="text" id="input-job-nomor" name="input-job-nomor" className="form-control" readOnly required />
                            </div>
                        </div>
                    </div>
                    <label className="fw-bold pb-2 pb-md-0">Customer</label>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-kode-customer" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Kode Customer</label>
                        <div className="col-12 col-lg-4 col-md-6">
                            <input type="text" name="input-kode-customer" id="input-kode-customer" className="form-control" readOnly required />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-nama-customer" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nama Customer</label>
                        <div className="col">
                            <input type="text" name="input-nama-customer" id="input-nama-customer" className="form-control" readOnly required />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-sisa-piutang" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Sisa Piutang</label>
                        <div className="col-12 col-md-4 col-lg-2">
                            <input type="text" id="input-sisa-piutang" name="input-sisa-piutang" className="form-control text-end" placeholder="0" readOnly required />
                        </div>
                    </div>
                    <label className="fw-bold pb-2 pb-md-0">Penerimaan</label>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="select-piutang-akun" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Akun Kas</label>
                        <div className="col-12 col-md-4 col-lg-2">
                            <select name="select-piutang-akun" id="select-piutang-akun" className="form-select">
                                {akun.length > 0 ? akun.map(data =>
                                    <option value={data.kode}>{data.kode} - {data.nama}</option>
                                ) :
                                    <option value="">-- Tidak Ada Data Akun --</option>
                                }
                            </select>
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-terima-piutang" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Terima Piutang</label>
                        <div className="col-12 col-md-4 col-lg-2">
                            <input type="text" id="input-terima-piutang" name="input-terima-piutang" className="form-control text-end" placeholder="0" onInput={inputNumber} required />
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Terima Piutang" onClick={simpanData} />
                    <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Bersihkan" />
                </div>
            </div>

            <div className="card-form my-5 p-4">
                <div className="table-responsive">
                    <table id="table-data" className="table table-bordered table-hover table-striped text-nowrap w-100">
                        <thead className="align-middle text-center text-nowrap">
                            <tr>
                                <th>No.</th>
                                <th>Job Nomor</th>
                                <th>Tanggal Transaksi</th>
                                <th>Kode Customer</th>
                                <th>Nama Customer</th>
                                <th>Jumlah Piutang</th>
                                <th>Terima Piutang</th>
                                <th>Sisa Piutang</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="table-data-body" className="align-middle">
                            {piutang.map((data, index) =>
                                <tr key={data.id}>
                                    <td className="text-center">{++index}.</td>
                                    <td className="text-center">{data.nomor}</td>
                                    <td className="text-center">{data.tanggal}</td>
                                    <td className="text-center">{data.kode_customer}</td>
                                    <td className="text-start">{data.nama_customer}</td>
                                    <td className="text-end">{hargaFormat(data.jumlah_piutang)}</td>
                                    <td className="text-end">{hargaFormat(data.terima_piutang)}</td>
                                    <td className="text-end">{hargaFormat(data.sisa_piutang)}</td>
                                    <td className="text-center">
                                        <button id={`btn-bayar-${data.id}`} className="btn btn-success ms-2" onClick={() => selectedBayarPiutang(data.id)}><FaMoneyBill /> Terima Piutang</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Piutang
