import { ReactNode } from "react";

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  className?: string;
}

const List = <T,>({
  items,
  renderItem,
  keyExtractor,
  className,
}: ListProps<T>) => {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
};

export default List;
