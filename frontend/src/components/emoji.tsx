import type { FC } from "react";

interface Props {
	emoji: string;
	label: string;
}

export const Emoji: FC<Props> = ({ emoji, label }) => (
	<span aria-label={label} role="img">
		{emoji}
	</span>
);
