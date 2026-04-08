// import dayjs from "dayjs";
// import React from "react";
// import Barcode from "react-barcode";

// export const MainBarcode = ({ stickers }) => {

//     const MAX_ROWS = 12;
//     const GROUPS = 3;

//     const createGridRows = (parts = []) => {
//         const rows = [];
//         for (let i = 0; i < MAX_ROWS; i++) {
//             const row = [];
//             for (let g = 0; g < GROUPS; g++) {
//                 const partIndex = i + g * MAX_ROWS;
//                 row.push(parts[partIndex] || { partNumber: "", totalQty: "" });
//             }
//             rows.push(row);
//         }
//         return rows;
//     };

//     return (
//         <>
//             {stickers?.packingLabelResponses?.map((details, index) => {
//                 const gridRows = createGridRows(details?.packingDetailsRes || []);
//                 return (
//                     <div key={index} style={pageContainer}>
//                         <div style={mainLabel}>
//                             <div style={leftSection}>
//                                 <div style={header}>
//                                     {stickers?.parentPartNumber}
//                                 </div>
//                                 <div style={barcodeContainer}>
//                                     <Barcode
//                                         value={stickers?.parentPartNumber || "BARCODE"}
//                                         width={1.4}
//                                         height={30}
//                                         margin={0}
//                                         displayValue={false}
//                                         format="CODE128"
//                                     />
//                                 </div>
//                                 <table style={table}>
//                                     <thead>
//                                         <tr>
//                                             <th style={th}>S.No</th>
//                                             <th style={th}>Part Numbers</th>
//                                             <th style={th}>QTY</th>
//                                             <th style={th}>Part Numbers</th>
//                                             <th style={th}>QTY</th>
//                                             <th style={th}>Part Numbers</th>
//                                             <th style={th}>QTY</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {gridRows?.map((row, i) => (
//                                             <tr key={i}>
//                                                 <td style={td}>{i + 1}</td>
//                                                 {row.map((item, idx) => (
//                                                     <React.Fragment key={idx}>
//                                                         <td style={td}>{item?.partNumber}</td>
//                                                         <td style={td}>{item?.totalQty}</td>
//                                                     </React.Fragment>
//                                                 ))}
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div style={rightSection}>
//                                 <div style={sectionStyle}>
//                                     <span style={badge}>OTIS-BW</span>
//                                 </div>
//                                 <div style={sectionStyle}>
//                                     <div style={text}>PACKED BY</div>
//                                     <div style={text}>{details?.packedBy ?? sessionStorage.getItem("name")}</div>
//                                 </div>
//                                 <div style={sectionStyle}>
//                                     <div style={text}>DATE</div>
//                                     <div style={text}>{details?.packedDate ? dayjs(details?.packedDate).format("DD-MM-YYYY") : ""}</div>
//                                 </div>
//                                 <div style={sectionStyle}>
//                                     <div style={text}>Product Color</div>
//                                 </div>
//                                 <div style={sectionStyle}>
//                                     <div style={text}>Case No.</div>
//                                     <div style={text}>{index + 1}</div>
//                                 </div>
//                                 <div style={sectionStyle}>
//                                     <div style={text}>{stickers?.packingLabelResponses?.length}</div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div style={secondLabel}>
//                             <div>
//                                 <h3>Contract No: {stickers?.crNumber}</h3>
//                                 <Barcode
//                                     value={stickers?.crNumber || "BARCODE"}
//                                     width={1}
//                                     height={20}
//                                     displayValue={false}
//                                     format="CODE128"
//                                 />
//                             </div>
//                             <div>
//                                 <h3>Item : {stickers?.parentPartNumber}</h3>
//                                 <Barcode
//                                     value={stickers?.parentPartNumber || "BARCODE"}
//                                     width={1}
//                                     height={20}
//                                     displayValue={false}
//                                     format="CODE128"
//                                 />
//                             </div>
//                             <div style={footerRow}>
//                                 <div>
//                                     <h3 sty>Qty: {details?.totalQty}</h3>
//                                     <Barcode
//                                         value={details?.totalQty || "BARCODE"}
//                                         width={1}
//                                         height={17}
//                                         displayValue={false}
//                                         format="CODE128"
//                                     />
//                                 </div>
//                                 <div style={caseBox}>
//                                     Case No
//                                     <br />
//                                     {index + 1} / {stickers?.packingLabelResponses?.length}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </>
//     );
// };

// const pageContainer = {
//     width: "100%",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
// };

// const mainLabel = {
//     width: "150mm",
//     height: "100mm",
//     border: "1px solid #000",
//     display: "flex",
//     borderRadius: "5px",
//     pageBreakAfter: "always"
// };

// const leftSection = {
//     width: "85%",
//     padding: "2px"
// };

// const rightSection = {
//     width: "15%",
//     borderLeft: "1px solid #ccc",
//     display: "flex",
//     flexDirection: "column"
// };

// const header = {
//     fontSize: "16px",
//     fontWeight: "700",
//     padding: "3px",
//     borderBottom: "1px solid #ccc"
// };

// const barcodeContainer = {
//     textAlign: "center",
//     padding: "5px 0",
//     borderBottom: "1px solid #ccc"
// };

// const table = {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: "12px"
// };

// const th = {
//     border: "1px solid #000",
//     textAlign: "center",
//     fontWeight: "600"
// };

// const td = {
//     border: "1px solid #000",
//     textAlign: "center",
//     lineHeight: "19px"
// };

// const sectionStyle = {
//     flex: 1,
//     borderBottom: "1px solid #ccc",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center"
// };

// const text = {
//     fontSize: "11px",
//     margin: 0
// };

// const badge = {
//     backgroundColor: "#000",
//     color: "#fff",
//     padding: "2px 6px",
//     fontSize: "11px"
// };

// const secondLabel = {
//     width: "150mm",
//     height: "100mm",
//     border: "1px solid #000",
//     borderRadius: "5px",
//     // marginTop: "10px",
//     padding: "10px",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between"
// };

// const footerRow = {
//     display: "flex",
//     justifyContent: "space-between"
// };

// const caseBox = {
//     border: "2px solid #000",
//     borderRadius: "5px",
//     padding: "5px 10px",
//     textAlign: "center",
//     fontWeight: "600",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
// };

import dayjs from "dayjs";
import React from "react";
import Barcode from "react-barcode";

export const MainBarcode = ({ stickers }) => {

    const MAX_ROWS = 12;
    const GROUPS = 3;

    const createGridRows = (parts = []) => {
        const rows = [];
        for (let i = 0; i < MAX_ROWS; i++) {
            const row = [];
            for (let g = 0; g < GROUPS; g++) {
                const partIndex = i + g * MAX_ROWS;
                row.push(parts[partIndex] || { partNumber: "", totalQty: "" });
            }
            rows.push(row);
        }
        return rows;
    };

    return (
        <>
            {stickers?.packingLabelResponses?.map((details, index) => {
                const gridRows = createGridRows(details?.packingDetailsRes || []);
                return (
                    <React.Fragment key={index}>

                        <div style={pageStyle}>
                            <div style={rotateContainer}>
                                <div style={leftSection}>
                                    <div style={header}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div><h1 style={{padding:0,margin:0,fontSize:"28px",whiteSpace: "nowrap"}}>{stickers?.parentPartNumber}</h1></div>
                                            <div>
                                                <p style={{ fontSize: "14px", padding: 0, margin: 0 }}>
                                                    {details?.barCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={barcodeContainer}>
                                        <Barcode
                                            value={details?.barCode || "BARCODE"}
                                            width={1.4}
                                            height={30}
                                            margin={0}
                                            displayValue={false}
                                            format="CODE128"
                                        />
                                    </div>
                                    <div style={{ width: "100%", display: "flex" }}>
                                        <h6 style={{ width: "50%", padding: 0, margin: 0 }}>GROSS WEIGHT</h6>
                                        <h6 style={{ width: "50%", padding: 0, margin: 0 }}>{stickers?.description}</h6>
                                    </div>
                                    <table style={table}>
                                        <thead>
                                            <tr>
                                                <th style={th}>S.No</th>
                                                <th style={th}>Part Numbers</th>
                                                <th style={th}>QTY</th>
                                                <th style={th}>Part Numbers</th>
                                                <th style={th}>QTY</th>
                                                <th style={th}>Part Numbers</th>
                                                <th style={th}>QTY</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gridRows.map((row, i) => (
                                                <tr key={i}>
                                                    <td style={td}>{i + 1}</td>
                                                    {row.map((item, idx) => (
                                                        <React.Fragment key={idx}>
                                                            <td style={td}>{item?.partNumber}</td>
                                                            <td style={td}>{item?.totalQty}</td>
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={rightSection}>
                                    <div style={sectionStyle}>
                                        <span style={badge}>OTIS-BW</span>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>PACKED BY</div>
                                        <div style={text}>
                                            {stickers?.packedBy ?? sessionStorage.getItem("name")}
                                        </div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>DATE</div>
                                        <div style={text}>
                                            {stickers?.packedDate
                                                ? dayjs(stickers?.packedDate).format("DD-MM-YYYY")
                                                : ""}
                                        </div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>Product Color</div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>Case No.</div>
                                        <div style={text}>{index + 1}</div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>
                                            {stickers?.packingLabelResponses?.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={pageStyle}>
                            <div style={secondRotateContainer}>
                                <div style={{ padding: "0 8px" }}>
                                    <h1 style={{ padding: 0, margin: 0,fontSize:"30px",whiteSpace:"nowrap"}}>
                                        Contract No: {stickers?.crNumber}
                                    </h1>
                                    <Barcode
                                        value={stickers?.crNumber || "BARCODE"}
                                        width={1}
                                        height={20}
                                        displayValue={false}
                                        format="CODE128"
                                    />
                                </div>
                                <div style={{ padding: "0 8px" }}>
                                    <h1 style={{ padding: 0, margin: 0, fontSize:"30px",whiteSpace:"nowrap"}}>
                                        Item : {stickers?.parentPartNumber}
                                    </h1>
                                    <Barcode
                                        value={stickers?.parentPartNumber || "BARCODE"}
                                        width={1}
                                        height={20}
                                        displayValue={false}
                                        format="CODE128"
                                    />
                                </div>
                                <div style={footerRow}>
                                    <div>
                                        <h1 style={{ padding: 0, margin: 0 ,fontSize:"30px",whiteSpace:"nowrap"}}>
                                            Qty: {(index + 1) === 1 ? "" : "Refer Box-"}1
                                        </h1>
                                        {(index + 1) === 1 &&
                                            <Barcode
                                                value={details?.totalQty || "BARCODE"}
                                                width={1}
                                                height={17}
                                                displayValue={false}
                                                format="CODE128"
                                            />
                                        }
                                    </div>
                                    <div style={caseBox}>
                                        Case No
                                        <br />
                                        {index + 1} / {stickers?.packingLabelResponses?.length}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </React.Fragment>
                );
            })}
        </>
    );
};

const pageStyle = {
    width: "99mm",
    height: "145mm",
    // pageBreakAfter: "always",
    breakAfter: "page",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // overflow: "hidden",         
    boxSizing: "border-box",
    position: "relative",
    pageBreakInside: "avoid", 
    breakInside: "avoid",
    margin:0
};

// const rotateContainer = {
//     width: "150mm",
//     height: "100mm",
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%) rotate(90deg)",
//     transformOrigin: "center center",
//     display: "flex",
//     flexDirection: "row",
//     boxSizing: "border-box",
//     border: "1px solid black",
//     overflow: "hidden",    
//     backgroundColor: "red"     
// };

// const rotateContainer = {
//     width: "150mm",           
//     height: "100mm",          
//     position: "absolute",
//     top: "25mm",              
//     left: "0",
//     transform: "rotate(90deg)",
//     transformOrigin: "center center",
//     display: "flex",
//     flexDirection: "row",
//     boxSizing: "border-box",
//     border: "1px solid black",
//     backgroundColor: "yellow"       
//     // overflow: "hidden",
// };

const rotateContainer = {
    width: "145mm",
    height: "95mm",
    position: "absolute",
    top: "52%",
    left: "52%",
    marginTop: "-47mm",   
    marginLeft: "-73mm",  
    transform: "rotate(90deg)",
    transformOrigin: "center center",
    display: "flex",
    flexDirection: "row",
    boxSizing: "border-box",
    border: "1px solid black",
    // overflow: "hidden",
};

// ✅ Page 2 rotate container — separate style
// const secondRotateContainer = {
//     width: "150mm",
//     height: "100mm",
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%) rotate(90deg)",
//     transformOrigin: "center center",
//     display: "flex",
//     flexDirection: "column",    
//     justifyContent: "space-evenly",
//     boxSizing: "border-box",
//     border: "1px solid black",
//     // overflow: "hidden",         
//     padding: "3mm",
//     // backgroundColor: "green"
// };

const secondRotateContainer = {
    width: "145mm",
    height: "95mm",
    position: "absolute",
    top: "52%",
    left: "52%",
    marginTop: "-47mm",       
    marginLeft: "-73mm", 
    transform: "rotate(90deg) scale(0.98)",
    transformOrigin: "center center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    boxSizing: "border-box",
    border: "1px solid black",
    // overflow: "hidden",
    padding: "3mm",
};

const leftSection = {
    width: "85%",
    height: "100%",
    borderRight: "1px solid black",
    padding: "2mm",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    // overflow: "hidden",         
};

const rightSection = {
    width: "15%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    // overflow: "hidden",  
};

const header = {
    fontSize: "13px",
    fontWeight: "700",
    padding: "3px",
    borderBottom: "1px solid #000",
};

const barcodeContainer = {
    textAlign: "center",
    padding: "3px 0",
    borderBottom: "1px solid #000",
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10px",
    border: "1px solid #000",
};

const th = {
    border: "1px solid #000",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: "14px",
};

const td = {
    border: "1px solid #000",
    textAlign: "center",
    lineHeight: "16px",
    fontWeight:"900"
};

const sectionStyle = {
    flex: 1,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // overflow: "hidden",
};

const text = {
    fontSize: "11px",
    margin: 0,
};

const badge = {
    backgroundColor: "#000",
    color: "#fff",
    padding: "4px 8px",
    fontSize: "11px",
};

const footerRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 8px",
};

const caseBox = {
    border: "2px solid #000",
    borderRadius: "5px",
    padding: "5px 10px",
    textAlign: "center",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};