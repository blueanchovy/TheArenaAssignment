import Link from 'next/link';

export const LeftSidebar = () => (
  <div className="w-78 p-4 border-r border-[#2f3336]">
    <div className="flex flex-col space-y-2">
      <Link href="/">
        <div className="hover:bg-[#2f3336] text-xl p-2 rounded font-bold">Home</div>
      </Link>
      <Link href="/profile">
        <div className="hover:bg-[#2f3336] text-xl p-2 rounded font-bold">Profile</div>
      </Link>
    </div>
  </div>
);
