import IResponse from './response';

export default interface IMessage {
    [key: string]: IResponse | ((val: string) => IResponse);
}
