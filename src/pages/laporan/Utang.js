import { useEffect, useState } from 'react';
import { disableMouseClick, enableMouseClick, getInputValue, setInputValue, today } from '../../components/Helper';

import $ from 'jquery';
import axios from 'axios';

const Utang = () => {

    const [utang, setUtang] = useState([]);

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/utang.php').then(response => {
            if (response.data.length > 0) setUtang(response.data);

            $(document).ready(function () {
                $('#table-data').DataTable();
            });

            enableMouseClick();
        });
    }, []);

    const cekLaporan = () => {
        let tanggalAwal = new Date(getInputValue('input-tanggal-awal'));
        let tanggalAkhir = new Date(getInputValue('input-tanggal-akhir'));

        let laporan = utang.filter(item => (new Date(item.tanggal)) >= tanggalAwal && (new Date(item.tanggal)) <= tanggalAkhir);

        $('#table-data').DataTable().destroy();
        $('#table-data-body').empty();

        laporan.forEach((item, index) => {
            if (item.jumlah_utang <= 0) return;
            
            $('#table-data-body').append(
                `<tr>
                    <td class="text-center">${++index}</td>
                    <td class="text-center">${item.nomor}</td>
                    <td class="text-center">${item.tanggal}</td>
                    <td>${item.nama_cost}</td>
                    <td>${item.kode_vendor}</td>
                    <td>${item.nama_vendor}</td>
                    <td class="text-end">Rp. ${item.jumlah_utang},00</td>
                    <td class="text-end">Rp. ${item.sisa_utang},00</td>
                    <td class="text-center">${item.jatuh_tempo}</td>
                </tr>`
            );
        });

        $('#table-data').DataTable();
    }

    return (
        <div className="active content overflow-auto">
            <p className="fw-bold text-secondary text-size-10">Utang</p>
            <p className="text-secondary">Laporan / <span className="fw-bold primary-text-color">Utang</span></p>
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
                                <th>Jenis Cost</th>
                                <th>Kode Vendor</th>
                                <th>Nama Vendor</th>
                                <th>Jumlah Utang</th>
                                <th>Sisa Utang</th>
                                <th>Jatuh Tempo</th>
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

export default Utang
