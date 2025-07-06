"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { createClient } from "@/lib/supabase/client"
import { generateSlug } from "@/lib/utils/slug"
import { useToast } from "@/hooks/use-toast"
import { cleanupUnusedImages } from "@/lib/utils/image-cleanup"
import type { Post } from "@/lib/types"
import { Save, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PostFormProps {
  post?: Post
  isEditing?: boolean
}

export function PostForm({ post, isEditing = false }: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [published, setPublished] = useState(post?.published || false)
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || "")
  const [images, setImages] = useState<string[]>(post?.images || [])
  const [originalImages, setOriginalImages] = useState<string[]>(post?.images || [])

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (post?.images) {
      setOriginalImages(post.images)
    }
  }, [post])

  const handleImageAdd = (imageUrl: string, altText?: string, caption?: string) => {
    setImages((prev) => [...prev, imageUrl])

    // Set as featured image if it's the first image
    if (!featuredImage && images.length === 0) {
      setFeaturedImage(imageUrl)
    }
  }

  const handleImageRemove = (imageUrl: string) => {
    setImages((prev) => prev.filter((img) => img !== imageUrl))

    // Remove from featured image if it matches
    if (featuredImage === imageUrl) {
      const remainingImages = images.filter((img) => img !== imageUrl)
      setFeaturedImage(remainingImages.length > 0 ? remainingImages[0] : "")
    }
  }

  const ensureUserProfile = async (user: any) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
          throw new Error("Failed to create user profile")
        }
      }
    } catch (error) {
      console.error("Profile creation error:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Validation Error",
        description: "Content is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a post",
          variant: "destructive",
        })
        return
      }

      // Ensure user profile exists
      await ensureUserProfile(user)

      const slug = generateSlug(title)
      const postData = {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt.trim() || null,
        featured_image: featuredImage || null,
        images: images.length > 0 ? images : null,
        published,
        author_id: user.id,
        updated_at: new Date().toISOString(),
      }

      let error
      if (isEditing && post) {
        const { error: updateError } = await supabase.from("posts").update(postData).eq("id", post.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase.from("posts").insert([postData])
        error = insertError
      }

      if (error) {
        console.error("Database error:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to save post",
          variant: "destructive",
        })
      } else {
        // Clean up unused images if editing
        if (isEditing) {
          try {
            const allUsedImages = [...images]
            // Get all images from all user's posts to avoid deleting images used elsewhere
            const { data: userPosts } = await supabase
              .from("posts")
              .select("images, featured_image")
              .eq("author_id", user.id)

            if (userPosts) {
              userPosts.forEach((userPost) => {
                if (userPost.images) {
                  allUsedImages.push(...userPost.images)
                }
                if (userPost.featured_image) {
                  allUsedImages.push(userPost.featured_image)
                }
              })
            }

            // Clean up unused images
            await cleanupUnusedImages(user.id, allUsedImages)
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError)
            // Don't fail the post save for cleanup issues
          }
        }

        toast({
          title: "Success",
          description: `Post ${isEditing ? "updated" : "created"} successfully`,
        })
        router.push(`/post/${slug}`)
        router.refresh()
      }
    } catch (error: any) {
      console.error("Submission error:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Preview Error",
        description: "Title and content are required for preview",
        variant: "destructive",
      })
      return
    }

    // Store current form data in localStorage for preview
    const previewData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      featured_image: featuredImage,
      images,
      published,
    }
    localStorage.setItem("post-preview", JSON.stringify(previewData))
    window.open("/preview", "_blank")
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto glass-morphism">
        <CardHeader>
          <CardTitle className="font-serif text-xl sm:text-2xl text-gradient">
            {isEditing ? "Edit Post" : "Create New Post"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
                className="text-base border-gray-200 focus:border-royal-400 focus:ring-royal-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-gray-700 font-medium">
                Excerpt (Optional)
              </Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of your post"
                rows={3}
                className="text-base resize-none border-gray-200 focus:border-royal-400 focus:ring-royal-400"
              />
            </div>

            <ImageUpload onImageAdd={handleImageAdd} onImageRemove={handleImageRemove} images={images} maxImages={10} />

            {featuredImage && (
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Featured Image</Label>
                <div className="text-sm text-muted-foreground">
                  The first uploaded image will be used as the featured image
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-700 font-medium">
                Content *
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={15}
                required
                className="text-base resize-none min-h-[300px] sm:min-h-[400px] border-gray-200 focus:border-royal-400 focus:ring-royal-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="published" className="text-gray-700 font-medium">
                Publish immediately
              </Label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none bg-gradient-to-r from-royal-600 to-gold-500 hover:from-royal-700 hover:to-gold-600 text-white font-medium"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
                disabled={!title.trim() || !content.trim()}
                className="flex-1 sm:flex-none border-royal-200 hover:bg-royal-50 bg-transparent"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="flex-1 sm:flex-none text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
