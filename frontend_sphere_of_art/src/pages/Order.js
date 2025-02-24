import React from 'react';
import OrderForm from './OrderForm'; 

export default function Order() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Upload an Image, Pick a Style, and Let the Magic Begin!!!
      </h1>
      <OrderForm />
    </div>
  );
}
