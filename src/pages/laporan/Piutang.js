import { useEffect, useState } from 'react';
import { disableMouseClick, enableMouseClick, getInputValue, hargaFormat, setInputValue, today } from '../../components/Helper';

import $ from 'jquery';
import axios from 'axios';

const Piutang = () => {

    const [piutang, setPiutang] = useState([]);

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/detail-piutang.php').then(response => {
            if (response.data.length > 0) setPiutang(response.data);

            $(document).ready(function () {
                $('#table-data').DataTable();
            });
            enableMouseClick();
        });
    }, []);

    const cekLaporan = () => {
        let tanggalAwal = new Date(getInputValue('input-tanggal-awal'));
        let tanggalAkhir = new Date(getInputValue('input-tanggal-akhir'));

        let laporan = piutang.filter(item => (new Date(item.tanggal)) >= tanggalAwal && (new Date(item.tanggal)) <= tanggalAkhir);

        $('#table-data').DataTable().destroy();
        $('#table-data-body').empty();

        laporan.forEach((item, index) => {
            $('#table-data-body').append(
                `<tr>
                    <td class="text-center">${++index}.</td>
                    <td class="text-center">${item.nomor}</td>
                    <td class="text-center">${item.tanggal}</td>
                    <td>${item.kode_customer}</td>
                    <td>${item.nama_customer}</td>
                    <td class="text-end">${hargaFormat(parseInt(item.terima_piutang) + parseInt(item.sisa_piutang))}</td>
                    <td class="text-end">${hargaFormat(item.sisa_piutang)}</td>
                </tr>`
            );
        });

        $('#table-data').DataTable();
    }

    return (
        <div className="active content overflow-auto">
            <p className="fw-bold text-secondary text-size-10">Piutang</p>
            <p className="text-secondary">Laporan / <span className="fw-bold primary-text-color">Piutang</span></p>
            <form className="card-form">
                <div className="p-4">
                    <div className="d-flex flex-wrap">
                        <div className="align-items-center col-12 col-lg-6 d-flex flex-wrap pb-2 pb-md-0">
                            <label htmlFor="input-tanggal-awal" className="col-12 col-lg-4 pb-2 pb-md-0">Tanggal Awal</label>
                            <div className="col-12 col-lg-6">
                                <input type="date" name="input-tanggal-awal" id="input-tanggal-awal" className="form-control" defaultValue={today()} />
                            </div>
                        </div>
                        <div className="align-items-center col-12 col-lg-6 d-flex flex-wrap">
                            <label htmlFor="input-tanggal-akhir" className="col-12 col-lg-4 pb-2 pb-md-0">Tanggal Akhir</label>
                            <div className="col-12 col-lg-6">
                                <input type="date" name="input-tanggal-akhir" id="input-tanggal-akhir" className="form-control" defaultValue={today()} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Cek Laporan" onClick={cekLaporan} />
                    <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Batal" />
                </div>
            </form>
            <div className="card-form my-5 p-4">
                <div className="table-responsive">
                    <table id="table-data" className="table table-bordered table-hover table-striped text-nowrap w-100">
                        <thead className="align-middle text-center text-nowrap">
                            <tr>
                                <th>No.</th>
                                <th>Nomor</th>
                                <th>Tanggal</th>
                                <th>Kode Customer</th>
                                <th>Nama Customer</th>
                                <th>Jumlah Piutang</th>
                                <th>Sisa Piutang</th>
                            </tr>
                        </thead>
                        <tbody id="table-data-body" className="align-middle">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Piutang
