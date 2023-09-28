import { ChangeEventHandler, MouseEventHandler, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Emoji } from "../components/emoji";
import { IconButton } from "../components/icon-button";
import { List } from "../components/list";
import { TypoH2 } from "../components/typo";
import { TodoItem } from "./todo-item";
import type { Todo } from "./types";

const LOCAL_STORAGE_KEY = "todoList";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;

  & > button {
    width: fit-content;
  }

  @media (min-width: 768px) {
    margin-top: 3rem;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

function getItemsFromStorage() {
	try {
		const data = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (!data) {
			return [];
		}

		return JSON.parse(data) as Todo[];
	} catch (e) {
		console.error(e);
		return [];
	}
}

export const TodoList = () => {
	const [items, setItems] = useState<Todo[]>(getItemsFromStorage());
	const [inputText, setInputText] = useState("");

	const handleTextChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
		setInputText(event.target.value);
	}, []);

	const handleAddItem = useCallback<MouseEventHandler<HTMLButtonElement>>(
		(event) => {
			event.preventDefault();

			setItems((prev) => [
				{
					done: false,
					id: Date.now(),
					text: inputText,
				},
				...prev,
			]);

			setInputText("");
		},
		[inputText],
	);

	const markItemCompleted = useCallback(
		(itemId: number) => () => {
			setItems((prev) => prev.map((item) => (itemId === item.id ? { ...item, done: !item.done } : item)));
		},
		[],
	);

	const handleDeleteItem = useCallback(
		(itemId: number) => () => {
			setItems((prev) => prev.filter((item) => item.id !== itemId));
		},
		[],
	);

	const handleDeleteCompletedItems = useCallback(() => {
		setItems((prev) => prev.filter((item) => !item.done));
	}, []);

	const handleDeleteAllItems = useCallback(() => {
		setItems([]);
	}, []);

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
	}, [items]);

	return (
		<Container>
			<TypoH2>
				<Emoji emoji="🔥" label="fire emoji" /> Start adding TODOs today!
			</TypoH2>
			<ActionContainer>
				<button disabled={items.findIndex((item) => item.done) === -1} onClick={handleDeleteCompletedItems}>
					Remove completed
				</button>
				<button disabled={items.length === 0} onClick={handleDeleteAllItems}>
					Remove all todos
				</button>
			</ActionContainer>
			<form>
				<input onChange={handleTextChange} type="text" value={inputText} />
				<IconButton disabled={!inputText} onClick={handleAddItem}>
					<Emoji emoji="🚀" label="rocket emoji" />
				</IconButton>
			</form>
			<List>
				{items.map((item) => (
					<TodoItem
						completed={item.done}
						key={item.id}
						onComplete={markItemCompleted(item.id)}
						onDelete={handleDeleteItem(item.id)}
						text={item.text}
					/>
				))}
			</List>
		</Container>
	);
};
