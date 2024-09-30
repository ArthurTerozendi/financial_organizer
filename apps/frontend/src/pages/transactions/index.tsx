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

const Transactions: FC = () => {
  const navigate = useNavigate();
  const { getRequest } = useApi(navigate);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getTransactions = useCallback(async () => {
    const response = await getRequest<
      Record<string, never>,
      { transactions: Transaction[] }
    >(ApiRoutes.transaction.allTransactions);

    if (response.data?.transactions) {
      setTransactions(response.data.transactions);
    }
  }, [getRequest, setTransactions]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  return (
    <DashboardLayout
      currentPage={PageEnum.Transactions}
      title={Pages[PageEnum.Transactions].label}
    >
      <div className="flex flex-row w-full h-full overflow-auto">
        <TableContainer>
          <Table className="text-neutral-200">
            <TableHead>
              <TableRow>
                <TableCell className="text-neutral-200"> Descrição </TableCell>
                <TableCell className="text-neutral-200"> Categoria </TableCell>
                <TableCell className="text-neutral-200"> Valor </TableCell>
                <TableCell className="text-neutral-200"> Data </TableCell>
                <TableCell className="text-neutral-200"> Arquivo </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-neutral-200">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="text-neutral-200">
                    <TagBadge tagName={transaction.tag?.name} tagColor={transaction.tag?.color} />
                  </TableCell>
                  <TableCell className="text-neutral-200">
                    <ValueDisplay value={transaction.value} type={transaction.type}	/>
                  </TableCell>
                  <TableCell className="text-neutral-200">
                    {DateTime.fromISO(transaction.transactionDate).toFormat("dd LLL yyyy")}
                  </TableCell>
                  <TableCell className="text-neutral-200">
                    {transaction.bankStatement?.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
