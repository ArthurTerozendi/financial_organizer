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
import { DashboardSkeleton } from "./components/skeleton";
import { firstLetterToUpperCase } from "./utils";

// Custom hook for window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

function App() {
  const navigate = useNavigate();
  const { getRequest } = useApi(navigate);
  const { width: windowWidth } = useWindowSize();

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
  const [isLoading, setIsLoading] = useState(true);

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
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getTransactionsGroupedByTag(),
          getTransactionsGroupedByYearMonth(),
          getLastFiveTransactions(),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [
    getTransactionsGroupedByTag,
    getTransactionsGroupedByYearMonth,
    getLastFiveTransactions,
  ]);

  const getYearMonthChartData = useCallback(() => {
    return transactionsGroupedByYearMonth.reduce(
      (acc, month) => {
        const date = DateTime.fromFormat(month.yearMonth, "yyyy-LL")
          .setLocale("pt-BR")
          .toFormat("LLL, yy");

        acc.creditAmount.push(month.creditAmount);
        acc.debitAmount.push(month.debitAmount);
        acc.months.push(firstLetterToUpperCase(date).replace(".", ""));
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
    
    // Calculate responsive dimensions
    const getChartDimensions = () => {
      if (windowWidth < 500) {
        return { width: 280, height: 200 };
      } else if (windowWidth < 768) {
        return { width: 400, height: 250 };
      } else if (windowWidth < 1024) {
        return { width: 500, height: 300 };
      } else if (windowWidth < 1440) {
        return { width: 800, height: 450 };
      } else {
        return { width: 1000, height: 550 };
      }
    };

    const { width, height } = getChartDimensions();
    
    return (
      <div className="flex flex-col bg-md-gray rounded-lg p-3 sm:p-6 w-full">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">
          Evolução Mensal
        </h3>
        <div className="flex justify-center items-center w-full overflow-x-auto">
          <BarChart
            xAxis={[
              { 
                scaleType: "band", 
                data: months,
                tickLabelStyle: {
                  fontSize: windowWidth < 500 ? 10 : windowWidth < 768 ? 12 : windowWidth < 1024 ? 14 : 16,
                },
              }
            ]}
            yAxis={[
              {
                tickLabelStyle: {
                  fontSize: windowWidth < 500 ? 10 : windowWidth < 768 ? 12 : windowWidth < 1024 ? 14 : 16,
                },
              }
            ]}
                          series={[
                { 
                  data: creditAmount, 
                  label: "Crédito", 
                  color: "#297c2d",
                  valueFormatter: (value) => `R$ ${(value || 0).toLocaleString('pt-BR')}`,
                },
                { 
                  data: debitAmount, 
                  label: "Débito", 
                  color: "#ef4444",
                  valueFormatter: (value) => `R$ ${(value || 0).toLocaleString('pt-BR')}`,
                },
              ]}
            width={width}
            height={height}
            slotProps={{
              legend: {
                direction: windowWidth < 500 ? 'row' : 'row',
                position: { vertical: 'top', horizontal: 'middle' },
                padding: windowWidth < 500 ? 8 : 16,
                itemMarkWidth: windowWidth < 500 ? 12 : 16,
                itemMarkHeight: windowWidth < 500 ? 12 : 16,
                markGap: windowWidth < 500 ? 4 : 8,
                itemGap: windowWidth < 500 ? 8 : 16,
                labelStyle: {
                  fontSize: windowWidth < 500 ? 10 : windowWidth < 768 ? 12 : windowWidth < 1024 ? 14 : 16,
                },
              },
            }}
            margin={{
              top: windowWidth < 500 ? 40 : windowWidth < 1024 ? 10 : 10,
              bottom: windowWidth < 500 ? 40 : windowWidth < 1024 ? 40 : 40,
              left: windowWidth < 500 ? 50 : windowWidth < 1024 ? 0 : 0,
              right: windowWidth < 500 ? 20 : windowWidth < 1024 ? 0 : 0,
            }}
          />
        </div>
      </div>
    );
  }, [getYearMonthChartData, windowWidth]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DashboardLayout
        currentPage={PageEnum.Dashboard}
        title={Pages[PageEnum.Dashboard].label}
      >
        <div className="flex w-full h-full flex-col gap-4">
          {isLoading ? (
            <DashboardSkeleton />
          ) : transactionsGroupedByTag.length === 0 &&
            lastFiveTransactions.length === 0 ? (
            <EmptyState
              title="Bem-vindo ao seu painel"
              description="Comece importando um extrato bancário ou criando sua primeira transação para ver insights aqui."
            />
          ) : (
            <>
              <div className="flex justify-evenly flex-col lg:flex-row gap-6">
                <div className="flex flex-col items-center bg-md-gray rounded-lg p-3 sm:p-6 min-w-[280px] sm:min-w-[500px] lg:min-w-[600px]">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">
                    Distribuição por Categoria
                  </h3>
                  <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-6 w-full">
                    <div className="flex justify-center items-center">
                      <PieChart
                        series={[
                          {
                            innerRadius: windowWidth < 500 ? 25 : 40,
                            cornerRadius: windowWidth < 500 ? 4 : 8,
                            paddingAngle: windowWidth < 500 ? 2 : 3,
                            data: transactionsGroupedByTag,
                            highlightScope: {
                              faded: "global",
                              highlighted: "item",
                            },
                            faded: {
                              innerRadius: windowWidth < 500 ? 20 : 30,
                              additionalRadius: windowWidth < 500 ? -20 : -30,
                              color: "gray",
                            },
                          },
                        ]}
                        width={windowWidth < 500 ? 250 : windowWidth < 1024 ? 300 : 350}
                        height={windowWidth < 500 ? 250 : windowWidth < 1024 ? 300 : 350}
                        slotProps={{
                          legend: {
                            hidden: true,
                          },
                        }}
                        margin={{ right: 0 }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-3 w-full max-w-[280px] sm:min-w-[180px] sm:max-w-[200px]">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                        Detalhes por Categoria
                      </h4>
                      <div className="flex flex-col gap-1 sm:gap-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                        {transactionsGroupedByTag.map((item) => {
                          const total = transactionsGroupedByTag.reduce(
                            (sum, t) => sum + t.value,
                            0
                          );
                          const percentage =
                            total > 0
                              ? ((item.value / total) * 100).toFixed(1)
                              : 0;
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-xs sm:text-sm hover:bg-gray-700 rounded px-1 sm:px-2 py-1 transition-colors"
                            >
                              <div className="flex items-center gap-1 sm:gap-2">
                                <div
                                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span
                                  className="truncate max-w-[60px] sm:max-w-[80px] lg:max-w-[100px]"
                                  title={item.label}
                                >
                                  {item.label}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-medium text-xs">
                                  {item.value}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="border-t border-gray-600 pt-1 sm:pt-2 mt-1 sm:mt-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-300">Total:</span>
                          <span className="font-semibold">
                            {transactionsGroupedByTag.reduce(
                              (sum, t) => sum + t.value,
                              0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 bg-md-gray rounded-lg p-4 max-h-[50vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold">Transações recentes</h3>
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
                        {DateTime.fromISO(transaction.transactionDate)
                          .setLocale("pt-BR")
                          .toFormat("dd LLL")}
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
