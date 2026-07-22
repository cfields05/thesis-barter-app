import GoogleStrategy from 'passport-google-oauth20';
import passport from 'passport';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import prisma from '../db/index';
import { error } from 'console';

dotenv.config({ path: './config/.env' });

const router = express.Router();

passport.serializeUser((user, done) => {
  done(null, user.googleId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { googleId: id },
    });
    done(null, user);
  } catch (err) {
    console.error('Could not deserialize user: ', err);
    return done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.user.update({
          where: { googleId: profile.id },
          data: {
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
          },
        })
        done(error, null);
      } catch (err) {
        console.error('Could not deserialize user: ', err);
        return done(err, null),
      }
    },
  ),
);

router.get('/login', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
}));

router.get('/redirect/google', passport.authenticate('google', {
  failureRedirect: '/login',
  successRedirect: '/',
}));

router.get('/check', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ user: null });
  res.json({ user: req.user });
});

export default router;