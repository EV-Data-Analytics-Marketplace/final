import React from 'react';
import TransactionList from '../../components/payment/TransactionList';
import PaymentMethodForm from '../../components/payment/PaymentMethodForm';

const ConsumerTransactionsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions & Payments</h1>
        <p className="text-gray-600 mt-1">Manage your payment methods and transaction history</p>
      </div>
      <PaymentMethodForm />
      <TransactionList />
    </div>
  );
};

export default ConsumerTransactionsPage;
