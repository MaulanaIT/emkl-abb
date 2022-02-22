import { Component } from 'react';

import $ from 'jquery';
import axios from 'axios';
import { disableMouseClick, enableMouseClick, hargaFormat, setInputValue } from '../../components/Helper';

class Operasional extends Component {

    state = {
        cost: [],
        detailCost: [],
        totalBiayaLain: 3
    }

    calculate = () => {
        let costBiayaLain = document.querySelectorAll('.cost-biaya-lain');
        let cost = document.querySelectorAll('.cost');

        let totalCost = 0;

        cost.forEach(item => {
            if (parseInt(item.value.replace(/[^0-9]/g, '').slice(0, -2)) > 0) {
                totalCost += parseInt(item.value.replace(/[^0-9]/g, '').slice(0, -2));
            }
        });

        costBiayaLain.forEach(item => {
            if (parseInt(item.value.replace(/[^0-9]/g, '').slice(0, -2)) > 0) {
                totalCost += parseInt(item.value.replace(/[^0-9]/g, '').slice(0, -2));
            }
        });

        setInputValue('total-cost', hargaFormat(totalCost));
        
        this.cetak();
    }

    componentDidMount = () => {
        axios.get('http://emkl-abb.virtusrox.me/api/select/cost.php').then(responseCost => {
            if (responseCost.data.length > 0) {
                this.setState({ cost: responseCost.data }, () => {
                    axios.get('http://emkl-abb.virtusrox.me/api/select/detail-cost.php').then(responseDetailCost => {
                        if (responseDetailCost.data.length > 0) {
                            this.setState({ detailCost: responseDetailCost.data }, () => {
                                $(document).ready(function () {
                                    $('#table-data').DataTable();
                                });

                                if (sessionStorage.getItem('id')) this.ubahData(sessionStorage.getItem('id'));
                                sessionStorage.clear();
                            });
                        }
                    });
                });
            }
        });
    }

    cetak = () => {
        window.print();
    }

    ubahData = (id) => {
        let cost = this.state.cost.find(item => item.id === id);
        let detailCost = this.state.detailCost.find(item => item.nomor === cost.nomor);

        setInputValue('input-job-nomor', cost.nomor);
        setInputValue('input-customer', cost.shipper);
        setInputValue('input-consignee', (cost.consignee) ? cost.consignee : '-');
        setInputValue('input-no-booking', (cost.nomor_booking) ? cost.nomor_booking : '-');
        setInputValue('input-depo', cost.depo);
        setInputValue('input-stuffing-date', cost.tanggal_stuffing);
        setInputValue('input-alamat-stuffing', cost.alamat_stuffing);
        setInputValue('input-jumlah-party', cost.jumlah_party);
        setInputValue('input-ukuran-container', cost.ukuran_container);

        $('#container').empty();

        if (cost.jumlah_party > 0) {
            for (let i = 1; i <= cost.jumlah_party; i++) {
                $('#container').append('<input readOnly type="text" id="input-container-' + i + '" name="input-container" class="border-0 form-control mb-2" placeholder="Container / Seal" />');
            }
        } else {
            $('#container').append('<input readOnly type="text" id="input-container-0" name="input-container" class="border-0 form-control mb-2" style="padding-left: 25px" placeholder="-" disabled />');
        }

        if (document.getElementById('input-container-1')) setInputValue('input-container-1', cost.container_seal_1);
        if (document.getElementById('input-container-2')) setInputValue('input-container-2', cost.container_seal_2);
        if (document.getElementById('input-container-3')) setInputValue('input-container-3', cost.container_seal_3);
        if (document.getElementById('input-container-4')) setInputValue('input-container-4', cost.container_seal_4);
        if (document.getElementById('input-container-5')) setInputValue('input-container-5', cost.container_seal_5);
        if (document.getElementById('input-container-6')) setInputValue('input-container-6', cost.container_seal_6);
        if (document.getElementById('input-container-7')) setInputValue('input-container-7', cost.container_seal_7);
        if (document.getElementById('input-container-8')) setInputValue('input-container-8', cost.container_seal_8);
        if (document.getElementById('input-container-9')) setInputValue('input-container-9', cost.container_seal_9);
        if (document.getElementById('input-container-10')) setInputValue('input-container-10', cost.container_seal_10);

        setInputValue('input-cost-lolo', hargaFormat(detailCost.lolo));
        setInputValue('input-cost-storage', hargaFormat(detailCost.storage));
        setInputValue('input-cost-op-depo', hargaFormat(detailCost.op_depo));
        setInputValue('input-cost-solar', hargaFormat(detailCost.tambahan_solar));
        setInputValue('input-cost-lembur', hargaFormat(detailCost.lembur));
        setInputValue('input-cost-gudang', hargaFormat(detailCost.gudang));
        setInputValue('input-cost-jalur-merah', hargaFormat(detailCost.jalur_merah));
        setInputValue('input-cost-vgm', hargaFormat(detailCost.vgm));
        setInputValue('input-cost-sopir', hargaFormat(detailCost.tambahan_sopir));
        setInputValue('cost-input-nama-biaya-lain-1', detailCost.biaya_lain_1);
        setInputValue('cost-input-cost-biaya-lain-1', hargaFormat(detailCost.cost_biaya_lain_1));
        setInputValue('cost-input-nama-biaya-lain-2', detailCost.biaya_lain_2);
        setInputValue('cost-input-cost-biaya-lain-2', hargaFormat(detailCost.cost_biaya_lain_2));
        setInputValue('cost-input-nama-biaya-lain-3', detailCost.biaya_lain_3);
        setInputValue('cost-input-cost-biaya-lain-3', hargaFormat(detailCost.cost_biaya_lain_3));
        setInputValue('cost-input-nama-biaya-lain-4', detailCost.biaya_lain_4);
        setInputValue('cost-input-cost-biaya-lain-4', hargaFormat(detailCost.cost_biaya_lain_4));
        setInputValue('cost-input-nama-biaya-lain-5', detailCost.biaya_lain_5);
        setInputValue('cost-input-cost-biaya-lain-5', hargaFormat(detailCost.cost_biaya_lain_5));
        setInputValue('cost-input-nama-biaya-lain-6', detailCost.biaya_lain_6);
        setInputValue('cost-input-cost-biaya-lain-6', hargaFormat(detailCost.cost_biaya_lain_6));
        setInputValue('cost-input-nama-biaya-lain-7', detailCost.biaya_lain_7);
        setInputValue('cost-input-cost-biaya-lain-7', hargaFormat(detailCost.cost_biaya_lain_7));
        setInputValue('cost-input-nama-biaya-lain-8', detailCost.biaya_lain_8);
        setInputValue('cost-input-cost-biaya-lain-8', hargaFormat(detailCost.cost_biaya_lain_8));
        setInputValue('cost-input-nama-biaya-lain-9', detailCost.biaya_lain_9);
        setInputValue('cost-input-cost-biaya-lain-9', hargaFormat(detailCost.cost_biaya_lain_9));
        setInputValue('cost-input-nama-biaya-lain-10', detailCost.biaya_lain_10);
        setInputValue('cost-input-cost-biaya-lain-10', hargaFormat(detailCost.cost_biaya_lain_10));

        for (let i = 3; i <= 10; i++) {
            if (i > detailCost.jumlah_biaya_lain) {
                document.getElementById(`cost-biaya-lain-${i}`).classList.add('d-none');
                document.getElementById(`cost-biaya-lain-${i}`).classList.remove('d-flex');
            } else {
                document.getElementById(`cost-biaya-lain-${i}`).classList.remove('d-none');
                document.getElementById(`cost-biaya-lain-${i}`).classList.add('d-flex');
            }

            if (i === detailCost.jumlah_biaya_lain) {
                document.getElementById(`cost-btn-hapus-biaya-lain-${i}`).classList.remove('d-none')
            }
        }

        if (detailCost.jumlah_biaya_lain === 10) {
            document.getElementById('cost-btn-tambah-biaya-lain').classList.add('d-none');
        }

        this.setState({ totalBiayaLain: parseInt(detailCost.jumlah_biaya_lain) }, () => {
            this.calculate();
        });
    }

    render() {
        return (
            <div id="form" className="bg-white overflow-auto p-4">
                <p className="fw-bold fs-3 text-center">Shipping Instruction Operational Berdikari</p>
                <div className="d-flex flex-row flex-wrap">
                    <div className="col">
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-job-nomor" className="col-4 col-form-label pb-md-0">Job No</label>
                            <div className="col-6">
                                <input readOnly type="text" id="input-job-nomor" name="input-job-nomor" className="border-0 form-control" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-customer" className="col-4 col-form-label pb-md-0">Shipper/Customer</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-customer" name="input-customer" className="border-0 form-control" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-consignee" className="col-4 col-form-label pb-md-0">Consignee</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-consignee" name="input-consignee" className="border-0 form-control" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-no-booking" className="col-4 col-form-label pb-md-0">No Booking</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-no-booking" name="input-no-booking" className="border-0 form-control" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-depo" className="col-4 col-form-label pb-md-0">DEPO</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-depo" name="input-depo" className="border-0 form-control" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-stuffing-date" className="col-4 col-form-label pb-md-0">Tanggal Stuffing</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-stuffing-date" name="input-stuffing-date" className="border-0 form-control" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-alamat-stuffing" className="col-4 col-form-label pb-md-0">Alamat Stuffing</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-alamat-stuffing" name="input-alamat-stuffing" className="border-0 form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-party" className="col-4 col-form-label pb-md-0">Party</label>
                            <div className="col-2">
                                <input readOnly type="text" id="input-jumlah-party" name="input-jumlah-party" className="border-0 form-control text-center" />
                            </div>
                            <div className="col-1 col-form-label text-center px-2">x</div>
                            <div className="col-4">
                                <input readOnly type="text" name="input-ukuran-container" id="input-ukuran-container" className="border-0 form-control" />
                            </div>
                        </div>
                        <div className="d-flex flex-wrap px-0">
                            <label htmlFor="container" className="col-4 col-form-label pb-md-0">Container / Seal</label>
                            <div id="container" className="align-items-center col-8">
                                <input readOnly type="text" id="input-container-0" name="input-container" className="border-0 form-control mb-2" />
                            </div>
                        </div>
                    </div>
                </div>
                <label htmlFor="surcharge" className="col-12 pb-md-0 fw-bold pt-4">Surcharge</label>
                <div className="d-flex flex-row flex-wrap">
                    <div className="col-6 pe-5">
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-cost-lolo" className="col-4 col-form-label pb-md-0">LOLO</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-cost-lolo" name="input-cost-lolo" className="cost border-0 form-control text-end" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-cost-storage" className="col-4 col-form-label pb-md-0">Storage</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-cost-storage" name="input-cost-storage" className="cost border-0 form-control text-end" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-cost-op-depo" className="col-4 col-form-label pb-md-0">OP Depo</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-cost-op-depo" name="input-cost-op-depo" className="cost border-0 form-control text-end" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-cost-solar" className="col-4 col-form-label pb-md-0">Tambahan Solar</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-cost-solar" name="input-cost-solar" className="cost border-0 form-control text-end" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-cost-lembur" className="col-4 col-form-label pb-md-0">Lembur</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-cost-lembur" name="input-cost-lembur" className="cost border-0 form-control text-end" />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 ps-5">
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-cost-gudang" className="col-4 col-form-label pb-md-0 ps-0">Gudang</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-cost-gudang" name="input-cost-gudang" className="cost border-0 form-control text-end" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-cost-jalur-merah" className="col-4 col-form-label pb-md-0 ps-0">Jalur Merah/PBB</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-cost-jalur-merah" name="input-cost-jalur-merah" className="cost border-0 form-control text-end" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-cost-vgm" className="col-4 col-form-label pb-md-0 ps-0">VGM</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-cost-vgm" name="input-cost-vgm" className="cost border-0 form-control text-end" />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap px-0">
                            <label htmlFor="input-cost-sopir" className="col-4 col-form-label pb-md-0 ps-0">Tambahan Sopir</label>
                            <div className="col-8">
                                <input readOnly type="text" id="input-cost-sopir" name="input-cost-sopir" className="cost border-0 form-control text-end" />
                            </div>
                        </div>
                    </div>
                </div>
                <label htmlFor="biaya-lain" className="col-12 pb-md-0 fw-bold pt-4">Biaya Lain</label>
                <div id="cost-form-biaya-lain" className="col-6 pe-5">
                    <div id="cost-input-biaya-lain">
                        <div id="cost-biaya-lain-1" className="align-items-center d-flex flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-1" name="cost-input-nama-biaya-lain-1" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-1" name="cost-input-cost-biaya-lain-1" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                        <div id="cost-biaya-lain-2" className="align-items-center d-flex flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-2" name="cost-input-nama-biaya-lain-2" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-2" name="cost-input-cost-biaya-lain-2" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                        <div id="cost-biaya-lain-3" className="align-items-center d-flex flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-3" name="cost-input-nama-biaya-lain-3" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-3" name="cost-input-cost-biaya-lain-3" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                        <div id="cost-biaya-lain-4" className="align-items-center d-none flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-4" name="cost-input-nama-biaya-lain-4" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-4" name="cost-input-cost-biaya-lain-4" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                        <div id="cost-biaya-lain-5" className="align-items-center d-none flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-5" name="cost-input-nama-biaya-lain-5" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-5" name="cost-input-cost-biaya-lain-5" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                        <div id="cost-biaya-lain-6" className="align-items-center d-none flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-6" name="cost-input-nama-biaya-lain-6" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-6" name="cost-input-cost-biaya-lain-6" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                        <div id="cost-biaya-lain-7" className="align-items-center d-none flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-7" name="cost-input-nama-biaya-lain-7" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-7" name="cost-input-cost-biaya-lain-7" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                        <div id="cost-biaya-lain-8" className="align-items-center d-none flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-8" name="cost-input-nama-biaya-lain-8" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-8" name="cost-input-cost-biaya-lain-8" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                        <div id="cost-biaya-lain-9" className="align-items-center d-none flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-9" name="cost-input-nama-biaya-lain-9" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-9" name="cost-input-cost-biaya-lain-9" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                        <div id="cost-biaya-lain-10" className="align-items-center d-none flex-wrap px-0">
                            <div className="align-items-center col d-flex flex-wrap px-0">
                                <div className="col-4 pe-2">
                                    <input readOnly type="text" id="cost-input-nama-biaya-lain-10" name="cost-input-nama-biaya-lain-10" className="border-0 form-control ps-0" placeholder="-" />
                                </div>
                                <div className="col-8">
                                    <input readOnly type="text" id="cost-input-cost-biaya-lain-10" name="cost-input-cost-biaya-lain-10" className="cost-biaya-lain border-0 form-control text-end" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="align-items-center col-6 d-flex flex-wrap pe-5 px-0">
                    <p className="col-4 col-form-label fw-bold primary-text-color">Total Cost</p>
                    <div className="col-8">
                        <input readOnly type="text" id="total-cost" name="total-cost" className="border-0 form-control text-end" />
                    </div>
                </div>
                <div className="d-flex flex-row flex-wrap justify-content-evenly pt-3">
                    <div className="px-0 text-center">
                        <p className="col-form-label fw-bold pb-5">Mengetahui</p>
                        <p className="col-form-label fw-bold">Semarang</p>
                    </div>
                    <div className="px-0 text-center">
                        <p className="col-form-label fw-bold pb-5">Finance Manager</p>
                        <p className="col-form-label fw-bold">OPS Manager</p>
                    </div>
                </div>
            </div>
        )
    }
}
export default Operasional;