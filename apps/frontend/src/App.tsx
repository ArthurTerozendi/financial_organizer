import { BarChart, PieChart } from '@mui/x-charts'
import './App.css'
import { PageEnum, Pages } from './components/sidebar/types'
import DashboardLayout from './layouts/dashboard'
import { useCallback, useEffect, useState } from 'react';
import { useApi } from './services/api';
import { ApiRoutes } from './services/routes';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const { getRequest } = useApi(navigate);

  const [transactionsGroupedByTag, setTransactionsGroupedByTag] = useState<{ id: string, value: number, label: string, color: string}[]>([]);
  const [transactionsGroupedByYearMonth, setTransactionsGroupedByYearMonth] = useState<{ yearMonth: string, creditAmount: number, debitAmount: number }[]>([]);

  const getTransactionsGroupedByTag = useCallback(async () => {
    const response = await getRequest<Record<string, string>, { transactionsGrouped: { [key: string]: { count: number, label: string, color: string } } }>
    (ApiRoutes.dashboard.tags, { period: 'string' });

    if (response.data?.transactionsGrouped) {
      const tagsData: { id: string, value: number, label: string, color: string}[] = [];
    
      for (const tagId of Object.keys(response.data.transactionsGrouped)) {
        const { color, count, label } = response.data.transactionsGrouped[tagId];
        tagsData.push({ id: tagId, value: count, label, color }) 
      }

      setTransactionsGroupedByTag(tagsData)
    }
  }, [getRequest, setTransactionsGroupedByTag]);
  
  const getTransactionsGroupedByYearMonth = useCallback(async () => {
    const response = await getRequest<Record<string, string>, { transactions: { yearMonth: string, creditAmount: number, debitAmount: number }[] }>
    (ApiRoutes.dashboard.yearMonths);

    if (response.data && response.data.transactions.length > 0) {
      setTransactionsGroupedByYearMonth(response.data.transactions);
    }
  }, [getRequest, setTransactionsGroupedByYearMonth])

  useEffect(() => {
    getTransactionsGroupedByTag();
    getTransactionsGroupedByYearMonth();
  }, [getTransactionsGroupedByTag, getTransactionsGroupedByYearMonth])


  const getYearMonthChartData = useCallback(() => {

    return transactionsGroupedByYearMonth.reduce((acc, month) => {
      acc.creditAmount.push(month.creditAmount);
      acc.debitAmount.push(month.debitAmount);
      acc.months.push((month.yearMonth));

      return acc;
    }, { months: [], creditAmount: [], debitAmount: [] } as { months: string[], creditAmount: number[], debitAmount: number[] })

  }, [transactionsGroupedByYearMonth])

  const getYearMonthChart = useCallback(() => {
    const { months, creditAmount, debitAmount } = getYearMonthChartData();
    return <>
      <BarChart
        className='h-1/2'
        xAxis={[{ scaleType: 'band', data: months }]}
        series={[
          { data: creditAmount },
          { data: debitAmount }
        ]}
      />
    </>
  }, [getYearMonthChartData])

  return (
    <DashboardLayout currentPage={PageEnum.Dashboard} title={Pages[PageEnum.Dashboard].label}>
      <div className="flex w-full h-full flex-col">
        <div className="flex flex-row h-1/2">
          <PieChart
            series={[
              { 
                innerRadius: 2,
                cornerRadius: 4,
                paddingAngle: 2,
                data: transactionsGroupedByTag 
              }
            ]}
            width={400}
            height={200}
          />
          <div>
            test
          </div>
        </div>
        {getYearMonthChart()}
      </div>
    </DashboardLayout>
  )
}

export default App
