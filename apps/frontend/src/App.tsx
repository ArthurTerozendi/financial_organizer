import './App.css'
import { PageEnum, Pages } from './components/sidebar/types'
import DashboardLayout from './layouts/dashboard'

function App() {
  return (
    <DashboardLayout currentPage={PageEnum.Dashboard} title={Pages[PageEnum.Dashboard].label}>
      <div className="flex w-full h-full items-center justify-center">
        Test
      </div>
    </DashboardLayout>
  )
}

export default App
