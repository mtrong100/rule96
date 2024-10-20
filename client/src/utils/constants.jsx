import {
  ChartBarStacked,
  LayoutDashboard,
  MessageCircle,
  Palette,
  SquarePlay,
  Tag,
  UsersRound,
} from "lucide-react";

export const SIDEBAR_LINKS = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard />,
    link: "/admin/dashboard",
  },
  {
    name: "Video",
    icon: <SquarePlay />,
    link: "/admin/video-manage",
  },
  {
    name: "Categories",
    icon: <ChartBarStacked />,
    link: "/admin/category-manage",
  },
  {
    name: "Tags",
    icon: <Tag />,
    link: "/admin/tag-manage",
  },
  {
    name: "Artists",
    icon: <Palette />,
    link: "/admin/artist-manage",
  },
  {
    name: "Users",
    icon: <UsersRound />,
    link: "/admin/user-manage",
  },
  {
    name: "Comments",
    icon: <MessageCircle />,
    link: "/admin/comment-manage",
  },
];

export const DATE_FILTERS = [
  {
    label: "Latest",
    value: "latest",
  },
  {
    label: "Past 24 hours",
    value: "past-24-hours",
  },
  {
    label: "Past week",
    value: "past-week",
  },
  {
    label: "Past month",
    value: "past-month",
  },
  {
    label: "Past year",
    value: "past-year",
  },
  {
    label: "Oldest",
    value: "oldest",
  },
];
