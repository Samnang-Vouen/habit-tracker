import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { avatarFileExtension, validateAvatarFile } from '@/lib/avatar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import type { Profile } from '@/types/database'

interface AvatarUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile | null
  onUploaded: (avatarUrl: string) => Promise<{ error: string | null }>
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Upload failed. Please try again.'
}

export function AvatarUploadDialog({
  open,
  onOpenChange,
  profile,
  onUploaded,
}: AvatarUploadDialogProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function resetSelection() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setError(null)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0]
    event.target.value = ''
    if (!selected) return

    const validationError = validateAvatarFile(selected)
    if (validationError) {
      setError(validationError)
      setFile(null)
      setPreviewUrl(null)
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setError(null)
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  async function handleUpload() {
    if (!file || !user) return

    setUploading(true)
    setError(null)

    const path = `${user.id}/avatar.${avatarFileExtension(file)}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setUploading(false)
      setError(getErrorMessage(uploadError))
      return
    }

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(path)
    const avatarUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`

    const { error: saveError } = await onUploaded(avatarUrl)

    setUploading(false)

    if (saveError) {
      setError(saveError)
      return
    }

    resetSelection()
    onOpenChange(false)
  }

  const displayUrl = previewUrl ?? profile?.avatar_url ?? undefined

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!uploading) {
          onOpenChange(next)
          if (!next) resetSelection()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update avatar</DialogTitle>
          <DialogDescription>PNG, JPG or GIF. 1 MB max.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="size-24">
            <AvatarImage src={displayUrl} alt="Avatar preview" />
            <AvatarFallback>
              <Camera className="text-muted-foreground size-8" />
            </AvatarFallback>
          </Avatar>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Choose image
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button type="button" onClick={handleUpload} disabled={!file || uploading}>
            {uploading && <Spinner className="size-4" />}
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
