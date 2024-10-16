import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import VideoDetail from "./pages/VideoDetail";
import Favorite from "./pages/Favorite";
import Upload from "./pages/Upload";
import Tag from "./pages/Tag";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/tag" element={<Tag />}></Route>
        <Route path="/favorite" element={<Favorite />}></Route>
        <Route path="/upload" element={<Upload />}></Route>
        <Route path="/video/:videoId" element={<VideoDetail />}></Route>
        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
        <Route path="/profile/:userId" element={<UserProfile />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
