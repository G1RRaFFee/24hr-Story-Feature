"use client";

import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import useImageUpload from "@/hook/imageUpload";
import Story from "./types/story.type";
import {
  loadStoriesFromLocalStorage,
  saveStoriesToLocalStorage,
} from "@/helpers/story.helper";

import ProgressBar from "@/components/shared/ProgressBar";
import List from "@/components/shared/List";
import { Button } from "@/components/ui/button";

export default function Home(): JSX.Element {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const [stories, setStories] = useState<Story[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isViewerOpen, setViewerOpen] = useState<boolean>(false);
  const { image, error, isLoading, handleImageUpload, resetImage } =
    useImageUpload();

  const handleSaveClick = (image: string | null) => {
    saveImage(image);
    setIsDialogOpen(false);
  };

  const saveImage = (image: string | null): void => {
    if (!image) return;

    const newStory: Story = { id: uuidv4(), isViewed: false, src: image };
    const updatedStories = [newStory, ...stories];

    saveStoriesToLocalStorage(updatedStories);
    setStories(updatedStories);
  };

  useEffect(() => {
    const loadStories = async () => {
      const stories = await loadStoriesFromLocalStorage();
      setStories(stories);
    };

    loadStories();
  }, [image]);

  const handleSegmentComplete = (segmentIndex: number): void => {
    const currentStoryId = stories[segmentIndex].id;
    setViewedStories((prev) => new Set(prev).add(currentStoryId));

    if (segmentIndex < stories.length - 1) {
      setCurrentStoryIndex(segmentIndex + 1); // Переключаемся на следующую историю
    } else {
      markStoriesAsViewedAndReorder(); // Помечаем истории как просмотренные и переупорядочиваем
      setViewerOpen(false); // Закрываем Dialog
    }
  };

  const markStoriesAsViewedAndReorder = (): void => {
    const updatedStories = stories.map((story) =>
      viewedStories.has(story.id) ? { ...story, isViewed: true } : story
    );

    // Перемещаем просмотренные истории в конец списка
    const reorderedStories = [
      ...updatedStories.filter((story) => !story.isViewed),
      ...updatedStories.filter((story) => story.isViewed),
    ];

    setStories(reorderedStories);
    saveStoriesToLocalStorage(reorderedStories); // Сохраняем изменения в localStorage
  };

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
                setCurrentStoryIndex(stories.indexOf(story));
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
            disabled={isLoading}
          />
          {isLoading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
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
      <Dialog
        open={isViewerOpen}
        onOpenChange={(open) => {
          if (!open) {
            markStoriesAsViewedAndReorder();
          }
          setViewerOpen(open);
        }}
      >
        <DialogTrigger asChild />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Story Viewer</DialogTitle>
          </DialogHeader>
          <ProgressBar
            duration={3000}
            segments={stories.length}
            currentSegment={currentStoryIndex}
            initialProgress={stories.map((_, index) =>
              index < currentStoryIndex ? 100 : 0
            )}
            onSegmentComplete={handleSegmentComplete}
          />
          {stories.length > 0 && stories[currentStoryIndex]?.src && (
            <Image
              height={500}
              width={300}
              src={stories[currentStoryIndex].src}
              alt="Story"
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
