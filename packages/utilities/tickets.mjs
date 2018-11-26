import { connect } from '@be/server/src/config/database';
import { Ticket } from '@be/server/src/modules/ticket/ticket.model';

const Tickets = [];

const insertToDb = async ([tickets]) => {
  try {
    await Ticket.collection.drop();
  } catch (error) {
    if (error.code === 26) console.log('Tickets collection does not exist');
  }
  try {
    if (!tickets.length) return;

    await Ticket.bulkWrite(
      tickets.map(airport => ({
        insertOne: {
          document: airport,
        },
      })),
    );
  } catch (error) {
    console.log(error);
  }
};

const load = async () => Promise.all([
  Promise.resolve(Tickets),
  connect(),
]).then(insertToDb);

export {
  load,
};
