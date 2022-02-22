import React, { Component } from 'react';

class Loader extends Component {
    render() {
        return (
            <div id="loader" className="overlay d-none">
                <div className="popup-loader">
                    <div className="col-12 d-flex flex-row flex-wrap justify-content-center pb-2">
                        <div className="loader"></div>
                    </div>
                    <div id="loader-percentage" className="loader-percentage">Menyimpan Data 0%</div>
                </div>
            </div>
        );
    }
}

export default Loader;