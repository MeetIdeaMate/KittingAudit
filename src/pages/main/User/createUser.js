import { UiButton, UiDrawer, UiSelect, UiTextBox } from "../../../components";

const CreateUser = ({
    isOpenCreateUser,
    handleClose,
    handleChange,
    handleSubmit,
    designationOptions,
    roleOptions,
    isButtonEnabled
}) => {
    return (
        <div>
            <UiDrawer
                title="Create User"
                open={isOpenCreateUser} onClose={handleClose} footer={
                    <div style={{ display: "flex", justifyContent: "right", gap: "10px" }}>
                        <UiButton onClick={handleClose}>Cancel</UiButton>
                        <UiButton type="primary" disabled={!isButtonEnabled} onClick={handleSubmit}>Save</UiButton>
                    </div>
                }>
                <div>
                    <label>Name <span style={{ color: "red" }}>*</span></label>
                    <UiTextBox placeholder="Name" name="name" onChange={(event) => handleChange(event?.target?.value, "name")} />
                    <label>Designation <span style={{ color: "red" }}>*</span></label>
                    <UiSelect
                        placeholder="Designation"
                        name="designation"
                        options={designationOptions}
                        onChange={(value) => handleChange(value, "designation")}
                    />
                    <label>Role <span style={{ color: "red" }}>*</span></label>
                    <UiSelect
                        placeholder="Role"
                        name="role"
                        options={roleOptions}
                        onChange={(value) => handleChange(value, "role")}
                    />
                    <label>Username <span style={{ color: "red" }}>*</span></label>
                    <UiTextBox placeholder="Username" name="username" onChange={(event) => handleChange(event?.target?.value, "userName")} />
                    <label>Password <span style={{ color: "red" }}>*</span></label>
                    <UiTextBox placeholder="Password" name="password" onChange={(event) => handleChange(event?.target?.value, "passWord")} />
                </div>
            </UiDrawer>
        </div>
    )
};
export default CreateUser