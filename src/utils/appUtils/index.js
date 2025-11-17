import { AccessPerforming } from "./appAccessControl";

export const currentLocation = () => {
    let location = window?.location?.pathname;
    return location.replace(/^\//, '');
};

export const { filteredMenus } = AccessPerforming();
export const searchInitiateDelayTime = 1000;

export const downloadFile = async (fileUrl) => {
    const updatedUrl = fileUrl;;
    const response = await fetch(updatedUrl, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("_ac")}`,
        },
    });
    const blob = await response.blob();
    return { blob, response };
};

export const handleDownload = async (file) => {
    try {
        const { blob, response } = await downloadFile(file.url || file.thumbUrl);
        const url = URL.createObjectURL(blob);
        let fileName = file.name;
        if (!fileName) {
            const disposition = response.headers.get("Content-Disposition");
            if (disposition && disposition.includes("filename=")) {
                fileName = disposition.split("filename=")[1].replace(/"/g, "");
            } else {
                fileName = (file.url || file.thumbUrl).split("/").pop();
            }
        }

        if (!/\.[a-zA-Z0-9]+$/.test(fileName)) {
            const extMatch = (file.url || file.thumbUrl).match(/\.[a-zA-Z0-9]+$/);
            if (extMatch) {
                fileName += extMatch[0];
            }
        }
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "downloaded-file";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed", error);
    }
};