import createError from 'http-errors';

export default async function (req, res, next) {
  if (req.user.dataValues.email !== 'admin@mail.com') {
    const error = createError(403, 'You are not an admin!');
    return next(error);
  }
  return next();
}
