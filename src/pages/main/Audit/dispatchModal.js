import { useState } from "react";
import { disatch_icon } from "../../../assets/images"
import { UiButton, UiDatePicker, UiModal, } from "../../../components"
import dayjs from "dayjs";
import * as api from "../../../actions";

export const DispatchModal = ({ open, handleClose }) => {

    const [dispatchDate, setDispatchDate] = useState(dayjs());

    return <div>
        <UiModal
            open={open}
            onCancel={() => handleClose(false, null)}
            footer={null}
        >
            <div style={{ textAlign: "center" }}>
                <img
                    src={disatch_icon}
                    style={{ width: "50px", marginBottom: "5px" }}
                    alt="status"
                />
                <h2 style={{ fontSize: "20px", padding: 0, margin: 0 }}>
                    Are you sure you want to Dispatch?
                </h2>
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "5px", }}>
                <div>
                    <label style={{ fontSize: "16px", }}>Select the dispatch date</label>
                    <UiDatePicker
                        style={{ width: "200px" }}
                        value={dayjs(dispatchDate).isValid() ? dayjs(dispatchDate) : null}
                        onChange={date => setDispatchDate(date ? date : null)}
                    />
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "5px",
                    gap: "8px",
                }}
            >
                <UiButton
                    style={{ width: "90px" }}
                    onClick={() => handleClose(false, null)}
                >
                    No
                </UiButton>
                <UiButton
                    type="primary"
                    disabled={!dispatchDate}
                    onClick={() => handleClose(true, dispatchDate)}
                    style={{ marginRight: "10px", width: "90px" }}
                >
                    Yes
                </UiButton>
            </div>
        </UiModal>
    </div>
}