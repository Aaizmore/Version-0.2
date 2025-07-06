"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2, Trash2, Upload, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadAvatar, deleteAvatar } from "@/lib/utils/avatar-upload"

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  userName?: string
  userId: string
  onAvatarUpdate: (newAvatarUrl: string | null) => void
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-20 w-20",
  xl: "h-32 w-32",
}

export function AvatarUpload({ currentAvatarUrl, userName, userId, onAvatarUpdate, size = "xl" }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)
    setIsUploading(true)

    try {
      const result = await uploadAvatar(file, userId)

      if (result.success && result.url) {
        onAvatarUpdate(result.url)
        toast({
          title: "Success!",
          description: "Your profile picture has been updated successfully!",
        })
        // Clear preview since we have the real URL now
        setPreviewUrl(null)
        URL.revokeObjectURL(preview)
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload profile picture",
          variant: "destructive",
        })
        setPreviewUrl(null)
        URL.revokeObjectURL(preview)
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Something went wrong while uploading",
        variant: "destructive",
      })
      setPreviewUrl(null)
      URL.revokeObjectURL(preview)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteAvatar = async () => {
    setIsUploading(true)
    try {
      const success = await deleteAvatar(userId)

      if (success) {
        onAvatarUpdate(null)
        toast({
          title: "Removed",
          description: "Profile picture removed successfully!",
        })
      } else {
        toast({
          title: "Delete failed",
          description: "Failed to remove profile picture",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Something went wrong while removing the picture",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const displayUrl = previewUrl || currentAvatarUrl
  const initials =
    userName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar
          className={`${sizeClasses[size]} ring-4 ring-gold-200 shadow-xl transition-all duration-300 group-hover:ring-gold-300 group-hover:shadow-2xl group-hover:scale-105`}
        >
          <AvatarImage
            src={displayUrl || "/placeholder.svg"}
            alt={userName || "User avatar"}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-royal-100 to-gold-100 text-royal-700 font-bold text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Loading overlay */}
        {isUploading && (
          <div
            className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-royal-500/50 to-gold-500/50 backdrop-blur-sm flex items-center justify-center`}
          >
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}

        {/* Camera overlay on hover */}
        {!isUploading && size === "xl" && (
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-royal-500/80 to-gold-500/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-8 w-8 text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      {size === "xl" && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-gradient-to-r from-royal-50 to-gold-50 border-royal-200 hover:from-royal-100 hover:to-gold-100 hover:border-royal-300 transition-all duration-300"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-royal-600" />
            ) : (
              <Upload className="h-4 w-4 mr-2 text-royal-600" />
            )}
            <span className="text-gradient font-medium">{currentAvatarUrl ? "Change" : "Upload"}</span>
          </Button>

          {currentAvatarUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAvatar}
              disabled={isUploading}
              className="border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-red-600 font-medium">Remove</span>
            </Button>
          )}
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {size === "xl" && (
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground max-w-xs">
            <Sparkles className="inline h-3 w-3 mr-1 text-royal-500" />
            Upload a square image for best results. Photos are saved permanently!
          </p>
          <p className="text-xs text-royal-600 font-medium">Max 5MB • JPG, PNG, GIF, or WebP</p>
        </div>
      )}
    </div>
  )
}
