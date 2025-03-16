import Artist from '../models/artist-model.js'
import User from '../models/user-model.js'
import Order from '../models/order-model.js'
import Payment from '../models/payment-model.js'

const adminCltr = {}

adminCltr.verifyArtist = async (req,res) => {
    try {
        const { artistId } = req.params;
        const artist = await Artist.findById(artistId);
        
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        artist.isVerified = true;
        await artist.save();

        res.json({ message: 'Artist verified successfully', artist });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

adminCltr.unverifyArtist = async (req,res) => {
    try {
        const { artistId } = req.params;
        console.log("Received artistId:", artistId);
        const artist = await Artist.findById(artistId);
        console.log("Found artist:", artist);
        
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        artist.isVerified = false;
        await artist.save();

        res.json({ message: 'Artist unverified successfully', artist });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


adminCltr.manageUsers = async (req, res) => {
    try {
        const loggedInArtists = await User.find({ role: "artist"}).select("-password");
        const loggedInCustomers = await User.find({ role: "customer" }).select("-password");

        res.json({
            loggedInArtistsCount: loggedInArtists.length,
            loggedInCustomersCount: loggedInCustomers.length,
            loggedInArtists,
            loggedInCustomers,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


adminCltr.manageOrders = async (req, res) => {
    try {
        // Fetch all artists with their corresponding user data
        const artists = await Artist.find().populate("user", "username").lean();

        // Get order counts for each artist
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: "$artist", // Group by artist ID
                    orderCount: { $sum: 1 } // Count orders
                }
            }
        ]);

        // Convert order data into a map for quick lookup
        const orderCountMap = {};
        orders.forEach(order => {
            orderCountMap[order._id.toString()] = order.orderCount;
        });

        // Format the final response
        const result = artists.map(artist => ({
            artistName: artist.user?.username || "Unknown",
            orderCount: orderCountMap[artist._id.toString()] || 0
        }));

        res.json(result);
    } catch (error) {
        console.error("Error fetching artist order counts:", error);
        res.status(500).json({ error: "Server error" });
    }
};

adminCltr.manageCommission = async ( req,res ) =>{
    try {
        const commissionData = await Payment.aggregate([
          {
            $group: {
              _id: "$orderId",
              totalCommission: { $sum: "$adminCommission" },
              latestDate: { $max: "$createdAt" },
            },
          },
          {
            $sort: { latestDate: -1 }, // Sort by latest payment
          },
        ]);
    
        res.status(200).json(commissionData);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
}

export default adminCltr