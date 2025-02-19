import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2> Order Confirmed!</h2>
            <p>Thank you for your payment. Your order is being processed.</p>
            <Link to="/my-orders/:customerId">
                <button>View My Orders</button>
            </Link>
        </div>
    );
};

export default OrderConfirmation;
