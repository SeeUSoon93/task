import { Card, Avatar, Button } from "antd";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs"; // 날짜 처리를 위한 라이브러리
import ApexCharts from "react-apexcharts";

export default function UserInfo({ user, logout }) {
  const [taskData, setTaskData] = useState([]);
  const [doing, setDoing] = useState([]);
  const [done, setDone] = useState([]);
  const [chartData, setChartData] = useState({}); // 차트 데이터 저장

  useEffect(() => {
    setDoing(taskData.filter((item) => item.isDone === false));
    setDone(taskData.filter((item) => item.isDone === true));

    // 월별 데이터 준비 함수 호출
    prepareChartData(taskData);
  }, [taskData]);

  const fetchTasks = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "task"));
      const tasks = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((task) => task.userUid === user.uid);
      setTaskData(tasks);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);
  // 월별로 데이터를 그룹화하고 차트 데이터를 준비하는 함수
  const prepareChartData = (data) => {
    const currentYear = dayjs().year(); // 현재 연도 자동 계산
    // 각 월에 대해 독립적인 객체를 초기화
    const monthlyData = Array.from({ length: 12 }, () => ({
      doing: 0,
      done: 0
    }));

    data.forEach((task) => {
      const deadline = dayjs(task.deadline); // task의 deadline을 dayjs로 파싱
      const taskYear = deadline.year();
      const taskMonth = deadline.month(); // 0: 1월, 1: 2월 ...

      if (taskYear === currentYear) {
        if (task.isDone) {
          monthlyData[taskMonth].done += 1; // 완료된 작업 수 증가
        } else {
          monthlyData[taskMonth].doing += 1; // 진행 중인 작업 수 증가
        }
      }
    });

    // 차트에 사용할 데이터로 변환
    const categories = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월"
    ];
    const doingSeries = monthlyData.map((data) => data.doing);
    const doneSeries = monthlyData.map((data) => data.done);

    setChartData({
      series: [
        { name: "진행 중", data: doingSeries },
        { name: "완료", data: doneSeries }
      ],
      options: {
        chart: {
          type: "line",
          height: 350,
          fontFamily: "SUITE600" // 폰트 패밀리 설정
        },
        markers: {
          size: 5 // 마커 크기 설정 (데이터 포인트 마커 표시)
        },
        stroke: {
          curve: "smooth",
          width: 3 // 라인 두께 설정
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: "16px", // x축 폰트 크기 설정
              fontFamily: "SUITE800" // x축 폰트 패밀리 설정
            }
          }
        },
        yaxis: {
          min: 0, // y축 최소값 설정
          max: 15, // y축 최대값 설정
          title: {
            text: "작업 수",
            style: {
              fontSize: "16px", // y축 제목 폰트 크기 설정
              fontFamily: "SUITE800" // y축 제목 폰트 패밀리 설정
            }
          },
          labels: {
            style: {
              fontSize: "16px", // y축 폰트 크기 설정
              fontFamily: "SUITE800" // y축 폰트 패밀리 설정
            }
          }
        },
        legend: {
          fontSize: "16px", // 범례 폰트 크기 설정
          fontFamily: "SUITE800" // 범례 폰트 패밀리 설정
        },
        tooltip: {
          style: {
            fontSize: "16px", // 툴팁 폰트 크기 설정
            fontFamily: "SUITE600" // 툴팁 폰트 패밀리 설정
          }
        }
      }
    });
  };

  return (
    <div>
      <Card
        style={{
          fontFamily: "SUITE600",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "15px",
          border: "none",
          position: "relative",
          marginTop: "20px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <Avatar
              size={{
                xs: 24,
                sm: 32,
                md: 40,
                lg: 64,
                xl: 80,
                xxl: 100
              }}
              src={user.photoURL}
            />
          </div>
          <div style={{ marginLeft: "15px" }}>
            <h2>{user.displayName}님 환영합니다!</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
          <Button
            onClick={logout}
            style={{
              fontFamily: "SUITE600",
              borderRadius: "15px",
              fontSize: "16px"
            }}
          >
            로그아웃
          </Button>
        </div>
      </Card>

      {/* 차트를 표시하는 Card */}
      <Card
        style={{
          fontFamily: "SUITE600",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "15px",
          border: "none",
          position: "relative",
          marginTop: "20px"
        }}
      >
        {chartData.series && (
          <ApexCharts
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={450}
          />
        )}
      </Card>
    </div>
  );
}
