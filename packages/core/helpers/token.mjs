import { head } from 'ramda';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const getTokenIat = token => {
  const payload = jwt.decode(token);

  return payload && payload.iat;
};

const canGenerateNewToken = (previousTokens, dailyLimit) => {
  const previousTokenCount = previousTokens && previousTokens.length;

  if (previousTokenCount < dailyLimit) return true;

  const oldestToken = head(previousTokens);
  const oldestTokenIat = getTokenIat(oldestToken);
  const iatDate = moment.unix(oldestTokenIat);

  return moment().isAfter(iatDate.add(1, 'd'));
};

const appendToSize = (array, item, size) => (
  [...array, item].slice(Number.isFinite(size) ? -size : -1)
);

export {
  appendToSize,
  canGenerateNewToken,
};
