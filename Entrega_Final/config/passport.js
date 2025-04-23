import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) token = req.cookies['jwtCookie'];
    return token;
};

const initializePassport = () => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'tu_clave_secreta' 
    };

    passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
};

export default initializePassport;