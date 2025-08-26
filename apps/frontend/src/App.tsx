import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "./theme";

import { BarChart, PieChart } from "@mui/x-charts";
import "./App.css";
import { PageEnum, Pages } from "./components/sidebar/types";
import DashboardLayout from "./layouts/dashboard";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "./services/api";
import { ApiRoutes } from "./services/routes";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { Transaction } from "./pages/transactions/types";
import ValueDisplay from "./components/valueDisplay";
import TagBadge from "./components/tagBadge";
import EmptyState from "./components/emptyState";

function App() {
  const navigate = useNavigate();
  const { getRequest } = useApi(navigate);

  const [transactionsGroupedByTag, setTransactionsGroupedByTag] = useState<
    { id: string; value: number; label: string; color: string }[]
  >([]);
  const [transactionsGroupedByYearMonth, setTransactionsGroupedByYearMonth] =
    useState<
      { yearMonth: string; creditAmount: number; debitAmount: number }[]
    >([]);

  const [lastFiveTransactions, setLastFiveTransactions] = useState<
    Transaction[]
  >([]);

  const getTransactionsGroupedByTag = useCallback(async () => {
    const response = await getRequest<
      Record<string, string>,
      {
        transactionsGrouped: {
          [key: string]: { count: number; label: string; color: string };
        };
      }
    >(ApiRoutes.dashboard.tags, { period: "string" });

    if (response.data?.transactionsGrouped) {
      const tagsData: {
        id: string;
        value: number;
        label: string;
        color: string;
      }[] = [];

      for (const tagId of Object.keys(response.data.transactionsGrouped)) {
        const { color, count, label } =
          response.data.transactionsGrouped[tagId];
        tagsData.push({ id: tagId, value: count, label, color });
      }

      setTransactionsGroupedByTag(tagsData);
    }
  }, [getRequest, setTransactionsGroupedByTag]);

  const getTransactionsGroupedByYearMonth = useCallback(async () => {
    const response = await getRequest<
      Record<string, string>,
      {
        transactions: {
          yearMonth: string;
          creditAmount: number;
          debitAmount: number;
        }[];
      }
    >(ApiRoutes.dashboard.yearMonths);

    if (response.data && response.data.transactions.length > 0) {
      setTransactionsGroupedByYearMonth(response.data.transactions);
    }
  }, [getRequest, setTransactionsGroupedByYearMonth]);

  const getLastFiveTransactions = useCallback(async () => {
    const response = await getRequest<
      Record<string, string>,
      { transactions: Transaction[] }
    >(ApiRoutes.transaction.lastFiveTransactions);

    if (response.data && response.data.transactions.length > 0) {
      setLastFiveTransactions(response.data.transactions);
    }
  }, [getRequest, setLastFiveTransactions]);

  useEffect(() => {
    getTransactionsGroupedByTag();
  }, [getTransactionsGroupedByTag]);

  useEffect(() => {
    getTransactionsGroupedByYearMonth();
  }, [getTransactionsGroupedByYearMonth]);

  useEffect(() => {
    getLastFiveTransactions();
  }, [getLastFiveTransactions]);

  const getYearMonthChartData = useCallback(() => {
    return transactionsGroupedByYearMonth.reduce(
      (acc, month) => {
        const date = DateTime.fromFormat(month.yearMonth, "yyyy-LL").toFormat(
          "LLL, yy"
        );

        acc.creditAmount.push(month.creditAmount);
        acc.debitAmount.push(month.debitAmount);
        acc.months.push(date);

        return acc;
      },
      { months: [], creditAmount: [], debitAmount: [] } as {
        months: string[];
        creditAmount: number[];
        debitAmount: number[];
      }
    );
  }, [transactionsGroupedByYearMonth]);

  const getYearMonthChart = useCallback(() => {
    const { months, creditAmount, debitAmount } = getYearMonthChartData();
    return (
      <div className="flex flex-grow">
        <BarChart
          xAxis={[{ scaleType: "band", data: months }]}
          series={[
            { data: creditAmount, label: "Crédito", color: "#297c2d" },
            { data: debitAmount, label: "Débito", color: "#ef4444" },
          ]}
        />
      </div>
    );
  }, [getYearMonthChartData]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DashboardLayout
        currentPage={PageEnum.Dashboard}
        title={Pages[PageEnum.Dashboard].label}
      >
        <div className="flex w-full h-full flex-col">
          {transactionsGroupedByTag.length === 0 &&
          lastFiveTransactions.length === 0 ? (
            <EmptyState
              title="Welcome to your dashboard"
              description="Start by importing a bank statement or creating your first transaction to see insights here."
            />
          ) : (
            <>
              <div className="flex justify-evenly flex-col lg:flex-row ">
                <div className="flex justify-center items-center">
                  <PieChart
                    series={[
                      {
                        innerRadius: 2,
                        cornerRadius: 4,
                        paddingAngle: 2,
                        data: transactionsGroupedByTag,
                      },
                    ]}
                    width={400}
                    height={200}
                  />
                </div>
                <div className="flex flex-col gap-4 bg-md-gray rounded-lg p-4 max-h-[50vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  {lastFiveTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-row gap-4 justify-between"
                    >
                      <div className="truncate w-2/4">
                        {transaction.description}
                      </div>
                      <TagBadge
                        tagName={transaction.tag?.name}
                        tagColor={transaction.tag?.color}
                      />
                      <ValueDisplay
                        value={transaction.value}
                        type={transaction.type}
                      />
                      <div className="text-sm text-gray-400">
                        {DateTime.fromISO(transaction.transactionDate).toFormat(
                          "dd LLL"
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {getYearMonthChart()}
            </>
          )}
        </div>
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default App;
