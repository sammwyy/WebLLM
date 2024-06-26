import { createBrowserRouter } from "react-router-dom";

import Layout from "./Layout";
import ChatPage from "./pages/chat-page";
import NewPage from "./pages/new-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <NewPage />,
      },
      {
        path: "/chat/:chatId",
        element: <ChatPage />,
      },
    ],
  },
]);

export default router;
