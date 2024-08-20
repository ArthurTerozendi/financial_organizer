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

  const [transactionsGroupedByTag, setTransactionsGroupedByTag] = useState<{ id: string, value: number, label: string, color: string}[]>([])

  const getTransactions = useCallback(async () => { 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  
  useEffect(() => {
    getTransactions();
  }, [getTransactions])

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
        <BarChart
          className='h-1/2'
          xAxis={[{ scaleType: 'band', data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] }]}
          series={[
            { data: [10, 5, 15, 20, 50, 0, 20, 30, 15, 10, 12, 40] },
          ]}
        />
      </div>
    </DashboardLayout>
  )
}

export default App
