export const ApiRoutes = {
  login: "/login",
  signUp: "/signUp",
  transaction: {
    create: "/transaction",
    uploadFile: "/transaction/uploadFile",
    allTransactions: "/transaction/all",
    lastFiveTransactions: "/transaction/lastFiveTransactions",
    update: "/transaction",
    delete: "/transaction",
  },
  dashboard: {
    tags: "/dashboard/tags",
    yearMonths: "/dashboard/yearMonths",
  },
  tag: "/tag"
};
