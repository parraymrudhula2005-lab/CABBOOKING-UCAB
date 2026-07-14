const Support = require('../models/Support');

// Create a support ticket
exports.createTicket = async (req, res) => {
  try {
    const { bookingId, subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject and description',
      });
    }

    const ticket = new Support({
      userId: req.userId,
      bookingId: bookingId || null,
      subject,
      description,
      status: 'open',
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Support ticket raised successfully',
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all support tickets raised by this user
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Support.find({ userId: req.userId })
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
