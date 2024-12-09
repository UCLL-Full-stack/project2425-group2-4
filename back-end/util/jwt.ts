import jwt from "jsonwebtoken";
import { UserInput } from "../types";

const generateJwtToken = ({ username }: { username: string }): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'diddyscord' };
    const secret = process.env.JWT_SECRET || 'default-secret';
    try {
        return jwt.sign({ username }, secret, options);
    } catch (error) {
        console.log(error);
        throw new Error('Error generating JWT token, see server log for details.');
    }
};

export { generateJwtToken };
