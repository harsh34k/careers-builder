import jwt, { Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = "superman@123$";


export default function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as { id: string; email: string };
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}
