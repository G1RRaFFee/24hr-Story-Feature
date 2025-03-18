"use client";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

import { Plus } from "lucide-react";
import {
  ChangeEvent,
  JSX,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import StoryViewer from "@/components/shared/StoryViewer";
import { ONE_DAY, ONE_MINUTE, ONE_SECOND } from "@/constants/story.constant";
import StoriesSkeleton from "@/components/shared/StoriesSkeleton";
import { StoryItem } from "@/components/shared/StoryItem";
import AddStoryButton from "@/components/shared/AddStoryButton";

export default function Home(): JSX.Element {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  );
  const [stories, setStories] = useState<Story[]>([]);
  const [isStoriesLoading, setIsStoriesLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const { handleImageUpload } = useImageUpload();

  useEffect(() => {
    const loadStories = async () => {
      setIsStoriesLoading(true);
      try {
        const loadedStories = await loadStoriesFromLocalStorage();
        setStories(loadedStories);
      } finally {
        setTimeout(() => {
          setIsStoriesLoading(false);
        }, ONE_SECOND);
      }
    };

    loadStories();

    const cleanUpStories = setInterval(cleanUpExpiresStories, ONE_MINUTE);
    return () => clearInterval(cleanUpStories);
  }, []);

  const cleanUpExpiresStories = useCallback(() => {
    setStories((previousStories) => {
      const filteredStories = previousStories.filter(
        (story) => Date.now() - story.createdAt < ONE_DAY
      );
      if (filteredStories.length !== previousStories.length) {
        saveStoriesToLocalStorage(filteredStories);
      }
      return filteredStories;
    });
  }, []);

  const handleStoryClick = useCallback((storyIndex: number) => {
    setStories((previousStories) => {
      const updatedStories = previousStories.map((story, index) => {
        if (index === storyIndex && !story.isViewed) {
          return { ...story, isViewed: true };
        }

        return story;
      });

      saveStoriesToLocalStorage(updatedStories);
      return updatedStories;
    });

    setIsViewerOpen(true);
    setSelectedStoryIndex(storyIndex);
  }, []);

  const handleAddStoryClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = event.target.files?.[0];
      if (!uploadedFile) return;

      try {
        const newStory = await handleImageUpload(uploadedFile);
        if (newStory) {
          setStories((previousStories) => {
            const updatedStories = [newStory, ...previousStories];
            saveStoriesToLocalStorage(updatedStories);
            return updatedStories;
          });
        }
      } catch (error) {
        console.log("Error uploading image:", error);
      }

      setIsDialogOpen(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleImageUpload]
  );

  if (isStoriesLoading) {
    return <StoriesSkeleton />;
  }

  return (
    <main className="font-[family-name:var(--font-geist-sans)] h-full w-xl flex items-center justify-center">
      <header>
        <h1 className="text-2xl">Stories</h1>
        <p className="text-gray-400">desc.</p>
        <section className="flex items-center gap-2 mt-4">
          <button
            className="hover:cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus size={20} />
          </button>
          <List<Story>
            className="flex items-center justify-center gap-2"
            items={stories}
            renderItem={(story, index) => (
              <StoryItem
                story={story}
                index={index}
                onStoryClick={handleStoryClick}
              />
            )}
          />
          {stories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No stories yet. Click the + button to add your first story!</p>
            </div>
          )}
        </section>
      </header>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Story</DialogTitle>
            <DialogDescription>desc.</DialogDescription>
          </DialogHeader>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />

          <AddStoryButton
            item={<Plus size={20} />}
            onClick={handleAddStoryClick}
          />
        </DialogContent>
      </Dialog>

      {selectedStoryIndex !== null && isViewerOpen && (
        <StoryViewer
          setViewerOpen={setIsViewerOpen}
          isViewerOpen={isViewerOpen}
          stories={stories}
          initialIndex={selectedStoryIndex}
        />
      )}
    </main>
  );
}
