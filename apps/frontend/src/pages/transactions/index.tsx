import { FC, useCallback, useEffect, useState } from "react";
import { Transaction } from "./types";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../services/api";
import { ApiRoutes } from "../../services/routes";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DashboardLayout from "../../layouts/dashboard";
import { PageEnum, Pages } from "../../components/sidebar/types";
import ValueDisplay from "../../components/valueDisplay";
import { DateTime } from "luxon";
import TagBadge from "../../components/tagBadge";
import EmptyState from "../../components/emptyState";
import { TableSkeleton } from "../../components/skeleton";
import ImportationSidebar from "../../components/importationSidebar";

const Transactions: FC = () => {
  const navigate = useNavigate();
  const { getRequest } = useApi(navigate);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );

  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRequest<
        Record<string, never>,
        { transactions: Transaction[] }
      >(ApiRoutes.transaction.allTransactions);

      if (response.data?.transactions) {
        setTransactions(response.data.transactions);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getRequest, setTransactions]);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditTransaction(transaction);
    setIsSidebarOpen(true);
  }, []);

  const onCreatedTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prevTransactions) => [transaction, ...prevTransactions]);
  }, []);

  const onEditTransaction = useCallback((editedTransaction: Transaction) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === editedTransaction.id
          ? editedTransaction
          : transaction
      )
    );
  }, []);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  return (
    <DashboardLayout
      currentPage={PageEnum.Transactions}
      title={Pages[PageEnum.Transactions].label}
    >
      <div className="flex flex-row w-full h-full overflow-auto">
        <div className="flex-1">
          <div className="flex md:justify-end sm:justify-start md:mt-0 mt-4 items-center mb-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="bg-purple hover:bg-purple/90 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Importar Transação
            </button>
          </div>
          {isLoading ? (
            <TableSkeleton rows={8} columns={5} />
          ) : transactions.length === 0 ? (
            <EmptyState
              title="Nenhuma transação encontrada"
              description="Importe um extrato bancário ou adicione uma transação para ver elas listadas aqui."
            />
          ) : (
            <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }}>
              <Table className="text-neutral-200" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      className="text-neutral-200"
                      sx={{ backgroundColor: "#252e42" }}
                    >
                      Descrição
                    </TableCell>
                    <TableCell
                      className="text-neutral-200"
                      sx={{ backgroundColor: "#252e42" }}
                    >
                      Categoria
                    </TableCell>
                    <TableCell
                      className="text-neutral-200"
                      sx={{ backgroundColor: "#252e42" }}
                    >
                      Valor
                    </TableCell>
                    <TableCell
                      className="text-neutral-200"
                      sx={{ backgroundColor: "#252e42" }}
                    >
                      Data
                    </TableCell>
                    <TableCell
                      className="text-neutral-200"
                      sx={{ backgroundColor: "#252e42" }}
                    >
                      Arquivo
                    </TableCell>
                    <TableCell
                      className="text-neutral-200"
                      sx={{ backgroundColor: "#252e42" }}
                    />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-neutral-200">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="text-neutral-200">
                        <TagBadge
                          tagName={transaction.tag?.name}
                          tagColor={transaction.tag?.color}
                        />
                      </TableCell>
                      <TableCell className="text-neutral-200">
                        <ValueDisplay
                          value={transaction.value}
                          type={transaction.type}
                        />
                      </TableCell>
                      <TableCell className="text-neutral-200">
                        {DateTime.fromISO(transaction.transactionDate).toFormat(
                          "dd LLL yyyy"
                        )}
                      </TableCell>
                      <TableCell className="text-neutral-200">
                        {transaction.bankStatement?.name}
                      </TableCell>
                      <TableCell className="text-neutral-200">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>

      <ImportationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        editTransaction={editTransaction}
        onEditTransaction={onEditTransaction}
        onCreatedTransaction={onCreatedTransaction}
        loadTransactions={getTransactions}
      />
    </DashboardLayout>
  );
};

export default Transactions;
