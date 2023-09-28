import { memo } from "react";
import styled from "styled-components";
import { Emoji } from "../components/emoji";
import { IconButton } from "../components/icon-button";

const Item = styled.li<{ $completed: boolean }>`
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;

  & > span {
    color: rgba(0, 0, 0, ${(props) => (props.$completed ? 0.5 : 1)});
    text-align: start;
    text-decoration: ${(props) => (props.$completed ? "line-through" : "none")};
    width: 100%;
  }

  @media (min-width: 768px) {
    max-width: 480px;
    width: 50%;
  }
`;

interface Props {
	completed: boolean;
	onComplete: () => void;
	onDelete: () => void;
	text: string;
}

export const TodoItem = memo<Props>(({ completed, onComplete, onDelete, text }) => (
	<Item $completed={completed}>
		<IconButton onClick={onComplete} type="button">
			<Emoji emoji={completed ? "✅" : "⬜️"} label={completed ? "checked emoji" : "unchecked emoji"} />
		</IconButton>
		<span>{text}</span>
		<IconButton onClick={onDelete} type="button">
			<Emoji emoji="❌" label="x mark emoji" />
		</IconButton>
	</Item>
));
