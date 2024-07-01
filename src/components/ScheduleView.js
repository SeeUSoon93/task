import React from "react";
import ReactApexChart from "react-apexcharts";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "./css/ScheduleView.css";

const ScheduleView = ({ projects }) => {
  const seriesData = projects.map((project) => ({
    data: project.schedules?.map((schedule) => {
      const startDate =
        schedule.startDate instanceof firebase.firestore.Timestamp
          ? schedule.startDate.toDate().getTime()
          : new Date(schedule.startDate).getTime();

      const endDate =
        schedule.endDate instanceof firebase.firestore.Timestamp
          ? schedule.endDate.toDate().getTime()
          : new Date(schedule.endDate).getTime();

      return {
        x: project.title,
        y: [startDate, endDate],
        label: {
          text: schedule.content,
        },
      };
    }),
  }));

  const options = {
    chart: {
      type: "rangeBar",
      width: "100%",
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 25,
      },
    },
    xaxis: {
      type: "datetime",
      position: "top",
      labels: {
        style: {
          fontFamily: "SUITE-400, sans-serif",
          fontSize: "15px",
        },
        formatter: function (val) {
          return new Date(val)
            .toLocaleDateString("ko-KR", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\./g, ".");
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "SUITE-900, sans-serif",
          fontSize: "20px",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const { dataPointIndex, w } = opts;
        return w.config.series[opts.seriesIndex].data[dataPointIndex].label
          .text;
      },
      style: {
        colors: ["#000"],
        fontSize: "15px",
        fontFamily: "SUITE-700, sans-serif",
      },
    },
    fill: {
      type: "solid",
      colors: projects.map((project) => `#${project.color}`),
      opacity: 0.8,
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.15,
        },
      },
    },
    shadow: {
      enabled: true,
      color: "#000",
      top: 3,
      left: 3,
      blur: 6,
      opacity: 0.2,
    },
  };

  return (
    <div className="chart-container" style={{ width: "90vw" }}>
      <ReactApexChart
        options={options}
        series={seriesData}
        type="rangeBar"
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default ScheduleView;
