const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export default {
  secret: JWT_SECRET,
  expiresIn: '7d',
};
