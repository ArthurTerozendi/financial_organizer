export enum PageEnum {
  Dashboard,
  Transactions,
  Login,
  SignUp,
}

export const Pages: { [key in PageEnum]: { label: string; url: string } } = {
  [PageEnum.Dashboard]: { label: "Página Inicial", url: "/" },
  [PageEnum.Transactions]: { label: "Transações", url: "/transactions" },
  [PageEnum.Login]: { label: "Login", url: "/login" },
  [PageEnum.SignUp]: { label: "Sign Up", url: "/signUp" },
};

export interface SidebarProps extends Partial<HTMLDivElement> {
  selectedPage: PageEnum;
}