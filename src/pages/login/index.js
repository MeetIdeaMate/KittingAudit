import React, { useEffect, useState } from "react";
import "./style.scss";
import { SignInBG, TechLambdasLogo } from "../../assets/images";
import { lang_en_US as translation } from "../../config/locales";
import { loginForm, resetForm } from "./config";
import * as Yup from "yup";
import { UiFormWrapper } from "../../components";
import { loaderReducer } from "../../reducers/loader.reducer";
import { useDispatch } from "react-redux";
import { LOGIN, USER } from "../../apiservices/endpoints";
import * as api from "../../actions";
import { useMutation } from "@tanstack/react-query";
import { loginReducer } from "../../reducers/login.reducer";
import { getToken } from "@firebase/messaging";
import { showToast } from "../../components/UiToastNotification";
import { messaging, setupNotifications } from "./firebase/firebase";

export const Login = () => {

    const keywords = translation.signin;
    const dispatch = useDispatch();
    const [loginData, setLoginData] = useState([]);
    const [showResetForm, setShowResetForm] = useState(false);

    const onFinish = async (values) => {
        try {
            const token = await getToken(messaging);
            values.deviceToken = token || null;
        } catch (error) {
            console.error("Failed to get device token:", error);
            values.deviceToken = null;
        }
        signIn(values);
        sessionStorage.clear();
        localStorage.clear();
        dispatch(loaderReducer(true));
    };

    const getSignIn = (payload) => {
        return api.post(`${LOGIN}`, payload);
    };

    const { mutate: signIn } = useMutation(getSignIn, {
        onSuccess: (loginData) => {
            if (loginData?.status === 200) {
                const data = loginData.data;
                // const { companyName, departmentId, designation, role, userId } = data;
                // //  const isAdhie = companyName === "ADHIEGEAR";
                // // const isKb = companyName === "KBASSOCIATE";
                if (data?.passWordReset === false) {
                    dispatch(loaderReducer(false));
                    setLoginData(data);
                    setShowResetForm(true);
                } else {
                    // setLoginData(data);
                    showToast.success("success");
                    sessionStorage.setItem("_ac", data.token);
                    const accessData = [
                        { menuName: "ExcelUpload", accessLevels: ["ADD", "DELETE", "F_UPDATE", "P_UPDATE", "VIEW"] },
                        { menuName: "Kitting", accessLevels: ["ADD", "DELETE", "F_UPDATE", "P_UPDATE", "VIEW"] },
                    ];
                    sessionStorage.setItem("access", JSON.stringify(accessData));

                    dispatch(loginReducer(loginData?.data));
                    dispatch(loaderReducer(false));

                    // reftchNotification(loginData?.data?.userId, {});
                    // client.prefetchQuery(
                    //     ["FETCH_ACCESS_CONTROL", isKb ? "kb" : isAdhie ? "adhie" : "other"],
                    //     async () => {
                    //         if (isKb) {
                    //             let accessData = await getAccessControl(departmentId, designation, role?.toUpperCase(), userId);
                    //             if (accessData?.length > 0) return accessData;
                    //             accessData = await getAccessControl(departmentId, designation, userId);
                    //             if (accessData?.length > 0) return accessData;
                    //             accessData = await getAccessControl(departmentId, designation, role?.toUpperCase());
                    //             if (accessData?.length > 0) return accessData;
                    //             accessData = await getAccessControl(departmentId, userId);
                    //             if (accessData?.length > 0) return accessData;
                    //             accessData = await getAccessControl(departmentId, designation);
                    //             if (accessData?.length > 0) return accessData;
                    //             accessData = await getAccessControl(departmentId, role?.toUpperCase());
                    //             if (accessData?.length > 0) return accessData;
                    //             return getAccessControl(departmentId);
                    //         }
                    //         if (isAdhie) {
                    //             return getAccessControl(departmentId);
                    //         }
                    //         return getAccessControl(departmentId);
                    //     }
                    // );
                }
            } else {
                showToast.error("Error", loginData?.response?.data?.message);
                dispatch(loaderReducer(false));
            }
        },
    });

    const handleResetSubmit = async (values) => {
        if (values.oldPassWord === values.newPassWord) {
            showToast.error("The new password cannot be the same as the old password.")
            return;
        }
        try {
            const response = await api.put(`${USER}/changePwd`, {
                newPassword: values?.newPassWord,
                oldPassWord: values?.oldPassWord,
                userName: values?.mobileNumber,
            },
                {
                    headers: {
                        Authorization: `Bearer ${loginData?.token}`,
                    },
                });
            if (response.status === 200) {
                showToast.success("Password changed Successfully", response.data);
                setShowResetForm(false);
            } else {
                showToast.error('Unexpected response status', response.error);
                setShowResetForm(false);
            }
        } catch (error) {
            setShowResetForm(false);
            showToast.error('"Unexpected response status', error);
        }
    };

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required(""),
        passWord: Yup.string().required(""),
    });

    useEffect(() => {
        return () => setupNotifications();
    }, []);

    return <React.Fragment>
        <div className="login">
            <div className="login__block" style={{ backgroundColor: "red" }}>
                <figure className="login__inner">
                    <img src={SignInBG} alt="Login Background" />
                    <figcaption>
                        <img
                            className="logo"
                            src={TechLambdasLogo}
                            alt="Tech Lambdas Logo"
                        />
                        <p>
                            {keywords?.text1} <span>{keywords?.text2}</span>
                        </p>
                        <p>{keywords?.text3}</p>
                    </figcaption>
                </figure>
            </div>
            <div className="login__block">
                <div className="login__inner login--fixedwidth">
                    <div className="applicationLogo">
                        {/* <img src={kbLogo} alt="KB-LOGO" /> */}
                    </div>
                    {!showResetForm ? (
                        <>
                            <div className="login__content">
                                <span>{keywords?.heading}</span>
                                <span>{keywords?.title}</span>
                                <span>{keywords?.subTitle}</span>
                            </div>
                            <UiFormWrapper
                                formConfig={loginForm}
                                initialValues={{}}
                                validationSchema={validationSchema}
                                handleButtonClick={onFinish}
                            />
                        </>
                    ) : (
                        <div>
                            <h2 style={{ color: "#F6822B" }}>Reset Your Password</h2>
                            <UiFormWrapper
                                formConfig={resetForm}
                                initialValues={{}}
                                handleButtonClick={handleResetSubmit}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </React.Fragment>
};