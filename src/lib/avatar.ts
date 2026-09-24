export const MAX_AVATAR_BYTES = 1 * 1024 * 1024 // 1 MB

export function validateAvatarFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Please choose an image file (PNG, JPG, GIF, etc).'
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return 'Image must be 1 MB or smaller.'
  }
  return null
}

export function avatarFileExtension(file: File): string {
  const fromName = file.name.split('.').pop()
  if (fromName && fromName.length <= 5) return fromName.toLowerCase()
  return file.type.split('/')[1] ?? 'png'
}
