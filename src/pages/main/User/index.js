import { useEffect, useRef, useState } from "react";
import { UiButton, UiCounterBatch, UiModal, UiSearchBox, UiTable } from "../../../components"
import CreateUser from "./createUser";
import { USER_COLUMN_HEADER } from "./Config";
import * as api from "../../../actions";
import { CONFIG, USER } from "../../../apiservices/endpoints";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { showToast } from "../../../components/UiToastNotification";
import { reset, statuChange } from "../../../assets/images";
import { searchInitiateDelayTime } from "../../../utils/appUtils";

export const User = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const debounceTime = useRef(null);

    const [isOpenCreateUser, setIsOpenCreateUser] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: "",
        password: "",
        userName: "",
        role: "",
        designation: "",
    });
    const [allUserDetails, setAllUserDetails] = useState([]);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [mainRecord, setMainRecord] = useState({});
    const [pageSize, setPageSize] = useState({ page: 0, size: 25, });
    const [searchTerm, setSearchTerm] = useState("");
    const [designationOptions, setDesignationOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [isButtonEnabled, setButtonEnabled] = useState(false);

    const addUser = (payload) => api.post(`${USER}`, payload);
    const getUser = (pages, searchTerm, size) => api.get(`${USER}/page?page=${pages}&size=${size}${searchTerm ? `&name=${searchTerm}` : ""}`);
    const getAllDesignation = () => api.get(`${CONFIG}/Designation`);
    const getAllRole = () => api.get(`${CONFIG}/Role`);

    const { data:allUsers, isFetching: isFetchingUser, refetch: refetchUsers } = useQuery(["FETCH_ALL_USER", pageSize?.page, searchTerm, pageSize?.size], () => getUser(pageSize?.page, searchTerm, pageSize?.size), {
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (allUserResponse) => {
            if (allUserResponse?.statusCode === 200) {
                setAllUserDetails(allUserResponse?.result?.usersWithPage?.content);
            }
            else {
                showToast.error("Error", `${allUserResponse?.error?.message}`);
            }
        }
    });

    useQuery(["FETCH_DESIGNATION", ""], getAllDesignation, {
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (designationResponse) => {
            const designationOptions = designationResponse?.configuration?.map((designation) => ({
                key: designation,
                value: designation,
            }));
            setDesignationOptions(designationOptions);
        }
    });

    useQuery(["FETCH_ROLE", ""], getAllRole, {
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (roleResponse) => {
            const roleOptions = roleResponse?.configuration?.map((role) => ({
                key: role,
                value: role,
            }));
            setRoleOptions(roleOptions);
        }
    });

    const { isFetching: isFetchingAddUser } = useQuery(["ADD_USER", ""], addUser, {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (userResponse) => {
            if (userResponse?.data?.statusCode === 201) {
                showToast.success("Success", "User Created Successfully!!!");
                setIsOpenCreateUser(false);
                setUserDetails({});
                refetchUsers();
            }
            else {
                showToast.error("Error", `${userResponse?.response?.data?.error?.message}`);
            }
        },
    });

    const debounceSearch = (searchValue) => {
        if (debounceTime?.current) {
            clearTimeout(debounceTime?.current);
        }
        if (searchValue !== "") {
            debounceTime.current = setTimeout(() => {
                setSearchTerm(searchValue);
                setPageSize({ page: 0, size: 25, });
            }, searchInitiateDelayTime);
        } else {
            setSearchTerm("");
            setPageSize({ page: 0, size: 25, });
        }
    };

    const handleSearch = (searchValue) => {
        const searchTerms = searchValue;
        debounceSearch(searchTerms);
    };

    const handleAddNew = () => {
        setIsOpenCreateUser(true);
    };

    const handleClose = () => {
        setIsOpenCreateUser(false);
        setUserDetails({});
    };

    const handleChange = (fieldValue, fieldName) => {
        setUserDetails((prev) => ({ ...prev, [fieldName]: fieldValue }));
    };

    const handlePagination = (pages, size) => {
        setPageSize({ page: pages - 1, size: size, });
    };

    const handleSubmit = () => {
        queryClient.prefetchQuery(["ADD_USER", ""], () => addUser(userDetails));
    };

    const handleModalOpen = (userDetails) => {
        setModalOpen(true);
        setMainRecord(userDetails);
    };

    const handleModalStatusOpen = (userDetails) => {
        setStatusModalOpen(true);
        setMainRecord(userDetails);
    };

    const handleResetPassword = () => {
        api
            .patch(`${USER}/passwordReset/${mainRecord?.userId}`)
            .then((response) => {
                setModalOpen(false);
                refetchUsers();
                showToast.success(
                    "Success",
                    "Password Reset Successfully!!!"
                );
            })
            .catch((error) => {
                showToast.error("Error", "Password Not Able to Reset ");
            });
    };

    const handleStatusChange = () => {
        const newStatus = mainRecord?.userStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        api
            .patch(`${USER}/status/${mainRecord?.userId}?status=${newStatus}`)
            .then((response) => {
                setStatusModalOpen(false);
                refetchUsers();
            })
            .catch((error) => {
                showToast.error("Error", "User Status Cannot be Changed");
            });
    };

    useEffect(() => {
        let enable = Boolean(userDetails?.name && userDetails?.designation && userDetails?.role && userDetails?.userName && userDetails?.password);
        setButtonEnabled(enable);
    }, [userDetails]);

    useEffect(() => {
        const isLoading = isFetchingAddUser || isFetchingUser;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchingAddUser, isFetchingUser]);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="flexible-start">
                    <h3>All Users</h3> <UiCounterBatch primary >{allUsers?.result?.usersWithPage?.totalElements ?? 0}</UiCounterBatch>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <UiSearchBox
                        placeholder="Search user"
                        handleSearch={handleSearch}
                    />
                    <UiButton
                        add={true}
                        type="primary"
                        onClick={handleAddNew}
                    >
                        Add
                    </UiButton>
                </div>
            </div>
            <UiTable
                columns={USER_COLUMN_HEADER(handleModalStatusOpen, handleModalOpen)}
                dataSource={allUserDetails}
                pagination={{
                    pageSize: pageSize?.size,
                    current: pageSize?.page + 1,
                    pageSizeOptions: [25, 50, 75, 100],
                    showSizeChanger: true,
                    total: allUsers?.result?.usersWithPage?.totalElements,
                    onChange: (page, size) => handlePagination(page, size),
                }}
            />
            {
                isOpenCreateUser && <CreateUser
                    isOpenCreateUser={isOpenCreateUser}
                    handleClose={handleClose}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    designationOptions={designationOptions}
                    roleOptions={roleOptions}
                    isButtonEnabled={isButtonEnabled}
                />
            }
            <UiModal open={isModalOpen} onCancel={() => setModalOpen(false)}
                footer={null}>
                <div style={{ textAlign: "center" }}>
                    <img
                        src={reset}
                        style={{ width: "50px", marginBottom: "20px" }}
                        alt="reset"
                    />
                    <h2 style={{ fontSize: "20px" }}>
                        Are you sure you want to reset the password?
                    </h2>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                        gap: "8px",
                    }}
                >
                    <UiButton
                        style={{ width: "90px" }}
                        onClick={() => setModalOpen(false)}
                    >
                        No
                    </UiButton>
                    <UiButton
                        type="primary"
                        onClick={handleResetPassword}
                        style={{ marginRight: "10px", width: "90px" }}
                    >
                        Yes
                    </UiButton>
                </div>
            </UiModal>
            <UiModal
                open={isStatusModalOpen} onCancel={() => setStatusModalOpen(false)}
                footer={null}
            >
                <div style={{ textAlign: "center" }}>
                    <img
                        src={statuChange}
                        style={{ width: "50px", marginBottom: "20px" }}
                        alt="status"
                    />
                    <h2 style={{ fontSize: "20px" }}>
                        Are you sure you want to Change the userStatus?
                    </h2>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                        gap: "8px",
                    }}
                >
                    <UiButton
                        style={{ width: "90px" }}
                        onClick={() => setStatusModalOpen(false)}
                    >
                        No
                    </UiButton>
                    <UiButton
                        type="primary"
                        onClick={handleStatusChange}
                        style={{ marginRight: "10px", width: "90px" }}
                    >
                        Yes
                    </UiButton>
                </div>
            </UiModal>
        </div>
    )
};
