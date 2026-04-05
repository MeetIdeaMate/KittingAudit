import { UiButton, UiDrawer, UiTextBox } from "../../../components";

const CreateUser = ({
    isOpenCreateUser,
    handleClose,
    handleChange,
    handleSubmit
}) => {
    return (
        <div>
            <UiDrawer 
            title="Create User"
            open={isOpenCreateUser} onClose={handleClose} footer={
                <div style={{display:"flex",justifyContent:"right",gap:"10px"}}>
                    <UiButton onClick={handleClose}>Cancel</UiButton>
                    <UiButton type="primary" onClick={handleSubmit}>Save</UiButton>
                </div>
            }>
                <div>
                    <label>Name </label>
                    <UiTextBox placeholder="Name" name="name" onChange={(event)=>handleChange(event.target.value,"name")}/>
                     <label>Designation </label>
                    <UiTextBox placeholder="Designation" name="designation" onChange={(event)=>handleChange(event.target.value,"designation")}/>
                    <label>Password </label>
                    <UiTextBox placeholder="Password" name="password" onChange={(event)=>handleChange(event.target.value,"password")}/>
                    <label>Username </label>
                    <UiTextBox placeholder="Username" name="username" onChange={(event)=>handleChange(event.target.value,"username")}/>
                    <label>Role </label>
                    <UiTextBox placeholder="Role" name="role" onChange={(event)=>handleChange(event.target.value,"role")}/>
                   
                </div>
            </UiDrawer>
        </div>
    )
};
export default CreateUser