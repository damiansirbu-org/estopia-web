import { Modal } from 'antd';
import { X } from 'lucide-react';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HelpModal({ visible, onClose }: HelpModalProps) {
  return (
    <Modal
      title="Keyboard Shortcuts & Help"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      closeIcon={<X className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {/* Entity Management Shortcuts */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Entity Management</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">Add new record</span>
              <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded font-mono text-sm">+</kbd>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">Delete record</span>
              <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded font-mono text-sm">-</kbd>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">Save changes / Confirm action</span>
              <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded font-mono text-sm">Enter</kbd>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">Cancel editing</span>
              <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded font-mono text-sm">Escape</kbd>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Navigation</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-700">Edit record</span>
              <span className="text-gray-600 text-sm">Double-click on any row</span>
            </div>
          </div>
        </div>

        {/* Usage Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Usage Notes</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Keyboard shortcuts work when not typing in input fields</p>
            <p>• Add (+) only works when no record is being edited</p>
            <p>• Delete (-) only works when editing a saved record with no changes</p>
            <p>• Save (Enter) works when there are unsaved changes, or to confirm delete</p>
            <p>• Cancel (Escape) works during any editing operation</p>
          </div>
        </div>

        {/* Payment Specific */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Payment Features</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Total Amount:</strong> Automatically calculated from all individual amounts</p>
            <p>• <strong>Remaining:</strong> Shows outstanding balance in red when positive</p>
            <p>• <strong>Paid Checkbox:</strong> Auto-fills paid amount when checked</p>
            <p>• <strong>Auto-complete:</strong> Paid checkbox auto-checks when remaining reaches zero</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}