import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Skeleton } from "primereact/skeleton";

const OtherChart = ({ numbers = [], loading }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = {
      labels: ["Videos", "Users", "Comments", "Artists", "Categories", "Tags"],
      datasets: [
        {
          label: "Some other stats",
          data: numbers,
          backgroundColor: [
            "rgba(255, 159, 64, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: [
            "rgb(255, 159, 64)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(255, 99, 132)",
            "rgb(255, 206, 86)",
          ],
          borderWidth: 1,
        },
      ],
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [numbers]);

  if (loading) {
    return <Skeleton height={500}></Skeleton>;
  }

  return (
    <Card>
      <Chart type="bar" data={chartData} options={chartOptions} />
    </Card>
  );
};

export default OtherChart;
