import Artist from '../models/artist-model.js'

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
        const artist = await Artist.findById(artistId);
        
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


export default adminCltr