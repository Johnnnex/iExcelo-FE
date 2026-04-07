import { Metadata } from "next";
import ChatRoom from "./ChatRoom";

export const metadata: Metadata = {
  title: "iExcelo - Student | Chat",
};

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ chatroomId: string }>;
}) {
  const { chatroomId } = await params;
  return <ChatRoom chatroomId={chatroomId} />;
}
