import { BarChart, PieChart } from '@mui/x-charts'
import './App.css'
import { PageEnum, Pages } from './components/sidebar/types'
import DashboardLayout from './layouts/dashboard'

function App() {
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
                data: [
                  { id: 0, value: 10, label: 'series A', color: '#22B7C2' },
                  { id: 1, value: 20, label: 'series B', color: '#A92F10' },
                  { id: 2, value: 20, label: 'series C', color: '#0A57C5' },
                ]
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
