"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { useTheme } from "next-themes";

interface BasketPriceChartProps {
    priceData: { time: string; value: number }[]; // Time as ISO string
    name: string;
}

const BasketPriceChart: React.FC<BasketPriceChartProps> = ({
    priceData,
    name,
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Convert ISO string to Unix timestamp (seconds since epoch)
        const formattedData = priceData.map((data) => ({
            time: Math.floor(new Date(data.time).getTime() / 1000), // Convert to seconds
            value: data.value,
        }));
        const myPriceFormatter = (p: any) => p.toFixed(8);

        const chartOptions = {
            layout: {
                textColor: theme === "dark" ? "white" : "black",
                background: {
                    type: "solid",
                    color: theme === "dark" ? "#0f172a" : "#ffffff", // Tailwind `slate-900` and `white`
                },
            },
            timeScale: {
                timeVisible: true, // Show time on the scale
                secondsVisible: true, // Show seconds if selected
            },
            grid: {
                vertLines: {
                    color: theme === "dark" ? "#475569" : "#e5e7eb", // Tailwind `slate-600` and `gray-200`
                },
                horzLines: {
                    color: theme === "dark" ? "#475569" : "#e5e7eb",
                },
            },
            watermark: {
                visible: true,
                fontSize: 24,
                horzAlign: "center",
                vertAlign: "center",
                color:
                    theme === "dark"
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(0, 0, 0, 0.1)",
                text: "basket.something",
            },
            localization: {
                priceFormatter: myPriceFormatter,
            },
        };

        // @ts-ignore
        const chart = createChart(chartContainerRef.current, chartOptions);

        const lineSeries = chart.addLineSeries();
        lineSeries.priceScale().applyOptions({
            autoScale: false,
            scaleMargins: {
                top: 0.4,
                bottom: 0.3,
            },
        });
        // @ts-ignore
        lineSeries.setData(formattedData);

        // Handle crosshair move to update legend
        chart.subscribeCrosshairMove((param: any) => {
            if (!legendRef.current) return;

            let price = "--";
            if (param?.seriesData?.get(lineSeries)) {
                const data = param.seriesData.get(lineSeries) as {
                    value: number;
                };
                if (data?.value !== undefined) {
                    price = data.value.toFixed(2);
                }
            }

            // Update the legend content
            legendRef.current.innerHTML = `
                <div style="font-size: 16px;">${name}</div>
                <div style="font-size: 20px; font-weight: bold;">Price: $${price}</div>
            `;
        });

        // Set initial legend
        if (legendRef.current) {
            legendRef.current.innerHTML = `
                <div style="font-size: 16px;">${name}</div>
                <div style="font-size: 20px; font-weight: bold;">Price: --</div>
            `;
        }

        return () => chart.remove();
    }, [priceData, theme]);

    return (
        <div className="relative">
            <div
                ref={chartContainerRef}
                className="w-full h-96 sm:max-w-none max-w-[80vw] rounded"
            />
            <div
                ref={legendRef}
                className={
                    "absolute left-3 top-3 p-2 rounded z-50 bg-muted text-primary"
                }
            ></div>
        </div>
    );
};

export default BasketPriceChart;
