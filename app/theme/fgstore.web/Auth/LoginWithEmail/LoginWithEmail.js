import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CryptoJS from 'crypto-js';
import { useRecoilState, useSetRecoilState } from 'recoil';
// import { productListApiCall } from '../../../../Utils/API/ProductListAPI';
import {  toast } from 'react-toastify';
import './LoginWithEmail.modul.scss'
// import { DesignSet } from '../../../../Utils/API/DesignSet';
// import { GetCount } from '../../../../Utils/API/GetCount';
// import { getDesignPriceList } from '../../../../Utils/API/PriceDataApi';
import Footer from '../../Home/Footer/Footer';
import { LoginWithEmailAPI } from '../../../../../../utils/API/Auth/LoginWithEmailAPI';
// import { CommonAPI } from '../../../../../../utils/API/CommonAPI/CommonAPI';
import { CartCount, WishCount, loginState, smr_loginState } from '../../../Recoil/atom';
import { ForgotPasswordEmailAPI } from '../../../../../../utils/API/Auth/ForgotPasswordEmailAPI';
import Cookies from 'js-cookie';
import { CurrencyComboAPI } from '../../../../../../utils/API/Combo/CurrencyComboAPI';
import { MetalColorCombo } from '../../../../../../utils/API/Combo/MetalColorCombo';
import { MetalTypeComboAPI } from '../../../../../../utils/API/Combo/MetalTypeComboAPI';
import { GetCountAPI } from '../../../../../../utils/API/GetCount/GetCountAPI';

export default function LoginWithEmail() {
    const [email, setEmail] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigate();
    const location = useLocation();

    const [cartCountNum, setCartCountNum] = useRecoilState(CartCount)
    const [wishCountNum, setWishCountNum] = useRecoilState(WishCount)

    const search = location?.search
    const updatedSearch = search.replace('?LoginRedirect=', '');
    const redirectEmailUrl = `${decodeURIComponent(updatedSearch)}`;
    const cancelRedireactUrl = `/LoginOption/${search}`;


    // const setPdData = useSetRecoilState(productDataNew)
    const setIsLoginState = useSetRecoilState(smr_loginState)
    // const setDesignList = useSetRecoilState(designSet)

    // const setCartCount = useSetRecoilState(CartListCounts)
    // const setWishCount = useSetRecoilState(WishListCounts)
    // const setTestProdData = useSetRecoilState(newTestProdData);


    // const getCountFunc = async () => {

    //     await GetCount().then((res) => {
    //         if (res) {
    //             setCartCount(res.CountCart)
    //             setWishCount(res.WishCount)
    //         }
    //     })

    // }


    // let pdDataCalling = async () => {
    //     await productListApiCall().then((res) => {
    //         setPdData(res)
    //     })
    // }

    // let designDataCall = async () => {
    //     await DesignSet().then((res) => {
    //         setDesignList(res)
    //     })
    // }


    useEffect(() => {

        setCSSVariable();

        const storedEmail = location.state?.email;;
        if (storedEmail) setEmail(storedEmail);
    }, []);

    const setCSSVariable = () => {
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
        document.documentElement.style.setProperty(
            "--background-color",
            backgroundColor
        );
    };

    const handleInputChange = (e, setter, fieldName) => {
        const { value } = e.target;
        setter(value);
        if (fieldName === 'confirmPassword') {
            if (!value.trim()) {
                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Password is required' }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
            }
        }
    };
    const handleMouseDownConfirmPassword = (event) => {
        event?.preventDefault();
    };

    function hashPasswordSHA1(password) {
        const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
        return hashedPassword;
    }

    // const handelCurrencyData = () =>{

    //     let currencyData = JSON.parse(sessionStorage.getItem('CURRENCYCOMBO'));
    //     let loginData = JSON.parse(sessionStorage.getItem('loginUserDetail'));
    //     console.log("param",loginData);

    //     const filterData = currencyData?.filter((cd)=>cd?.Currencyid === loginData?.CurrencyCodeid)

    //     console.log("currencyData",filterData);

    //     if(filterData.length && filterData){
    //         if(Array.isArray(filterData)){
    //             sessionStorage.setItem("currencyData",JSON.stringify(filterData[0]))
    //         }else{
    //             sessionStorage.setItem("currencyData",JSON.stringify(filterData))
    //         }
    //     }else{
    //         let DefaultObj = {
    //             "Currencyid": 42,
    //             "Currencycode": "INR",
    //             "Currencyname": "Rupees",
    //             "Currencysymbol": "₹",
    //             "CurrencyRate": 1.00000,
    //             "IsDefault": 1
    //         }
    //         sessionStorage.setItem("currencyData",JSON.stringify(DefaultObj))
    //     }
    // }  



    const handleSubmit = async () => {
        const visiterId = Cookies.get('visiterId');
        if (!confirmPassword.trim()) {
            errors.confirmPassword = 'Password is required';
            return;
        }

        const hashedPassword = hashPasswordSHA1(confirmPassword);

        setIsLoading(true);
        LoginWithEmailAPI(email, '', hashedPassword, '', '', visiterId).then((response) => {
            setIsLoading(false);
            if (response.Data.rd[0].stat === 1) {
                const visiterID = Cookies.get('visiterId');

                console.log('responseresponse', response?.Data?.rd[0]?.Token);
                Cookies.set('userLoginCookie', response?.Data?.rd[0]?.Token);
                sessionStorage.setItem('registerEmail', email)
                setIsLoginState(true)
                sessionStorage.setItem('LoginUser', true)
                sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data.rd[0]));


                GetCountAPI(visiterID).then((res) => {
                    if (res) {
                        setCartCountNum(res?.cartcount)
                        setWishCountNum(res?.wishcount)
                    }
                }).catch((err) => {
                    if (err) {
                        console.log("getCountApiErr", err);
                    }
                })

                CurrencyComboAPI(response?.Data?.rd[0]?.id).then((response) => {
                    if (response?.Data?.rd) {
                        let data = JSON.stringify(response?.Data?.rd)
                        sessionStorage.setItem('CurrencyCombo', data)
                    }
                }).catch((err) => console.log(err))


                MetalColorCombo(response?.Data?.rd[0]?.id).then((response) => {
                    if (response?.Data?.rd) {
                        let data = JSON.stringify(response?.Data?.rd)
                        sessionStorage.setItem('MetalColorCombo', data)
                    }
                }).catch((err) => console.log(err))


                MetalTypeComboAPI(response?.Data?.rd[0]?.id).then((response) => {
                    if (response?.Data?.rd) {
                        let data = JSON.stringify(response?.Data?.rd)
                        sessionStorage.setItem('metalTypeCombo', data)
                    }
                }).catch((err) => console.log(err))

                if (redirectEmailUrl) {
                    navigation(redirectEmailUrl);
                } else {
                    navigation('/')
                }

                // pdDataCalling()
                // designDataCall()
                // getCountFunc()
                // getDesignPriceList()

                // handelCurrencyData()
                // getAllProdData()
                window.location.reload();
            } else {
                errors.confirmPassword = 'Password is Invalid'
            }
        }).catch((err) => console.log(err))

        // try {
        //     setIsLoading(true);

        //     const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        //     const { FrontEnd_RegNo } = storeInit;
        //     const combinedValue = JSON.stringify({
        //         userid: `${email}`, mobileno: '', pass: `${hashedPassword}`, mobiletoken: '', FrontEnd_RegNo: `${FrontEnd_RegNo}`
        //     });
        //     const encodedCombinedValue = btoa(combinedValue);
        //     const body = {
        //         "con": "{\"id\":\"\",\"mode\":\"WEBLOGIN\"}",
        //         "f": "LoginWithEmail (handleSubmit)",
        //         p: encodedCombinedValue
        //     };
        //     const response = await CommonAPI(body);

        //     if (response.Data.rd[0].stat === 1) {
        //         let resData = response.Data.rd[0]
        //         sessionStorage.setItem('registerEmail', email)
        //         setIsLoginState('true')
        //         sessionStorage.setItem('LoginUser', 'true')
        //         sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data.rd[0]));
        //         navigation('/');
        //         pdDataCalling()
        //         designDataCall()
        //         getCountFunc()
        //         getDesignPriceList()
        //         // handelCurrencyData()
        //         // getAllProdData()
        //         // window.location.reload(); 
        //     } else {
        //         errors.confirmPassword = 'Password is Invalid'
        //     }
        // } catch (error) {
        //     console.error('Error:', error);
        // } finally {
        //     setIsLoading(false);
        // }
    };


    const handleTogglePasswordVisibility = (fieldName) => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleNavigation = () => {
        sessionStorage.setItem('LoginCodeEmail', 'true');
        navigation('/LoginWithEmailCode', { state: { email: location.state?.email } });
    }

    const handleForgotPassword = async () => {
        // try {
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        // const { FrontEnd_RegNo, domain } = storeInit;
        // // let Domian = `https://${domain}`
        let Domian = `${window?.location?.protocol}//${storeInit?.domain}`

        // const combinedValue = JSON.stringify({
        //     domain: `${Domian}`, userid: `${email}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0'
        // });

        // const encodedCombinedValue = btoa(combinedValue);
        // const body = {
        //     "con": "{\"id\":\"\",\"mode\":\"FORGOTPASSWORDEMAIL\",\"appuserid\":\"\"}",
        //     "f": "m-test2.orail.co.in (getdesignnolist)",
        //     p: encodedCombinedValue
        // };
        // const response = await CommonAPI(body);

        setIsLoading(true);
        ForgotPasswordEmailAPI(Domian, email).then((response) => {
            setIsLoading(false);
            if (response.Data.rd[0].stat === 1) {
                toast.success('Reset Link Send On Your Email');
            } else {
                alert('Error')
            }
        }).catch((err) => console.log(err))



        // } catch (error) {
        //     console.error('Error:', error);
        // } finally {
        //     setIsLoading(false);
        // }
    }
    return (
        <div className='smr_loginEmail'>
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div>
                <div className='smr_loginEmailD'>
                    <p style={{
                        textAlign: 'center',
                        paddingBlock: '60px',
                        marginTop: '0px',
                        fontSize: '40px',
                        color: '#7d7f85',
                      
                    }}
                        className='AuthScreenMainTitle'
                    >Login With Password</p>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '-80px',
                        fontSize: '15px',
                        color: '#7d7f85',
                      
                    }}
                        className='AuthScreenSubTitle'
                    >using {email}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
                        <TextField
                            autoFocus
                            id="outlined-confirm-password-input"
                            label="Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            className='smr_loginPasswordBox'
                            style={{ margin: '15px' }}
                            value={confirmPassword}
                            onChange={(e) => handleInputChange(e, setConfirmPassword, 'confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                                            onMouseDown={handleMouseDownConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <button className='submitBtnForgot' style={{
                            fontWeight:'600'
                        }} onClick={handleSubmit}>Login</button>
                        <Button style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>

                        <button type='submit' className='SmilingLoginCodeBtn' onClick={handleNavigation}>Login With a Code instead on email</button>
                        <p className='go_pass_fg' style={{ textAlign: 'center' }}>Go passwordless! we'll send you an email.</p>

                        <p style={{ color: 'blue', cursor: 'pointer' }} onClick={handleForgotPassword}>Forgot Password ?</p>
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '30px' }}>
                <p 
          className="backtotop_Smr"
                
                style={{ margin: '0px', fontWeight: 500, width: '100px', color: 'white', cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>BACK TO TOP</p>
            </div> */}
        </div>
    );
}
