import VideoCard from "../components/VideoCard";

const Home = () => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {Array(15)
        .fill(0)
        .map((item, index) => (
          <VideoCard
            key={index}
            title={"Video Title"}
            description={"Video Description"}
            views={123}
            uploadDate={"2022-01-01"}
            thumbnail={"https://placehold.co/600x400"}
          />
        ))}
    </div>
  );
};

export default Home;
