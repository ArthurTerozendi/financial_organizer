import { FC, useCallback, useEffect, useState } from "react";
import { Transaction } from "./types";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../services/api";
import { ApiRoutes } from "../../services/routes";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DashboardLayout from "../../layouts/dashboard";
import { PageEnum, Pages } from "../../components/sidebar/types";

const Transactions: FC = () => {
 const navigate = useNavigate();
  const { getRequest } = useApi(navigate);

  const [transactions, setTransactions] = useState<Transaction[]>([])

  const getTransactions = useCallback(async () => { 
    const response = await getRequest<Record<string, never>, { transactions: Transaction[] }>
    (ApiRoutes.transaction.allTransactions);

    if (response.data?.transactions) {
      setTransactions(response.data.transactions);
    }
  }, [getRequest, setTransactions]);
  
  useEffect(() => {
    getTransactions();
  }, [getTransactions])

  return (
    <DashboardLayout currentPage={PageEnum.Transactions} title={Pages[PageEnum.Transactions].label}>
      <div className="flex flex-row w-full h-full overflow-auto">
      <TableContainer>
        <Table sx={{color: 'white'}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{color: 'white'}}> Descrição </TableCell>
              <TableCell sx={{color: 'white'}}> Categoria </TableCell>
              <TableCell sx={{color: 'white'}}> Valor </TableCell>
              <TableCell sx={{color: 'white'}}> Data </TableCell>
              <TableCell sx={{color: 'white'}}> Arquivo </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell sx={{color: 'white'}}> {transaction.description} </TableCell>
                <TableCell sx={{color: 'white'}}> {transaction.tag?.name} </TableCell>
                <TableCell sx={{color: 'white'}}> {transaction.value} </TableCell>
                <TableCell sx={{color: 'white'}}> {transaction.transactionDate} </TableCell>
                <TableCell sx={{color: 'white'}}> {transaction.bankStatement?.name} </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </DashboardLayout>
  );
}

export default Transactions;