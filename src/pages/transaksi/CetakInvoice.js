import { useEffect, useState } from 'react';
import { disableMouseClick, enableMouseClick, getInputValue, hargaFormat, inputNumber, setInputValue } from '../../components/Helper';

import Logo from '../../image/logo.png';

import $ from 'jquery';
import axios from 'axios';

const CetakInvoice = () => {
    const [table, setTable] = useState([]);

    useEffect(() => {
        disableMouseClick();


        axios.get('http://emkl-abb.virtusrox.me/api/select/data-office.php').then(responseDataOffice => {
            document.getElementById('text-alamat').innerHTML = responseDataOffice.data.find(item => item.item === 'Alamat').data;
            document.getElementById('text-fax').innerHTML = responseDataOffice.data.find(item => item.item === 'Fax').data;
            document.getElementById('text-email').innerHTML = responseDataOffice.data.find(item => item.item === 'Email').data;
            document.getElementById('text-footer').innerHTML = responseDataOffice.data.find(item => item.item === 'Footer Invoice').data;

            axios.get('http://emkl-abb.virtusrox.me/api/select/detail-cost.php').then(responseDetailCost => {
                axios.get('http://emkl-abb.virtusrox.me/api/select/customer.php').then(responseCustomer => {
                    axios.get('http://emkl-abb.virtusrox.me/api/select/sales.php').then(responseSales => {
                        axios.get('http://emkl-abb.virtusrox.me/api/select/detail-transaksi.php').then(responseDetailTransaksi => {
                            setInputValue('input-job-nomor', sessionStorage.getItem('nomor'));
                            setInputValue('input-invoice-date', sessionStorage.getItem('date'));
                            setInputValue('input-fax', sessionStorage.getItem('fax'));

                            $('input').on('input', function () {
                                $(this).val($(this).val().replace(/['"]/gi, ''));
                            });

                            let customer = responseCustomer.data;
                            let daftarTransaksi = responseDetailTransaksi.data;
                            let sales = responseSales.data;

                            let dataTable = [];
                            let jobNomor = getInputValue('input-job-nomor').replace(new RegExp('/', 'g'), '-');

                            let filterTransaksi = daftarTransaksi.filter(item => item.nomor === jobNomor);

                            if (filterTransaksi.length === 0) {
                                setTable(dataTable);

                                return;
                            }

                            let filterCustomer = customer.filter(item => item.nama === filterTransaksi[0].customer);

                            setInputValue('input-invoice-date', filterTransaksi[0].tanggal);
                            setInputValue('input-bill-to', filterTransaksi[0].customer);
                            setInputValue('input-alamat', (filterCustomer[0].alamat === '') ? sessionStorage.getItem('alamat') : filterCustomer[0].alamat);
                            setInputValue('input-email', (filterCustomer[0].email === '') ? sessionStorage.getItem('email') : filterCustomer[0].email);
                            setInputValue('input-consignee', filterTransaksi[0].consignee);
                            setInputValue('input-jumlah-party', filterTransaksi[0].jumlah_party);
                            setInputValue('input-ukuran-party', filterTransaksi[0].ukuran_party);
                            setInputValue('input-invoice-for', `${filterTransaksi[0].container_seal_1} - ${filterTransaksi[0].jumlah_party}/${filterTransaksi[0].ukuran_party} - ${filterTransaksi[0].destination}`);

                            let filterSales = sales.filter(item => item.nomor === jobNomor);

                            if (filterSales.length === 0) {
                                setTable(dataTable);

                                return;
                            }

                            let totalPrice = 0;
                            let totalQuantity = 0;

                            filterSales.forEach(itemDaftar => {
                                let price = itemDaftar.unit_price * itemDaftar.quantity - itemDaftar.discount;
                                let item = ((itemDaftar.item.includes('biaya_lain_')) ? responseDetailCost.data.find(item => item.nomor === jobNomor)[itemDaftar.item] : itemDaftar.item);

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

                            document.getElementById('total-quantity').innerHTML = totalQuantity.toString();
                            document.getElementById('total-price').innerHTML = hargaFormat(totalPrice);

                            setTable(dataTable);
                            enableMouseClick();
                            print();
                        });
                    });
                });
            });
        });
    }, []);

    const print = () => {
        var ifr = document.createElement('iframe');

        ifr.style.background = "white";
        ifr.style.height = "100vh";
        ifr.style.width = "100vw";
        document.body.appendChild(ifr);

        $('#form').clone().appendTo(ifr.contentDocument.body);

        ifr.contentWindow.print();
    }

    return (
        <div id="form" style={{ padding: "10px" }}>
            <div style={{ background: 'white', paddingBottom: '10px', paddingTop: '10px' }}>
                <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                    <img src={Logo} alt="..." width="100" />
                    <div style={{ fontWeight: 'bold' }}>PT ADIL BERKAH BERDIKARI</div>
                </div>
                <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', paddingTop: '10px' }}>
                    <div style={{ width: '50%' }}><span id="text-alamat"></span></div>
                    <div style={{ width: '50%' }}>Fax : <span id="text-fax"></span><br />Email : <span id="text-email"></span></div>
                </div>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0' }}>
                <label htmlFor="input-job-nomor" style={{ paddingBottom: '5px', width: '25%' }}>Job No.</label>
                <div style={{ width: '75%' }}>
                    <input type="text" id="input-job-nomor" name="input-job-nomor" style={{ background: 'white', border: 'none', padding: '5px', width: '100%' }} placeholder="Job No." disabled />
                </div>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0' }}>
                <label htmlFor="input-invoice-date" style={{ paddingBottom: '5px', width: '25%' }}>Invoice Date</label>
                <div style={{ width: '75%' }}>
                    <input type="date" id="input-invoice-date" name="input-invoice-date" style={{ background: 'white', border: 'none', padding: '5px', width: '100%' }} placeholder="Nomor Faktur" disabled />
                </div>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0' }}>
                <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0', width: '50%' }}>
                    <label htmlFor="input-bill-to" style={{ paddingBottom: '5px', width: '50%' }}>Bill To</label>
                    <div style={{ width: '50%' }}>
                        <input type="text" id="input-bill-to" name="input-bill-to" style={{ background: 'white', border: 'none', padding: '5px', width: '100%' }} placeholder="Customer" disabled />
                    </div>
                </div>
                <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0', width: '50%' }}>
                    <label htmlFor="input-fax" style={{ paddingBottom: '5px', width: '50%' }}>Fax</label>
                    <div style={{ width: '50%' }}>
                        <input type="text" id="input-fax" name="input-fax" style={{ background: 'white', border: 'none', padding: '5px', width: '100%' }} placeholder="Fax" disabled />
                    </div>
                </div>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0' }}>
                <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0', width: '50%' }}>
                    <label htmlFor="input-alamat" style={{ paddingBottom: '5px', width: '50%' }}>Alamat</label>
                    <div style={{ width: '50%' }}>
                        <input type="text" id="input-alamat" name="input-alamat" style={{ background: 'white', border: 'none', padding: '5px', width: '100%' }} placeholder="Alamat" disabled />
                    </div>
                </div>
                <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0', width: '50%' }}>
                    <label htmlFor="input-email" style={{ paddingBottom: '5px', width: '50%' }}>Email</label>
                    <div style={{ width: '50%' }}>
                        <input type="text" id="input-email" name="input-email" style={{ background: 'white', border: 'none', padding: '5px', width: '100%' }} placeholder="Email" disabled />
                    </div>
                </div>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0' }}>
                <label htmlFor="input-consignee" style={{ paddingBottom: '5px', width: '25%' }}>Consignee</label>
                <div style={{ width: '75%' }}>
                    <input type="text" id="input-consignee" name="input-consignee" style={{ background: 'white', border: 'none', padding: '5px', width: '100%' }} placeholder="Consignee" maxLength={100} disabled />
                </div>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0' }}>
                <label htmlFor="input-jumlah-party" style={{ paddingBottom: '5px', width: '25%' }}>Party</label>
                <div style={{ width: '5%' }}>
                    <input type="text" id="input-jumlah-party" name="input-jumlah-party" style={{ background: 'white', border: 'none', textAlign: 'center', padding: '5px', width: '100%' }} placeholder="0" onInput={inputNumber} disabled />
                </div>
                <div style={{ paddingLeft: '10px', paddingRight: '10px', width: 'auto' }}>x</div>
                <div style={{ width: '5%' }}>
                    <input type="text" id="input-ukuran-party" name="input-ukuran-party" style={{ background: 'white', border: 'none', textAlign: 'center', padding: '5px', width: '100%' }} placeholder="0" onInput={inputNumber} disabled />
                </div>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', paddingBottom: '5px', paddingLeft: '0', paddingRight: '0' }}>
                <label htmlFor="input-invoice-for" style={{ paddingBottom: '5px', width: '25%' }}>Invoice For</label>
                <div style={{ width: '50%' }}>
                    <input type="text" id="input-invoice-for" name="input-invoice-for" style={{ background: 'white', border: 'none', padding: '5px', width: '100%' }} placeholder="Invoice For" maxLength={30} disabled />
                </div>
            </div>
            <div style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                <table id="table-data" style={{ whiteSpace: 'nowrap', width: '100%' }}>
                    <thead style={{ textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody id="table-data-body" style={{ verticalAlign: 'middle' }}>
                        {table.map((data, index) =>
                            <tr key={++index}>
                                <td>{data.item.replace(new RegExp('_', 'g'), ' ')}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div id={`data-quantity-${data.nomor}`}>{data.quantity}</div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div id={`data-unit-price-${data.nomor}`}>Rp. {data.unit_price},00</div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div id={`data-price-${data.nomor}`}>Rp. {data.total_price},00</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tr style={{ textAlign: 'center' }}>
                        <td style={{ fontWeight: 'bold', paddingTop: '10px', paddingBottom: '10px' }}>Total</td>
                        <td id="total-quantity" style={{ fontWeight: 'bold' }}></td>
                        <td style={{ fontWeight: 'bold' }}></td>
                        <td id="total-price" style={{ fontWeight: 'bold' }}></td>
                        <td style={{ fontWeight: 'bold' }}></td>
                    </tr>
                </table>
            </div>
            <div style={{ paddingTop: '5px' }}>
                <div style={{ paddingBottom: '5px' }}><span id="text-footer"></span></div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'right', paddingBottom: '5px', paddingTop: '5px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'right', width: '100%' }}>
                    <label style={{ paddingBottom: '40px', width: '25%' }}>For and On Behalf of</label>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'right', width: '100%' }}>
                    <label style={{ width: '25%' }}>LILYK N</label>
                </div>
            </div>
        </div>
    )
}

export default CetakInvoice
