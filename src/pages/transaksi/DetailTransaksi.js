import { useEffect, useState } from 'react'
import { disableMouseClick, enableMouseClick, getInputValue, getSelectValue, hargaFormat, inputNumber, setInputValue, setLoaderPercentage, setSelectValue, showLoader, today } from '../../components/Helper';

import $ from 'jquery';
import axios from 'axios';
import Loader from '../../components/Loader';
import { FaEdit, FaMinus, FaPlus, FaPrint } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DetailTransaksi = () => {

    const [customer, setCustomer] = useState([]);
    const [costData, setCostData] = useState([]);
    const [detailCostData, setDetailCostData] = useState([]);
    const [detailSalesData, setDetailSalesData] = useState([]);
    const [detailTransaksiData, setDetailTransaksiData] = useState([]);
    const [totalCostBiayaLain, setCostTotalBiayaLain] = useState(3);
    const [totalSalesBiayaLain, setSalesTotalBiayaLain] = useState(3);
    const [ukuranContainer, setUkuranContainer] = useState([]);
    const [utang, setUtang] = useState([]);
    const [vendor, setVendor] = useState([]);

    const calculate = () => {
        let costBiayaLain = document.querySelectorAll('.cost-biaya-lain');
        let salesBiayaLain = document.querySelectorAll('.sales-biaya-lain');
        let cost = document.querySelectorAll('.cost');
        let sales = document.querySelectorAll('.sales');

        let totalCost = 0;
        let totalProfit = 0;
        let totalSales = 0;

        cost.forEach(item => {
            if (parseInt(item.value) > 0) {
                totalCost += parseInt(item.value);
            }
        });

        costBiayaLain.forEach(item => {
            if (parseInt(item.value) > 0) {
                totalCost += parseInt(item.value);
            }
        });

        salesBiayaLain.forEach(item => {
            if (parseInt(item.value) > 0) {
                totalSales += parseInt(item.value);
            }
        });

        sales.forEach(item => {
            if (parseInt(item.value) > 0) {
                totalSales += parseInt(item.value);
            }
        });

        totalProfit = totalSales - totalCost;

        setInputValue('total-cost', hargaFormat(totalCost));
        setInputValue('total-profit', hargaFormat(totalProfit));
    }

    const calculateTotal = (event) => {
        inputNumber(event);

        calculate();
    }

    const cetakData = (nomor) => {
        sessionStorage.setItem('nomor', nomor);
    }

    const codeCustomer = () => {
        let lengthData = customer.length;
        let index = 0;

        let formatKode = "0001";

        if (lengthData > 0) {
            let kode = customer[lengthData - 1].kode;

            for (let i = 1; i < kode.length; i++) {
                const data = customer[lengthData - 1].kode[i];
                if (data != 0) {
                    index = i;
                    break;
                }
            }

            let lastKode = "";

            for (let i = index; i < kode.length; i++) {
                lastKode = lastKode + kode[i];
            }

            return "C" + formatKode.substring(0, formatKode.length - lastKode.length) + (parseInt(lastKode) + 1);
        } else {
            return "C" + formatKode;
        }
    }

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/utang.php').then(responseUtang => {
            if (responseUtang.data.length > 0) setUtang(responseUtang.data);

            axios.get('http://emkl-abb.virtusrox.me/api/select/vendor.php').then(responseVendor => {
                if (responseVendor.data.length > 0) setVendor(responseVendor.data);

                axios.get('http://emkl-abb.virtusrox.me/api/select/ukuran-container.php').then(responseUkuranContainer => {
                    if (responseUkuranContainer.data.length > 0) setUkuranContainer(responseUkuranContainer.data);

                    axios.get('http://emkl-abb.virtusrox.me/api/select/detail-transaksi.php').then(responseDetailTransaksi => {
                        if (responseDetailTransaksi.data.length > 0) setDetailTransaksiData(responseDetailTransaksi.data);

                        axios.get('http://emkl-abb.virtusrox.me/api/select/cost.php').then(responseCost => {
                            if (responseCost.data.length > 0) {
                                let stateDetailTransaksiData = ((responseDetailTransaksi.data.length > 0) ? responseDetailTransaksi.data.map(item => item['nomor']) : false);
                                let costData = ((stateDetailTransaksiData) ? responseCost.data.filter(item => stateDetailTransaksiData.indexOf(item['nomor']) === -1) : responseCost.data);

                                setCostData(costData);
                            }

                            axios.get('http://emkl-abb.virtusrox.me/api/select/detail-cost.php').then(responseDetailCost => {
                                if (responseDetailCost.data.length > 0)
                                    setDetailCostData(responseDetailCost.data);

                                axios.get('http://emkl-abb.virtusrox.me/api/select/sales.php').then(responseDetailSales => {
                                    if (responseDetailSales.data.length > 0)
                                        setDetailSalesData(responseDetailSales.data);

                                    axios.get('http://emkl-abb.virtusrox.me/api/select/customer.php').then(responseCustomer => {
                                        if (responseCustomer.data.length > 0)
                                            setCustomer(responseCustomer.data);

                                        setInputValue('input-stuffing-date', today());
                                        setInputValue('input-date', today());

                                        $(document).ready(function () {
                                            $('#table-data').DataTable();

                                            $('input').on('input', function () {
                                                $(this).val($(this).val().replace(/['"]/gi, ''));
                                            });
                                        });

                                        if (sessionStorage.getItem('nomor')) ubahData(sessionStorage.getItem('nomor'));
                                        sessionStorage.clear();

                                        enableMouseClick();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }, []);

    const generateCostBiayaLain = () => {
        if (totalCostBiayaLain < 10) {
            let stateCostTotalBiayaLain = totalCostBiayaLain + 1;

            setCostTotalBiayaLain(stateCostTotalBiayaLain);
            document.getElementById(`cost-biaya-lain-${stateCostTotalBiayaLain}`).classList.remove('d-none');
            document.getElementById(`cost-biaya-lain-${stateCostTotalBiayaLain}`).classList.add('d-flex');

            if (stateCostTotalBiayaLain > 4) {
                document.getElementById(`cost-btn-hapus-biaya-lain-${stateCostTotalBiayaLain - 1}`).classList.add('d-none')
            }

            if (stateCostTotalBiayaLain === 10) {
                document.getElementById('cost-btn-tambah-biaya-lain').classList.add('d-none');
            }
        }
    }

    const generateContainer = (event) => {
        inputNumber(event);

        if (event.target.value > 10) {
            setInputValue(event.target.id, "10");
        }

        $('#container').empty();

        if (event.target.value > 0) {
            for (let i = 1; i <= event.target.value; i++) {
                $('#container').append('<input type="text" id="input-container-' + i + '" name="input-container" class="form-control mb-2" placeholder="Container / Seal" />');
            }
        } else {
            $('#container').append('<input type="text" id="input-container-0" name="input-container" class="form-control mb-2" placeholder="Container / Seal" disabled />');
        }
    }

    const hapusCostBiayaLain = () => {
        if (totalCostBiayaLain > 3) {

            if (totalCostBiayaLain === 10) document.getElementById('cost-btn-tambah-biaya-lain').classList.remove('d-none');

            document.getElementById(`cost-biaya-lain-${totalCostBiayaLain}`).classList.add('d-none');
            document.getElementById(`cost-biaya-lain-${totalCostBiayaLain}`).classList.remove('d-flex');

            setInputValue(`cost-input-nama-biaya-lain-${totalCostBiayaLain}`, '');
            setInputValue(`cost-input-cost-biaya-lain-${totalCostBiayaLain}`, '');
            setInputValue(`cost-input-file-biaya-lain-${totalCostBiayaLain}`, '');

            setCostTotalBiayaLain(totalCostBiayaLain - 1);

            if (totalCostBiayaLain > 4) document.getElementById(`cost-btn-hapus-biaya-lain-${totalCostBiayaLain - 1}`).classList.remove('d-none');

            calculate();
        }
    }

    const selectJobNomor = (event) => {
        let cost = costData.find(item => item.nomor === event.target.value.replace(new RegExp('/', 'g'), '-'));
        let detailCost = detailCostData.find(item => item.nomor === event.target.value.replace(new RegExp('/', 'g'), '-'));

        setInputValue('input-customer', cost.shipper);
        setInputValue('input-shipper', cost.shipper);
        setInputValue('input-consignee', cost.consignee);
        setInputValue('input-jumlah-party', cost.jumlah_party);
        setSelectValue('select-ukuran-party', cost.ukuran_container);

        $('#container').empty();

        if (cost.jumlah_party > 0) {
            for (let i = 1; i <= cost.jumlah_party; i++) {
                $('#container').append('<input type="text" id="input-container-' + i + '" name="input-container" class="form-control mb-2" placeholder="Container / Seal" />');
            }
        } else {
            $('#container').append('<input type="text" id="input-container-0" name="input-container" class="form-control mb-2" placeholder="Container / Seal" disabled />');
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

        setInputValue('input-cost-lolo', detailCost.lolo);
        setInputValue('input-cost-storage', detailCost.storage);
        setInputValue('input-cost-lembur', detailCost.lembur);
        setInputValue('input-cost-gudang', detailCost.gudang);
        setInputValue('input-cost-vgm', detailCost.vgm);

        setInputValue('cost-input-nama-biaya-lain-1', detailCost.biaya_lain_1);
        setInputValue('cost-input-cost-biaya-lain-1', detailCost.cost_biaya_lain_1);
        setInputValue('cost-input-nama-biaya-lain-2', detailCost.biaya_lain_2);
        setInputValue('cost-input-cost-biaya-lain-2', detailCost.cost_biaya_lain_2);
        setInputValue('cost-input-nama-biaya-lain-3', detailCost.biaya_lain_3);
        setInputValue('cost-input-cost-biaya-lain-3', detailCost.cost_biaya_lain_3);
        setInputValue('cost-input-nama-biaya-lain-4', detailCost.biaya_lain_4);
        setInputValue('cost-input-cost-biaya-lain-4', detailCost.cost_biaya_lain_4);
        setInputValue('cost-input-nama-biaya-lain-5', detailCost.biaya_lain_5);
        setInputValue('cost-input-cost-biaya-lain-5', detailCost.cost_biaya_lain_5);
        setInputValue('cost-input-nama-biaya-lain-6', detailCost.biaya_lain_6);
        setInputValue('cost-input-cost-biaya-lain-6', detailCost.cost_biaya_lain_6);
        setInputValue('cost-input-nama-biaya-lain-7', detailCost.biaya_lain_7);
        setInputValue('cost-input-cost-biaya-lain-7', detailCost.cost_biaya_lain_7);
        setInputValue('cost-input-nama-biaya-lain-8', detailCost.biaya_lain_8);
        setInputValue('cost-input-cost-biaya-lain-8', detailCost.cost_biaya_lain_8);
        setInputValue('cost-input-nama-biaya-lain-9', detailCost.biaya_lain_9);
        setInputValue('cost-input-cost-biaya-lain-9', detailCost.cost_biaya_lain_9);
        setInputValue('cost-input-nama-biaya-lain-10', detailCost.biaya_lain_10);
        setInputValue('cost-input-cost-biaya-lain-10', detailCost.cost_biaya_lain_10);

        calculate();
    }

    const resetForm = () => {
        document.getElementById('form').reset();

        document.getElementById('select-job-nomor').classList.remove('d-none');
        document.getElementById('input-job-nomor').classList.add('d-none');
    }

    const simpanData = () => {
        // if (checkInputValidity('form')) {
        showLoader();

        let formData = new FormData();

        let kodeCustomer = customer.find(item => item.nama === getInputValue('input-customer'));
        let checkNomor = detailTransaksiData.find(item => item.nomor === getInputValue('input-job-nomor').replace(new RegExp('/', 'g'), '-'));

        formData.append('nomor', ((checkNomor) ? getInputValue('input-job-nomor') : getSelectValue('select-job-nomor')));
        formData.append('invoice', getInputValue('input-invoice-number'));
        formData.append('customer', getInputValue('input-customer'));
        formData.append('booking_number', getInputValue('input-booking-number'));
        formData.append('shipper', getInputValue('input-shipper'));
        formData.append('license_export', getInputValue('input-license-export'));
        formData.append('consignee', getInputValue('input-consignee'));
        formData.append('destination', getInputValue('input-destination'));
        formData.append('feeder', getInputValue('input-feeder'));
        formData.append('etd_srg', getInputValue('input-etd-srg'));
        formData.append('closing_time', getInputValue('input-closing-time'));
        formData.append('forwarding_shipline', getInputValue('input-forwarding-shipline'));
        formData.append('jumlah_party', getInputValue('input-jumlah-party'));
        formData.append('ukuran_party', getSelectValue('select-ukuran-party'));
        if (document.getElementById('input-container-1')) formData.append('container_seal_1', getInputValue('input-container-1'));
        if (document.getElementById('input-container-2')) formData.append('container_seal_2', getInputValue('input-container-2'));
        if (document.getElementById('input-container-3')) formData.append('container_seal_3', getInputValue('input-container-3'));
        if (document.getElementById('input-container-4')) formData.append('container_seal_4', getInputValue('input-container-4'));
        if (document.getElementById('input-container-5')) formData.append('container_seal_5', getInputValue('input-container-5'));
        if (document.getElementById('input-container-6')) formData.append('container_seal_6', getInputValue('input-container-6'));
        if (document.getElementById('input-container-7')) formData.append('container_seal_7', getInputValue('input-container-7'));
        if (document.getElementById('input-container-8')) formData.append('container_seal_8', getInputValue('input-container-8'));
        if (document.getElementById('input-container-9')) formData.append('container_seal_9', getInputValue('input-container-9'));
        if (document.getElementById('input-container-10')) formData.append('container_seal_10', getInputValue('input-container-10'));
        formData.append('stuffing_date', getInputValue('input-stuffing-date'));
        formData.append('stuffing_place', getInputValue('input-stuffing-place'));
        formData.append('note', getInputValue('input-note'));
        formData.append('total_cost', getInputValue('total-cost').replace(/[^0-9]/g, '').slice(0, -2));
        formData.append('profit', getInputValue('total-profit').replace(/[^0-9]/g, '').slice(0, -2));
        formData.append('peb_no', getInputValue('input-peb-no'));
        formData.append('date', getInputValue('input-date'));

        // let formData = new FormData

        formData.append('trucking', getInputValue('input-cost-trucking'));
        formData.append('lolo', getInputValue('input-cost-lolo'));
        formData.append('storage', getInputValue('input-cost-storage'));
        formData.append('operational_cost', getInputValue('input-cost-operational-cost'));
        formData.append('lembur', getInputValue('input-cost-lembur'));
        formData.append('sending_peb_vgm', getInputValue('input-cost-sending-peb-vgm'));
        formData.append('vgm', getInputValue('input-cost-vgm'));
        formData.append('karantina_cost', getInputValue('input-cost-karantina-cost'));
        formData.append('gudang', getInputValue('input-cost-gudang'));
        formData.append('pnbp_phyto', getInputValue('input-cost-pnbp-phyto'));
        formData.append('coo', getInputValue('input-cost-coo'));
        formData.append('ispm', getInputValue('input-cost-ispm'));
        formData.append('fumigasi', getInputValue('input-cost-fumigasi'));
        formData.append('rc', getInputValue('input-cost-rc'));
        formData.append('v_legal', getInputValue('input-cost-v-legal'));
        formData.append('jumlah_biaya_lain', totalCostBiayaLain.toString());
        formData.append('biaya_lain_1', getInputValue('cost-input-nama-biaya-lain-1'));
        formData.append('cost_biaya_lain_1', getInputValue('cost-input-cost-biaya-lain-1'));
        formData.append('biaya_lain_2', getInputValue('cost-input-nama-biaya-lain-2'));
        formData.append('cost_biaya_lain_2', getInputValue('cost-input-cost-biaya-lain-2'));
        formData.append('biaya_lain_3', getInputValue('cost-input-nama-biaya-lain-3'));
        formData.append('cost_biaya_lain_3', getInputValue('cost-input-cost-biaya-lain-3'));
        formData.append('biaya_lain_4', getInputValue('cost-input-nama-biaya-lain-4'));
        formData.append('cost_biaya_lain_4', getInputValue('cost-input-cost-biaya-lain-4'));
        formData.append('biaya_lain_5', getInputValue('cost-input-nama-biaya-lain-5'));
        formData.append('cost_biaya_lain_5', getInputValue('cost-input-cost-biaya-lain-5'));
        formData.append('biaya_lain_6', getInputValue('cost-input-nama-biaya-lain-6'));
        formData.append('cost_biaya_lain_6', getInputValue('cost-input-cost-biaya-lain-6'));
        formData.append('biaya_lain_7', getInputValue('cost-input-nama-biaya-lain-7'));
        formData.append('cost_biaya_lain_7', getInputValue('cost-input-cost-biaya-lain-7'));
        formData.append('biaya_lain_8', getInputValue('cost-input-nama-biaya-lain-8'));
        formData.append('cost_biaya_lain_8', getInputValue('cost-input-cost-biaya-lain-8'));
        formData.append('biaya_lain_9', getInputValue('cost-input-nama-biaya-lain-9'));
        formData.append('cost_biaya_lain_9', getInputValue('cost-input-cost-biaya-lain-9'));
        formData.append('biaya_lain_10', getInputValue('cost-input-nama-biaya-lain-10'));
        formData.append('cost_biaya_lain_10', getInputValue('cost-input-cost-biaya-lain-10'));

        let formVendor = new FormData

        let cost = {
            trucking: getInputValue('input-cost-trucking'),
            operational_cost: getInputValue('input-cost-operational-cost'),
            sending_peb_vgm: getInputValue('input-cost-sending-peb-vgm'),
            karantina_cost: getInputValue('input-cost-karantina-cost'),
            pnbp_phyto: getInputValue('input-cost-pnbp-phyto'),
            coo: getInputValue('input-cost-coo'),
            ispm: getInputValue('input-cost-ispm'),
            fumigasi: getInputValue('input-cost-fumigasi'),
            rc: getInputValue('input-cost-rc'),
            v_legal: getInputValue('input-cost-v-legal'),
            ekspor_license: getInputValue('input-cost-ekspor-license'),
            biaya_lain_1: getInputValue('cost-input-cost-biaya-lain-1'),
            biaya_lain_2: getInputValue('cost-input-cost-biaya-lain-2'),
            biaya_lain_3: getInputValue('cost-input-cost-biaya-lain-3'),
            biaya_lain_4: getInputValue('cost-input-cost-biaya-lain-4'),
            biaya_lain_5: getInputValue('cost-input-cost-biaya-lain-5'),
            biaya_lain_6: getInputValue('cost-input-cost-biaya-lain-6'),
            biaya_lain_7: getInputValue('cost-input-cost-biaya-lain-7'),
            biaya_lain_8: getInputValue('cost-input-cost-biaya-lain-8'),
            biaya_lain_9: getInputValue('cost-input-cost-biaya-lain-9'),
            biaya_lain_10: getInputValue('cost-input-cost-biaya-lain-10'),
        };

        let kodeVendor = {
            trucking: getSelectValue('select-vendor-trucking'),
            operational_cost: getSelectValue('select-vendor-operational-cost'),
            sending_peb_vgm: getSelectValue('select-vendor-sending-peb-vgm'),
            karantina_cost: getSelectValue('select-vendor-karantina-cost'),
            pnbp_phyto: getSelectValue('select-vendor-pnbp-phyto'),
            coo: getSelectValue('select-vendor-coo'),
            ispm: getSelectValue('select-vendor-ispm'),
            fumigasi: getSelectValue('select-vendor-fumigasi'),
            rc: getSelectValue('select-vendor-rc'),
            v_legal: getSelectValue('select-vendor-v-legal'),
            ekspor_license: getSelectValue('select-vendor-ekspor-license'),
            biaya_lain_1: getSelectValue('cost-select-vendor-biaya-lain-1'),
            biaya_lain_2: getSelectValue('cost-select-vendor-biaya-lain-2'),
            biaya_lain_3: getSelectValue('cost-select-vendor-biaya-lain-3'),
            biaya_lain_4: getSelectValue('cost-select-vendor-biaya-lain-4'),
            biaya_lain_5: getSelectValue('cost-select-vendor-biaya-lain-5'),
            biaya_lain_6: getSelectValue('cost-select-vendor-biaya-lain-6'),
            biaya_lain_7: getSelectValue('cost-select-vendor-biaya-lain-7'),
            biaya_lain_8: getSelectValue('cost-select-vendor-biaya-lain-8'),
            biaya_lain_9: getSelectValue('cost-select-vendor-biaya-lain-9'),
            biaya_lain_10: getSelectValue('cost-select-vendor-biaya-lain-10'),
        };

        formVendor.append('nomor', ((checkNomor) ? getInputValue('input-job-nomor') : getSelectValue('select-job-nomor')));
        formVendor.append('kode_vendor', JSON.stringify(kodeVendor));
        formVendor.append('cost', JSON.stringify(cost));

        let formSales = new FormData

        let item = {
            trucking: getInputValue('input-sales-trucking'),
            lolo: getInputValue('input-sales-lolo'),
            storage: getInputValue('input-sales-storage'),
            operational_cost: getInputValue('input-sales-operational-cost'),
            lembur: getInputValue('input-sales-lembur'),
            sending_peb_vgm: getInputValue('input-sales-sending-peb-vgm'),
            vgm: getInputValue('input-sales-vgm'),
            karantina_cost: getInputValue('input-sales-karantina-cost'),
            gudang: getInputValue('input-sales-gudang'),
            pnbp_phyto: getInputValue('input-sales-pnbp-phyto'),
            coo: getInputValue('input-sales-coo'),
            ispm: getInputValue('input-sales-ispm'),
            fumigasi: getInputValue('input-sales-fumigasi'),
            rc: getInputValue('input-sales-rc'),
            v_legal: getInputValue('input-sales-v-legal'),
            ekspor_license: getInputValue('input-sales-ekspor-license'),
            biaya_lain_1: getInputValue('sales-input-sales-biaya-lain-1'),
            biaya_lain_2: getInputValue('sales-input-sales-biaya-lain-2'),
            biaya_lain_3: getInputValue('sales-input-sales-biaya-lain-3'),
            biaya_lain_4: getInputValue('sales-input-sales-biaya-lain-4'),
            biaya_lain_5: getInputValue('sales-input-sales-biaya-lain-5'),
            biaya_lain_6: getInputValue('sales-input-sales-biaya-lain-6'),
            biaya_lain_7: getInputValue('sales-input-sales-biaya-lain-7'),
            biaya_lain_8: getInputValue('sales-input-sales-biaya-lain-8'),
            biaya_lain_9: getInputValue('sales-input-sales-biaya-lain-9'),
            biaya_lain_10: getInputValue('sales-input-sales-biaya-lain-10'),
        };

        formSales.append('nomor', ((checkNomor) ? getInputValue('input-job-nomor') : getSelectValue('select-job-nomor')));
        formSales.append('item', JSON.stringify(item));
        formSales.append('kode_customer', kodeCustomer.kode);
        formSales.append('nama_customer', kodeCustomer.nama);

        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencode, multipart/form-data'
            }
        };

        let urlTransaksi = ((checkNomor) ? 'http://emkl-abb.virtusrox.me/api/update/detail-transaksi.php' : 'http://emkl-abb.virtusrox.me/api/insert/detail-transaksi.php');
        let urlSales = ((checkNomor) ? 'http://emkl-abb.virtusrox.me/api/update/sales.php' : 'http://emkl-abb.virtusrox.me/api/insert/sales.php');
        let urlUtang = ((checkNomor) ? 'http://emkl-abb.virtusrox.me/api/update/utang.php' : 'http://emkl-abb.virtusrox.me/api/insert/utang.php')

        axios.post(urlSales, formSales, config).then(responseDetailSales => {
            setLoaderPercentage('loader-percentage', 0, 25);

            axios.post(urlTransaksi, formData, config).then(responseDetailTransaksi => {
                setLoaderPercentage('loader-percentage', 25, 50);

                axios.post(urlUtang, formVendor, config).then(responseUtang => {
                    setLoaderPercentage('loader-percentage', 50, 75);

                    console.log(responseUtang);

                    let checkCustomer = customer.filter(item => item.nama === getInputValue('input-customer'));

                    if (checkCustomer && checkCustomer.length > 0) {
                        setLoaderPercentage('loader-percentage', 75, 100);

                        setTimeout(() => {
                            document.getElementById('loader-percentage').innerHTML = "Menyimpan Data Berhasil!";
                            window.location.reload();
                        }, 1000);
                    } else {
                        let kodeCustomer = codeCustomer();

                        let data = {
                            kode: kodeCustomer,
                            nama: getInputValue('input-customer')
                        };

                        axios.post('http://emkl-abb.virtusrox.me/api/insert/customer.php', data, config).then(responseCustomer => {
                            setLoaderPercentage('loader-percentage', 75, 100);

                            setTimeout(() => {
                                document.getElementById('loader-percentage').innerHTML = "Menyimpan Data Berhasil!";
                                window.location.reload();
                            }, 1000);

                        });
                    }
                });
            });
        });
        // }
    }

    const ubahData = (nomor) => {
        document.getElementById('input-job-nomor').focus();

        let detailTransaksi = detailTransaksiData.find(item => item.nomor === nomor);
        let detailCost = detailCostData.find(item => item.nomor === nomor);
        let detailSales = detailSalesData.filter(item => item.nomor === nomor);
        let detailUtang = utang.filter(item => item.nomor === nomor);

        document.getElementById('select-job-nomor').classList.add('d-none');
        document.getElementById('input-job-nomor').classList.remove('d-none');

        setInputValue('input-job-nomor', nomor.replace(new RegExp('-', 'g'), '/'));
        setInputValue('input-invoice-number', detailTransaksi.invoice);
        setInputValue('input-customer', detailTransaksi.customer);
        setInputValue('input-booking-number', detailTransaksi.booking_number);
        setInputValue('input-shipper', detailTransaksi.shipper);
        setInputValue('input-license-export', detailTransaksi.license_export);
        setInputValue('input-consignee', detailTransaksi.consignee);
        setInputValue('input-destination', detailTransaksi.destination);
        setInputValue('input-feeder', detailTransaksi.feeder);
        setInputValue('input-etd-srg', detailTransaksi.etd_srg);
        setInputValue('input-closing-time', detailTransaksi.closing_time);
        setInputValue('input-forwarding-shipline', detailTransaksi.forwarding_shipline);
        setInputValue('input-destination', detailTransaksi.destination);
        setInputValue('input-jumlah-party', detailTransaksi.jumlah_party);
        setSelectValue('select-ukuran-party', detailTransaksi.ukuran_party);
        setInputValue('input-stuffing-date', detailTransaksi.stuffing_date);
        setInputValue('input-stuffing-place', detailTransaksi.stuffing_place);
        setInputValue('input-note', detailTransaksi.note);

        $('#container').empty();

        if (detailTransaksi.jumlah_party > 0) {
            for (let i = 1; i <= detailTransaksi.jumlah_party; i++) {
                $('#container').append('<input type="text" id="input-container-' + i + '" name="input-container" class="form-control mb-2" placeholder="Container / Seal" />');
            }
        } else {
            $('#container').append('<input type="text" id="input-container-0" name="input-container" class="form-control mb-2" placeholder="Container / Seal" disabled />');
        }

        if (document.getElementById('input-container-1')) setInputValue('input-container-1', detailTransaksi.container_seal_1);
        if (document.getElementById('input-container-2')) setInputValue('input-container-2', detailTransaksi.container_seal_2);
        if (document.getElementById('input-container-3')) setInputValue('input-container-3', detailTransaksi.container_seal_3);
        if (document.getElementById('input-container-4')) setInputValue('input-container-4', detailTransaksi.container_seal_4);
        if (document.getElementById('input-container-5')) setInputValue('input-container-5', detailTransaksi.container_seal_5);
        if (document.getElementById('input-container-6')) setInputValue('input-container-6', detailTransaksi.container_seal_6);
        if (document.getElementById('input-container-7')) setInputValue('input-container-7', detailTransaksi.container_seal_7);
        if (document.getElementById('input-container-8')) setInputValue('input-container-8', detailTransaksi.container_seal_8);
        if (document.getElementById('input-container-9')) setInputValue('input-container-9', detailTransaksi.container_seal_9);
        if (document.getElementById('input-container-10')) setInputValue('input-container-10', detailTransaksi.container_seal_10);

        setInputValue('input-cost-trucking', detailCost.trucking);
        setInputValue('select-vendor-trucking', detailUtang.find(item => item.nama_cost === 'trucking').kode_vendor);
        setInputValue('input-cost-lolo', detailCost.lolo);
        setInputValue('input-cost-storage', detailCost.storage);
        setInputValue('input-cost-operational-cost', detailCost.operational_cost);
        setInputValue('select-vendor-operational-cost', detailUtang.find(item => item.nama_cost === 'operational_cost').kode_vendor);
        setInputValue('input-cost-lembur', detailCost.lembur);
        setInputValue('input-cost-gudang', detailCost.gudang);
        setInputValue('input-cost-sending-peb-vgm', detailCost.sending_peb_vgm);
        setInputValue('select-vendor-sending-peb-vgm', detailUtang.find(item => item.nama_cost === 'sending_peb_vgm').kode_vendor);
        setInputValue('input-cost-vgm', detailCost.vgm);
        setInputValue('input-cost-karantina-cost', detailCost.karantina_cost);
        setInputValue('select-vendor-karantina-cost', detailUtang.find(item => item.nama_cost === 'karantina_cost').kode_vendor);
        setInputValue('input-cost-pnbp-phyto', detailCost.pnbp_phyto);
        setInputValue('select-vendor-pnbp-phyto', detailUtang.find(item => item.nama_cost === 'pnbp_phyto').kode_vendor);
        setInputValue('input-cost-coo', detailCost.coo);
        setInputValue('select-vendor-coo', detailUtang.find(item => item.nama_cost === 'coo').kode_vendor);
        setInputValue('input-cost-ispm', detailCost.ispm);
        setInputValue('select-vendor-ispm', detailUtang.find(item => item.nama_cost === 'ispm').kode_vendor);
        setInputValue('input-cost-fumigasi', detailCost.fumigasi);
        setInputValue('select-vendor-fumigasi', detailUtang.find(item => item.nama_cost === 'fumigasi').kode_vendor);
        setInputValue('input-cost-rc', detailCost.rc);
        setInputValue('select-vendor-rc', detailUtang.find(item => item.nama_cost === 'rc').kode_vendor);
        setInputValue('input-cost-v-legal', detailCost.v_legal);
        setInputValue('select-vendor-v-legal', detailUtang.find(item => item.nama_cost === 'v_legal').kode_vendor);
        setInputValue('input-cost-ekspor-license', detailCost.ekspor_license);
        setInputValue('select-vendor-ekspor-license', detailUtang.find(item => item.nama_cost === 'ekspor_license').kode_vendor);

        setInputValue('cost-input-nama-biaya-lain-1', detailCost.biaya_lain_1);
        setInputValue('cost-input-cost-biaya-lain-1', detailCost.cost_biaya_lain_1);
        setInputValue('cost-select-vendor-biaya-lain-1', detailUtang.find(item => item.nama_cost === 'biaya_lain_1').kode_vendor);
        setInputValue('cost-input-nama-biaya-lain-2', detailCost.biaya_lain_2);
        setInputValue('cost-input-cost-biaya-lain-2', detailCost.cost_biaya_lain_2);
        setInputValue('cost-select-vendor-biaya-lain-2', detailUtang.find(item => item.nama_cost === 'biaya_lain_2').kode_vendor);
        setInputValue('cost-input-nama-biaya-lain-3', detailCost.biaya_lain_3);
        setInputValue('cost-input-cost-biaya-lain-3', detailCost.cost_biaya_lain_3);
        setInputValue('cost-select-vendor-biaya-lain-3', detailUtang.find(item => item.nama_cost === 'biaya_lain_3').kode_vendor);
        setInputValue('cost-input-nama-biaya-lain-4', detailCost.biaya_lain_4);
        setInputValue('cost-input-cost-biaya-lain-4', detailCost.cost_biaya_lain_4);
        setInputValue('cost-select-vendor-biaya-lain-4', detailUtang.find(item => item.nama_cost === 'biaya_lain_4').kode_vendor);
        setInputValue('cost-input-nama-biaya-lain-5', detailCost.biaya_lain_5);
        setInputValue('cost-input-cost-biaya-lain-5', detailCost.cost_biaya_lain_5);
        setInputValue('cost-select-vendor-biaya-lain-5', detailUtang.find(item => item.nama_cost === 'biaya_lain_5').kode_vendor);
        setInputValue('cost-input-nama-biaya-lain-6', detailCost.biaya_lain_6);
        setInputValue('cost-input-cost-biaya-lain-6', detailCost.cost_biaya_lain_6);
        setInputValue('cost-select-vendor-biaya-lain-6', detailUtang.find(item => item.nama_cost === 'biaya_lain_6').kode_vendor);
        setInputValue('cost-input-nama-biaya-lain-7', detailCost.biaya_lain_7);
        setInputValue('cost-input-cost-biaya-lain-7', detailCost.cost_biaya_lain_7);
        setInputValue('cost-select-vendor-biaya-lain-7', detailUtang.find(item => item.nama_cost === 'biaya_lain_7').kode_vendor);
        setInputValue('cost-input-nama-biaya-lain-8', detailCost.biaya_lain_8);
        setInputValue('cost-input-cost-biaya-lain-8', detailCost.cost_biaya_lain_8);
        setInputValue('cost-select-vendor-biaya-lain-8', detailUtang.find(item => item.nama_cost === 'biaya_lain_8').kode_vendor);
        setInputValue('cost-input-nama-biaya-lain-9', detailCost.biaya_lain_9);
        setInputValue('cost-input-cost-biaya-lain-9', detailCost.cost_biaya_lain_9);
        setInputValue('cost-select-vendor-biaya-lain-9', detailUtang.find(item => item.nama_cost === 'biaya_lain_9').kode_vendor);
        setInputValue('cost-input-nama-biaya-lain-10', detailCost.biaya_lain_10);
        setInputValue('cost-input-cost-biaya-lain-10', detailCost.cost_biaya_lain_10);
        setInputValue('cost-select-vendor-biaya-lain-10', detailUtang.find(item => item.nama_cost === 'biaya_lain_10').kode_vendor);

        setInputValue('input-sales-trucking', detailSales.find(item => item.item === 'trucking').unit_price);
        setInputValue('input-sales-lolo', detailSales.find(item => item.item === 'lolo').unit_price);
        setInputValue('input-sales-storage', detailSales.find(item => item.item === 'storage').unit_price);
        setInputValue('input-sales-operational-cost', detailSales.find(item => item.item === 'operational_cost').unit_price);
        setInputValue('input-sales-lembur', detailSales.find(item => item.item === 'lembur').unit_price);
        setInputValue('input-sales-gudang', detailSales.find(item => item.item === 'gudang').unit_price);
        setInputValue('input-sales-sending-peb-vgm', detailSales.find(item => item.item === 'sending_peb_vgm').unit_price);
        setInputValue('input-sales-vgm', detailSales.find(item => item.item === 'vgm').unit_price);
        setInputValue('input-sales-karantina-cost', detailSales.find(item => item.item === 'karantina_cost').unit_price);
        setInputValue('input-sales-pnbp-phyto', detailSales.find(item => item.item === 'pnbp_phyto').unit_price);
        setInputValue('input-sales-coo', detailSales.find(item => item.item === 'coo').unit_price);
        setInputValue('input-sales-ispm', detailSales.find(item => item.item === 'ispm').unit_price);
        setInputValue('input-sales-fumigasi', detailSales.find(item => item.item === 'fumigasi').unit_price);
        setInputValue('input-sales-rc', detailSales.find(item => item.item === 'rc').unit_price);
        setInputValue('input-sales-v-legal', detailSales.find(item => item.item === 'v_legal').unit_price);
        setInputValue('input-sales-ekspor-license', detailSales.find(item => item.item === 'ekspor_license').unit_price);

        setInputValue('sales-input-sales-biaya-lain-1', detailSales.find(item => item.item === 'biaya_lain_1').unit_price);
        setInputValue('sales-input-sales-biaya-lain-2', detailSales.find(item => item.item === 'biaya_lain_2').unit_price);
        setInputValue('sales-input-sales-biaya-lain-3', detailSales.find(item => item.item === 'biaya_lain_3').unit_price);
        setInputValue('sales-input-sales-biaya-lain-4', detailSales.find(item => item.item === 'biaya_lain_4').unit_price);
        setInputValue('sales-input-sales-biaya-lain-5', detailSales.find(item => item.item === 'biaya_lain_5').unit_price);
        setInputValue('sales-input-sales-biaya-lain-6', detailSales.find(item => item.item === 'biaya_lain_6').unit_price);
        setInputValue('sales-input-sales-biaya-lain-7', detailSales.find(item => item.item === 'biaya_lain_7').unit_price);
        setInputValue('sales-input-sales-biaya-lain-8', detailSales.find(item => item.item === 'biaya_lain_8').unit_price);
        setInputValue('sales-input-sales-biaya-lain-9', detailSales.find(item => item.item === 'biaya_lain_9').unit_price);
        setInputValue('sales-input-sales-biaya-lain-10', detailSales.find(item => item.item === 'biaya_lain_10').unit_price);

        setInputValue('input-peb-no', detailTransaksi.peb_number);
        setInputValue('input-date', detailTransaksi.tanggal)

        calculate();
    }

    return (
        <div className="active content overflow-auto">
            <Loader />
            <p className="fw-bold text-secondary text-size-10">Detail Transaksi</p>
            <p className="text-secondary">Transaksi / <span className="fw-bold primary-text-color">Detail Transaksi</span></p>
            <form id="form" className="card-form">
                <div className="p-4">
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="select-job-nomor" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Job No.</label>
                        <div className="col col-lg-4 col-md-6">
                            <select name="select-job-nomor" id="select-job-nomor" className="form-select" onChange={selectJobNomor}>
                                {costData.length > 0 ? <option value="">-- Pilih Job Nomor --</option> : null}
                                {costData.length > 0 ? costData.map((data, index) =>
                                    <option key={++index} value={data.nomor.replace(new RegExp('-', 'g'), '/')}>{data.nomor.replace(new RegExp('-', 'g'), '/')}</option>
                                ) :
                                    <option value="">-- Tidak Ada Data Cost --</option>
                                }
                            </select>
                            <input type="text" name="input-job-nomor" id="input-job-nomor" className="d-none form-control" readOnly />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-invoice-number" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Invoice Number</label>
                        <div className="col col-lg-2 col-md-3">
                            <input type="text" id="input-invoice-number" name="input-invoice-number" className="form-control" placeholder="Nomor Faktur" />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-customer" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Customer</label>
                        <div className="col">
                            <input type="text" id="input-customer" name="input-customer" className="form-control" placeholder="Customer" list="customer" autoComplete="off" maxLength={100} />
                            <datalist id="customer">
                                {customer.map(data =>
                                    <option key={data.id} value={data.nama}>{data.kode}</option>
                                )}
                            </datalist>
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-booking-number" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Booking Number</label>
                        <div className="col col-lg-4 col-md-6">
                            <input type="text" id="input-booking-number" name="input-booking-number" className="form-control" placeholder="Booking Number" maxLength={30} />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-shipper" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Shipper</label>
                        <div className="col">
                            <input type="text" id="input-shipper" name="input-shipper" className="form-control" placeholder="Shipper" maxLength={100} />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-row flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-license-export" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">License Export</label>
                        <div className="col col-lg-4 col-md-6">
                            <input type="text" id="input-license-export" name="input-license-export" className="form-control" placeholder="License Export" maxLength={50} />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-consignee" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Consignee</label>
                        <div className="col">
                            <input type="text" id="input-consignee" name="input-consignee" className="form-control" placeholder="Consignee" maxLength={100} />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-destination" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Destination</label>
                        <div className="col">
                            <input type="text" id="input-destination" name="input-destination" className="form-control" placeholder="Destination" />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-feeder" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Feeder</label>
                        <div className="col col-lg-2 col-md-2 pb-3 pb-md-0">
                            <input type="text" id="input-feeder" name="input-feeder" className="form-control" placeholder="Feeder" maxLength={100} />
                        </div>
                        <label htmlFor="input-etd-srg" className="col-12 col-lg-2 col-md-2 pb-2 pb-md-0 ps-0 ps-md-4">ETD SRG</label>
                        <div className="col col-lg-2 col-md-2 pb-3 pb-md-0">
                            <input type="date" id="input-etd-srg" name="input-etd-srg" className="form-control" placeholder="ETD SRG" maxLength={100} />
                        </div>
                        <label htmlFor="input-closing-time" className="col-12 col-lg-2 col-md-2 pb-2 pb-md-0 ps-0 ps-md-4">Closing Time</label>
                        <div className="col col-lg-2 col-md-2">
                            <input type="time" id="input-closing-time" name="input-closing-time" className="form-control" placeholder="Closing Time" />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-forwarding-shipline" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Forwarding - Shipline</label>
                        <div className="col">
                            <input type="text" id="input-forwarding-shipline" name="input-forwarding-shipline" className="form-control" placeholder="Forwarding - Shipline" />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-jumlah-party" className="col-1 col-lg-2 col-md-3 pb-2 pb-md-0">Party</label>
                        <div className="col-2 col-md-1">
                            <input type="text" id="input-jumlah-party" name="input-jumlah-party" className="form-control text-center" placeholder="0" onInput={generateContainer} />
                        </div>
                        <div className="px-4">x</div>
                        <div className="col-6 col-md-4">
                            <select name="select-ukuran-party" id="select-ukuran-party" className="form-select text-center">
                                {ukuranContainer.length > 0 ? ukuranContainer.map((data, index) =>
                                    <option key={++index} value={data.nama}>{data.nama}</option>
                                ) :
                                    <option value="">-- Tidak Ada Data Ukuran Container --</option>
                                }
                            </select>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="container" className="col-12 col-lg-2 col-md-3 col-form-label pb-2 pb-md-0">Container / Seal</label>
                        <div id="container" className="align-items-center col">
                            <input type="text" id="input-container-0" name="input-container" className="form-control mb-2" placeholder="Container / Seal" disabled />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-stuffing-date" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Stuffing Date</label>
                        <div className="col pb-3 pb-md-0">
                            <input type="date" id="input-stuffing-date" name="input-stuffing-date" className="form-control" placeholder="Stuffing Date" />
                        </div>
                        <label htmlFor="input-stuffing-place" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0 ps-0 ps-md-4">Stuffing Place</label>
                        <div className="col">
                            <input type="text" id="input-stuffing-place" name="input-stuffing-place" className="form-control" placeholder="Stuffing Place" />
                        </div>
                    </div>
                    <div className="d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-note" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Note</label>
                        <div className="col">
                            <textarea id="input-note" name="input-note" className="form-control" placeholder="Note" ></textarea>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap flex-row">
                        <div className="col-12 col-md-8 pe-md-2">
                            <p className="fw-bold primary-text-color pt-5 text-size-6 d-flex">Cost</p>
                            <div className="align-items-center d-none d-lg-flex flex-wrap text-center">
                                <div className="col-lg-2">
                                    <div className="fw-bold">Nama</div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="fw-bold">Biaya</div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="fw-bold">File</div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="fw-bold">Vendor</div>
                                </div>
                            </div>
                            <hr className="primary-color mt-lg-1" />
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-trucking" className="col-12 col-lg-2 pb-2 pb-md-0">Trucking</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-trucking" name="input-cost-trucking" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-trucking" name="input-file-trucking" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-trucking" id="select-vendor-trucking" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-lolo" className="col-12 col-lg-2 pb-2 pb-md-0">LOLO</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-lolo" name="input-cost-lolo" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-lolo" name="input-file-lolo" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 d-none pe-lg-2">
                                    <select name="select-vendor-lolo" id="select-vendor-lolo" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-storage" className="col-12 col-lg-2 pb-2 pb-md-0">Storage</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-storage" name="input-cost-storage" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-storage" name="input-file-storage" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 d-none pe-lg-2">
                                    <select name="select-vendor-storage" id="select-vendor-storage" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-operational-cost" className="col-12 col-lg-2 pb-2 pb-md-0">Operational Cost</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-operational-cost" name="input-cost-operational-cost" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-operational-cost" name="input-file-operational-cost" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-operational-cost" id="select-vendor-operational-cost" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-lembur" className="col-12 col-lg-2 pb-2 pb-md-0">Lembur</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-lembur" name="input-cost-lembur" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-lembur" name="input-file-lembur" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 d-none pe-lg-2">
                                    <select name="select-vendor-lembur" id="select-vendor-lembur" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-peb-vgm" className="col-12 col-lg-2 pb-2 pb-md-0">Sending PEB VGM</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-sending-peb-vgm" name="input-cost-sending-peb-vgm" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-sending-peb-vgm" name="input-file-sending-peb-vgm" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-sending-peb-vgm" id="select-vendor-sending-peb-vgm" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-vgm" className="col-12 col-lg-2 pb-2 pb-md-0">VGM</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-vgm" name="input-cost-vgm" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-vgm" name="input-file-vgm" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 d-none pe-lg-2">
                                    <select name="select-vendor-vgm" id="select-vendor-vgm" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-karantina-cost" className="col-12 col-lg-2 pb-2 pb-md-0">Karantina Cost</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-karantina-cost" name="input-cost-karantina-cost" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-karantina-cost" name="input-file-karantina-cost" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-karantina-cost" id="select-vendor-karantina-cost" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-gudang" className="col-12 col-lg-2 pb-2 pb-md-0">Gudang</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-gudang" name="input-cost-gudang" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-gudang" name="input-file-gudang" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 d-none pe-lg-2">
                                    <select name="select-vendor-gudang" id="select-vendor-gudang" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-pnbp-phyto" className="col-12 col-lg-2 pb-2 pb-md-0">PNBP Phyto</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-pnbp-phyto" name="input-cost-pnbp-phyto" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-pnbp-phyto" name="input-file-pnbp-phyto" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-pnbp-phyto" id="select-vendor-pnbp-phyto" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-coo" className="col-12 col-lg-2 pb-2 pb-md-0">COO</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-coo" name="input-cost-coo" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-coo" name="input-file-coo" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-coo" id="select-vendor-coo" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-ispm" className="col-12 col-lg-2 pb-2 pb-md-0">ISPM</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-ispm" name="input-cost-ispm" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-ispm" name="input-file-ispm" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-ispm" id="select-vendor-ispm" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-fumigasi" className="col-12 col-lg-2 pb-2 pb-md-0">Fumigasi</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-fumigasi" name="input-cost-fumigasi" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-fumigasi" name="input-file-fumigasi" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-fumigasi" id="select-vendor-fumigasi" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-rc" className="col-12 col-lg-2 pb-2 pb-md-0">RC</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-rc" name="input-cost-rc" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-rc" name="input-file-rc" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-rc" id="select-vendor-rc" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-v-legal" className="col-12 col-lg-2 pb-2 pb-md-0">V Legal</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-v-legal" name="input-cost-v-legal" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-v-legal" name="input-file-v-legal" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-v-legal" id="select-vendor-v-legal" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-ekspor-license" className="col-12 col-lg-2 pb-2 pb-md-0">Ekspor License</label>
                                <div className="col-12 col-lg-3 pb-2 pb-lg-0 pe-lg-2">
                                    <input type="text" id="input-cost-ekspor-license" name="input-cost-ekspor-license" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                                <div className="col-12 col-lg-4 pb-2 pb-lg-0 px-lg-2">
                                    <input type="file" accept=".pdf" id="input-file-ekspor-license" name="input-file-ekspor-license" className="form-control" />
                                </div>
                                <div className="col-12 col-lg-3 pe-lg-2">
                                    <select name="select-vendor-ekspor-license" id="select-vendor-ekspor-license" className="form-select">
                                        {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                        {vendor.length > 0 ? vendor.map((data, index) =>
                                            <option key={++index} value={data.kode}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Vendor --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 ps-md-2">
                            <p className="fw-bold primary-text-color pt-5 text-size-6 d-flex">SALES</p>
                            <div className="align-items-center d-none d-lg-flex flex-wrap text-center">
                                <div className="col-lg-6">
                                    <div className="fw-bold">Nama</div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="fw-bold">Biaya</div>
                                </div>
                            </div>
                            <hr className="primary-color mt-lg-1" />
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-trucking" className="col-12 col-lg-6 pb-2 pb-md-0">Trucking</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-trucking" name="input-sales-trucking" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-lolo" className="col-12 col-lg-6 pb-2 pb-md-0">LOLO</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-lolo" name="input-sales-lolo" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-storage" className="col-12 col-lg-6 pb-2 pb-md-0">Storage</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-storage" name="input-sales-storage" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-operational-cost" className="col-12 col-lg-6 pb-2 pb-md-0">Operational Cost</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-operational-cost" name="input-sales-operational-cost" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-lembur" className="col-12 col-lg-6 pb-2 pb-md-0">Lembur</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-lembur" name="input-sales-lembur" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-sending-peb-vgm" className="col-12 col-lg-6 pb-2 pb-md-0">Sending PEB VGM</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-sending-peb-vgm" name="input-sales-sending-peb-vgm" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-vgm" className="col-12 col-lg-6 pb-2 pb-md-0">VGM</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-vgm" name="input-sales-vgm" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-karantina-cost" className="col-12 col-lg-6 pb-2 pb-md-0">Karantina Cost</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-karantina-cost" name="input-sales-karantina-cost" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-gudang" className="col-12 col-lg-6 pb-2 pb-md-0">Gudang</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-gudang" name="input-sales-gudang" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-pnbp-phyto" className="col-12 col-lg-6 pb-2 pb-md-0">PNBP Phyto</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-pnbp-phyto" name="input-sales-pnbp-phyto" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-coo" className="col-12 col-lg-6 pb-2 pb-md-0">COO</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-coo" name="input-sales-coo" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-ispm" className="col-12 col-lg-6 pb-2 pb-md-0">ISPM</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-ispm" name="input-sales-ispm" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-fumigasi" className="col-12 col-lg-6 pb-2 pb-md-0">Fumigasi</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-fumigasi" name="input-sales-fumigasi" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-rc" className="col-12 col-lg-6 pb-2 pb-md-0">RC</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-rc" name="input-sales-rc" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-v-legal" className="col-12 col-lg-6 pb-2 pb-md-0">V Legal</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-v-legal" name="input-sales-v-legal" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-sales-ekspor-license" className="col-12 col-lg-6 pb-2 pb-md-0">Ekspor License</label>
                                <div className="col-12 col-lg-6">
                                    <input type="text" id="input-sales-ekspor-license" name="input-sales-ekspor-license" className="sales form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-row flex-wrap">
                        <div className="align-items-center col-12 d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <p className="col-form-label fw-bold">Biaya Lain-Lain</p>
                            <button type="button" id="cost-btn-tambah-biaya-lain" className="btn btn-sm primary-color mx-2" onClick={generateCostBiayaLain}><FaPlus className="text-white" /></button>
                        </div>
                        <div id="cost-form-biaya-lain" className="col-12">
                            <div id="cost-biaya-lain-1" className="align-items-center d-flex flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-1" name="cost-input-nama-biaya-lain-1" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-1" name="cost-input-cost-biaya-lain-1" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-1" name="input-file-biaya-lain-1" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-1" id="cost-select-vendor-biaya-lain-1" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-1" name="sales-input-sales-biaya-lain-1" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-1" className="btn btn-sm d-none btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-2" className="align-items-center d-flex flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-2" name="cost-input-nama-biaya-lain-2" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-2" name="cost-input-cost-biaya-lain-2" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-2" name="cost-input-file-biaya-lain-2" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-2" id="cost-select-vendor-biaya-lain-2" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-2" name="sales-input-sales-biaya-lain-2" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-2" className="btn btn-sm d-none btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-3" className="align-items-center d-flex flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-3" name="cost-input-nama-biaya-lain-3" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-3" name="cost-input-cost-biaya-lain-3" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-3" name="cost-input-file-biaya-lain-3" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-3" id="cost-select-vendor-biaya-lain-3" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-3" name="sales-input-sales-biaya-lain-3" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-3" className="btn btn-sm d-none btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-4" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-4" name="cost-input-nama-biaya-lain-4" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-4" name="cost-input-cost-biaya-lain-4" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-4" name="cost-input-file-biaya-lain-4" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-4" id="cost-select-vendor-biaya-lain-4" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-4" name="sales-input-sales-biaya-lain-4" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-4" className="btn btn-sm btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-5" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-5" name="cost-input-nama-biaya-lain-5" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-5" name="cost-input-cost-biaya-lain-5" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-5" name="cost-input-file-biaya-lain-5" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-5" id="cost-select-vendor-biaya-lain-5" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-5" name="sales-input-sales-biaya-lain-5" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-5" className="btn btn-sm btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-6" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-6" name="cost-input-nama-biaya-lain-6" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-6" name="cost-input-cost-biaya-lain-6" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-6" name="cost-input-file-biaya-lain-6" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-6" id="cost-select-vendor-biaya-lain-6" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-6" name="sales-input-sales-biaya-lain-6" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-6" className="btn btn-sm btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-7" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-7" name="cost-input-nama-biaya-lain-7" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-7" name="cost-input-cost-biaya-lain-7" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-7" name="cost-input-file-biaya-lain-7" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-7" id="cost-select-vendor-biaya-lain-7" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-7" name="sales-input-sales-biaya-lain-7" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-7" className="btn btn-sm btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-8" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-8" name="cost-input-nama-biaya-lain-8" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-8" name="cost-input-cost-biaya-lain-8" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-8" name="cost-input-file-biaya-lain-8" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-8" id="cost-select-vendor-biaya-lain-8" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-8" name="sales-input-sales-biaya-lain-8" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-8" className="btn btn-sm btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-9" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-9" name="cost-input-nama-biaya-lain-9" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-9" name="cost-input-cost-biaya-lain-9" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-9" name="cost-input-file-biaya-lain-9" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-9" id="cost-select-vendor-biaya-lain-9" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-9" name="sales-input-sales-biaya-lain-9" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-9" className="btn btn-sm btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-10" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-lg-2 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-10" name="cost-input-nama-biaya-lain-10" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-lg-2 ps-2 ps-lg-0 px-lg-2">
                                        <input type="text" id="cost-input-cost-biaya-lain-10" name="cost-input-cost-biaya-lain-10" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                    <div className="col-12 col-lg-4 px-lg-2 py-2 py-lg-0">
                                        <input type="file" accept=".pdf" id="cost-input-file-biaya-lain-10" name="cost-input-file-biaya-lain-10" className="form-control" />
                                    </div>
                                    <div className="col-12 col-lg-2 pe-lg-2">
                                        <select name="cost-select-vendor-biaya-lain-10" id="cost-select-vendor-biaya-lain-10" className="form-select">
                                            {vendor.length > 0 ? <option value="">-- Pilih Vendor --</option> : null}
                                            {vendor.length > 0 ? vendor.map((data, index) =>
                                                <option key={++index} value={data.kode}>{data.nama}</option>
                                            ) :
                                                <option value="">-- Tidak Ada Data Vendor --</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="col-12 col-lg-2 ps-lg-2 py-2 py-lg-0">
                                        <input type="text" id="sales-input-sales-biaya-lain-10" name="sales-input-sales-biaya-lain-10" className="sales-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-10" className="btn btn-sm btn-danger mx-2" onClick={hapusCostBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <p className="col col-lg-2 col-md-4 col-form-label fw-bold primary-text-color">Total Cost</p>
                        <div className="col col-lg-4 col-md-6">
                            <input type="text" id="total-cost" name="total-cost" className="form-control text-end" placeholder="Rp. 0,00" readOnly />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <p className="col col-lg-2 col-md-4 col-form-label fw-bold primary-text-color">Profit</p>
                        <div className="col col-lg-4 col-md-6">
                            <input type="text" id="total-profit" name="total-profit" className="form-control text-end" placeholder="Rp. 0,00" readOnly />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap offset-6 offset-md-8 pb-3 pb-md-2 px-0">
                        <label htmlFor="input-peb-no" className="col-4 col-lg-2 col-md-3 pb-2 pb-md-0">PEB NO</label>
                        <div className="col">
                            <input type="text" id="input-peb-no" name="input-peb-no" className="form-control" placeholder="PEB NO" maxLength={30} />
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap offset-6 offset-md-8 pb-3 pb-md-2 px-0">
                        <label htmlFor="input-date" className="col-4 col-lg-2 col-md-3 pb-2 pb-md-0">DATE</label>
                        <div className="col">
                            <input type="date" id="input-date" name="input-date" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} onClick={simpanData} value="Simpan" />
                    <input type="button" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Bersihkan" onClick={resetForm} />
                </div>
            </form >
            <div className="card-form mt-5 p-4">
                <div className="table-responsive">
                    <table id="table-data" className="table table-bordered table-striped text-nowrap w-100">
                        <thead className="align-middle text-center">
                            <tr>
                                <th>No.</th>
                                <th>Tanggal</th>
                                <th>Job Nomor</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="table-data-body" className="align-middle">
                            {detailTransaksiData.map((data, index) =>
                                <tr key={++index} className="text-center">
                                    <td>{++index}.</td>
                                    <td>{data.tanggal}</td>
                                    <td>{data.nomor.replace(new RegExp('-', 'g'), '/')}</td>
                                    <td className="d-flex flex-row justify-content-around">
                                        <button type="button" id={`btn-ubah-${data.id}`} name={`btn-ubah-${data.id}`} className="btn btn-warning" onClick={() => ubahData(data.nomor)}><FaEdit /> Ubah</button>
                                        <Link to={{ pathname: '/transaksi/invoice' }} id={`btn-cetak-${data.id}`} className="btn btn-success" onClick={() => cetakData(`${data.nomor}`)} ><FaPrint /> Cetak</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

export default DetailTransaksi
