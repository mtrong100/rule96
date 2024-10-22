import React, { useMemo } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Skeleton } from "primereact/skeleton";

const VideoChart = ({ loading, dataSet = [], labels }) => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  // Memoize chart data
  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: "Videos uploaded by month",
          backgroundColor: documentStyle.getPropertyValue("--indigo-400"),
          borderColor: documentStyle.getPropertyValue("--indigo-500"),
          data: dataSet,
        },
      ],
    };
  }, [labels, documentStyle, dataSet]);

  const chartOptions = useMemo(() => {
    return {
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }, [textColor, textColorSecondary, surfaceBorder]);

  if (loading) {
    return <Skeleton height={430}></Skeleton>;
  }

  return (
    <Card>
      <Chart type="bar" data={chartData} options={chartOptions} />
    </Card>
  );
};

export default VideoChart;
