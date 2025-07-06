"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { useEffect, useState } from "react"

interface ShareButtonProps {
  title: string
  text: string
  url?: string
  iconOnly?: boolean
  className?: string
}

export function ShareButton({ title, text, url, iconOnly, className }: ShareButtonProps) {
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    setCurrentUrl(url || window.location.href)
  }, [url])

  const handleShare = async () => {
    const shareUrl = currentUrl || window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed")
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        // Could add a toast notification here
      } catch (error) {
        console.log("Failed to copy to clipboard")
      }
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className={className} title="Share">
      <Share2 className="h-4 w-4" />
      {!iconOnly && <span className="ml-2">Share</span>}
    </Button>
  )
}
