const LoadingScreen = () => {
    return (
        <div id="loading-screen" className="loading-overlay d-none">
            <div className="popup-loader">
                <div className="col-12 d-flex flex-row flex-wrap justify-content-center pb-2">
                    <div className="loader"></div>
                </div>
                <div className="loader-percentage">Loading Data...</div>
            </div>
        </div>
    );
}

export default LoadingScreen