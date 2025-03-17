// FIXME: Пофиксить проблемы с StoryViewer, проблему с IsViewed

"use client";

import { JSX, useEffect, useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ProgressBar from "./ProgressBar";
import Story from "@/types/story.type";

import { saveStoriesToLocalStorage } from "@/helpers/story.helper";
import { STORY_DURATION } from "@/constants/story.constant";

interface ViewerProps {
  stories: Story[];
  isViewerOpen: boolean;
  setViewerOpen: (isViewerOpen: boolean) => void;
  initialIndex: number;
}

const StoryViewer = ({
  stories,
  isViewerOpen,
  setViewerOpen,
  initialIndex,
}: ViewerProps): JSX.Element => {
  const [currentStoryIndex, setCurrentStoryIndex] =
    useState<number>(initialIndex);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<number[]>(
    new Array(stories.length).fill(0)
  );

  useEffect(() => {
    if (isViewerOpen) {
      setCurrentStoryIndex(initialIndex);
      setProgress((prev) => prev.map((_, i) => (i < initialIndex ? 100 : 0)));
    }
  }, [isViewerOpen, initialIndex]);

  const handleSegmentComplete = (): void => {
    setViewedStories((prev) =>
      new Set(prev).add(stories[currentStoryIndex].id)
    );

    if (currentStoryIndex < stories.length - 1) {
      setProgress((prev) => {
        const newProgress = [...prev];
        newProgress[currentStoryIndex] = 100;
        return newProgress;
      });
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      markStoriesAsViewedAndReorder();
      setViewerOpen(false);
    }
  };

  const markStoriesAsViewedAndReorder = (): void => {
    const updatedStories = stories.map((story) =>
      viewedStories.has(story.id) ? { ...story, isViewed: true } : story
    );
    const reorderedStories = [
      ...updatedStories.filter((story) => !story.isViewed),
      ...updatedStories.filter((story) => story.isViewed),
    ];
    saveStoriesToLocalStorage(reorderedStories);
  };

  return (
    <Dialog
      open={isViewerOpen}
      onOpenChange={(open) => {
        if (!open) markStoriesAsViewedAndReorder();
        setViewerOpen(open);
      }}
    >
      <DialogTrigger asChild />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Story Viewer</DialogTitle>
        </DialogHeader>
        <ProgressBar
          duration={STORY_DURATION}
          segments={stories.length}
          currentSegment={currentStoryIndex}
          initialProgress={progress}
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
  );
};

export default StoryViewer;
