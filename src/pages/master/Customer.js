import { useEffect, useState } from 'react';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { checkInputValidity, disableMouseClick, enableMouseClick, inputNumber } from '../../components/Helper';

import axios from 'axios';
import $ from 'jquery';

const Customer = () => {
    const [customer, setCustomer] = useState([]);

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/customer.php').then(response => {
            if (response.data.length > 0)
                setCustomer(response.data);

            $(document).ready(function () {
                $('#table-data').DataTable();

                $('input').on('input', function () {
                    $(this).val($(this).val().replace(/['"]/gi, ''));
                });

                let lengthData = response.data.length;
                let index = 0;

                let formatKode = "0001";

                if (lengthData > 0) {
                    let kode = response.data[lengthData - 1].kode;

                    for (let i = 1; i < kode.length; i++) {
                        const data = response.data[lengthData - 1].kode[i];
                        if (data != 0) {
                            index = i;
                            break;
                        }
                    }

                    let lastKode = "";

                    for (let i = index; i < kode.length; i++) {
                        lastKode = lastKode + kode[i];
                    }

                    $('#input-kode').val("C" + formatKode.substring(0, formatKode.length - lastKode.length) + (parseInt(lastKode) + 1));
                } else {
                    $('#input-kode').val("C" + formatKode);
                }
            });

            enableMouseClick();
        });
    }, []);

    const hapusData = (kode) => {
        const data = {
            kode: kode
        };

        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded, multipart/form-data'
            }
        };

        axios.post('http://emkl-abb.virtusrox.me/api/delete/customer.php', data, config).then(response => {
            window.location.reload();
        });
    }

    const simpanData = () => {
        if (checkInputValidity('form')) {
            const data = {
                kode: $('#input-kode').val(),
                nama: $('#input-nama').val(),
                alamat: $('#input-alamat').val(),
                telepon: $('#input-telepon').val(),
                email: $('#input-email').val(),
                pic: $('#input-pic').val()
            };

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded, multipart/form-data'
                }
            };

            axios.post('http://emkl-abb.virtusrox.me/api/insert/customer.php', data, config).then(response => {
                window.location.reload();
            });
        }
    }

    const terapkanData = (kode) => {
        if (checkInputValidity('form')) {
            const data = {
                kode: kode,
                nama: $('#edit-nama-' + kode).val(),
                alamat: $('#edit-alamat-' + kode).val(),
                telepon: $('#edit-telepon-' + kode).val(),
                email: $('#edit-email-' + kode).val(),
                pic: $('#edit-pic-' + kode).val()
            };

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded, multipart/form-data'
                }
            };

            axios.post('http://emkl-abb.virtusrox.me/api/update/customer.php', data, config).then(response => {
                $('#data-nama-' + kode).html($('#edit-nama-' + kode).val());
                $('#data-alamat-' + kode).html($('#edit-alamat-' + kode).val());
                $('#data-telepon-' + kode).html($('#edit-telepon-' + kode).val());
                $('#data-email-' + kode).html($('#edit-email-' + kode).val());
                $('#data-pic-' + kode).html($('#edit-pic-' + kode).val());

                $('#data-nama-' + kode).removeClass('d-none');
                $('#data-alamat-' + kode).removeClass('d-none');
                $('#data-telepon-' + kode).removeClass('d-none');
                $('#data-email-' + kode).removeClass('d-none');
                $('#data-pic-' + kode).removeClass('d-none');

                $('#edit-nama-' + kode).addClass('d-none');
                $('#edit-alamat-' + kode).addClass('d-none');
                $('#edit-telepon-' + kode).addClass('d-none');
                $('#edit-email-' + kode).addClass('d-none');
                $('#edit-pic-' + kode).addClass('d-none');

                $('#button-ubah-' + kode).removeClass('d-none');
                $('#button-terapkan-' + kode).addClass('d-none');
            });
        }
    }

    const ubahData = (kode) => {
        $('#data-nama-' + kode).addClass('d-none');
        $('#data-alamat-' + kode).addClass('d-none');
        $('#data-telepon-' + kode).addClass('d-none');
        $('#data-email-' + kode).addClass('d-none');
        $('#data-pic-' + kode).addClass('d-none');

        $('#edit-nama-' + kode).removeClass('d-none');
        $('#edit-alamat-' + kode).removeClass('d-none');
        $('#edit-telepon-' + kode).removeClass('d-none');
        $('#edit-email-' + kode).removeClass('d-none');
        $('#edit-pic-' + kode).removeClass('d-none');

        $('#button-ubah-' + kode).addClass('d-none');
        $('#button-terapkan-' + kode).removeClass('d-none');
    }

    return (
        <div className="active content overflow-auto">
            <p className="fw-bold text-secondary text-size-10">Customer</p>
            <p className="text-secondary">Master / <span className="fw-bold primary-text-color">Customer</span></p>
            <form id="form" className="card-form">
                <div className="p-4">
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-kode" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Kode Customer</label>
                        <div className="col col-lg-2 col-md-3">
                            <input type="text" id="input-kode" name="input-kode" className="form-control" placeholder="Kode Customer" maxLength={10} readOnly required />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-nama" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nama Customer</label>
                        <div className="col">
                            <input type="text" id="input-nama" name="input-nama" className="form-control" placeholder="Nama Customer" maxLength={100} required />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-alamat" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Alamat</label>
                        <div className="col">
                            <input type="text" id="input-alamat" name="input-alamat" className="form-control" placeholder="Alamat" required />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-row flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-telepon" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">No. Telepon</label>
                        <div className="col col-lg-4 col-md-6">
                            <input type="text" id="input-telepon" name="input-telepon" className="form-control" placeholder="Telepon" onInput={inputNumber} maxLength={13} required />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-email" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Email</label>
                        <div className="col col-lg-4 col-md-6">
                            <input type="email" id="input-email" name="input-email" className="form-control" placeholder="Email" maxLength={100} required />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-pic" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">PIC</label>
                        <div className="col">
                            <input type="text" id="input-pic" name="input-pic" className="form-control" placeholder="PIC" maxLength={100} required />
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} onClick={simpanData} value="Simpan" />
                    <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Bersihkan" />
                </div>
            </form>
            <div className="card-form my-5 p-4">
                <div className="table-responsive">
                    <table id="table-data" className="table table-bordered table-hover table-striped w-100">
                        <thead className="align-middle text-center text-nowrap">
                            <tr>
                                <th>No.</th>
                                <th>Nama Customer</th>
                                <th>Alamat</th>
                                <th>No. Telepon</th>
                                <th>Email</th>
                                <th>PIC</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle">
                            {customer.map((data, index) =>
                                <tr key={data.id}>
                                    <td className="text-center">
                                        <div>{++index}.</div>
                                    </td>
                                    <td>
                                        <div id={"data-nama-" + data.kode}>{data.nama}</div>
                                        <div><input type="text" id={"edit-nama-" + data.kode} name={"edit-nama-" + data.kode} className="d-none form-control" defaultValue={data.nama} /></div>
                                    </td>
                                    <td>
                                        <div id={"data-alamat-" + data.kode}>{data.alamat}</div>
                                        <div><input type="text" id={"edit-alamat-" + data.kode} name={"edit-alamat-" + data.kode} className="d-none form-control" defaultValue={data.alamat} /></div>
                                    </td>
                                    <td className="text-center">
                                        <div id={"data-telepon-" + data.kode}>{data.telepon}</div>
                                        <div><input type="text" id={"edit-telepon-" + data.kode} name={"edit-telepon-" + data.kode} className="d-none form-control" defaultValue={data.telepon} maxLength={13} onInput={inputNumber} /></div>
                                    </td>
                                    <td>
                                        <div id={"data-email-" + data.kode}>{data.email}</div>
                                        <div><input type="text" id={"edit-email-" + data.kode} name={"edit-email-" + data.kode} className="d-none form-control" defaultValue={data.email} /></div>
                                    </td>
                                    <td>
                                        <div id={"data-pic-" + data.kode}>{data.pic}</div>
                                        <div><input type="text" id={"edit-pic-" + data.kode} name={"edit-pic-" + data.kode} className="d-none form-control" defaultValue={data.pic} /></div>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1 justify-content-center text-nowrap">
                                            <button id={"button-ubah-" + data.kode} className="btn btn-warning col col-md-6 text-white" onClick={() => ubahData(data.kode)}><FaEdit /> Ubah</button>
                                            <button id={"button-terapkan-" + data.kode} className="btn col col-md-6 d-none primary-color text-white" onClick={() => terapkanData(data.kode)}><FaCheck /> Terapkan</button>
                                            <button id={"button-hapus-" + data.kode} className="btn btn-danger col col-md-6" onClick={() => hapusData(data.kode)}><FaTrash /> Hapus</button>
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

export default Customer
