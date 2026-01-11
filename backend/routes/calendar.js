const express = require('express');
const router = express.Router();
const Calendar = require('../models/Calendar');
const { tenantAuth } = require('../middleware/tenantAuth');

// Indian national holidays (predefined)
const nationalHolidays = [
  // 2024 holidays
  { title: 'New Year\'s Day', date: '2024-01-01', type: 'national_holiday' },
  { title: 'Republic Day', date: '2024-01-26', type: 'national_holiday' },
  { title: 'Holi', date: '2024-03-25', type: 'national_holiday' },
  { title: 'Good Friday', date: '2024-03-29', type: 'national_holiday' },
  { title: 'Ram Navami', date: '2024-04-17', type: 'national_holiday' },
  { title: 'Independence Day', date: '2024-08-15', type: 'national_holiday' },
  { title: 'Janmashtami', date: '2024-08-26', type: 'national_holiday' },
  { title: 'Gandhi Jayanti', date: '2024-10-02', type: 'national_holiday' },
  { title: 'Dussehra', date: '2024-10-12', type: 'national_holiday' },
  { title: 'Diwali', date: '2024-11-01', type: 'national_holiday' },
  { title: 'Guru Nanak Jayanti', date: '2024-11-15', type: 'national_holiday' },
  { title: 'Christmas Day', date: '2024-12-25', type: 'national_holiday' },
  // 2025 holidays
  { title: 'New Year\'s Day', date: '2025-01-01', type: 'national_holiday' },
  { title: 'Republic Day', date: '2025-01-26', type: 'national_holiday' },
  { title: 'Holi', date: '2025-03-14', type: 'national_holiday' },
  { title: 'Good Friday', date: '2025-04-18', type: 'national_holiday' },
  { title: 'Ram Navami', date: '2025-04-06', type: 'national_holiday' },
  { title: 'Independence Day', date: '2025-08-15', type: 'national_holiday' },
  { title: 'Janmashtami', date: '2025-08-16', type: 'national_holiday' },
  { title: 'Gandhi Jayanti', date: '2025-10-02', type: 'national_holiday' },
  { title: 'Dussehra', date: '2025-10-02', type: 'national_holiday' },
  { title: 'Diwali', date: '2025-10-20', type: 'national_holiday' },
  { title: 'Guru Nanak Jayanti', date: '2025-11-05', type: 'national_holiday' },
  { title: 'Christmas Day', date: '2025-12-25', type: 'national_holiday' },
  // 2026 holidays
  { title: 'New Year\'s Day', date: '2026-01-01', type: 'national_holiday' },
  { title: 'Republic Day', date: '2026-01-26', type: 'national_holiday' },
  { title: 'Holi', date: '2026-03-03', type: 'national_holiday' },
  { title: 'Good Friday', date: '2026-04-03', type: 'national_holiday' },
  { title: 'Ram Navami', date: '2026-03-25', type: 'national_holiday' },
  { title: 'Independence Day', date: '2026-08-15', type: 'national_holiday' },
  { title: 'Janmashtami', date: '2026-09-04', type: 'national_holiday' },
  { title: 'Gandhi Jayanti', date: '2026-10-02', type: 'national_holiday' },
  { title: 'Dussehra', date: '2026-10-21', type: 'national_holiday' },
  { title: 'Diwali', date: '2026-11-08', type: 'national_holiday' },
  { title: 'Guru Nanak Jayanti', date: '2026-11-24', type: 'national_holiday' },
  { title: 'Christmas Day', date: '2026-12-25', type: 'national_holiday' }
];

// Get all calendar events
router.get('/', tenantAuth, async (req, res) => {
  try {
    const events = await req.tenantModels.Calendar.find({})
      .populate('createdBy', 'name username')
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create calendar event (admin only)
router.post('/', tenantAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create events' });
    }

    const { title, description, date, type } = req.body;
    
    const event = new req.tenantModels.Calendar({
      title,
      description,
      date: new Date(date),
      type,
      createdBy: req.user._id
    });

    await event.save();
    
    const populatedEvent = await req.tenantModels.Calendar.findById(event._id)
      .populate('createdBy', 'name username');
    
    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Create calendar event error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Initialize national holidays
router.post('/init-holidays', tenantAuth, async (req, res) => {
  try {
    const existingHolidays = await req.tenantModels.Calendar.find({ type: 'national_holiday' });
    
    if (existingHolidays.length === 0) {
      const holidays = nationalHolidays.map(holiday => ({
        ...holiday,
        date: new Date(holiday.date),
        isNational: true,
        createdBy: req.user._id
      }));

      await req.tenantModels.Calendar.insertMany(holidays);
    }

    res.json({ message: 'National holidays initialized' });
  } catch (error) {
    console.error('Initialize holidays error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming events (next 7 days)
router.get('/upcoming', tenantAuth, async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingEvents = await req.tenantModels.Calendar.find({
      date: { $gte: today, $lte: nextWeek }
    }).sort({ date: 1 });
    
    res.json(upcomingEvents);
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete calendar event
router.delete('/:id', tenantAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete events' });
    }

    await req.tenantModels.Calendar.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete calendar event error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;