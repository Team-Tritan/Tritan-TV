import React, { Component } from 'react';
import '../config/config.json';
import {api} from  '../css/Login.css';

class LoginForm extends Component {
    state = {  }

    registerSubmit = () => {

        let data = {
            username: document.getElementById('username').nodeValue
        }
        /*
        fetch(api+"/oauth2/register", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }) */
    }

    render() { 
        return (
            <div className='wrapper'>
                <div className='content'>
                    <div className='classy-box box-shadow'>
                        <div className="login-form">
                            <h1>Create a new Tritan account.</h1>
                            <input className="input-fields" id='username' placeholder="Username"></input>
                            <input className="input-fields" id='email' placeholder="Email"></input>
                            <input className="input-fields" id='password' placeholder="Password"></input>
                            <button className="submit-button">Register ></button>
                        </div>
                    </div>
                </div>
            </div>
          );
    }
}
 
export default LoginForm;