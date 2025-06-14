'use client';

import Link from 'next/link';

export default function RoomsPage() {
  // 仮のルーム一覧（今後 Firebase から取得）
  const mockRooms = [
    { id: 'room1', name: '雑談ルーム' },
    { id: 'room2', name: '仕事の話' },
    { id: 'room3', name: '質問・相談' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">チャットルーム一覧</h1>

        <ul className="space-y-3">
          {mockRooms.map((room) => (
            <li key={room.id}>
              <Link
                href={`/rooms/${room.id}`}
                className="block px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded"
              >
                {room.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}