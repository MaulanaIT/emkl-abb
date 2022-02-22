import { Component } from 'react'
import { FaCheck } from 'react-icons/fa'

import $ from 'jquery';

export class PersetujuanMarketing extends Component {

    componentDidMount() {
        $(document).ready(function() {
            $('#table-data').DataTable();
                
            $('input').on('input', function() {
                $(this).val($(this).val().replace(/['"]/gi, ''));
            });
        });
    }

    render() {
        return (
            <div className="active content overflow-auto">
                <p className="fw-bold text-secondary text-size-10">Persetujuan Marketing</p>
                <p className="text-secondary">Master / <span className="fw-bold primary-text-color">Persetujuan Marketing</span></p>
                <div className="card-form my-5">
                    <div className="table-responsive p-4">
                        <table id="table-data" className="table table-bordered table-hover table-striped w-100">
                            <thead className="align-middle text-center text-nowrap">
                                <tr>
                                    <th>No.</th>
                                    <th>Job Number</th>
                                    <th>Company Name</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle">
                                <tr>
                                    <td className="text-center">1.</td>
                                    <td>Job/Nomor/Tahun</td>
                                    <td>ABB</td>
                                    <td>
                                        <div className="d-flex gap-1 justify-content-center">
                                            <button id="button-belum-proses" className="btn btn-secondary col col-md-6 text-white">Belum Diproses</button>
                                            <button id="button-sudah-proses" className="btn btn-success col col-md-6 d-none text-white">Sudah Diproses</button>
                                            <button id="button-setujui" className="btn btn-danger col col-md-2 text-white"><FaCheck /> Acc</button>
                                            <button id="button-disetujui" className="btn btn-success col col-md-2 d-none"><FaCheck /></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default PersetujuanMarketing
