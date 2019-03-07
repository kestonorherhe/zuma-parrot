import HTTPStatus from 'http-status';

import Admin from './admin.model';

export async function signUp(req, res) {
  try {
    const admin = await Admin.create(req.body);
    return res.status(HTTPStatus.CREATED).json(admin.toAuthJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
} 

export function login(req, res, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());

  return next();
} 
