import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

const f = createUploadthing()

export const ourFileRouter = {
  listingImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) throw new UploadThingError("Faqat tizimga kirganlar rasm yuklay oladi")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
