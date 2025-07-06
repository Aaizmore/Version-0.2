// components/auth/user-nav.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export function UserNav() {
  const { data: session } = useSession()
  const name = session?.user?.name || null
  const image = session?.user?.image || null
  const displayName = name || "No Name"

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          {image ? (
            <AvatarImage src={image || "/placeholder.svg"} alt={name || "Avatar"} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// components/ui/avatar-upload.tsx
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AvatarUploadProps {
  userName?: string | null
  userImage?: string | null
  onChange: (file: File) => void
}

export function AvatarUpload({ userName, userImage, onChange }: AvatarUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const initials =
    userName
      ?.split(" ")
      .map((n: string) => n[0])
      ?.join("") || ""

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      onChange(file) // Notify parent component of the selected file
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        {userImage ? (
          <AvatarImage src={userImage || "/placeholder.svg"} alt={userName || "Avatar"} />
        ) : (
          <AvatarFallback>{initials}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex items-center space-x-2">
        <Input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleFileChange} />
        <label htmlFor="avatar-upload">
          <Button variant="outline" size="sm" asChild>
            <span className="sr-only">Upload Avatar</span>
            Upload
          </Button>
        </label>
        {selectedFile && <span className="text-sm text-muted-foreground">{selectedFile.name}</span>}
      </div>
    </div>
  )
}

// components/blog/post-card.tsx
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PostCardProps {
  title: string
  content: string
  authorName: string
  authorImage?: string | null
  slug: string
}

export function PostCard({ title, content, authorName, authorImage, slug }: PostCardProps) {
  const authorInitials = authorName
    .split(" ")
    .map((n: string) => n[0])
    .join("")

  return (
    <div className="border rounded-md p-4">
      <Link href={`/blog/${slug}`}>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600">{content.substring(0, 100)}...</p>
      </Link>
      <div className="mt-4 flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          {authorImage ? (
            <AvatarImage src={authorImage || "/placeholder.svg"} alt={authorName} />
          ) : (
            <AvatarFallback>{authorInitials}</AvatarFallback>
          )}
        </Avatar>
        <p className="text-sm text-gray-500">By {authorName}</p>
      </div>
    </div>
  )
}
// app/profile/page.tsx
;("use client")

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name || "")
  const [image, setImage] = useState(session?.user?.image || null)
  const [isLoading, setIsLoading] = useState(false)

  const displayName = name || "No Name"

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")

  const handleAvatarChange = async (file: File) => {
    setIsLoading(true)
    try {
      // Upload the image to a service like Cloudinary or S3
      // For simplicity, we'll just use a placeholder URL
      const imageUrl = URL.createObjectURL(file)

      setImage(imageUrl)
      await update({ image: imageUrl })
    } catch (error) {
      console.error("Error uploading avatar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    try {
      await update({ name: name })
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:order-2 flex justify-center">
          <AvatarUpload userName={name} userImage={image} onChange={handleAvatarChange} />
        </div>
        <div className="md:order-1">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" value={name} onChange={handleNameChange} />
            </div>
            <Button onClick={handleUpdateProfile} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
