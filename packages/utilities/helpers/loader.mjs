import fs from 'fs';
import csv from 'csv';

const { parse } = csv;

const loader = filePath => new Promise((resolve, reject) => {
  const parser = parse({ delimiter: ',' }, (error, data) => {
    if (error) {
      return reject(error);
    }
    resolve(data);
  });

  fs.createReadStream(filePath).pipe(parser);
});

export {
  loader,
};
