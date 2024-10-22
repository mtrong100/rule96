import React, { useEffect } from "react";
import useGetStats from "../hooks/useGetStats";
import CardCount from "../components/CardCount";
import { Skeleton } from "primereact/skeleton";
import VideoChart from "../components/VideoChart";
import OtherChart from "../components/OtherChart";

const Dashboard = () => {
  const {
    countStats,
    videoStats,
    loading,
    loading2,
    fetchCountStats,
    fetchVideoStats,
  } = useGetStats();

  useEffect(() => {
    fetchCountStats();
    fetchVideoStats();
  }, []);

  return (
    <div>
      <ul className="grid grid-cols-3 gap-2">
        {loading ? (
          Array(6)
            .fill(0)
            .map((item, index) => (
              <Skeleton key={index} height="144px"></Skeleton>
            ))
        ) : (
          <>
            <CardCount
              icon="pi-video"
              count={countStats?.videoCount}
              title="Total Videos"
            />
            <CardCount
              icon="pi-users"
              count={countStats?.userCount}
              title="Total Users"
            />
            <CardCount
              icon="pi-comment"
              count={countStats?.commentCount}
              title="Total comments"
            />
            <CardCount
              icon="pi-palette"
              count={countStats?.artistCount}
              title="Total Artists"
            />
            <CardCount
              icon="pi-book"
              count={countStats?.categoryCount}
              title="Total Categories"
            />
            <CardCount
              icon="pi-hashtag"
              count={countStats?.tagCount}
              title="Total Tags"
            />
          </>
        )}
      </ul>

      <div className="mt-5 space-y-5">
        <VideoChart
          loading={loading2}
          dataSet={videoStats?.videoCount}
          labels={videoStats?.months}
        />
        <OtherChart
          loading={loading2}
          numbers={[
            countStats?.videoCount,
            countStats?.userCount,
            countStats?.commentCount,
            countStats?.artistCount,
            countStats?.categoryCount,
            countStats?.tagCount,
          ]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
