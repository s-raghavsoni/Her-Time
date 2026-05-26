import * as providerService from '../services/provider.service.js';

export async function createProfile(req, res, next) {
  try {
    const profile = await providerService.createProviderProfile(req.userId, req.body);
    res.status(201).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const profile = await providerService.getProviderProfile(req.userId);
    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
}
