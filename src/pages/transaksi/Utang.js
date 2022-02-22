import { useEffect, useState } from 'react';
import { checkInputValidity, disableMouseClick, enableMouseClick, getInputValue, getSelectValue, hargaFormat, inputNumber, setInputValue, setLoaderPercentage, showLoader, today } from '../../components/Helper';
import { FaCheck, FaEdit, FaMoneyBill } from 'react-icons/fa';

import $ from 'jquery';
import axios from 'axios';
import Loader from '../../components/Loader';

const Utang = () => {

    const [akun, setAkun] = useState([]);
    const [detailUtang, setDetailUtang] = useState([]);
    const [utang, setUtang] = useState([]);

    const bayarUtang = () => {
        let sisaUtang = parseInt(getInputValue('bayar-utang-input-sisa-utang')) - parseInt(getInputValue('bayar-utang-input-nominal'));

        if (checkInputValidity('form-bayar-utang')) {
            showLoader();
    
            let formData = new FormData();

            formData.append('nomor', getInputValue('bayar-utang-input-job-nomor'));
            formData.append('tanggal', getInputValue('bayar-utang-input-tanggal'));
            formData.append('nama_cost', getInputValue('bayar-utang-input-nama-cost'));
            formData.append('kode_vendor', getInputValue('bayar-utang-input-kode-vendor'));
            formData.append('nama_vendor', getInputValue('bayar-utang-input-nama-vendor'));
            formData.append('sisa_utang', sisaUtang.toString());
            formData.append('kode_akun', getSelectValue('bayar-utang-select-akun'));
            formData.append('nominal', getInputValue('bayar-utang-input-nominal'));
            formData.append('keterangan', getInputValue('bayar-utang-input-keterangan'));

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencode, multipart/form-data'
                }
            };

            axios.post('http://emkl-abb.virtusrox.me/api/insert/detail-utang.php', formData, config).then(response => {
                setLoaderPercentage('loader-percentage', 0, 100);

                setTimeout(() => {
                    document.getElementById('loader-percentage').innerHTML = "Menyimpan Data Berhasil!";
                    window.location.reload();
                }, 1000);
            });
        }
    }

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/akun.php').then(responseAkun => {
            if (responseAkun.data.length > 0)
                setAkun(responseAkun.data);

            setInputValue('input-utang-input-tanggal', today());
            setInputValue('bayar-utang-input-tanggal', today());

            axios.get('http://emkl-abb.virtusrox.me/api/select/detail-utang.php').then(responseDetailUtang => {
                if (responseDetailUtang.data.length > 0)
                    setDetailUtang(responseDetailUtang.data);

                axios.get('http://emkl-abb.virtusrox.me/api/select/utang.php').then(responseUtang => {
                    if (responseUtang.data.length > 0)
                        setUtang(responseUtang.data.filter(item => item.jumlah_utang > 0));

                    $(document).ready(function () {
                        $('#table-data-bayar-utang').DataTable();
                        $('#table-data-input-utang').DataTable();

                        $('input').on('input', function () {
                            $(this).val($(this).val().replace(/['"]/gi, ''));
                        });
                    });

                    enableMouseClick();
                });
            });
        });
    }, []);

    const selectedBayarUtang = (id) => {
        let selectedUtang = utang.find(item => item.id === id);
        
        if (!selectedUtang) return;

        setInputValue('bayar-utang-input-job-nomor', selectedUtang.nomor.replace(new RegExp('-', 'g'), '/'));
        setInputValue('bayar-utang-input-nama-cost', selectedUtang.nama_cost);
        setInputValue('bayar-utang-input-kode-vendor', selectedUtang.kode_vendor);
        setInputValue('bayar-utang-input-nama-vendor', selectedUtang.nama_vendor);
        setInputValue('bayar-utang-input-sisa-utang', selectedUtang.sisa_utang);
    }

    const terapkanData = (id) => {
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded, multipart/form-data'
            }
        };

        let formData = new FormData();

        formData.append('id', id);
        formData.append('jatuh_tempo', $(`#edit-jatuh-tempo-${id}`).val());

        axios.post('http://emkl-abb.virtusrox.me/api/update/utang-jatuh-tempo.php', formData, config).then(response => {
            $(`#data-jatuh-tempo-${id}`).html($(`#edit-jatuh-tempo-${id}`).val());

            $(`#data-jatuh-tempo-${id}`).removeClass('d-none');
            $(`#edit-jatuh-tempo-${id}`).addClass('d-none');

            $(`#btn-ubah-${id}`).removeClass('d-none');
            $(`#btn-terapkan-${id}`).addClass('d-none');
        });
    }

    const ubahData = (id) => {
        $(`#data-jatuh-tempo-${id}`).addClass('d-none');
        $(`#edit-jatuh-tempo-${id}`).removeClass('d-none');

        $(`#btn-ubah-${id}`).addClass('d-none');
        $(`#btn-terapkan-${id}`).removeClass('d-none');
    }

    return (
        <div className="active content overflow-auto">
            <Loader />
            <p className="fw-bold text-secondary text-size-10">Utang</p>
            <p className="text-secondary">Transaksi / <span className="fw-bold primary-text-color">Utang</span></p>
            <div className="card-form">
                <form id="form-bayar-utang">
                    <div className="p-4">
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <div className="align-items-center col-12 col-lg-6 d-flex flex-wrap">
                                <label htmlFor="bayar-utang-input-tanggal" className="col-12 col-lg-4 col-md-6 pb-2 pb-md-0">Tanggal</label>
                                <div className="col col-lg-6 col-md-6">
                                    <input type="date" id="bayar-utang-input-tanggal" name="bayar-utang-input-tanggal" className="form-control" required />
                                </div>
                            </div>
                            <div className="align-items-center col-12 col-lg-6 d-flex flex-wrap">
                                <label htmlFor="bayar-utang-input-job-nomor" className="col-12 col-lg-4 col-md-6 pb-2 pb-md-0">Job Nomor</label>
                                <div className="col col-lg-6 col-md-6">
                                    <input type="text" id="bayar-utang-input-job-nomor" name="bayar-utang-input-job-nomor" className="form-control" readOnly required />
                                </div>
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="bayar-utang-input-nama-cost" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nama Cost</label>
                            <div className="col-12 col-lg-4 col-md-6">
                                <input type="text" name="bayar-utang-input-nama-cost" id="bayar-utang-input-nama-cost" className="form-control" readOnly required />
                            </div>
                        </div>
                        <label className="fw-bold pb-2 pb-md-0">Vendor</label>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="bayar-utang-input-kode-vendor" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Kode Vendor</label>
                            <div className="col-12 col-lg-4 col-md-6">
                                <input type="text" name="bayar-utang-input-kode-vendor" id="bayar-utang-input-kode-vendor" className="form-control" readOnly required />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="bayar-utang-select-nama-vendor" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nama Vendor</label>
                            <div className="col">
                                <input type="text" name="bayar-utang-input-nama-vendor" id="bayar-utang-input-nama-vendor" className="form-control" readOnly required />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="bayar-utang-input-sisa-utang" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Sisa Utang</label>
                            <div className="col-12 col-md-4 col-lg-2">
                                <input type="text" id="bayar-utang-input-sisa-utang" name="bayar-utang-input-sisa-utang" className="form-control text-end" placeholder="0" onInput={inputNumber} readOnly required />
                            </div>
                        </div>
                        <label className="fw-bold pb-2 pb-md-0">Pelunasan</label>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="bayar-utang-select-akun" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Akun Kas</label>
                            <div className="col-12 col-md-4 col-lg-2">
                                <select name="bayar-utang-select-akun" id="bayar-utang-select-akun" className="form-select">
                                    {akun.length > 0 ? akun.map(data =>
                                        <option value={data.kode}>{data.kode} - {data.nama}</option>
                                    ) :
                                        <option value="">-- Tidak Ada Data Akun --</option>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="bayar-utang-input-nominal" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nominal</label>
                            <div className="col-12 col-md-4 col-lg-2">
                                <input type="text" id="bayar-utang-input-nominal" name="bayar-utang-input-nominal" className="form-control text-end" placeholder="0" onInput={inputNumber} required />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="bayar-utang-input-keterangan" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Keterangan</label>
                            <div className="col">
                                <textarea id="bayar-utang-input-keterangan" name="bayar-utang-input-keterangan" className="form-control" placeholder="Keterangan" ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex">
                        <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Bayar" onClick={bayarUtang} />
                        <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Bersihkan" />
                    </div>
                </form>
            </div>

            <div className="card-form my-5 p-4">
                <div id="table-input-utang" className="table-responsive">
                    <table id="table-data-input-utang" className="table table-bordered table-hover table-striped text-nowrap w-100">
                        <thead className="align-middle text-center text-nowrap">
                            <tr>
                                <th>No.</th>
                                <th>Nomor Job</th>
                                <th>Tanggal Transaksi</th>
                                <th>Nama Cost</th>
                                <th>Kode Vendor</th>
                                <th>Nama Vendor</th>
                                <th>Jumlah Utang</th>
                                <th>Sisa Utang</th>
                                <th>Jatuh Tempo</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="table-data-input-utang-body" className="align-middle">
                            {utang.map((data, index) =>
                                <tr key={data.id}>
                                    <td className="text-center">{++index}.</td>
                                    <td className="text-center">{data.nomor}</td>
                                    <td className="text-center">{data.tanggal}</td>
                                    <td className="text-center">{data.nama_cost}</td>
                                    <td className="text-center">{data.kode_vendor}</td>
                                    <td>{data.nama_vendor}</td>
                                    <td className="text-end">{hargaFormat(data.jumlah_utang)}</td>
                                    <td className="text-end">{hargaFormat(data.sisa_utang)}</td>
                                    <td className="text-center">
                                        <div id={`data-jatuh-tempo-${data.id}`}>{data.jatuh_tempo}</div>
                                        <input type="date" name={`edit-jatuh-tempo-${data.id}`} id={`edit-jatuh-tempo-${data.id}`} className="d-none form-control text-center" defaultValue={data.jatuh_tempo} required />
                                    </td>
                                    <td className="text-center">
                                        <button id={`btn-terapkan-${data.id}`} className="btn d-none primary-color text-white me-2" onClick={() => terapkanData(data.id)}><FaCheck /> Terapkan</button>
                                        <button id={`btn-ubah-${data.id}`} className="btn btn-warning me-2" onClick={() => ubahData(data.id)}><FaEdit /> Ubah</button>
                                        <button id={`btn-bayar-${data.id}`} className="btn btn-success ms-2" onClick={() => selectedBayarUtang(data.id)}><FaMoneyBill /> Bayar</button>
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

export default Utang
