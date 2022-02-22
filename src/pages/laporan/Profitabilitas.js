import { useEffect, useState } from 'react';
import { disableMouseClick, enableMouseClick, getInputValue, getSelectText, getSelectValue, hargaFormat, setInputValue, today } from '../../components/Helper';

import axios from 'axios';

const Profitabilitas = () => {

    const [customer, setCustomer] = useState([]);
    const [detailTransaksi, setDetailTransaksi] = useState([]);
    const [sales, setSales] = useState([]);

    useEffect(() => {
        disableMouseClick();

        axios.get('http://emkl-abb.virtusrox.me/api/select/customer.php').then(responseCustomer => {
            if (responseCustomer.data.length > 0)
                setCustomer(responseCustomer.data);

            axios.get('http://emkl-abb.virtusrox.me/api/select/detail-transaksi.php').then(responseDetailTransaksi => {
                if (responseDetailTransaksi.data.length > 0)
                    setDetailTransaksi(responseDetailTransaksi.data);

                axios.get('http://emkl-abb.virtusrox.me/api/select/detail-transaksi.php').then(responseSales => {
                    if (responseSales.data.length > 0)
                        setSales(responseSales.data);

                    enableMouseClick();
                });
            });
        });
    }, []);

    const chooseType = (event) => {
        if (event.target.value === "Periode") {
            document.getElementById("field-periode").classList.remove('d-none');
            document.getElementById("field-periode").classList.add('d-flex');
            document.getElementById("field-customer").classList.add('d-none');
            document.getElementById("field-job").classList.add('d-none');
        } else if (event.target.value === "Customer") {
            document.getElementById("field-customer").classList.remove('d-none');
            document.getElementById("field-customer").classList.add('d-flex');
            document.getElementById("field-periode").classList.add('d-none');
            document.getElementById("field-job").classList.add('d-none');
        } else if (event.target.value === "Job") {
            document.getElementById("field-job").classList.remove('d-none');
            document.getElementById("field-job").classList.add('d-flex');
            document.getElementById("field-customer").classList.add('d-none');
            document.getElementById("field-periode").classList.add('d-none');
        } else {
            document.getElementById("field-periode").classList.add('d-none');
            document.getElementById("field-customer").classList.add('d-none');
            document.getElementById("field-job").classList.add('d-none');
        }
    }

    const cekLaporan = () => {
        let filter = getSelectValue('select-filter');

        let totalCost = 0;
        let totalProfit = 0;

        if (filter === '' || filter === null) {
            setInputValue('input-pendapatan', hargaFormat(totalCost + totalProfit));
            setInputValue('input-hpp', hargaFormat(totalCost));
            setInputValue('input-profitabilitas', hargaFormat(totalProfit));

            return;
        };

        if (filter === 'Periode') {
            let tanggalAwal = new Date(getInputValue('input-tanggal-awal'));
            let tanggalAkhir = new Date(getInputValue('input-tanggal-akhir'));

            let filterDetailTransaksi = detailTransaksi.filter(item => {
                let date = new Date(item.updated_at);

                if (date.getTime() >= tanggalAwal.getTime() && date.getTime() <= tanggalAkhir.getTime()) return item;
            });

            console.log(filterDetailTransaksi);

            if (filterDetailTransaksi.length > 0) {
                filterDetailTransaksi.map(item => {
                    totalCost += parseInt(item.total_cost);
                    totalProfit += parseInt(item.profit);
                });
            }
        } else if (filter === 'Customer') {
            let namaCustomer = getSelectText('select-customer');

            let filterDetailTransaksi = detailTransaksi.filter(item => item.customer === namaCustomer);

            let result = [];

            filterDetailTransaksi.map(data => detailTransaksi.filter(item => item.nomor === data.nomor && result.push(item)));

            if (result.length > 0) {
                result.forEach(item => {
                    totalCost += parseInt(item.total_cost);
                    totalProfit += parseInt(item.profit);
                });
            }
        } else if (filter === 'Job') {
            let nomor = getInputValue('input-job-nomor');

            let filterDetailTransaksi = detailTransaksi.filter(item => item.nomor === nomor.replace(new RegExp('/', 'g'), '-'));

            if (filterDetailTransaksi.length > 0) {
                filterDetailTransaksi.map(item => {
                    totalCost += parseInt(item.total_cost);
                    totalProfit += parseInt(item.profit);
                });
            }
        }

        setInputValue('input-pendapatan', hargaFormat(totalCost + totalProfit));
        setInputValue('input-hpp', hargaFormat(totalCost));
        setInputValue('input-profitabilitas', hargaFormat(totalProfit));
    }

    return (
        <div className="active content overflow-auto">
            <p className="fw-bold text-secondary text-size-10">Laporan Profitabilitas</p>
            <p className="text-secondary">Laporan / <span className="fw-bold primary-text-color">Laporan Profitabilitas</span></p>
            <form className="card-form">
                <div className="p-4">
                    <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="select-filter" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Laporan Berdasarkan</label>
                        <div className="col col-lg-3 col-md-6" >
                            <select name="select-filter" id="select-filter" className="form-select" onChange={chooseType}>
                                <option value="">Pilih Laporan Berdasarkan</option>
                                <option value="Periode">Periode</option>
                                <option value="Customer">Customer</option>
                                <option value="Job">Job No</option>
                            </select>
                        </div>
                    </div>
                    <div id="field-periode" className="align-items-center d-none flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="input-tanggal-awal" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Tanggal</label>
                        <div className="col col-lg-2 col-md-4">
                            <input type="date" id="input-tanggal-awal" name="input-tanggal-awal" className="form-control" placeholder="dd/mm/yyyy" defaultValue={today()} required />
                        </div>
                        <label htmlFor="input-tanggal-akhir" className="col-auto px-4 pb-2 pb-md-0 text-center text-nowrap">s/d</label>
                        <div className="col col-lg-2 col-md-4">
                            <input type="date" id="input-tanggal-akhir" name="input-tanggal-akhir" className="form-control" placeholder="dd/mm/yyyy" defaultValue={today()} required />
                        </div>
                    </div>
                    <div id="field-customer" className="align-items-center d-none flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="select-customer" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Nama Customer</label>
                        <div className="col">
                            <select name="select-customer" id="select-customer" className="form-select">
                                {customer.length > 0 ? customer.map(data =>
                                    <option key={data.id} value={data.kode}>{data.nama}</option>
                                ) :
                                    <option value="">-- Tidak Ada Data Customer --</option>
                                }
                            </select>
                        </div>
                    </div>
                    <div id="field-job" className="align-items-center d-none flex-wrap pb-3 pb-md-2 px-0">
                        <label htmlFor="job-nomor" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Job No</label>
                        <div className="col">
                            <input type="text" name="input-job-nomor" id="input-job-nomor" list="job-nomor" className="form-control" required />
                            <datalist id="job-nomor">
                                {detailTransaksi.length > 0 ? detailTransaksi.map(data =>
                                    <option key={data.id} value={data.nomor.replace(new RegExp('-', 'g'), '/')}>{data.nomor.replace(new RegExp('-', 'g'), '/')}</option>
                                ) :
                                    <option value="">-- Tidak Ada Data Transaksi --</option>
                                }
                            </datalist>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <input type="button" className="btn col-6 primary-color text-white" style={{ borderRadius: '0px 0px 0px 20px' }} value="Cek Laporan" onClick={cekLaporan} />
                    <input type="reset" className="btn col-6 btn-danger" style={{ borderRadius: '0px 0px 20px 0px' }} value="Bersihkan" />
                </div>
            </form>
            <div className="card-form my-5">
                <div className="card-form">
                    <div className="p-4">
                        <div className="fs-4 fw-bold m-0 pb-4 text-center">PT ADIL BERKAH BERDIKARI<br />LAPORAN PROFITABILITAS</div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-pendapatan" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Pendapatan</label>
                            <div className="col">
                                <input type="text" id="input-pendapatan" name="input-pendapatan" className="form-control" placeholder="Harga jual yang ditawarkan kepada customer" maxLength={100} readOnly />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-hpp" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Harga Pokok Penjualan</label>
                            <div className="col">
                                <input type="text" id="input-hpp" name="input-hpp" className="form-control" placeholder="Harga perolehan dari vendor" maxLength={100} readOnly />
                            </div>
                        </div>
                        <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                            <label htmlFor="input-profitabilitas" className="col-12 col-lg-2 col-md-3 pb-2 pb-md-0">Profitabilitas</label>
                            <div className="col">
                                <input type="text" id="input-profitabilitas" name="input-profitabilitas" className="form-control" placeholder="Selisih antara Harga Jual dan HPP" maxLength={100} readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profitabilitas

