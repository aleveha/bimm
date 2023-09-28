import styled from "styled-components";
import { Emoji } from "./components/emoji";
import { Link } from "./components/link";
import { List } from "./components/list";
import { TypoH2 } from "./components/typo";

const Check = () => <Emoji emoji="✅" label="checked emoji" />;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;

  @media (min-width: 768px) {
    margin-top: 3rem;
  }
`;

export const Assignment = () => (
	<Container>
		<TypoH2>Assignments:</TypoH2>
		<List>
			<li>
				<Check /> Convert this TODO application from a class component into a function component using es6 and
				react hooks.
			</li>
			<li>
				<Check /> Use{" "}
				<Link href="https://styled-components.com/" rel="noopener noreferrer" target="_blank">
					styled components
				</Link>{" "}
				for all styles
			</li>
			<li>
				<Check /> Create a way to delete multiple selected items
			</li>
			<li>
				<Check /> Create a way to save the lists you have created in an organized fashion. The ability to resume
				editing or delete a whole saved list is required.
			</li>
			<li>
				<Check /> Bonus put your own design flair on this application!
			</li>
			<li>
				<Check /> Have fun!
			</li>
		</List>
	</Container>
);
