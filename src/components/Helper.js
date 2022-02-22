export const checkInputValidity = (form) => {
    let result = false;

    let input = document.getElementById(form).querySelectorAll('input[required]');

    if (input.length === 0) return result;

    let i = 0, lenInput = input.length;
    while (i < lenInput) {
        if (!input[i].checkValidity()) {
            input[i].focus();
            result = false;

            break;
        }

        result = true;

        i++;
    }

    if (result === false) return result;

    let select = document.getElementById(form).querySelectorAll('select[required]');

    if (select.length === 0) return result;

    let j = 0, lenSelect = select.length;
    while (j < lenSelect) {
        if (!select[j].checkValidity()) {
            select[j].focus();
            result = false;

            break;
        }

        result = true;

        j++;
    }

    return result;
}

export const disableMouseClick = () => {
    const root = document.getElementById('root');
    const loadingScreen = document.getElementById('loading-screen')

    root.style.pointerEvents = 'none';
    loadingScreen.classList.remove('d-none');
    loadingScreen.classList.add('active');
}

export const enableMouseClick = () => {
    const root = document.getElementById('root');
    const loadingScreen = document.getElementById('loading-screen')

    root.style.pointerEvents = 'auto';
    loadingScreen.classList.remove('active');
    setTimeout(() => {
        loadingScreen.classList.add('d-none');
    }, 500);
}

export const getInputValue = (id) => { if (document.getElementById(id)) return document.getElementById(id).value };

export const getInputFiles = (id) => { if (document.getElementById(id)) return document.getElementById(id).files[0] };

export const getMonthName = (date) => {
    return date.toLocaleString('id-ID', { month: 'long' });
}

export const getSelectValue = (id) => { if (document.getElementById(id)) return document.getElementById(id).value };

export const getSelectText = (id) => {
    const select = document.getElementById(id);
    return select.options[select.selectedIndex].text;
}

export const hargaFormat = (harga) => {
    if (harga === '0' || harga === null) return 'Rp. 0,00';

    let reverse = harga.toString().split('').reverse().join('');
    let ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');

    if (harga < 0) return 'Rp. -' + ribuan + ',00';
    return 'Rp. ' + ribuan + ',00';
}

export const hideLoader = () => {
    document.getElementById('loader').classList.add('d-none');
}

export const inputNumber = (event) => {
    document.getElementById(event.target.id).value = event.target.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');
}

export const setInputValue = (id, value) => { if (document.getElementById(id)) return document.getElementById(id).value = value };

export const setLoaderPercentage = (id, start, end) => {
    let i = start;
    
    function loop() {
        document.getElementById(id).innerHTML = `Menyimpan Data ${i}%`;

        setTimeout(() => {
            i++;

            if (i <= end) loop();
        }, 8);
    }

    loop();
}

export const setSelectValue = (id, value) => { if (document.getElementById(id)) return document.getElementById(id).value = value };

export const showLoader = () => {
    document.getElementById('loader').classList.remove('d-none');
}

export const stateTypeRedux = {
    ADD_JOB_NOMOR: 'ADD_JOB_NOMOR',
    ADD_CURRENT_MENU: 'ADD_CURRENT_MENU'
}

export const stateAddCurrentMenu = (menu) => {
    return {
        type: stateTypeRedux.ADD_CURRENT_MENU,
        menu: menu
    }
}

export const stateAddJobNomor = (nomor) => {
    return {
        type: stateTypeRedux.ADD_JOB_NOMOR,
        nomor: nomor
    }
}

export const today = () => {
    let date = new Date();

    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    return `${year}-${month}-${day}`;
}