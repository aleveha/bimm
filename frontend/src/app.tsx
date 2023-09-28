import { FC } from "react";
import Balancer from "react-wrap-balancer";
import { Assignment } from "./assignment";
import { Emoji } from "./components/emoji";
import { Link } from "./components/link";
import { TypoH1 } from "./components/typo";
import { TodoList } from "./todo/todo-list";

export const App: FC = () => (
	<main>
		<TypoH1>
			<Balancer>
				<Link href="https://bimm.com" rel="noopener noreferrer" target="_blank">
					BIMM
				</Link>{" "}
				coding challenge <Emoji emoji="💪" label="muscles emoji" />
			</Balancer>
		</TypoH1>
		<Assignment />
		<TodoList />
	</main>
);
