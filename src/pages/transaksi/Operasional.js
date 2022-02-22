import { useEffect, useState } from 'react';
import { FaPlus, FaMinus, FaEdit, FaPrint } from 'react-icons/fa';

import $ from 'jquery';
import axios from 'axios';
import { checkInputValidity, disableMouseClick, enableMouseClick, getInputValue, getSelectValue, hargaFormat, hideLoader, inputNumber, setInputValue, setLoaderPercentage, showLoader, today } from '../../components/Helper';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';

const Operasional = () => {

    const [useCustomer, setCustomer] = useState([]);
    const [useCost, setCost] = useState([]);
    const [useDetailCost, setDetailCost] = useState([]);
    const [useUkuranContainer, setUkuranContainer] = useState([]);
    const [useTotalBiayaLain, setTotalBiayaLain] = useState(3);
    const [useTable, setTable] = useState([]);

    const calculate = () => {
        let costBiayaLain = document.querySelectorAll('.cost-biaya-lain');
        let cost = document.querySelectorAll('.cost');

        let totalCost = 0;

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


        setInputValue('total-cost', hargaFormat(totalCost));
    }

    const calculateTotal = (event) => {
        inputNumber(event);

        calculate();
    }

    const cetakData = (id) => {
        sessionStorage.setItem('id', id);
    }

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/customer.php').then(responseCustomer => {
            if (responseCustomer.data.length > 0)
                setCustomer(responseCustomer.data);

            axios.get('http://emkl-abb.virtusrox.me/api/select/ukuran-container.php').then(responseUkuranContainer => {
                if (responseUkuranContainer.data.length > 0) setUkuranContainer(responseUkuranContainer.data);

                axios.get('http://emkl-abb.virtusrox.me/api/select/cost.php').then(responseCost => {
                    if (responseCost.data.length > 0) setCost(responseCost.data);

                    axios.get('http://emkl-abb.virtusrox.me/api/select/detail-cost.php').then(responseDetailCost => {
                        if (responseDetailCost.data.length > 0) setDetailCost(responseDetailCost.data);

                        $(document).ready(function () {
                            $('input[type="text"]').on('input', function () {
                                $(this).val($(this).val().replace(/['"]/gi, ''));
                            });

                            let lengthData = responseCost.data.length;
                            let index = 0;

                            let formatKode = "0001";

                            let date = new Date();

                            if (lengthData > 0) {
                                let kode = responseCost.data[lengthData - 1].nomor;

                                kode = kode.split('-');
                                kode = kode[0];

                                for (let i = 1; i < kode.length; i++) {
                                    const data = kode[i];
                                    if (data != 0) {
                                        index = i;
                                        break;
                                    }
                                }

                                let lastKode = "";

                                for (let i = index; i < kode.length; i++) {
                                    lastKode = lastKode + kode[i];
                                }

                                $(`#input-job-nomor`).val(`${formatKode.substring(0, formatKode.length - lastKode.length) + (parseInt(lastKode) + 1)}/BDKR/${date.toLocaleString('id-ID', { month: 'long' }).toUpperCase()}/${date.getFullYear()}`);
                            } else {
                                $('#input-job-nomor').val(`${formatKode}/BDKR/${date.toLocaleString('id-ID', { month: 'long' }).toUpperCase()}/${date.getFullYear()}`);
                            }

                            generateTable(responseCost.data, responseDetailCost.data);

                            enableMouseClick();
                        });
                    });
                });
            });
        });
    }, []);

    useEffect(() => {
        $('#table-data').DataTable();
    }, [useTable]);

    const generateBiayaLain = () => {
        if (useTotalBiayaLain < 10) {
            let stateTotalBiayaLain = useTotalBiayaLain + 1;

            document.getElementById(`cost-biaya-lain-${stateTotalBiayaLain}`).classList.remove('d-none');
            document.getElementById(`cost-biaya-lain-${stateTotalBiayaLain}`).classList.add('d-flex');

            if (stateTotalBiayaLain > 4) {
                document.getElementById(`cost-btn-hapus-biaya-lain-${useTotalBiayaLain}`).classList.add('d-none')
            }

            if (stateTotalBiayaLain === 10) {
                document.getElementById('cost-btn-tambah-biaya-lain').classList.add('d-none');
            }

            setTotalBiayaLain(stateTotalBiayaLain);
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

    const generateTable = (dataCost, dataDetailCost) => {
        const dataTable = [];

        dataCost.map((data, index) => {
            let selectedNomor = dataDetailCost.find(item => item.nomor === data.nomor);
            let totalPengeluaran = hargaFormat(parseInt(selectedNomor.lolo) + parseInt(selectedNomor.storage) + parseInt(selectedNomor.op_depo) + parseInt(selectedNomor.tambahan_solar) +
                parseInt(selectedNomor.lembur) + parseInt(selectedNomor.gudang) + parseInt(selectedNomor.jalur_merah) + parseInt(selectedNomor.vgm) + parseInt(selectedNomor.tambahan_sopir) +
                parseInt(selectedNomor.cost_biaya_lain_1) + parseInt(selectedNomor.cost_biaya_lain_2) + parseInt(selectedNomor.cost_biaya_lain_3) + parseInt(selectedNomor.cost_biaya_lain_4) +
                parseInt(selectedNomor.cost_biaya_lain_5) + parseInt(selectedNomor.cost_biaya_lain_6) + parseInt(selectedNomor.cost_biaya_lain_7) + parseInt(selectedNomor.cost_biaya_lain_8) +
                parseInt(selectedNomor.cost_biaya_lain_9) + parseInt(selectedNomor.cost_biaya_lain_10))

            dataTable.push(
                <tr key={data.id}>
                    <td className="text-center">{++index}.</td>
                    <td>{data.shipper}</td>
                    <td className="text-end">{totalPengeluaran}</td>
                    <td className="d-flex flex-row gap-2 justify-content-around text-nowrap">
                        <button type="button" id={`btn-ubah-${data.id}`} name={`btn-ubah-${data.id}`} className="btn btn-warning" onClick={() => ubahData(data.id)}><FaEdit /> Ubah</button>
                        <Link to={{ pathname: '/transaksi/cetak-operasional' }} className="btn btn-success" onClick={() => cetakData(data.id)}><FaPrint /> Cetak</Link>
                    </td>
                </tr>
            );
        });

        $('#table-data').DataTable().destroy();

        setTable(dataTable);
    }

    const hapusBiayaLain = () => {
        if (useTotalBiayaLain > 3) {

            if (useTotalBiayaLain === 10) document.getElementById('cost-btn-tambah-biaya-lain').classList.remove('d-none');

            document.getElementById(`cost-biaya-lain-${useTotalBiayaLain}`).classList.add('d-none');
            document.getElementById(`cost-biaya-lain-${useTotalBiayaLain}`).classList.remove('d-flex');

            setInputValue(`cost-input-nama-biaya-lain-${useTotalBiayaLain}`, '');
            setInputValue(`cost-input-cost-biaya-lain-${useTotalBiayaLain}`, '');
            setInputValue(`cost-input-file-biaya-lain-${useTotalBiayaLain}`, '');

            setTotalBiayaLain(useTotalBiayaLain - 1);

            if (useTotalBiayaLain > 4) document.getElementById(`cost-btn-hapus-biaya-lain-${useTotalBiayaLain - 1}`).classList.remove('d-none');

            calculate();
        }
    }

    const ubahData = (id) => {
        document.getElementById('input-job-nomor').focus();

        let cost = useCost.find(item => item.id === id);
        let detailCost = useDetailCost.find(item => item.nomor === cost.nomor);

        setInputValue('input-job-nomor', cost.nomor);
        setInputValue('input-customer', cost.shipper);
        setInputValue('input-consignee', cost.consignee);
        setInputValue('input-no-booking', cost.nomor_booking);
        setInputValue('input-depo', cost.depo);
        setInputValue('input-stuffing-date', cost.tanggal_stuffing);
        setInputValue('input-alamat-stuffing', cost.alamat_stuffing);
        setInputValue('input-jumlah-party', cost.jumlah_party);
        setInputValue('select-ukuran-container', cost.ukuran_container);

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
        setInputValue('input-cost-op-depo', detailCost.op_depo);
        setInputValue('input-cost-solar', detailCost.tambahan_solar);
        setInputValue('input-cost-lembur', detailCost.lembur);
        setInputValue('input-cost-gudang', detailCost.gudang);
        setInputValue('input-cost-jalur-merah', detailCost.jalur_merah);
        setInputValue('input-cost-vgm', detailCost.vgm);
        setInputValue('input-cost-sopir', detailCost.tambahan_sopir);
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

        setTotalBiayaLain(parseInt(detailCost.jumlah_biaya_lain));

        calculate();
    }

    const simpanData = () => {
        // if (checkInputValidity('form-data')) {
        showLoader();

        const formCost = new FormData;

        formCost.append('nomor', getInputValue('input-job-nomor'));
        formCost.append('shipper', getInputValue('input-customer'));
        formCost.append('consignee', getInputValue('input-consignee'));
        formCost.append('nomor_booking', getInputValue('input-no-booking'));
        formCost.append('depo', getInputValue('input-depo'));
        formCost.append('tanggal_stuffing', getInputValue('input-stuffing-date'));
        formCost.append('alamat_stuffing', getInputValue('input-alamat-stuffing'));
        formCost.append('jumlah_party', getInputValue('input-jumlah-party'));
        formCost.append('ukuran_container', getSelectValue('select-ukuran-container'));
        if (document.getElementById('input-container-1')) formCost.append('container_seal_1', getInputValue('input-container-1')); else formCost.append('container_seal_1', '');
        if (document.getElementById('input-container-2')) formCost.append('container_seal_2', getInputValue('input-container-2')); else formCost.append('container_seal_2', '');
        if (document.getElementById('input-container-3')) formCost.append('container_seal_3', getInputValue('input-container-3')); else formCost.append('container_seal_3', '');
        if (document.getElementById('input-container-4')) formCost.append('container_seal_4', getInputValue('input-container-4')); else formCost.append('container_seal_4', '');
        if (document.getElementById('input-container-5')) formCost.append('container_seal_5', getInputValue('input-container-5')); else formCost.append('container_seal_5', '');
        if (document.getElementById('input-container-6')) formCost.append('container_seal_6', getInputValue('input-container-6')); else formCost.append('container_seal_6', '');
        if (document.getElementById('input-container-7')) formCost.append('container_seal_7', getInputValue('input-container-7')); else formCost.append('container_seal_7', '');
        if (document.getElementById('input-container-8')) formCost.append('container_seal_8', getInputValue('input-container-8')); else formCost.append('container_seal_8', '');
        if (document.getElementById('input-container-9')) formCost.append('container_seal_9', getInputValue('input-container-9')); else formCost.append('container_seal_9', '');
        if (document.getElementById('input-container-10')) formCost.append('container_seal_10', getInputValue('input-container-10')); else formCost.append('container_seal_10', '');
        formCost.append('total_cost', getInputValue('total-cost').replace(/\D/g, "").slice(0, -2));

        const formDetailCost = new FormData;

        formDetailCost.append('nomor', getInputValue('input-job-nomor'));
        formDetailCost.append('lolo', getInputValue('input-cost-lolo'));
        formDetailCost.append('storage', getInputValue('input-cost-storage'));
        formDetailCost.append('op_depo', getInputValue('input-cost-op-depo'));
        formDetailCost.append('tambahan_solar', getInputValue('input-cost-solar'));
        formDetailCost.append('lembur', getInputValue('input-cost-lembur'));
        formDetailCost.append('gudang', getInputValue('input-cost-gudang'));
        formDetailCost.append('jalur_merah', getInputValue('input-cost-jalur-merah'));
        formDetailCost.append('vgm', getInputValue('input-cost-vgm'));
        formDetailCost.append('tambahan_sopir', getInputValue('input-cost-sopir'));
        formDetailCost.append('jumlah_biaya_lain', useTotalBiayaLain.toString());
        formDetailCost.append('biaya_lain_1', getInputValue('cost-input-nama-biaya-lain-1'));
        formDetailCost.append('cost_biaya_lain_1', getInputValue('cost-input-cost-biaya-lain-1'));
        formDetailCost.append('biaya_lain_2', getInputValue('cost-input-nama-biaya-lain-2'));
        formDetailCost.append('cost_biaya_lain_2', getInputValue('cost-input-cost-biaya-lain-2'));
        formDetailCost.append('biaya_lain_3', getInputValue('cost-input-nama-biaya-lain-3'));
        formDetailCost.append('cost_biaya_lain_3', getInputValue('cost-input-cost-biaya-lain-3'));
        formDetailCost.append('biaya_lain_4', getInputValue('cost-input-nama-biaya-lain-4'));
        formDetailCost.append('cost_biaya_lain_4', getInputValue('cost-input-cost-biaya-lain-4'));
        formDetailCost.append('biaya_lain_5', getInputValue('cost-input-nama-biaya-lain-5'));
        formDetailCost.append('cost_biaya_lain_5', getInputValue('cost-input-cost-biaya-lain-5'));
        formDetailCost.append('biaya_lain_6', getInputValue('cost-input-nama-biaya-lain-6'));
        formDetailCost.append('cost_biaya_lain_6', getInputValue('cost-input-cost-biaya-lain-6'));
        formDetailCost.append('biaya_lain_7', getInputValue('cost-input-nama-biaya-lain-7'));
        formDetailCost.append('cost_biaya_lain_7', getInputValue('cost-input-cost-biaya-lain-7'));
        formDetailCost.append('biaya_lain_8', getInputValue('cost-input-nama-biaya-lain-8'));
        formDetailCost.append('cost_biaya_lain_8', getInputValue('cost-input-cost-biaya-lain-8'));
        formDetailCost.append('biaya_lain_9', getInputValue('cost-input-nama-biaya-lain-9'));
        formDetailCost.append('cost_biaya_lain_9', getInputValue('cost-input-cost-biaya-lain-9'));
        formDetailCost.append('biaya_lain_10', getInputValue('cost-input-nama-biaya-lain-10'));
        formDetailCost.append('cost_biaya_lain_10', getInputValue('cost-input-cost-biaya-lain-10'));

        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencode, multipart/form-data'
            }
        };

        let checkNomor = useCost.find(item => item.nomor === getInputValue('input-job-nomor'));
        let urlCost = ((checkNomor) ? 'http://emkl-abb.virtusrox.me/api/update/cost.php' : 'http://emkl-abb.virtusrox.me/api/insert/cost.php');
        let urlDetailCost = ((checkNomor) ? 'http://emkl-abb.virtusrox.me/api/update/detail-cost.php' : 'http://emkl-abb.virtusrox.me/api/insert/detail-cost.php')

        axios.post(urlCost, formCost, config).then(responseCost => {
            setLoaderPercentage('loader-percentage', 0, 50);

            axios.post(urlDetailCost, formDetailCost, config).then(responseDetailCost => {
                setLoaderPercentage('loader-percentage', 50, 100);

                setTimeout(() => {
                    document.getElementById('loader-percentage').innerHTML = "Menyimpan Data Berhasil!";
                    window.location.reload();
                }, 1000);

            });
        });
        // }
    }

    return (
        <div className="active content overflow-auto">
            <Loader />
            <p className="fw-bold text-secondary text-size-10">Shipping Instruction Operational</p>
            <p className="text-secondary">Transaksi / <span className="fw-bold primary-text-color">Operasional</span></p>
            <div id="form-data" className="card-form">
                <div className="p-4">
                    <p className="fw-bold py-4 text-size-8 text-center">Shipping Instruction Operational Berdikari</p>
                    <div className="d-flex flex-row flex-wrap">
                        <div className="col-12 col-lg-6">
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-job-nomor" className="col-12 col-lg-4 col-md-2 pb-2 pb-md-0">Job No</label>
                                <div className="col col-lg-8 col-md-10">
                                    <input type="text" id="input-job-nomor" name="input-job-nomor" className="form-control" placeholder="Job No" required readOnly />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-customer" className="col-12 col-lg-4 col-md-2 pb-2 pb-md-0">Shipper/Customer</label>
                                <div className="col col-lg-8 col-md-10">
                                    <input type="text" id="input-customer" name="input-customer" className="form-control" placeholder="Customer" list="customer" autoComplete="off" maxLength={100} />
                                    <datalist id="customer">
                                        {useCustomer.map(data =>
                                            <option key={data.id} value={data.nama}>{data.kode}</option>
                                        )}
                                    </datalist>
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-consignee" className="col-12 col-lg-4 col-md-2 pb-2 pb-md-0">Consignee</label>
                                <div className="col col-lg-8 col-md-10">
                                    <input type="text" id="input-consignee" name="input-consignee" className="form-control" placeholder="Consignee" maxLength={100} required />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-no-booking" className="col-12 col-lg-4 col-md-2 pb-2 pb-md-0">No Booking</label>
                                <div className="col col-lg-8 col-md-10">
                                    <input type="text" id="input-no-booking" name="input-no-booking" className="form-control" placeholder="No Booking" maxLength={30} required />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-depo" className="col-12 col-lg-4 col-md-2 pb-2 pb-md-0">DEPO</label>
                                <div className="col col-lg-8 col-md-10">
                                    <input type="text" id="input-depo" name="input-depo" className="form-control" placeholder="DEPO" maxLength={30} required />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-stuffing-date" className="col-12 col-lg-4 col-md-2 pb-2 pb-md-0">Tanggal Stuffing</label>
                                <div className="col col-lg-8 col-md-10">
                                    <input type="date" id="input-stuffing-date" name="input-stuffing-date" className="form-control" placeholder="Stuffing Date" defaultValue={today()} required />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-alamat-stuffing" className="col-12 col-lg-4 col-md-2 pb-2 pb-md-0">Alamat Stuffing</label>
                                <div className="col col-lg-8 col-md-10">
                                    <input type="text" id="input-alamat-stuffing" name="input-alamat-stuffing" className="form-control" placeholder="Alamat Stuffing" required />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 ps-lg-4">
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-party" className="col-12 col-lg-4 col-md-2 pb-2 pb-md-0">Party</label>
                                <div className="col-2 col-md-1">
                                    <input type="text" id="input-jumlah-party" name="input-jumlah-party" className="form-control text-center" placeholder="0" onInput={generateContainer} />
                                </div>
                                <div className="px-4">x</div>
                                <div className="col-2 col-lg-4">
                                    <select name="select-ukuran-container" id="select-ukuran-container" className="form-select">
                                        {useUkuranContainer.length > 0 ? useUkuranContainer.map(data =>
                                            <option key={data.id} value={data.nama}>{data.nama}</option>
                                        ) :
                                            <option value="">-- Tidak Ada Data Ukuran Container --</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="container" className="col-12 col-lg-4 col-md-2 col-form-label pb-2 pb-md-0">Container / Seal</label>
                                <div id="container" className="align-items-center col">
                                    <input type="text" id="input-container-0" name="input-container" className="form-control mb-2" placeholder="Container / Seal" disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                    <label htmlFor="surcharge" className="col-12 pb-2 pb-md-0 fw-bold pt-4">Surcharge</label>
                    <div className="d-flex flex-row flex-wrap">
                        <div className="col-12 col-md-6">
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-lolo" className="col-12 col-lg-4 col-md-4 pb-2 pb-md-0">LOLO</label>
                                <div className="col-12 col-lg-8 col-md-8">
                                    <input type="text" id="input-cost-lolo" name="input-cost-lolo" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-storage" className="col-12 col-lg-4 col-md-4 pb-2 pb-md-0">Storage</label>
                                <div className="col-12 col-lg-8 col-md-8">
                                    <input type="text" id="input-cost-storage" name="input-cost-storage" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-op-depo" className="col-12 col-lg-4 col-md-4 pb-2 pb-md-0">OP Depo</label>
                                <div className="col-12 col-lg-8 col-md-8">
                                    <input type="text" id="input-cost-op-depo" name="input-cost-op-depo" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-solar" className="col-12 col-lg-4 col-md-4 pb-2 pb-md-0">Tambahan Solar</label>
                                <div className="col-12 col-lg-8 col-md-8">
                                    <input type="text" id="input-cost-solar" name="input-cost-solar" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-lembur" className="col-12 col-lg-4 col-md-4 pb-2 pb-md-0">Lembur</label>
                                <div className="col-12 col-lg-8 col-md-8">
                                    <input type="text" id="input-cost-lembur" name="input-cost-lembur" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 ps-md-4">
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-gudang" className="col-12 col-lg-4 col-md-4 pb-2 pb-md-0 ps-0">Gudang</label>
                                <div className="col-12 col-lg-8 col-md-8">
                                    <input type="text" id="input-cost-gudang" name="input-cost-gudang" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-jalur-merah" className="col-12 col-lg-4 col-md-4 pb-2 pb-md-0 ps-0">Jalur Merah/PBB</label>
                                <div className="col-12 col-lg-8 col-md-8">
                                    <input type="text" id="input-cost-jalur-merah" name="input-cost-jalur-merah" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-vgm" className="col-12 col-lg-4 col-md-4 pb-2 pb-md-0 ps-0">VGM</label>
                                <div className="col-12 col-lg-8 col-md-8">
                                    <input type="text" id="input-cost-vgm" name="input-cost-vgm" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-cost-sopir" className="col-12 col-lg-4 col-md-4 pb-2 pb-md-0 ps-0">Tambahan Sopir</label>
                                <div className="col-12 col-lg-8 col-md-8">
                                    <input type="text" id="input-cost-sopir" name="input-cost-sopir" className="cost form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="cost-form-biaya-lain" className="col-12 col-md-6 pe-md-2">
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <p className="col-form-label fw-bold">Biaya Lain-Lain</p>
                            <button type="button" id="cost-btn-tambah-biaya-lain" className="btn btn-sm primary-color mx-2" onClick={generateBiayaLain}><FaPlus className="text-white" /></button>
                        </div>
                        <div id="cost-input-biaya-lain">
                            <div id="cost-biaya-lain-1" className="align-items-center d-flex flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-1" name="cost-input-nama-biaya-lain-1" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-1" name="cost-input-cost-biaya-lain-1" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-1" className="btn btn-sm d-none btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-2" className="align-items-center d-flex flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-2" name="cost-input-nama-biaya-lain-2" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-2" name="cost-input-cost-biaya-lain-2" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-2" className="btn btn-sm d-none btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-3" className="align-items-center d-flex flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-3" name="cost-input-nama-biaya-lain-3" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-3" name="cost-input-cost-biaya-lain-3" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-3" className="btn btn-sm d-none btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-4" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-4" name="cost-input-nama-biaya-lain-4" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-4" name="cost-input-cost-biaya-lain-4" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-4" className="btn btn-sm btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-5" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-5" name="cost-input-nama-biaya-lain-5" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-5" name="cost-input-cost-biaya-lain-5" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-5" className="btn btn-sm btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-6" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-6" name="cost-input-nama-biaya-lain-6" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-6" name="cost-input-cost-biaya-lain-6" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-6" className="btn btn-sm btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-7" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-7" name="cost-input-nama-biaya-lain-7" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-7" name="cost-input-cost-biaya-lain-7" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-7" className="btn btn-sm btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-8" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-8" name="cost-input-nama-biaya-lain-8" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-8" name="cost-input-cost-biaya-lain-8" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-8" className="btn btn-sm btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-9" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-9" name="cost-input-nama-biaya-lain-9" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-9" name="cost-input-cost-biaya-lain-9" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-9" className="btn btn-sm btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                            <div id="cost-biaya-lain-10" className="align-items-center d-none flex-wrap pb-2 px-0">
                                <div className="align-items-center col d-flex flex-wrap px-0">
                                    <div className="col-6 col-md-4 pe-2">
                                        <input type="text" id="cost-input-nama-biaya-lain-10" name="cost-input-nama-biaya-lain-10" className="form-control" placeholder="Nama Biaya" />
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <input type="text" id="cost-input-cost-biaya-lain-10" name="cost-input-cost-biaya-lain-10" className="cost-biaya-lain form-control text-end" placeholder="Rp. 0,00" onInput={calculateTotal} />
                                    </div>
                                </div>
                                <div className="col-auto px-0">
                                    <button type="button" id="cost-btn-hapus-biaya-lain-10" className="btn btn-sm btn-danger mx-2" onClick={hapusBiayaLain}><FaMinus className="text-white" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <p className="col-12 col-lg-2 col-md-4 col-form-label fw-bold primary-text-color">Total Cost</p>
                        <div className="col-12 col-lg-4 col-md-8">
                            <input type="text" id="total-cost" name="total-cost" className="form-control text-end" placeholder="Rp. 0,00" readOnly />
                        </div>
                    </div>
                    <div className="d-flex flex-row flex-wrap justify-content-evenly pt-5">
                        <div className="pb-3 pb-md-2 px-0 text-center">
                            <p className="col-form-label fw-bold pb-5">Mengetahui</p>
                            <p className="col-form-label fw-bold">Semarang</p>
                        </div>
                        <div className="pb-3 pb-md-2 px-0 text-center">
                            <p className="col-form-label fw-bold pb-5">Finance Manager</p>
                            <p className="col-form-label fw-bold">OPS Manager</p>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Simpan" onClick={simpanData} />
                    <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Bersihkan" />
                </div>
            </div>
            <div className="card-form my-5 p-4">
                <div className="table-responsive">
                    <table id="table-data" className="table table-bordered table-hover table-striped w-100">
                        <thead className="align-middle text-center text-nowrap">
                            <tr>
                                <th>No Job</th>
                                <th>Nama Customer</th>
                                <th>Total Pengeluaran</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle">
                            {useTable}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default Operasional