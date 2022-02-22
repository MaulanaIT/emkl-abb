import { useEffect, useState } from 'react';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { disableMouseClick, enableMouseClick, getInputValue, hargaFormat, inputNumber, today } from '../../components/Helper';

import $ from 'jquery';
import axios from 'axios';

const Jasa = () => {
    const [detailCost, setDetailCost] = useState([]);
    const [jasa, setJasa] = useState([]);
    const [table, setTable] = useState([]);

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/detail-cost.php').then(responseDetailCost => {
            if (responseDetailCost.data.length > 0)
                setDetailCost(responseDetailCost.data);

            axios.get('http://emkl-abb.virtusrox.me/api/select/jasa.php').then(responseJasa => {
                if (responseJasa.data.length > 0)
                    setJasa(responseJasa.data);

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

    useEffect(() => {
        $('#table-data').DataTable();
    }, [table])

    useEffect(() => {
        generateTable();
    }, [jasa])

    const filterJasa = () => {
        generateTable();
    }

    const generateTable = () => {
        let dataTable = [];
        let stateCostAverage = [];
        let stateCostTotal = [];

        $('#table-data').DataTable().destroy();

        jasa.map(itemJasa => {
            let total = 0;

            detailCost.map(itemDetailCost => {
                let tanggalAwal = (new Date(getInputValue('input-tanggal-awal'))).getTime();
                let tanggalAkhir = (new Date(getInputValue('input-tanggal-akhir'))).getTime();
                let tanggalItem = (new Date(itemDetailCost.updated_at)).getTime();

                if (itemDetailCost[itemJasa.nama.toLowerCase().replace(new RegExp(' ', 'g'), '_')] && tanggalItem >= tanggalAwal && tanggalItem <= tanggalAkhir) {
                    total += parseInt(itemDetailCost[itemJasa.nama.toLowerCase().replace(new RegExp(' ', 'g'), '_')]);
                };
            });

            stateCostAverage[itemJasa.nama.toLowerCase().replace(new RegExp(' ', 'g'), '_')] = Math.round(total / detailCost.length);
            stateCostTotal[itemJasa.nama.toLowerCase().replace(new RegExp(' ', 'g'), '_')] = total;
        });

        jasa.map((data, index) => {
            dataTable.push(
                <tr key={data.id}>
                    <td className="text-center">
                        <div>{++index}.</div>
                    </td>
                    <td>
                        <div id={"data-nama-" + data.id}>{data.nama}</div>
                        <div><input type="text" id={"edit-nama-" + data.id} name={"edit-nama-" + data.id} className="d-none form-control" defaultValue={data.nama} required /></div>
                    </td>
                    <td className="text-end">
                        <div id={"data-biaya-rata-" + data.id}>{hargaFormat(stateCostAverage[data.nama.toLowerCase().replace(new RegExp(' ', 'g'), '_')])} </div>
                    </td>
                    <td className="text-end">
                        <div id={"data-harga-" + data.id}>{(data.harga > 0 ? (hargaFormat(data.harga)) : ('Rp. 0,00'))}</div>
                        <div><input type="text" id={"edit-harga-" + data.id} name={"edit-harga-" + data.id} className="d-none form-control" defaultValue={data.harga} onInput={inputNumber} required /></div>
                    </td>
                    <td className="text-end">
                        <div id={"data-total-" + data.id}>{hargaFormat(stateCostTotal[data.nama.toLowerCase().replace(new RegExp(' ', 'g'), '_')])}</div>
                    </td>
                    <td>
                        <div className="d-flex gap-1 justify-content-center text-nowrap">
                            <button id={"button-ubah-" + data.id} className="btn btn-warning col col-md-6 text-white" onClick={() => ubahData(data.id)}><FaEdit /> Ubah</button>
                            <button id={"button-terapkan-" + data.id} className="btn col col-md-6 d-none primary-color text-white" onClick={() => terapkanData(data.id)}><FaCheck /> Terapkan</button>
                            <button id={"button-hapus-" + data.id} className="btn btn-danger col col-md-6" onClick={() => hapusData(data.id)}><FaTrash /> Hapus</button>
                        </div>
                    </td>
                </tr>
            );
        });

        setTable(dataTable);
    }

    const hapusData = (id) => {
        const data = {
            id: id
        };

        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded, multipart/form-data'
            }
        };

        axios.post('http://emkl-abb.virtusrox.me/api/delete/jasa.php', data, config).then(response => {
            window.location.reload();
        });
    }

    const terapkanData = (id) => {
        const data = {
            id: id,
            nama: $('#edit-nama-' + id).val(),
            harga: $('#edit-harga-' + id).val()
        };

        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded, multipart/form-data'
            }
        };

        axios.post('http://emkl-abb.virtusrox.me/api/update/jasa.php', data, config).then(response => {
            $('#data-nama-' + id).html($('#edit-nama-' + id).val());
            $('#data-harga-' + id).html(hargaFormat(parseInt($('#edit-harga-' + id).val())));

            $('#data-nama-' + id).removeClass('d-none');
            $('#data-harga-' + id).removeClass('d-none');

            $('#edit-nama-' + id).addClass('d-none');
            $('#edit-harga-' + id).addClass('d-none');

            $('#button-ubah-' + id).removeClass('d-none');
            $('#button-terapkan-' + id).addClass('d-none');

            axios.get('http://emkl-abb.virtusrox.me/api/select/jasa.php').then(responseJasa => {
                if (responseJasa.data.length > 0)
                    setJasa(responseJasa.data);
            });
        });
    }

    const ubahData = (id) => {
        $('#data-nama-' + id).addClass('d-none');
        $('#data-harga-' + id).addClass('d-none');

        $('#edit-nama-' + id).removeClass('d-none');
        $('#edit-harga-' + id).removeClass('d-none');

        $('#button-ubah-' + id).addClass('d-none');
        $('#button-terapkan-' + id).removeClass('d-none');
    }

    return (
        <div className="active content overflow-auto">
            <p className="fw-bold text-secondary text-size-10">Jasa</p>
            <p className="text-secondary">Master / <span className="fw-bold primary-text-color">Jasa</span></p>
            <form className="card-form">
                <div className="p-4">
                    <div id="field-periode" className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-tanggal-awal" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Tanggal</label>
                        <div className="col col-lg-2 col-md-4">
                            <input type="date" id="input-tanggal-awal" name="input-tanggal-awal" className="form-control" placeholder="dd/mm/yyyy" defaultValue={today()} required />
                        </div>
                        <label htmlFor="input-tanggal-akhir" className="col-auto px-4 pb-2 pb-md-0 text-center text-nowrap">s/d</label>
                        <div className="col col-lg-2 col-md-4">
                            <input type="date" id="input-tanggal-akhir" name="input-tanggal-akhir" className="form-control" placeholder="dd/mm/yyyy" defaultValue={today()} required />
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Tampilkan" onClick={filterJasa} />
                    <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Bersihkan" />
                </div>
            </form>
            <div className="card-form my-5 p-4">
                <div className="table-responsive">
                    <table id="table-data" className="table table-bordered table-hover table-striped text-nowrap w-100">
                        <thead className="align-middle text-center text-nowrap">
                            <tr>
                                <th>No.</th>
                                <th>Nama Jasa</th>
                                <th>Biaya Rata-Rata</th>
                                <th>Harga Jual</th>
                                <th>Total</th>
                                <th>Aksi</th>
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

export default Jasa
