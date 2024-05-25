import Link from "next/link";
import { FC } from "react";

const Sidebar: FC<Partial<HTMLDivElement>> = () => {
	return (
		<nav className="flex flex-col p-6 gap-3 bg-dark-gray">
			<Link className="mt-10 cursor-pointer hover:underline" href="/dashboard" > Página Inicial </Link>
			<Link className="cursor-pointer hover:underline"  href="/dashboard/transactions"> Transações </Link>
			<Link className="cursor-pointer hover:underline" href="/dashboard/importation"> Importação </Link>
		</nav>
	);
}

export default Sidebar;