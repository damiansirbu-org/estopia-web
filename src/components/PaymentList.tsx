import React from 'react';

function PaymentList() {
  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6">
        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
          + Add Payment
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ion Popescu - Floreasca</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-07-01</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">€1,550</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Paid
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-07-05</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Maria Ionescu - Herastrau</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-07-01</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">€3,100</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Overdue
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentList;