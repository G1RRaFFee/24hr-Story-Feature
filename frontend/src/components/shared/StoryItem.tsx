"use client";

import { JSX, memo, useCallback } from "react";

import Story from "@/types/story.type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface StoryItemProps {
  index: number;
  story: Story;
  onStoryClick: (storyIndex: number) => void;
}

export const StoryItem = memo(
  ({ index, story, onStoryClick }: StoryItemProps): JSX.Element => {
    const handleClick = useCallback(() => {
      onStoryClick(index);
    }, []);

    return (
      <Avatar
        key={story.id}
        className={`h-12 w-12 hover:cursor-pointer ${
          story.isViewed ? "opacity-50" : ""
        }`}
        onClick={handleClick}
      >
        <AvatarImage src={story.src} alt="User story" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
  }
);
