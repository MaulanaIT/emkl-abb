import { Component } from 'react'
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

import $ from 'jquery';
import axios from 'axios';

export class Marketing extends Component {
    state = {
        cost: 0,
        id: 0,
        marketing: []
    };

    componentDidMount() {
        axios.get('http://emkl-abb.virtusrox.me/api/select/marketing.php').then(response => {
            if (response.data.length > 0) {
                this.setState({ marketing: response.data });
            }

            $(document).ready(function () {
                $('#table-data').DataTable();
                
                $('input').on('input', function() {
                    $(this).val($(this).val().replace(/['"]/gi, ''));
                });
            })
        });
    }

    hapusData = (id) => {
        const data = {
            id: id
        };

        const config = {
            headers: {
                'content-type':'application/x-www-form-urlencoded, multipart/form-data'
            }
        };

        axios.post('http://emkl-abb.virtusrox.me/api/delete/marketing.php', data, config).then(response => {
            window.location.reload();
        });
    }

    inputNumber = (event) => {
        (document.getElementById(event.target.id) as HTMLInputElement).value = event.target.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');
    }

    simpanData = () => {
        const data = {
            tanggal: $('#input-tanggal').val(),
            nama: $('#input-nama').val(),
            jasa: $('#input-jasa').val(),
            harga: $('#input-harga').val()
        };

        const config = {
            headers: {
                'content-type':'application/x-www-form-urlencoded, multipart/form-data'
            }
        };

        axios.post('http://emkl-abb.virtusrox.me/api/insert/marketing.php', data, config).then(response => {
            window.location.reload();
        });
    }

    terapkanData = (id) => {
        const data = {
            id: id,
            nama: $('#edit-nama-' + id).val(),
            jasa: $('#edit-jasa-' + id).val(),
            harga: $('#edit-harga-' + id).val(),
            tanggal: $('#edit-tanggal-' + id).val()
        };

        const config = {
            headers: {
                'content-type':'application/x-www-form-urlencoded, multipart/form-data'
            }
        };

        axios.post('http://emkl-abb.virtusrox.me/api/update/marketing.php', data, config).then(response => {
            $('#data-nama-' + id).html($('#edit-nama-' + id).val());
            $('#data-jasa-' + id).html($('#edit-jasa-' + id).val());
            $('#data-harga-' + id).html($('#edit-harga-' + id).val());
            $('#data-tanggal-' + id).html($('#edit-tanggal-' + id).val());

            $('#data-nama-' + id).removeClass('d-none');
            $('#data-jasa-' + id).removeClass('d-none');
            $('#data-harga-' + id).removeClass('d-none');
            $('#data-tanggal-' + id).removeClass('d-none');
    
            $('#edit-nama-' + id).addClass('d-none');
            $('#edit-jasa-' + id).addClass('d-none');
            $('#edit-harga-' + id).addClass('d-none');
            $('#edit-tanggal-' + id).addClass('d-none');
    
            $('#button-ubah-' + id).removeClass('d-none');
            $('#button-terapkan-' + id).addClass('d-none');
        });
    }

    ubahData = (id) => {
        $('#data-nama-' + id).addClass('d-none');
        $('#data-jasa-' + id).addClass('d-none');
        $('#data-harga-' + id).addClass('d-none');
        $('#data-tanggal-' + id).addClass('d-none');

        $('#edit-nama-' + id).removeClass('d-none');
        $('#edit-jasa-' + id).removeClass('d-none');
        $('#edit-harga-' + id).removeClass('d-none');
        $('#edit-tanggal-' + id).removeClass('d-none');

        $('#button-ubah-' + id).addClass('d-none');
        $('#button-terapkan-' + id).removeClass('d-none');
    }

    render() {
        return (
            <div className="active content overflow-auto">
                <p className="fw-bold text-secondary text-size-10">Marketing</p>
                <p className="text-secondary">Transaksi / <span className="fw-bold primary-text-color">Marketing</span></p>
                <form className="card-form" action="#" method="POST" encType="multipart/form-data">
                    <div className="p-4">
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-tanggal" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Tanggal</label>
                            <div className="col col-lg-4 col-md-6">
                                <input type="date" id="input-tanggal" name="input-tanggal" className="form-control" placeholder="dd/mm/yyyy" required />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-nama" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nama Customer</label>
                            <div className="col">
                                <input type="text" id="input-nama" name="input-nama" className="form-control" placeholder="Nama Customer" maxLength={100} required />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-jasa" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nama Jasa</label>
                            <div className="col">
                                <input type="text" id="input-jasa" name="input-jasa" className="form-control" placeholder="Nama Jasa" maxLength={100} required />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-harga" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Harga</label>
                            <div className="col col-lg-4 col-md-6">
                                <input type="text" id="input-harga" name="input-harga" className="form-control" placeholder="Harga" onInput={this.inputNumber} required />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex">
                        <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Simpan" onClick={this.simpanData} />
                        <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Bersihkan" />
                    </div>
                </form>
                <div className="card-form my-5">
                    <div className="table-responsive p-4">
                        <table id="table-data" className="table table-bordered table-hover table-striped w-100">
                            <thead className="align-middle text-center text-nowrap">
                                <tr>
                                    <th>No.</th>
                                    <th>Nama Customer</th>
                                    <th>Nama Jasa</th>
                                    <th>Harga</th>
                                    <th>Tanggal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle">
                                {this.state.marketing.map(data =>
                                    <tr key={data.id}>
                                        <td className="text-center">
                                            <div>{++this.state.id}.</div>
                                        </td>
                                        <td>
                                            <div id={"data-nama-" + data.id}>{data.nama}</div>
                                            <div><input type="text" id={"edit-nama-" + data.id} name={"edit-nama-" + data.id} className="d-none form-control" defaultValue={data.nama} /></div>
                                        </td>
                                        <td className="text-center">
                                            <div id={"data-jasa-" + data.id}>{data.jasa}</div>
                                            <div><input type="text" id={"edit-jasa-" + data.id} name={"edit-jasa-" + data.id} className="d-none form-control" defaultValue={data.jasa} /></div>
                                        </td>
                                        <td className="text-center">
                                            <div id={"data-harga-" + data.id}>Rp. {data.harga}</div>
                                            <div><input type="text" id={"edit-harga-" + data.id} name={"edit-harga-" + data.id} className="d-none form-control" defaultValue={data.harga} onInput={this.inputNumber} /></div>
                                        </td>
                                        <td className="text-center">
                                            <div id={"data-tanggal-" + data.id}>{data.tanggal}</div>
                                            <div><input type="date" id={"edit-tanggal-" + data.id} name={"edit-tanggal-" + data.id} className="d-none form-control" defaultValue={data.tanggal} /></div>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1 justify-content-center text-nowrap">
                                                <button id={"button-ubah-" + data.id} className="btn btn-warning col col-md-6 text-white" onClick={() => this.ubahData(data.id)}><FaEdit /> Ubah</button>
                                                <button id={"button-terapkan-" + data.id} className="btn col col-md-6 d-none primary-color text-white" onClick={() => this.terapkanData(data.id)}><FaCheck /> Terapkan</button>
                                                <button id={"button-hapus-" + data.id} className="btn btn-danger col col-md-6" onClick={() => this.hapusData(data.id)}><FaTrash /> Hapus</button>
                                            </div>
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
}

export default Marketing
