import Story from "@/types/story.type";
import { STORIES } from "@/constants/story.constant";

export const loadStoriesFromLocalStorage = (): Promise<Story[]> => {
  return new Promise((resolve) => {
    const savedStories = localStorage.getItem(STORIES);
    if (savedStories) {
      const parsedStories = JSON.parse(savedStories);
      resolve(parsedStories);
    }
    resolve([]);
  });
};

export const saveStoriesToLocalStorage = (stories: Story[]): void => {
  localStorage.setItem(STORIES, JSON.stringify(stories));
};
