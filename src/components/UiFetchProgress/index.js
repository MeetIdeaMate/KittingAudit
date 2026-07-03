import { useEffect, useRef, useState } from "react";
import { Progress } from "antd";

export const UiFetchProgress = ({ loading, text }) => {
    const [percent, setPercent] = useState(0);
    const timer = useRef();

    useEffect(() => {
        if (loading) {
            timer.current = setInterval(() => {
                setPercent((prev) => {
                    if (prev >= 95) return prev;
                    const step =
                        prev < 30 ? 3 :
                            prev < 60 ? 2 :
                                prev < 90 ? 1 :
                                    0.5;
                    return Math.min(prev + step, 95);
                });
            }, 200);
        } else {
            clearInterval(timer.current);
            setPercent(100);
            setTimeout(() => {
                setPercent(0);
            }, 500);
        }
        return () => clearInterval(timer.current);
    }, [loading]);

    if (!loading && percent === 0) return null;

    return (
        <div style={overlayStyle}>
            <div style={containerStyle}>
                <h3>{text}</h3>
                <Progress
                    percent={Math.round(percent)}
                    status={percent === 100 ? "success" : "active"}
                    strokeWidth={20}
                />
                <p>{Math.round(percent)}% Completed</p>
            </div>
        </div>
    );
};

const overlayStyle = {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(2px)",
    zIndex: 99999,
};

const containerStyle = {
    width: 500,
    padding: 25,
    borderRadius: 10,
    background: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
};