import { Component, useEffect, useState } from 'react';

import $ from 'jquery';
import axios from 'axios';
import { getSelectValue, hargaFormat, today } from '../../components/Helper';

const PengeluaranKas = () => {

    const [jenisPengeluaran, setJenisPengeluaranKas] = useState([]);
    const [piutang, setPiutang] = useState([]);
    const [utang, setUtang] = useState([]);
    const [table, setTable] = useState([]);

    useEffect(() => {
        axios.get('http://emkl-abb.virtusrox.me/api/select/piutang.php').then(responsePiutang => {
            if (responsePiutang.data.length > 0)
                setPiutang(responsePiutang.data);

            axios.get('http://emkl-abb.virtusrox.me/api/select/utang.php').then(responseUtang => {
                if (responseUtang.data.length > 0)
                    setUtang(responseUtang.data);

                axios.get('http://emkl-abb.virtusrox.me/api/select/jenis-pengeluaran.php').then(responseJeniPengeluaran => {
                    if (responseJeniPengeluaran.data.length > 0)
                        setJenisPengeluaranKas(responseJeniPengeluaran.data);

                    $(document).ready(function () {
                        $('#table-data').DataTable();
                    });

                    generateTable('Semua');
                });
            });
        });
    }, []);

    useEffect(() => {
        $('#table-data').DataTable();
    }, [table]);

    const filterTable = () => {
        generateTable(getSelectValue('select-jenis-pengeluaran'));
    }

    const generateTable = (filter) => {
        let dataTable = [];

        if (filter === 'Semua') {
            let index = 0;
            piutang.map(data => {
                dataTable.push(
                    <tr key={data.id}>
                        <td className="text-center">{++index}.</td>
                        <td className="text-center">{data.tanggal}</td>
                        <td>{(data.keterangan) ? data.keterangan : ''}</td>
                        <td className="text-end">{hargaFormat(data.jumlah_piutang)}</td>
                    </tr>
                );
            });

            utang.map(data => {
                dataTable.push(
                    <tr key={data.id}>
                        <td className="text-center">{++index}.</td>
                        <td className="text-center">{data.tanggal}</td>
                        <td>{(data.keterangan) ? data.keterangan : ''}</td>
                        <td className="text-end">{hargaFormat(data.jumlah_utang)}</td>
                    </tr>
                );
            });
        } else if (filter === 'Pembayaran Cost') {
            piutang.map((data, index) => {
                dataTable.push(
                    <tr key={data.id}>
                        <td className="text-center">{++index}.</td>
                        <td className="text-center">{data.tanggal}</td>
                        <td>{(data.keterangan) ? data.keterangan : ''}</td>
                        <td className="text-end">{hargaFormat(data.jumlah_piutang)}</td>
                    </tr>
                );
            });
        } else if (filter === 'Pembayaran Utang') {
            utang.map((data, index) => {
                dataTable.push(
                    <tr key={data.id}>
                        <td className="text-center">{++index}.</td>
                        <td className="text-center">{data.tanggal}</td>
                        <td>{(data.keterangan) ? data.keterangan : ''}</td>
                        <td className="text-end">{hargaFormat(data.jumlah_utang)}</td>
                    </tr>
                );
            });
        }

        $('#table-data').DataTable().destroy();

        setTable(dataTable);
    }

    return (
        <div className="active content overflow-auto">
            <p className="fw-bold text-secondary text-size-10">Pengeluaran Kas</p>
            <p className="text-secondary">Laporan / <span className="fw-bold primary-text-color">Pengeluaran Kas</span></p>
            <form className="card-form">
                <div className="p-4">
                    <div className="d-flex flex-wrap pb-3 pb-md-2">
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
                    <div className="align-items-center col-12 col-lg-6 d-flex flex-wrap">
                        <label htmlFor="select-jenis-pengeluaran" className="col-12 col-lg-4 pb-2 pb-md-0">Jenis Pengeluaran</label>
                        <div className="col-12 col-lg-8">
                            <select name="select-jenis-pengeluaran" id="select-jenis-pengeluaran" className="form-select">
                                {jenisPengeluaran.length > 0 ? jenisPengeluaran.map(data =>
                                    <option key={data.id} value={data.nama}>{data.nama}</option>
                                ) :
                                    <option value="">-- Tidak Ada Data --</option>
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Cek Laporan" onClick={filterTable} />
                    <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Batal" />
                </div>
            </form>
            <div className="card-form my-5">
                <div className="table-responsive p-4">
                    <table id="table-data" className="table table-bordered table-hover table-striped w-100">
                        <thead className="align-middle text-center text-nowrap">
                            <tr>
                                <th>No.</th>
                                <th>Tanggal</th>
                                <th>Keterangan</th>
                                <th>Pengeluaran</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle">
                            {table}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PengeluaranKas
