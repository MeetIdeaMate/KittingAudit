// import Barcode from "react-barcode";

// export const PrintStickerLabels = ({
//     stickers,
//     tabDetails,
// }) => {
//     const {
//         templabeledinfoMap,
//         dublicateBarcode,
//         isDublicate,
//         labelMap,
//         mode,
//     } = stickers;

//     const filteredEntries = (dublicateBarcode || [])
//         ?.map(code => code?.barcodeId?.split("-").pop())
//         ?.filter(key => templabeledinfoMap?.hasOwnProperty(key))
//         ?.map(key => [key, templabeledinfoMap[key]]);

//     const filteredMap = Object.fromEntries(filteredEntries);

//     const getNewlyAddedMap = (prevMap = {}, currMap = {}) => {
//         return Object.fromEntries(
//             Object.entries(currMap)
//                 ?.filter(([key]) => !prevMap?.hasOwnProperty(key))
//         );
//     };

//     let printMap = templabeledinfoMap;

//     if (mode === "update") {
//         printMap =
//             tabDetails?.activeTab === "individual"
//                 ? templabeledinfoMap
//                 : getNewlyAddedMap(labelMap, templabeledinfoMap);
//     }
//     else if (isDublicate && mode !== "edit") {
//         printMap = filteredMap;
//     }

//     const entries = Object.entries(printMap || {});
//     const sumValues = (map = {}) => Object.values(map)?.reduce((s, v) => s + (Number(v) || 0), 0);

//     const prevTotal = sumValues(labelMap || {});
//     const currTotal = sumValues(templabeledinfoMap || {});

//     const printQty =
//         mode === "update"
//             ? Math.max(currTotal - prevTotal, 0)
//             : currTotal;

//     const startIndex = mode === "update" ? prevTotal + 1 : 1;

//     const labelsArray = Array.from(
//         { length: printQty },
//         (_, i) => startIndex + i
//     );

//     const chunkArray = (arr, size) => {
//         const result = [];
//         for (let i = 0; i < arr.length; i += size) {
//             result.push(arr.slice(i, i + size));
//         }
//         return result;
//     };

//     const rows =
//         tabDetails?.activeTab === "individual"
//             ? chunkArray(labelsArray, 2)
//             : chunkArray(entries, 2);

//     return (
//         <div style={{ margin: "auto", width: "100mm" }}>
//             {rows?.map((row, rowIndex) => {
//                 let updatedRow = [...row];
//                 if (row?.length === 1) {
//                     updatedRow.push("empty");
//                 }
//                 return (
//                     <div
//                         key={rowIndex}
//                         style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             breakInside: "avoid",
//                             pageBreakAfter: "always",
//                             breakAfter: "always",
//                         }}
//                     >
//                         {updatedRow?.map((item, index) => {
//                             if (item === "empty") {
//                                 return (
//                                     <div
//                                         key={index}
//                                         style={{
//                                             width: "50mm",
//                                             height: "23mm",
//                                         }}
//                                     />
//                                 );
//                             }
//                             if (tabDetails?.activeTab === "individual") {
//                                 const key = item;
//                                 return (
//                                     <div
//                                         key={key}
//                                         style={{
//                                             border: "1px solid #999",
//                                             padding: "5px",
//                                             boxSizing: "border-box",
//                                             borderRadius: "5px",
//                                             width: "50mm",
//                                             height: "23mm",
//                                         }}
//                                     >
//                                         <div style={{ textAlign: "center" }}>
//                                             <Barcode
//                                                 value={`${stickers?.partNumber}-${key}`}
//                                                 width={1}
//                                                 height={15}
//                                                 fontSize={10}
//                                                 margin={0}
//                                                 format="CODE128"
//                                             />
//                                         </div>
//                                         <div>
//                                             <h3 style={{ margin: 0 }}>
//                                                 {stickers?.partNumber}-{key}
//                                             </h3>
//                                             <h6 style={{ margin: 0 }}>
//                                                 OTIS VENDOR:
//                                             </h6>
//                                         </div>
//                                     </div>
//                                 );
//                             }
//                             if (tabDetails?.activeTab === "grouped") {
//                                 const [key, value] = item;

//                                 return (
//                                     <div
//                                         key={index}
//                                         style={{
//                                             border: "1px solid #999",
//                                             padding: "5px",
//                                             boxSizing: "border-box",
//                                             borderRadius: "5px",
//                                             width: "50mm",
//                                             height: "23mm",
//                                         }}
//                                     >
//                                         <div style={{ textAlign: "center" }}>
//                                             <Barcode
//                                                 value={`${stickers?.partNumber}-${key}`}
//                                                 width={1}
//                                                 height={15}
//                                                 fontSize={10}
//                                                 margin={0}
//                                                 format="CODE128"
//                                             />
//                                         </div>

//                                         <div
//                                             style={{
//                                                 display: "flex",
//                                                 justifyContent: "space-between",
//                                                 alignItems: "center",
//                                             }}
//                                         >
//                                             <h3 style={{ margin: 0 }}>
//                                                 {stickers?.partNumber}
//                                             </h3>
//                                             <h3 style={{ margin: 0 }}>
//                                                 {value}
//                                             </h3>
//                                         </div>

//                                         <h6 style={{ margin: 0 }}>
//                                             OTIS VENDOR:
//                                         </h6>
//                                     </div>
//                                 );
//                             }
//                             return null;
//                         })}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };
import Barcode from "react-barcode";

export const PrintStickerLabels = ({ stickers, tabDetails }) => {

    const {
        templabeledinfoMap,
        dublicateBarcode,
        isDublicate,
        labelMap,
        mode,
    } = stickers;

    const filteredEntries = (dublicateBarcode || [])
        ?.map(code => code?.barcodeId?.split("-").pop())
        ?.filter(key => templabeledinfoMap?.hasOwnProperty(key))
        ?.map(key => [key, templabeledinfoMap[key]]);

    const filteredMap = Object.fromEntries(filteredEntries);

    const getNewlyAddedMap = (prevMap = {}, currMap = {}) => {
        return Object.fromEntries(
            Object.entries(currMap)
                ?.filter(([key]) => !prevMap?.hasOwnProperty(key))
        );
    };

    let printMap = templabeledinfoMap;

    if (mode === "update") {
        printMap =
            tabDetails?.activeTab === "individual"
                ? templabeledinfoMap
                : getNewlyAddedMap(labelMap, templabeledinfoMap);
    }
    else if (isDublicate && mode !== "edit") {
        printMap = filteredMap;
    }

    const entries = Object.entries(printMap || {});
    const sumValues = (map = {}) => Object.values(map)?.reduce((s, v) => s + (Number(v) || 0), 0);

    const prevTotal = sumValues(labelMap || {});
    const currTotal = sumValues(templabeledinfoMap || {});

    const printQty =
        mode === "update"
            ? Math.max(currTotal - prevTotal, 0)
            : currTotal;

    const startIndex = mode === "update" ? prevTotal + 1 : 1;

    const labelsArray = Array.from(
        { length: printQty },
        (_, i) => startIndex + i
    );

    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const rows =
        tabDetails?.activeTab === "individual"
            ? chunkArray(labelsArray, 2)
            : chunkArray(entries, 2);

    return (
        <div style={{ margin: "auto", width: "102mm" }}>
            {rows?.map((row, rowIndex) => {
                let updatedRow = [...row];
                if (row?.length === 1) {
                    updatedRow.push("empty");
                }
                return (
                    <div
                        key={rowIndex}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            breakInside: "avoid",
                            pageBreakAfter: rowIndex !== rows.length - 1 ? "always" : "auto"
                        }}
                    >
                        {updatedRow?.map((item, index) => {
                            if (item === "empty") {
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            width: "50mm",
                                            height: "23mm"
                                        }}
                                    />
                                );
                            }
                            if (tabDetails?.activeTab === "individual") {
                                const key = item;
                                return (
                                    <div
                                        key={key}
                                        style={{
                                            border: "1px solid #999",
                                            padding: "5px",
                                            boxSizing: "border-box",
                                            borderRadius: "5px",
                                            width: "50mm",
                                            height: "23mm"
                                        }}
                                    >
                                        <div style={{ textAlign: "center" }}>
                                            <Barcode
                                                value={`${stickers?.barCode}-${key}`}
                                                width={1}
                                                height={15}
                                                fontSize={10}
                                                margin={0}
                                                format="CODE128"
                                            />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0 }}>
                                                {stickers?.partNumber}-{key}
                                            </h3>
                                            <h6 style={{ margin: 0 }}>
                                                OTIS VENDOR:
                                            </h6>
                                        </div>
                                    </div>
                                );
                            }
                            if (tabDetails?.activeTab === "grouped") {
                                const [key, value] = item;

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            border: "1px solid #999",
                                            padding: "5px",
                                            boxSizing: "border-box",
                                            borderRadius: "5px",
                                            width: "50mm",
                                            height: "23mm"
                                        }}
                                    >
                                        <div style={{ textAlign: "center" }}>
                                            <Barcode
                                                value={`${stickers?.barCode}-${key}`}
                                                width={1}
                                                height={15}
                                                fontSize={10}
                                                margin={0}
                                                format="CODE128"
                                            />
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}
                                        >
                                            <h3 style={{ margin: 0 }}>
                                                {stickers?.partNumber}
                                            </h3>
                                            <h3 style={{ margin: 0 }}>
                                                {value}
                                            </h3>
                                        </div>

                                        <h6 style={{ margin: 0 }}>
                                            OTIS VENDOR:
                                        </h6>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                );
            })}
        </div>
    );
};