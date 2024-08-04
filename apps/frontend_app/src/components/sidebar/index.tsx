import { FC } from "react";
import { PageEnum, Pages } from "./types";

interface SidebarProps extends Partial<HTMLDivElement> {
	selectedPage: PageEnum;
}

const Sidebar: FC<SidebarProps> = ({ selectedPage }) => {
	const displayPage = [PageEnum.Dashboard, PageEnum.Transactions, PageEnum.Importations]

	return (
		<nav className="flex flex-col p-6 gap-3 bg-dark-gray w-60">
			{displayPage.map((page) =>	<a key={`${page}_key`} className={`cursor-pointer hover:underline first:mt-10 ${selectedPage === page ? 'underline' : ''}`} style={ selectedPage === page ? { color: '#af50db', textDecorationLine: 'underline', textDecorationColor: '#af50db', textUnderlineOffset: '0.2rem', textDecorationThickness: '2px' } : {}} href={Pages[page].url} > {Pages[page].label} </a>)}
		</nav>
	);
}

export default Sidebar;