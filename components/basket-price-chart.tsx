import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

interface BasketPriceChartProps {
    priceData: { time: string; value: number }[]; // Time as ISO string
}

const BasketPriceChart: React.FC<BasketPriceChartProps> = ({ priceData }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Convert ISO string to Unix timestamp (seconds since epoch)
        const formattedData = priceData.map((data) => ({
            time: Math.floor(new Date(data.time).getTime() / 1000), // Convert to seconds
            value: data.value,
        }));

        const chartOptions = {
            layout: {
                textColor: "black",
                background: { type: "solid", color: "white" },
            },
            timeScale: {
                timeVisible: true, // Show time on the scale
                secondsVisible: true, // Show seconds if selected
            },
            grid: {
                vertLines: {
                    visible: true,
                },
                horzLines: {
                    visible: true,
                },
            },
            watermark: {
                visible: true,
                fontSize: 24,
                horzAlign: "center",
                vertAlign: "center",
                color: "rgba(255, 114, 22, 0.5)",
                text: "basket.something",
            },
        };
        // ESlint-disable-next-line
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const chart = createChart(chartContainerRef.current, chartOptions);

        const lineSeries = chart.addLineSeries();
        // ESlint-disable-next-line
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lineSeries.setData(formattedData); // Use cleaned-up data

        return () => chart.remove();
    }, [priceData]);

    return (
        <div
            ref={chartContainerRef}
            style={{ width: "100%", height: "400px" }}
        />
    );
};

export default BasketPriceChart;
