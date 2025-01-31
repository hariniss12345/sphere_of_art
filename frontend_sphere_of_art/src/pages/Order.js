import React from 'react';
import OrderForm from './OrderForm'; // Since both are in the same folder, use './'

export default function Order() {
  return (
    <div>
      <h2>Order Page</h2>
      <OrderForm />
    </div>
  );
}