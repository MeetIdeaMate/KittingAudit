import { useRef, useState } from "react";
import { excelFileUpload } from "../../assets/images";
import { showToast } from "../UiToastNotification";

export default function UiFileUploader({ onFileSelect }) {
    const fileRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");

    const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
    ];

    const handleFile = (file) => {
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            showToast.warning("Warning", "Only Excel (.xlsx / .xls) files allowed!")
            return;
        }
        setFileName(file.name);
        if (onFileSelect) onFileSelect(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const removeFile = () => {
        setFileName("");
        fileRef.current.value = "";
        if (onFileSelect) onFileSelect(null);
    };

    return (
        <div>
            <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
            />

            <div
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                style={{
                    padding: "24px",
                    border: "1px dashed #ff8716",
                    borderRadius: "10px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: isDragging ? "#fff7e6" : "#fafafa",
                    transition: "0.2s"
                }}
            >
                <h3 style={{ textAlign: "center", margin: 0 }}><img src={excelFileUpload} alt="" /></h3>
                <p style={{ margin: 0, fontWeight: 400 }}>
                    {isDragging ? "Drop your Excel file…" : "Click or drag file to this area to upload your Excel"}
                </p>
                <p style={{ margin: 0, opacity: 0.3 }}>
                    Only .xlsx / .xls supported
                </p>
            </div>

            {fileName && (
                <div
                    style={{
                        marginTop: "12px",
                        padding: "10px 14px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#fff"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "18px" }}>📄</span>
                        <span style={{ fontSize: "14px", color: "#1890FF" }}>{fileName}</span>
                    </div>

                    <span
                        onClick={removeFile}
                        style={{
                            cursor: "pointer",
                            color: "red",
                            fontSize: "18px"
                        }}
                        title="Remove"
                    >
                        🗑
                    </span>
                </div>
            )}
        </div>
    );
};