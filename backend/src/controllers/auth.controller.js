import * as authService from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
}
