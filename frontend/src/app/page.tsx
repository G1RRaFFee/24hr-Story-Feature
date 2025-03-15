"use client";

import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { JSX, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useImageUpload from "@/hook/imageUpload";

export default function Home(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { image, error, isLoading, handleImageUpload, resetImage } =
    useImageUpload();

  const saveImage = (image: string | null): void => {
    if (!image) return;
    localStorage.setItem("image", image);
    console.log("Image successfully save");
  };

  return (
    <main className="font-[family-name:var(--font-geist-sans)] h-full w-xl">
      <header className="flex items-center gap-2">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus size={20} />
        </Button>
        <Avatar>
          <AvatarImage
            src="https://i.pinimg.com/736x/e1/9e/b1/e19eb12d5bf236c2543cb38b297adc59.jpg"
            alt="User"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://i.pinimg.com/474x/21/78/a0/2178a0582649a6943cd4e3c631adec34.jpg"
            alt="User"
          />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://i.pinimg.com/474x/d6/a2/43/d6a2433136c595540b048eab5fcf9acb.jpg"
            alt="User"
          />
          <AvatarFallback>HJ</AvatarFallback>
        </Avatar>
      </header>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Story</DialogTitle>
            <h1>Upload an Image</h1>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isLoading}
            />
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {image && (
              <div>
                <h2>Uploaded Image:</h2>
                <img
                  src={image}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <button onClick={resetImage}>Reset Image</button>
                <button onClick={() => saveImage(image)}>Save</button>
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
