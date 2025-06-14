'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sendMessageToRoom, subscribeToMessages } from '@/lib/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function RoomPage() {
    const { roomId } = useParams();
    const [text, setText] = useState('');
    const [messages, setMessages] = useState<any[]>([]); // ← ここでメッセージ保持
    const router = useRouter();

    const handleLogout = async () => {
      await signOut(auth);
      router.push('/login');
    };  
    useEffect(() => {
      if (!roomId || Array.isArray(roomId)) return;
      console.log("📡 サブスク開始 roomId:", roomId);
      const unsubscribe = subscribeToMessages(roomId, (msgs) => {
        console.log("📥 メッセージ更新:", msgs);
        setMessages(msgs);
      });
      return () => {
        console.log("🧹 クリーンアップ");
        unsubscribe(); // クリーンアップ
      };
    }, [roomId]);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const user = auth.currentUser;
      if (!user || !roomId || Array.isArray(roomId)) return;
      await sendMessageToRoom({
        roomId,
        uid: user.uid,
        text,
      });
      setText('');
    };
  
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold">ルームID: {roomId}</h1>
  
        {/* メッセージ一覧 */}
        <div className="space-y-2">
          {messages.map((msg) => {
            const isMyMessage = msg.uid === auth.currentUser?.uid;
            return (
              <div
                key={msg.id}
                className={`p-2 rounded max-w-[70%] ${
                  isMyMessage
                    ? 'ml-auto bg-blue-100 text-right'
                    : 'mr-auto bg-gray-100 text-left'
                }`}
              >
                {!isMyMessage && (
                  <p className="text-xs text-gray-500">👤 </p>
                )}
                <p>{msg.text}</p>
              </div>
            );
          })}
        </div>
  
        {/* メッセージ送信フォーム */}
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <input
            type="text"
            className="flex-1 border px-2 py-1 rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="メッセージを入力"
          />
          <button className="bg-blue-600 text-white px-4 py-1 rounded">送信</button>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 underline absolute top-4 right-4"
          >
            ログアウト
          </button>
        </form>
      </div>
    );
  }