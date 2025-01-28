// Import necessary modules and models
import Order from '../models/order-model.js';
import Art from '../models/art-model.js';
import User from '../models/user-model.js';
import sendEmail from '../../utils/mailer.js';

const orderCltr = {};

// Controller for creating a new order
orderCltr.create = async (req, res) => {
  try {
    const { title, styles, artist, customRequest } = req.body; // Get request body data
    const customerId = req.currentUser.userId; // Get the ID of the logged-in customer

    // Prepare uploaded image data
    const images = req.files.map(file => ({
      path: file.path,
      fileHash: file.hash,
    }));

    // Create a new artwork document
    const art = new Art({
      title,
      styles,
      image: images,
      customer: customerId,
    });

    const savedArt = await art.save(); // Save the artwork to the database

    // Create a new order document
    const order = new Order({
      customer: customerId,
      artist,
      arts: savedArt._id,
      customRequest,
      status: 'pending',
    });

    const savedOrder = await order.save(); // Save the order to the database

    // Fetch artist details from the database
    const artistUser = await User.findById(artist);
    if (!artistUser) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    const artistEmail = artistUser.email;

    // Fetch customer details from the database
    const customerUser = await User.findById(customerId);
    if (!customerUser) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const customerName = customerUser.username; // Get the customer's name

    // Prepare email content for the artist
    const emailSubject = 'New Order Placed';
    const emailText = `Hi ${artistUser.username},\n\nYou have received a new order from ${customerName}.\nPlease log in to your account to view the order details.\n\nThank you,\nArt Commission Platform`;
    const emailHtml = `
      <h1>New Order Notification</h1>
      <p>Hi ${artistUser.username},</p>
      <p>You have received a new order from <strong>${customerName}</strong>. Please log in to your account to view the order details.</p>
      <p>Thank you,</p>
    `;

    // Send email to the artist
    await sendEmail(artistEmail, emailSubject, emailText, emailHtml);

    // Send response to the client
    res.status(201).json({
      message: 'Artwork, Order created successfully, and email sent to the artist',
      artwork: savedArt,
      order: savedOrder,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Controller for accepting an order by the artist
orderCltr.accept = async (req, res) => {
  try {
    const { price, deliveryCharges, dueDate } = req.body; // Get the price, delivery charges, and due date
    const { orderId } = req.params; // Get the order ID from the route parameter

    // Find the order in the database
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the logged-in user is the artist associated with the order
    if (order.artist.toString() !== req.currentUser.userId) {
      return res.status(403).json({ message: 'You are not authorized to accept this order' });
    }

    // Update the order details
    order.price = price;
    order.deliveryCharges = deliveryCharges;
    order.totalPrice = price + deliveryCharges;
    order.dueDate = new Date(dueDate);
    order.status = 'in progress';
    order.artistHasAccepted = true;

    const updatedOrder = await order.save(); // Save the updated order

    // Fetch customer details to send a notification email
    const customer = await User.findById(order.customer);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const customerEmail = customer.email;
    const customerName = customer.username;

    // Prepare email content for the customer
    const emailSubject = 'Artist Has Accepted Your Order';
    const emailText = `Hi ${customerName},\n\nThe artist has accepted your order. Please log in to your account to check the order details.\n\nThank you,\nArt Commission Platform`;
    const emailHtml = `
      <h1>Artist Has Accepted Your Order</h1>
      <p>Hi ${customerName},</p>
      <p>The artist has accepted your order. Please log in to your account to check the order details.</p>
      <p>Thank you,</p>
    `;

    // Send email to the customer
    await sendEmail(customerEmail, emailSubject, emailText, emailHtml);

    // Send response with the updated order
    res.status(200).json({
      message: 'Order accepted and customer notified successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default orderCltr;
