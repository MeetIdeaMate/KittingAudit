export const loginForm = [
    {
        key: 'userName',
        id: 'username',
        type: 'text',
        label: 'Username',
        placeholder: 'Enter your user name'
    },
    {
        key: 'passWord',
        id: 'passWord',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your Password'
    },
    {
        key: 'submit',
        width: { width: '100%', marginTop: '40px' },
        id: 'login_submit',
        variant: 'primary',
        type: 'button',
        label: 'Login'
    },
];

export const resetForm = [
    {
        key: 'mobileNumber',
        id: 'mobileNumber',
        type: 'text',
        label: 'User Name',
        placeholder: 'Enter your Mobile Number',
    },
    {
        key: 'oldPassWord',
        id: 'oldPassWord',
        type: 'text',
        label: 'Old Password',
        placeholder: 'Enter your Old Password',
    },
    {
        key: 'newPassWord',
        id: 'newPassWord',
        type: 'password',
        label: 'New Password',
        placeholder: 'Enter your New Password',
    },
    {
        key: 'submit',
        width: { width: '100%', marginTop: '40px' },
        variant: 'primary',
        type: 'button',
        label: 'Reset'
    },
];

export const signInInitialValues = {
    userName: '',
    passWord: ''
};

export const resetInitialValues = {
    mobileNumber: '',
    oldPassWord: '',
    newPassWord: ''
};