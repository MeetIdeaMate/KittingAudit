// components/BarChart.jsx
import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({
    labels = [],
    datasets = [],
    horizontal = false,
    stacked = false,
    height = 350,
    options = {},
    barThickness = 14,
}) => {
    const safeLabels = Array.isArray(labels) ? labels : [];
    const safeDatasets = Array.isArray(datasets) ? datasets : [];

    const updatedDatasets = safeDatasets.map(chartDetail => ({
        ...chartDetail,
        barThickness,
    }));

    const data = {
        labels: safeLabels,
        datasets: updatedDatasets,
    };

    const defaultOptions = {
        responsive: true,
        indexAxis: horizontal ? "y" : "x",
        plugins: {
            legend: { position: "top" },
        },
        scales: {
            x: {
                stacked: stacked,
                beginAtZero: true,
                grid: {
                    display: false,
                    drawBorder: false,
                },
            },
            y: {
                stacked: stacked,
                beginAtZero: true,
                grid: {
                    display: false,
                    drawBorder: false,
                },
            },
        },
    };

    return (
        <div style={{ height }}>
            <Bar data={data} options={{ ...defaultOptions, ...options }} />
        </div>
    );
};

export default BarChart;