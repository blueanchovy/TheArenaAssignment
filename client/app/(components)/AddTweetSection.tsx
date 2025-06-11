import { useState } from 'react';
import { useAuth } from '../(contexts)/AuthContext';
import { createPost } from '../(utils)/api';

interface AddTweetSectionProps {
  onPostCreated?: () => void;
}

export const AddTweetSection = ({ onPostCreated }: AddTweetSectionProps) => {
  const { user, isAuthenticated } = useAuth()
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (characterCount > 280 || !text.trim() || !user?.walletAddress) return
    
    setIsSubmitting(true)
    try {
      const newPost = await createPost({
        walletAddress: user.walletAddress,
        content: text.trim()
      })
      
      if (newPost) {
        setText('')
        setCharacterCount(0)
        // Notify parent component that a new post was created
        if (onPostCreated) {
          onPostCreated()
        }
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    const newCharacterCount = newText.length
    setCharacterCount(newCharacterCount)
    setText(newText)
  }

  // Only render the form when user is authenticated
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="What's on your mind?"
        className="w-full p-2 border-2 border-gray-300 rounded-md"
      />
      <div className="flex justify-between items-center mt-2">
        <span className={`text-sm ${characterCount > 280 ? 'text-red-500' : 'text-gray-400'}`}>
          {characterCount}/280
        </span>
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={characterCount === 0 || characterCount > 280 || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  )
}
