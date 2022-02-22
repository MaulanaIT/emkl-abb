import React, { Component } from 'react';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { checkInputValidity, disableMouseClick, enableMouseClick, getInputValue, getSelectValue, hargaFormat, inputNumber, setInputValue, setSelectValue, today } from '../../components/Helper';
import Store from '../../components/redux/Store';

import Logo from '../../image/logo.png';

import $ from 'jquery';
import axios from 'axios';

class Invoice extends Component {

    state = {
        customer: [],
        daftarTransaksi: [],
        detailCost: [],
        sales: [],
        table: [],
        totalPrice: 0,
        totalQuantity: 0
    }

    cetakData = () => {
        if (checkInputValidity('form')) {
            sessionStorage.setItem('nomor', getSelectValue('select-job-nomor'));
            sessionStorage.setItem('date', getInputValue('input-invoice-date'));
            sessionStorage.setItem('alamat', getInputValue('input-alamat'));
            sessionStorage.setItem('email', getInputValue('input-email'));
            sessionStorage.setItem('fax', getInputValue('input-fax'));

            window.open('/transaksi/cetak-invoice', '_blank');
        }
    }

    componentDidMount = () => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/data-office.php').then(responseDataOffice => {
            document.getElementById('text-alamat').innerHTML = responseDataOffice.data.find(item => item.item === 'Alamat').data;
            document.getElementById('text-fax').innerHTML = responseDataOffice.data.find(item => item.item === 'Fax').data;
            document.getElementById('text-email').innerHTML = responseDataOffice.data.find(item => item.item === 'Email').data;
            document.getElementById('text-footer').innerHTML = responseDataOffice.data.find(item => item.item === 'Footer Invoice').data;

            axios.get('http://emkl-abb.virtusrox.me/api/select/detail-cost.php').then(responseDetailCost => {
                if (responseDetailCost.data.length > 0)
                    this.setState({ detailCost: responseDetailCost.data });

                axios.get('http://emkl-abb.virtusrox.me/api/select/customer.php').then(responseCustomer => {
                    if (responseCustomer.data.length > 0)
                        this.setState({ customer: responseCustomer.data });

                    axios.get('http://emkl-abb.virtusrox.me/api/select/sales.php').then(responseSales => {
                        if (responseSales.data.length > 0)
                            this.setState({ sales: responseSales.data });

                        axios.get('http://emkl-abb.virtusrox.me/api/select/detail-transaksi.php').then(responseDetailTransaksi => {
                            if (responseDetailTransaksi.data.length > 0)
                                this.setState({ daftarTransaksi: responseDetailTransaksi.data }, () => {
                                    setInputValue('input-invoice-date', today());
                                    setSelectValue('select-job-nomor', (sessionStorage.getItem('nomor')) ? sessionStorage.getItem('nomor').replace(new RegExp('-', 'g'), '/') : '');

                                    if (sessionStorage.getItem('nomor')) this.selectJobNomor();
                                });

                            $(document).ready(function () {
                                $('#table-data').DataTable();

                                $('input').on('input', function () {
                                    $(this).val($(this).val().replace(/['"]/gi, ''));
                                });
                            });

                            sessionStorage.clear();

                            enableMouseClick();
                        });
                    });
                });
            });
        });
    };

    selectJobNomor = () => {
        let dataTable = [];
        let jobNomor = getSelectValue('select-job-nomor').replace(new RegExp('/', 'g'), '-');

        if (jobNomor === '') {
            setInputValue('input-invoice-date', '');
            setInputValue('input-bill-to', '');
            setInputValue('input-alamat', '');
            setInputValue('input-email', '');
            setInputValue('input-consignee', '');
            setInputValue('input-jumlah-party', '');
            setInputValue('input-ukuran-party', '');
            setInputValue('input-container-1', '');
            setInputValue('input-invoice-for', '');

            $('#table-data').DataTable().destroy();

            this.setState({ table: dataTable }, () => {
                $('#table-data').DataTable();
            });
        } else {
            let filterTransaksi = this.state.daftarTransaksi.filter(item => item.nomor === jobNomor);

            $('#table-data').DataTable().destroy();

            if (filterTransaksi.length === 0) {
                this.setState({ table: dataTable }, () => {
                    $('#table-data').DataTable();
                });

                return;
            }

            let filterCustomer = this.state.customer.filter(item => item.nama === filterTransaksi[0].customer);

            setInputValue('input-invoice-date', filterTransaksi[0].tanggal);
            setInputValue('input-bill-to', filterTransaksi[0].customer);
            setInputValue('input-alamat', filterCustomer[0].alamat);
            setInputValue('input-email', filterCustomer[0].email);
            setInputValue('input-consignee', filterTransaksi[0].consignee);
            setInputValue('input-jumlah-party', filterTransaksi[0].jumlah_party);
            setInputValue('input-ukuran-party', filterTransaksi[0].ukuran_party);
            setInputValue('input-container-1', filterTransaksi[0].container_seal_1);
            setInputValue('input-invoice-for', `${filterTransaksi[0].container_seal_1} - ${filterTransaksi[0].jumlah_party}/${filterTransaksi[0].ukuran_party} - ${filterTransaksi[0].destination}`);

            let filterSales = this.state.sales.filter(item => item.nomor === jobNomor);

            if (filterSales.length === 0) {
                this.setState({ table: dataTable }, () => {
                    $('#table-data').DataTable();
                });

                return;
            }

            let totalPrice = 0;
            let totalQuantity = 0;

            filterSales.forEach(itemDaftar => {
                let price = itemDaftar.unit_price * itemDaftar.quantity - itemDaftar.discount;
                let item = ((itemDaftar.item.includes('biaya_lain_')) ? this.state.detailCost.find(item => item.nomor === jobNomor)[itemDaftar.item] : itemDaftar.item);

                if (item !== '') {
                    dataTable.push({
                        id: itemDaftar.id,
                        nomor: itemDaftar.nomor,
                        item: item,
                        original: itemDaftar.item,
                        unit_price: itemDaftar.unit_price,
                        quantity: itemDaftar.quantity,
                        total_price: price
                    });
                }

                totalPrice += price;
                totalQuantity += parseInt(itemDaftar.quantity);
            });

            this.setState({ table: dataTable }, () => {
                document.getElementById('total-quantity').innerHTML = totalQuantity.toString();
                document.getElementById('total-price').innerHTML = hargaFormat(totalPrice);

                $('#table-data').DataTable();
            });
        }
    }

    terapkanData = (id) => {
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded, multipart/form-data'
            }
        };

        let formData = new FormData();

        formData.append('id', id);
        formData.append('nomor', getSelectValue('select-job-nomor'));
        formData.append('quantity', $(`#edit-quantity-${id}`).val());

        axios.post('http://emkl-abb.virtusrox.me/api/update/invoice.php', formData, config).then(response => {
            $(`#data-quantity-${id}`).html($(`#edit-quantity-${id}`).val());
            $(`#data-price-${id}`).html(hargaFormat($(`#edit-quantity-${id}`).val() * $(`#edit-unit-price-${id}`).val()));

            $(`#data-quantity-${id}`).removeClass('d-none');

            $(`#edit-quantity-${id}`).addClass('d-none');

            $(`#btn-ubah-${id}`).removeClass('d-none');
            $(`#btn-terapkan-${id}`).addClass('d-none');


            axios.get('http://emkl-abb.virtusrox.me/api/select/sales.php').then(responseSales => {
                if (responseSales.data.length > 0) this.setState({ sales: responseSales.data }, () => {
                    this.selectJobNomor();
                });
            });
        });
    }

    ubahData = (id) => {
        $(`#data-quantity-${id}`).addClass('d-none');

        $(`#edit-quantity-${id}`).removeClass('d-none');

        $(`#btn-ubah-${id}`).addClass('d-none');
        $(`#btn-terapkan-${id}`).removeClass('d-none');
    }

    render() {
        return (
            <div className="active content overflow-auto">
                <p className="fw-bold text-secondary text-size-10">Invoice</p>
                <p className="text-secondary">Transaksi / <span className="fw-bold primary-text-color">Invoice</span></p>
                <div id="form" className="card-form">
                    <div className="p-4">
                        <div className="bg-white card-header">
                            <div className="align-items-center d-flex flex-row logo-img">
                                <img src={Logo} alt="..." width="100" />
                                <b className="fs-2 fw-bold px-4">PT ADIL BERKAH BERDIKARI</b>
                            </div>
                            <div className="align-items-center d-flex flex-wrap py-3 py-md-2 px-0">
                                <p className="col-12 col-md-6 m-0"><span id="text-alamat">Jl. Mugas Dalam I No 11, Semarang, Jawa Tengah</span></p>
                                <p className="col-12 col-md-6 m-0">Fax : <span id="text-fax"></span><br />Email : <span id="text-email"></span></p>
                            </div>
                        </div>
                        <p className="text-center"></p>
                        <p className="text-center"></p>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="select-job-nomor" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Job No.</label>
                            <div className="col col-lg-4 col-md-6">
                                <select name="select-job-nomor" id="select-job-nomor" className="form-select" onChange={this.selectJobNomor} required >
                                    {this.state.daftarTransaksi.length > 0 ? <option value="">-- Pilih Job Nomor --</option> : null}
                                    {this.state.daftarTransaksi.length > 0 ? this.state.daftarTransaksi.map(data =>
                                        <option key={data.id} value={data.nomor.replace(new RegExp('-', 'g'), '/')}>{data.nomor.replace(new RegExp('-', 'g'), '/')}</option>
                                    ) :
                                        <option value="">-- Tidak Ada Data --</option>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-invoice-date" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Invoice Date</label>
                            <div className="col col-lg-2 col-md-3">
                                <input type="date" id="input-invoice-date" name="input-invoice-date" className="form-control" placeholder="Nomor Faktur" readOnly required />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <div className="align-items-center col-12 col-md-6 d-flex flex-wrap pb-2 pb-md-0">
                                <label htmlFor="input-bill-to" className="col-12 col-lg-4 col-md-6 pb-2 pb-md-0">Bill To</label>
                                <div className="col">
                                    <input type="text" id="input-bill-to" name="input-bill-to" className="form-control" placeholder="Customer" readOnly required />
                                </div>
                            </div>
                            <div className="align-items-center col-12 col-md-6 d-flex flex-wrap">
                                <label htmlFor="input-fax" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0 ps-0 ps-md-4">Fax</label>
                                <div className="col col-lg-6 col-md-8">
                                    <input type="text" id="input-fax" name="input-fax" className="form-control" placeholder="Fax" />
                                </div>
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <div className="align-items-center col-12 col-md-6 d-flex flex-wrap pb-2 pb-md-0">
                                <label htmlFor="input-alamat" className="col-12 col-lg-4 col-md-6 pb-2 pb-md-0">Alamat</label>
                                <div className="col">
                                    <input type="text" id="input-alamat" name="input-alamat" className="form-control" placeholder="Alamat" required />
                                </div>
                            </div>
                            <div className="align-items-center col-12 col-md-6 d-flex flex-wrap">
                                <label htmlFor="input-email" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0 ps-0 ps-md-4">Email</label>
                                <div className="col col-lg-6 col-md-8">
                                    <input type="text" id="input-email" name="input-email" className="form-control" placeholder="Email" required />
                                </div>
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-consignee" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Consignee</label>
                            <div className="col">
                                <input type="text" id="input-consignee" name="input-consignee" className="form-control" placeholder="Consignee" maxLength={100} readOnly required />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-jumlah-party" className="col-1 col-lg-2 col-md-3 pb-2 pb-md-0">Party</label>
                            <div className="col-2 col-md-1">
                                <input type="text" id="input-jumlah-party" name="input-jumlah-party" className="form-control text-center" placeholder="0" onInput={inputNumber} readOnly required />
                            </div>
                            <div className="px-4">x</div>
                            <div className="col-2 col-md-1">
                                <input type="text" id="input-ukuran-party" name="input-ukuran-party" className="form-control text-center" placeholder="0" onInput={inputNumber} readOnly required />
                            </div>
                        </div>
                        <div className="align-items-center col-12 col-md-6 d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-container-1" className="col-12 col-lg-4 col-md-6 pb-2 pb-md-0">Container</label>
                            <div className="col">
                                <input type="text" id="input-container-1" name="input-container-1" className="form-control" placeholder="Container 1" readOnly required />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-invoice-for" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Invoice For</label>
                            <div className="col col-lg-4 col-md-6">
                                <input type="text" id="input-invoice-for" name="input-invoice-for" className="form-control" placeholder="Invoice For" maxLength={30} readOnly required />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table id="table-data" className="table table-bordered table-hover table-striped text-nowrap w-100">
                                <thead className="align-middle text-center text-nowrap">
                                    <tr>
                                        <th>Description</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Price</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="table-data-body" className="align-middle">
                                    {this.state.table.map((data, index) =>
                                        <tr key={++index}>
                                            <td>{data.item.replace(new RegExp('_', 'g'), ' ')}</td>
                                            <td className="text-center">
                                                <div id={`data-quantity-${data.id}`}>{data.quantity}</div>
                                                <input type="text" name={`edit-quantity-${data.id}`} id={`edit-quantity-${data.id}`} className="d-none form-control" defaultValue={data.quantity} />
                                            </td>
                                            <td className="text-end">
                                                <div id={`data-unit-price-${data.id}`}>{hargaFormat(data.unit_price)}</div>
                                                <input type="hidden" name={`edit-unit-price-${data.id}`} id={`edit-unit-price-${data.id}`} className="d-none form-control" defaultValue={data.unit_price} />
                                            </td>
                                            <td className="text-end">
                                                <div id={`data-price-${data.id}`}>{hargaFormat(data.total_price)}</div>
                                            </td>
                                            <td className="d-flex flex-row flex-wrap justify-content-center">
                                                <button id={`btn-ubah-${data.id}`} className="btn btn-warning px-4 text-white" onClick={() => this.ubahData(data.id)}><FaEdit />Ubah</button>
                                                <button id={`btn-terapkan-${data.id}`} className="btn d-none primary-color px-4 text-white" onClick={() => this.terapkanData(data.id)}><FaCheck /> Terapkan</button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tr className="text-center">
                                    <td className="fw-bold py-2">Total</td>
                                    <td id="total-quantity" className="fw-bold"></td>
                                    <td className="fw-bold"></td>
                                    <td id="total-price" className="fw-bold"></td>
                                    <td className="fw-bold"></td>
                                </tr>
                            </table>
                        </div>
                        <div className="align-items-center col-12 col-md-6 d-flex flex-wrap pb-2 pb-md-0 "><span id="text-footer"></span></div>
                        <div className="align-items-center d-flex flex-row flex-wrap pb-3 pb-md-2 px-0">
                            <div className="col"></div>
                            <div className="col-auto pe-5">
                                <p className="m-0 pb-5">For and On Behalf of</p>
                                <p className="m-0 pt-5">LILYK N</p>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex">
                        <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Cetak" onClick={this.cetakData} />
                        <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Batalkan" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Invoice;
