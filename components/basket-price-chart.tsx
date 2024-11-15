import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

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

        // @ts-ignore
        const chart = createChart(chartContainerRef.current, chartOptions);

        const lineSeries = chart.addLineSeries();
        // @ts-ignore
        lineSeries.setData(formattedData);

        // Handle crosshair move to update legend
        chart.subscribeCrosshairMove((param: any) => {
            if (!legendRef.current) return;
            console.log(param);

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
    }, [priceData]);

    return (
        <div className="relative">
            <div ref={chartContainerRef} className="w-full h-96" />
            <div
                ref={legendRef}
                className="absolute left-3 top-3 bg-black p-2 rounded z-50"
            ></div>
        </div>
    );
};

export default BasketPriceChart;
