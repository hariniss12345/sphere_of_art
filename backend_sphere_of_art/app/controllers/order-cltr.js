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
orderCltr.artistAction = async (req, res) => {
    try {
        const { orderId } = req.params; // Get the order ID from the route parameter
        const { action ,reason } = req.body; // Get the action (accept or cancel) from the request body
    
        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
    
        // Handle accept or cancel actions
        if (action === 'accept') {
          const { price, deliveryCharges, dueDate } = req.body; // Additional details required when accepting an order
          if (!price || !deliveryCharges || !dueDate) {
            return res.status(400).json({ message: 'Price, delivery charges, and due date are required to accept the order' });
          }
    
          order.price = price;
          order.deliveryCharges = deliveryCharges;
          order.totalPrice = Number(price) + Number(deliveryCharges);
          order.dueDate = new Date(dueDate);
          order.status = 'in-progress'; // Update status to "in-progress"
          order.artistHasAccepted = true; // Mark artist acceptance
        } else if (action === 'cancel') {
          order.status = 'canceled'; // Update status to "canceled"
          order.artistHasAccepted = false; // Mark artist rejection
          order.cancelReason = reason; // Save the cancellation reason
        } else {
          return res.status(400).json({ message: 'Invalid action. Use "accept" or "cancel"' });
        }
    
        // Save the updated order
        const updatedOrder = await order.save();
    
        // Notify the customer about the artist's action
        const customer = await User.findById(order.customer);
        if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
        }
    
        const customerEmail = customer.email;
        const customerName = customer.username;
    
        // Prepare email content for the customer
        const emailSubject =
          action === 'accept'
            ? 'Artist Accepted Your Order'
            : 'Artist Canceled Your Order';
        const emailText = `Hi ${customerName},\n\nThe artist has ${
          action === 'accept' ? 'accepted' : 'canceled'
        } your order. Please log in to your account to view the details.\n\nThank you,\nArt Commission Platform`;
        const emailHtml = `
          <h1>Order ${action === 'accept' ? 'Accepted' : 'Canceled'}</h1>
          <p>Hi ${customerName},</p>
          <p>The artist has ${
            action === 'accept' ? 'accepted' : 'canceled'
          } your order. Please log in to your account to view the details.</p>
          <p>Thank you,</p>
        `;
    
        // Send email to the customer
        await sendEmail(customerEmail, emailSubject, emailText, emailHtml);
    
        // Respond with the updated order
        res.status(200).json({
          message:
            action === 'accept'
              ? 'Order accepted and customer notified successfully'
              : 'Order canceled and customer notified successfully',
          order: updatedOrder,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
      }   
};

// Controller for confirming or declining an order by the customer
orderCltr.customerAction = async (req, res) => {
    try {
      const { orderId } = req.params; // Get the order ID from the route parameter
      const { action } = req.body; // Get the action (either 'confirm' or 'decline')
  
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Handle confirmation or decline
      if (action === 'confirm') {
        order.status = 'confirmed'; // Update status to "confirmed"
        order.customerHasAccepted = true; // Mark customer confirmation
      } else if (action === 'decline') {
        order.status = 'declined'; // Update status to "declined"
        order.customerHasAccepted = false; // Mark customer rejection
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
  
      // Save the updated order
      const updatedOrder = await order.save();
  
      // Fetch the artist's and customer's details
      const artist = await User.findById(order.artist);
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
      
      const customer = await User.findById(order.customer);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      const artistEmail = artist.email;
      const artistName = artist.username;
      const customerName = customer.username;
  
      // Prepare email content for the artist
      const emailSubject = action === 'confirm'
        ? `${customerName} Confirmed Your Order`
        : `${customerName} Declined Your Order`;
  
      const emailText = `Hi ${artistName},\n\n${customerName} has ${
        action === 'confirm' ? 'confirmed' : 'declined'
      } your order. Please log in to your account to view the details.\n\nThank you,\nArt Commission Platform`;
  
      const emailHtml = `
        <h1>Order ${action === 'confirm' ? 'Confirmed' : 'Declined'}</h1>
        <p>Hi ${artistName},</p>
        <p>${customerName} has ${
          action === 'confirm' ? 'confirmed' : 'declined'
        } your order. Please log in to your account to view the details.</p>
        <p>Thank you,</p>
      `;
  
      // Send email to the artist
      await sendEmail(artistEmail, emailSubject, emailText, emailHtml);
  
      // Respond with the updated order
      res.status(200).json({
        message: action === 'confirm'
          ? 'Order confirmed and artist notified successfully'
          : 'Order declined and artist notified successfully',
        order: updatedOrder,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
};

orderCltr.listArtist = async (req, res) => {
  try {
    const { artistId } = req.params; // Get artistId from URL

    const orders = await Order.find({ artist: artistId }) // Correct field name
        .populate('customer', 'username email') // Correct field name
        .populate('arts', 'title style image') // Fetch ordered artwork details
        .sort({ createdAt: -1 }); // Sort by newest first

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this artist" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};


orderCltr.listCustomer = async (req, res) => {
  try {
    const { customerId } = req.params; // Get customerId from URL

    const orders = await Order.find({ customer: customerId }) // Correct field name
      .populate('artist', 'username email') // Fetch artist's details
      .populate('arts', 'title style image') // Fetch ordered artwork details
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this customer" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};


export default orderCltr;
