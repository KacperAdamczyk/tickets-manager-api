export default interface IResponse<T = {}> {
    success: boolean;
    message?: string;
    code?: number;
    result?: T;
}
