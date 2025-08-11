
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            {t('dashboard.placeholder')}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;