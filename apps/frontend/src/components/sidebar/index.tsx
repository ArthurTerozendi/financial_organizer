import { FC } from "react";
import { PageEnum, Pages, SidebarProps } from "./types";

const Sidebar: FC<SidebarProps> = ({ selectedPage }) => {
  const displayPage = [
    PageEnum.Dashboard,
    PageEnum.Transactions,
    PageEnum.Importations,
  ];

  return (
    <nav className="flex flex-col p-4 md:p-6 gap-3 bg-md-gray w-full md:w-60 min-h-[250px] md:h-full">
      {displayPage.map((page) => (
        <a
          key={`${page}_key`}
          className={`cursor-pointer hover:underline text-sm md:text-base py-2 px-3 rounded-lg transition-colors duration-200 ${
            selectedPage === page
              ? "bg-purple/20 text-light-purple"
              : "hover:bg-md-gray/50"
          }`}
          href={Pages[page].url}
        >
          {Pages[page].label}
        </a>
      ))}
    </nav>
  );
};

export default Sidebar;
