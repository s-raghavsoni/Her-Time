import * as bookingService from '../services/booking.service.js';

export async function createBooking(req, res, next) {
  try {
    const booking = await bookingService.createBooking(
      req.userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (err) {
    next(err);
  }
}

export async function getBookings(req, res, next) {
  try {
    const bookings = await bookingService.getBookings(
      req.userId,
    );

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    next(err);
  }
}