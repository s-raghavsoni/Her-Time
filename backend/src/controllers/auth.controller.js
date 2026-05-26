import * as authService from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { token, user } = await authService.loginUser(req.body);
    res.json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.userId);

    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}
