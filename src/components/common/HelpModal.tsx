import { Modal } from 'antd';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getVersionString, VERSION_INFO } from '../../version';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HelpModal({ visible, onClose }: HelpModalProps) {
  const { t } = useTranslation();
  
  return (
    <Modal
      title={t('help.title')}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      closeIcon={<X className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {/* Entity Management Shortcuts */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">{t('help.entityManagement')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">{t('help.addRecord')}</span>
              <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded font-mono text-sm">+</kbd>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">{t('help.deleteRecord')}</span>
              <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded font-mono text-sm">-</kbd>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">{t('help.saveChanges')}</span>
              <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded font-mono text-sm">Enter</kbd>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">{t('help.cancelEditing')}</span>
              <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded font-mono text-sm">Escape</kbd>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">{t('help.navigation')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">{t('help.editRecord')}</span>
              <span className="text-gray-600 text-sm">{t('help.doubleClick')}</span>
            </div>
          </div>
        </div>

        {/* Usage Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">{t('help.usageNotes')}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Keyboard shortcuts work when not typing in input fields</p>
            <p>• Add (+) only works when no record is being edited</p>
            <p>• Delete (-) only works when editing a saved record with no changes</p>
            <p>• Save (Enter) works when there are unsaved changes, or to confirm delete</p>
            <p>• Cancel (Escape) works during any editing operation</p>
          </div>
        </div>

        {/* User Interface */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">{t('help.interfaceTips')}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Table Editing:</strong> Double-click any row to start editing</p>
            <p>• <strong>Tab Navigation:</strong> Use Tab to move between form fields</p>
            <p>• <strong>Auto-save:</strong> Changes are automatically saved when valid</p>
            <p>• <strong>Visual Feedback:</strong> Red borders indicate validation errors</p>
            <p>• <strong>Status Indicators:</strong> Color-coded badges show record status</p>
          </div>
        </div>

        {/* Version Information */}
        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">{t('help.version')}</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('status.version')}:</span>
                <span className="font-mono text-gray-800">{VERSION_INFO.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('status.build')}:</span>
                <span className="font-mono text-gray-800">{new Date(VERSION_INFO.buildDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('status.time')}:</span>
                <span className="font-mono text-gray-800">{new Date(VERSION_INFO.buildDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('status.mode')}:</span>
                <span className={`font-mono px-2 py-1 rounded text-xs ${VERSION_INFO.isDev ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {VERSION_INFO.isDev ? t('status.development') : t('status.production')}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500 font-mono">{getVersionString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}