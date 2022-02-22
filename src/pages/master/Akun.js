import { useEffect, useState } from 'react'
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { checkInputValidity, disableMouseClick, enableMouseClick, getInputValue, hargaFormat, inputNumber } from '../../components/Helper';

import axios from 'axios';
import $ from 'jquery';

const Akun = () => {
    const [akun, setAkun] = useState([]);

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/akun.php').then(response => {
            if (response.data.length > 0)
                setAkun(response.data);

            $(document).ready(function () {
                $('#table-data').DataTable();

                $('input').on('input', function () {
                    $(this).val($(this).val().replace(/['"]/gi, ''));
                });
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

        axios.post('http://emkl-abb.virtusrox.me/api/delete/akun.php', data, config).then(response => {
            window.location.reload();
        });
    }

    const simpanData = () => {
        if (checkInputValidity('form')) {
            const data = {
                kode: getInputValue('input-kode'),
                nama: getInputValue('input-nama'),
                alamat: getInputValue('input-saldo-awal')
            };

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded, multipart/form-data'
                }
            };

            let checkAkun = akun.filter(item => (item.kode === getInputValue('input-kode') || item.nama === getInputValue('input-nama')));

            if (checkAkun && checkAkun.length > 0) {
                alert('Kode Atau Nama Akun Sudah Terdaftar!');
            } else {
                axios.post('http://emkl-abb.virtusrox.me/api/insert/akun.php', data, config).then(response => {
                    window.location.reload();
                });
            }
        }
    }

    const terapkanData = (kode) => {
        if (checkInputValidity('form')) {
            const data = {
                kode: kode,
                nama: getInputValue(`edit-nama-${kode}`),
                saldo: getInputValue(`edit-saldo-${kode}`)
            };

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded, multipart/form-data'
                }
            };

            axios.post('http://emkl-abb.virtusrox.me/api/update/akun.php', data, config).then(response => {
                $('#data-nama-' + kode).html(data.nama);
                $('#data-saldo-' + kode).html(`Rp. ${data.saldo},00`);

                $('#data-nama-' + kode).removeClass('d-none');
                $('#data-saldo-' + kode).removeClass('d-none');

                $('#edit-nama-' + kode).addClass('d-none');
                $('#edit-saldo-' + kode).addClass('d-none');

                $('#button-ubah-' + kode).removeClass('d-none');
                $('#button-terapkan-' + kode).addClass('d-none');
            });
        }
    }

    const ubahData = (kode) => {
        $('#data-nama-' + kode).addClass('d-none');
        $('#data-saldo-' + kode).addClass('d-none');

        $('#edit-nama-' + kode).removeClass('d-none');
        $('#edit-saldo-' + kode).removeClass('d-none');

        $('#button-ubah-' + kode).addClass('d-none');
        $('#button-terapkan-' + kode).removeClass('d-none');
    }

    return (
        <div className="active content overflow-auto">
            <p className="fw-bold text-secondary text-size-10">Akun</p>
            <p className="text-secondary">Master / <span className="fw-bold primary-text-color">Akun</span></p>
            <form id="form" className="card-form">
                <div className="p-4">
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-kode" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Kode Akun</label>
                        <div className="col col-lg-2 col-md-3">
                            <input type="text" id="input-kode" name="input-kode" className="form-control" placeholder="Kode Akun" maxLength={10} required />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-nama" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nama Akun</label>
                        <div className="col">
                            <input type="text" id="input-nama" name="input-nama" className="form-control" placeholder="Nama Akun" maxLength={100} required />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-alamat" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Saldo Awal</label>
                        <div className="col-12 col-md-6 col-lg-4">
                            <input type="text" id="input-alamat" name="input-alamat" className="form-control" placeholder="Saldo Awal" onInput={inputNumber} required />
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
                                <th>Kode Akun</th>
                                <th>Nama Akun</th>
                                <th>Saldo</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle">
                            {akun.map((data, index) =>
                                <tr key={data.id}>
                                    <td className="text-center">
                                        <div>{++index}.</div>
                                    </td>
                                    <td className="text-center">
                                        <div id={"data-kode-" + data.kode}>{data.kode}</div>
                                        <div><input type="text" id={"edit-kode-" + data.kode} name={"edit-kode-" + data.kode} className="d-none form-control" maxLength={10} defaultValue={data.kode} /></div>
                                    </td>
                                    <td>
                                        <div id={"data-nama-" + data.kode}>{data.nama}</div>
                                        <div><input type="text" id={"edit-nama-" + data.kode} name={"edit-nama-" + data.kode} className="d-none form-control" maxLength={100} defaultValue={data.nama} /></div>
                                    </td>
                                    <td className="text-end">
                                        <div id={"data-saldo-" + data.kode}>{hargaFormat(data.saldo)}</div>
                                        <div><input type="text" id={"edit-saldo-" + data.kode} name={"edit-saldo-" + data.kode} className="d-none form-control" onInput={inputNumber} defaultValue={data.saldo} /></div>
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

export default Akun