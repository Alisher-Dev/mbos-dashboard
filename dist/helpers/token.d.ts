import { IPayload } from './type';
declare class Token {
    private readonly accessSecret;
    private readonly refreshSecret;
    constructor();
    generateAccessToken(payload: IPayload): string;
    generateRefreshToken(payload: IPayload): string;
    verifyAccessToken(accessToken: string): IPayload;
    verifyRefreshToken(refreshToken: string): IPayload;
}
declare const _default: Token;
export default _default;
