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

export async function listProviders(req, res, next) {
  try {
    const providers = await providerService.listProviders(req.query.role);
    res.json({ success: true, providers });
  } catch (err) {
    next(err);
  }
}

export async function getProviderByUserId(req, res, next) {
  try {
    const provider = await providerService.getProviderByUserId(req.params.userId);
    res.json({ success: true, provider });
  } catch (err) {
    next(err);
  }
}
