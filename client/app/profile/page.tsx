"use client";

import { useState, useEffect } from 'react'
import { Feed } from "../(components)/Feed"
import { useIsMounted } from "../(hooks)/useIsMounted"
import { useAuth } from "../(contexts)/AuthContext"
import SimpleBar from "simplebar-react"
import { fetchUserPosts, Post } from "../(utils)/api"

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const { user, isAuthenticated, updateUserProfile } = useAuth()
  const isMounted = useIsMounted()
  const [userPosts, setUserPosts] = useState<Post[]>([])

  // Fetch user posts when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.walletAddress) {
      fetchUserPosts(user.walletAddress).then(posts => {
        setUserPosts(posts);
      });
    }
  }, [isAuthenticated, user]);

  if (!isMounted) return null
  
  if (!isAuthenticated || !user) {
    return (
      <SimpleBar className="w-[calc(100vw-156px)]">
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-bold mb-4">Please connect your wallet and sign in to view your profile</h2>
        </div>
      </SimpleBar>
    )
  }

  const handleEdit = () => setEditing(true)

  if (editing) {
    return (
      <SimpleBar className="w-[calc(100vw-156px)]">
        <div className="p-4">
          <form onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const username = fd.get('username') as string
            const bio = fd.get('bio') as string
            const profilePicUrl = fd.get('profilePicUrl') as string

            // Call API to update user profile
            const success = await updateUserProfile({
              username: username.trim() || null,
              bio: bio.trim() || null,
              profilePicUrl: profilePicUrl.trim() || null
            });
            
            if (success) {
              console.log('Profile updated successfully');
            } else {
              console.error('Failed to update profile');
            }
            setEditing(false)
          }} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Username:</label>
              <input
                name="username"
                className="w-full p-2 border border-[#2f3336] rounded"
                defaultValue={user?.username || ""}
                type="text"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Bio:</label>
              <textarea 
                name="bio" 
                defaultValue={user?.bio || ''} 
                className="p-2 border border-gray-300 rounded-md h-24"
              ></textarea>
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Profile picture URL:</label>
              <input
                name="profilePicUrl"
                className="w-full p-2 border border-[#2f3336] rounded"
                defaultValue={user?.profilePicUrl || ""}
                type="text"
              />
            </div>
            <div>
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </SimpleBar>
    )
  }

  return (
    <SimpleBar className="w-[calc(100vw-156px)]">
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
          <div className="flex flex-row items-center">
            {user?.profilePicUrl ? (
              <img 
                src={user.profilePicUrl} 
                alt="Profile picture" 
                width={48} 
                height={48} 
                className="rounded-full object-cover" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-bold">{user.username ? user.username.charAt(0) : '?'}</span>
              </div>
            )}
            <div className="flex flex-col ml-4">
              <span className="font-bold">{user.username || 'Anonymous'}</span>
              <span className="text-sm text-gray-600">{user.bio || 'No bio yet'}</span>
            </div>
          </div>
          <button 
            onClick={handleEdit} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
        </div>
        <Feed userPosts={userPosts} />
      </div>
    </SimpleBar>
  )
}
