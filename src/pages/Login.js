import { getInputValue } from '../components/Helper';
import Logo from '../image/abb-2.png';

import SHA256 from 'crypto-js/sha256';
import axios from 'axios';

const Login = () => {

    const login = () => {
        let username = getInputValue('input-username');
        let password = getInputValue('input-password');

        let hashPassword = SHA256(password, 'key');
        
        axios.get('http://emkl-abb.virtusrox.me/api/select/users.php').then(responseUsers => {
            if (responseUsers.data.length <= 0) return;

            let checkUsername = responseUsers.data.find(item => item.username.toLowerCase() === username.toLowerCase());

            if (!checkUsername) return;

            let checkPassword = checkUsername.password === hashPassword.toString();

            if (checkPassword) {
                localStorage.setItem("login", JSON.stringify({
                    Username: username,
                    Password: hashPassword.toString(),
                    Role: checkUsername.role
                }))
                window.location.href = '/dashboard';
            }
        });
    }

        return (
            <div className="bg-white vh-100 vw-100">
                <div className="container-login">
                    <img src={Logo} className='backgroundImage' alt='...' />
                    <form className="card-form">
                        <div className="p-4">
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-username">Username</label>
                                <div className="col-12">
                                    <input type="text" name="input-username" id="input-username" className="form-control" maxLength={20} placeholder="Username" />
                                </div>
                            </div>
                            <div className="align-items-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <label htmlFor="input-password">Password</label>
                                <div className="col-12">
                                    <input type="password" name="input-password" id="input-password" className="form-control" placeholder="Password" />
                                </div>
                            </div>
                            <div className="text-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <input type="button" className="btn col-12 primary-color text-white" value="Login" onClick={login} />
                            </div>
                            {/* <div className="text-center d-flex flex-wrap pb-3 pb-md-2 px-0">
                                <input type="button" className="bg-secondary btn col-12 text-white" value="Register" />
                            </div> */}
                        </div>
                    </form>
                </div>
            </div>
        )
}

export default Login