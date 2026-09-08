import { useState } from "react";
import { Image, Upload } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { UiButton, UiDrawer, UiTextBox, UiTextArea, UiSelect } from "../../../components";

const DUMMY_SIMILAR_PART_OPTIONS = [
    { partId: "P001", partName: "F.JNCLFONDL" },
    { partId: "P002", partName: "F.JNCLFONDR" },
    { partId: "P003", partName: "F.JNCLFONDS" },
];

const DUMMY_ADDED_PARTS = [
    {
        partId: "P001",
        partName: "F.JNCLFONDL",
        subtitle: "Standard M8 fastener",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        notMatchReason:
            "The part does not match due to a dimensional discrepancy — the supplied component exceeds the specified tolerance range, resulting in an improper fit with the mating assembly.",
    },
    {
        partId: "P002",
        partName: "F.JNCLFONDL",
        subtitle: "Standard M8 fastener",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        notMatchReason:
            "The part does not match due to a dimensional discrepancy — the supplied component exceeds the specified tolerance range, resulting in an improper fit with the mating assembly.",
    },
];

const DUMMY_RECORD = {
    partNo: "PRT-1001",
    description: "Sample hydraulic pump part used for testing view mode.",
    similarParts: DUMMY_ADDED_PARTS,
};

const PartDrawer = ({
    isOpenDrawer,
    mode,
    handleClose,
    handleChange,
    handleSubmit,
    partDetails,
    similarPartOptions,
    selectSmilarPart,
    handleNotMatchReasonChange,
    isButtonEnabled,
    record,
    setSelectSimilarPart,
}) => {
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";
    const isFormMode = isAddMode || isEditMode;

    const drawerTitle = isViewMode ? "View Part" : isEditMode ? "Edit Part" : "Add new Part";
    const submitLabel = isEditMode ? "Update" : "Submit";
    console.log(record, 'record');
    console.log(partDetails, 'partDetails', partDetails?.partNumber);

    return (
        <UiDrawer
            title={drawerTitle}
            open={isOpenDrawer}
            onClose={handleClose}
            width={340}
            footer={
                isViewMode ? null : (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <UiButton style={{ flex: 1 }} onClick={handleClose}>
                            Cancel
                        </UiButton>
                        <UiButton
                            style={{ flex: 1 }}
                            type="primary"
                            disabled={!isButtonEnabled}
                            onClick={handleSubmit}
                        >
                            {submitLabel}
                        </UiButton>
                    </div>
                )
            }
        >
            {isViewMode ? (
                <>
                    <p style={{ fontWeight: 600, marginBottom: "12px" }}>Added Parts</p>
                    {(record?.similarParts?.length > 0 ? record?.similarParts : [])?.map((part) => {
                        return (
                            <div
                                key={part?.partNumber}
                                style={{
                                    border: "1px solid #eee",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    marginBottom: "12px",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <Image
                                            src={part?.partImage}
                                            alt={part?.partNumber}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "6px",
                                                background: "#f5f5f5",
                                            }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{part?.partName}</div>
                                            <div style={{ fontSize: "12px", color: "#888" }}>{part?.subtitle}</div>
                                        </div>
                                    </div>
                                </div>

                                <p style={{ marginTop: "10px", marginBottom: "4px", fontSize: "13px", color: "#555" }}>
                                    Why This Part Not Match
                                </p>
                                <p style={{ margin: 0, fontSize: "13px", color: "#333", lineHeight: 1.5 }}>
                                    {part?.notMatchReason}
                                </p>
                            </div>
                        );
                    })}
                </>
            ) : (
                isFormMode && (
                    <>
                        <p style={{ color: "#F97316", fontWeight: 600, marginBottom: "10px" }}>MAIN IMAGE</p>
                        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                fileList={
                                    partDetails?.partImage
                                        ? [partDetails?.partImage]
                                        : []
                                }
                                onChange={({ file }) => handleChange(file, "partImage")}
                            >
                                {!partDetails?.partImage && <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 4, fontSize: "12px" }}>Upload</div>
                                </div>}
                            </Upload>
                            <div style={{ flex: 1 }}>
                                <UiTextBox
                                    name="partDescription"
                                    label="Part Name"
                                    placeholder="Part Name"
                                    value={partDetails?.partNumber}
                                    onChange={(e) => handleChange(e.target.value, "partNumber")}
                                />
                            </div>
                        </div>
                        <div >
                            <UiTextArea
                                label="Part Description"
                                placeholder="Part Description"
                                name="partDescription"
                                value={partDetails?.partDescription}
                                onChange={(e) =>
                                    handleChange(e.target.value, "partDescription")
                                }
                            />
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: "3px",
                            }}
                        >
                            <UiTextBox
                                label="Width"
                                name="width"
                                placeholder="Width"
                                value={partDetails?.width}
                                onChange={(e) => handleChange(e.target.value, "width")}
                            />

                            <UiTextBox
                                label="Height"
                                name="height"
                                placeholder="Height"
                                value={partDetails?.height}
                                onChange={(e) => handleChange(e.target.value, "height")}
                            />

                            <UiTextBox
                                label="Length"
                                name="length"
                                placeholder="Length"
                                value={partDetails?.length}
                                onChange={(e) => handleChange(e.target.value, "length")}
                            />
                        </div>

                        <div >
                            <UiTextArea
                                label="Description"
                                placeholder="Why This Part Not Match"
                                value={partDetails?.description}
                                onChange={(e) =>
                                    handleChange(e.target.value, "description")
                                }
                            />
                        </div>
                        <p style={{ color: "#F97316", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>
                            ADD SIMILAR PARTS
                        </p>
                        <UiSelect
                            mode="multiple"
                            isStyle={true}
                            placeholder="Search part name"
                            value={selectSmilarPart}
                            options={similarPartOptions?.map((p) => ({ label: p?.partNumber, value: p?.partId, key: p?.partId }))}
                            onChange={(value) => setSelectSimilarPart(value)}
                        />
                        <div >
                            <p style={{ fontWeight: 600, marginBottom: "8px" }}>Added Parts</p>
                            {similarPartOptions?.filter(partList => selectSmilarPart?.includes(partList?.partId))?.map((part) => (
                                <div
                                    key={part?.partId}
                                    style={{
                                        border: "1px solid #eee",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <Image
                                                src={part?.partImage}
                                                alt={part?.partNumber}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "6px",
                                                    background: "#f5f5f5",
                                                }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{part?.partName}</div>
                                                <div style={{ fontSize: "12px", color: "#888" }}>{part?.subtitle}</div>
                                            </div>
                                        </div>
                                        <DeleteOutlined
                                            style={{ color: "#F97316", cursor: "pointer" }}
                                            onClick={() => setSelectSimilarPart(prev => prev?.filter(parts => parts !== part?.partId))}
                                        />
                                    </div>

                                    <UiTextArea
                                        placeholder="Why This part not Match"
                                        style={{ marginTop: "10px" }}
                                        name="notMatchReason"
                                        value={part?.notMatchReason}
                                        onChange={(e) =>
                                            handleNotMatchReasonChange(part?.partId, e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )
            )}
        </UiDrawer>
    );
};

export default PartDrawer;