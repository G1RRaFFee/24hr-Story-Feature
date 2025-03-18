import { JSX, memo } from "react";

interface AddStoryButtonProps {
  item: JSX.Element;
  onClick: () => void;
}

const AddStoryButton = memo(({ item, onClick }: AddStoryButtonProps) => (
  <div className="flex flex-col flex-shrink-0 items-center space-y-1">
    <button
      onClick={onClick}
      className="flex justify-center items-center w-16 h-16 rounded-full border-2 border-blue-400 border-dashed transition-all duration-300 hover:border-blue-500 hover:bg-blue-400 hover:cursor-pointer group"
      aria-label="Add new story"
    >
      {item}
    </button>
  </div>
));

export default AddStoryButton;
