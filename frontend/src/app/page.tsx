"use client";
// TODO: Проблема, при загрузке картинки, вызывается рендер StoriesSkeleton
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { JSX, useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import useImageUpload from "@/hook/imageUpload";
import Story from "../types/story.type";
import {
  loadStoriesFromLocalStorage,
  saveStoriesToLocalStorage,
} from "@/helpers/story.helper";

import List from "@/components/shared/List";
import { Button } from "@/components/ui/button";
import StoryViewer from "@/components/shared/StoryViewer";
import { ONE_DAY, ONE_MINUTE } from "@/constants/story.constant";
import StoriesSkeleton from "@/components/shared/StoriesSkeleton";

export default function Home(): JSX.Element {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  );
  const [stories, setStories] = useState<Story[]>([]);
  const [isStoriesLoading, setIsStoriesLoading] = useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isViewerOpen, setViewerOpen] = useState<boolean>(false);
  const { image, error, isImageLoading, handleImageUpload, resetImage } =
    useImageUpload();

  const handleSaveClick = (image: string | null) => {
    saveImage(image);
    setIsDialogOpen(false);
  };

  const saveImage = (image: string | null): void => {
    if (!image) return;

    const newStory: Story = {
      id: uuidv4(),
      isViewed: false,
      src: image,
      createdAt: Date.now(),
    };
    const updatedStories = [newStory, ...stories];

    saveStoriesToLocalStorage(updatedStories);
    setStories(updatedStories);
  };

  useEffect(() => {
    const loadStories = async () => {
      setIsStoriesLoading(true);
      try {
        const loadedStories = await loadStoriesFromLocalStorage();
        setStories(loadedStories);
      } finally {
        setTimeout(() => {
          setIsStoriesLoading(false);
        }, 1000);
      }
    };

    loadStories();

    const cleanUpStories = setInterval(cleanUpExpiresStories, ONE_MINUTE);
    return () => clearInterval(cleanUpStories);
  }, [image]);

  const cleanUpExpiresStories = useCallback(() => {
    setStories((previousStories) => {
      const filteredStories = previousStories.filter(
        (story) => Date.now() - story.createdAt < ONE_DAY
      );
      if (filteredStories.length !== previousStories.length) {
        saveStoriesToLocalStorage(filteredStories);
      }
      console.log("clean up");
      return filteredStories;
    });
  }, []);

  if (isStoriesLoading) {
    return <StoriesSkeleton />;
  }

  return (
    <main className="font-[family-name:var(--font-geist-sans)] h-full w-xl flex items-center justify-center">
      <header className="flex items-center gap-2">
        <button
          className="p-2 hover:cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={20} />
        </button>

        <List<Story>
          className="flex items-center justify-center gap-2"
          items={stories}
          renderItem={(story) => (
            <Avatar
              key={story.id}
              className={`h-12 w-12 hover:cursor-pointer ${
                story.isViewed ? "opacity-50" : ""
              }`}
              onClick={() => {
                setSelectedStoryIndex(stories.indexOf(story));
                setViewerOpen(true);
              }}
            >
              <AvatarImage src={story.src} alt="User story" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
        />
      </header>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Story</DialogTitle>
            <DialogDescription>desc.</DialogDescription>
          </DialogHeader>
          <h1>Upload an Image</h1>
          <input
            type="file"
            className="hover:cursor-pointer"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isImageLoading}
          />
          {isImageLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {image && (
            <div>
              <h2>Uploaded Image:</h2>
              <Image
                height={100}
                width={100}
                src={image}
                alt="Uploaded image"
              />
              <div className="flex justify-center items-center gap-2">
                <Button onClick={resetImage}>Reset Image</Button>
                <Button onClick={() => handleSaveClick(image)}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {selectedStoryIndex !== null && isViewerOpen && (
        <StoryViewer
          setViewerOpen={setViewerOpen}
          isViewerOpen={isViewerOpen}
          stories={stories}
          initialIndex={selectedStoryIndex}
        />
      )}
    </main>
  );
}
