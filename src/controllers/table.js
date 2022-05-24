let tables = [];
let bookings = [];

const getAllTable = (req, res, next) => {
  try {
    res.json({
      status: true,
      message: "get tables success",
      data: tables,
    });
  } catch (error) {
    throw ThrowError.BAD_REQUEST("Bad Request", error);
  }
};

const newTable = (req, res, next) => {
  try {
    const maxId =
      tables.reduce(
        (acc, table) => (acc = acc > table.id ? acc : table.id),
        0
      ) + 1;

    req.body.id = maxId;
    tables.push(req.body);

    res.json({
      status: true,
      message: "create success",
      data: tables,
    });
  } catch (error) {}
};

const clearTable = (req, res, next) => {
  try {
    tables = [];
    bookings = [];

    res.json({
      status: true,
      message: "clear data success",
      data: tables,
    });
  } catch (error) {}
};

const getTable = (req, res, next) => {
  try {
    const table = tables.find((table) => table.id === Number(req.params.id));

    if (!table) {
      res.json({
        status: false,
        message: `id '${req.params.id}' not found`,
        data: [],
      });
    }

    res.json({
      status: true,
      message: "get data success",
      data: tables[0],
    });
  } catch (error) {}
};

const reserveTable = (req, res, next) => {
  try {
    const { customers, name, tel } = req.body;

    if (customers < 1) {
      res.json({
        status: false,
        message: `can not reserve for ${customers}`,
      });
    }

    if (tables.length === 0) {
      res.json({
        status: false,
        message: `can not reserve cause table empty`,
      });
    }

    var listTableAvailable = tables.filter(function (el) {
      return el.isAvailable === true;
    });

    const tableAvailable = listTableAvailable.length;
    const tableReserve = Math.ceil(customers / 4);

    if (tableAvailable === 0 || tableAvailable < tableReserve) {
      res.json({
        status: false,
        message: `can not reserve cause table not available`,
      });
    }

    let i = 1;
    let tableIds = [];
    const bookId =
      bookings.reduce(
        (acc, booking) => (acc = acc > booking.id ? acc : booking.id),
        0
      ) + 1;

    listTableAvailable.forEach((tbl, index) => {
      if (index >= tableReserve) {
        return;
      }

      tableIds.push(tbl.id);

      const reserveIndex = tables.findIndex((t) => t.id === Number(tbl.id));
      tables[reserveIndex] = {
        ...tables[reserveIndex],
        isAvailable: false,
        bookId,
      };
    });

    bookings.push({
      id: bookId,
      tableIds,
      customers,
      name,
      tel,
    });

    res.json({
      status: true,
      message: `reserve success`,
      reserveInformation: {
        bookId,
        tableReserve,
        tableIds,
        customers,
        name,
        tel,
      },
      remainTables: tables.filter(function (element) {
        return element.isAvailable === true;
      }).length,
    });
  } catch (error) {}
};

//PUT '/table/cancel/:id'
const cancelReserveTable = (req, res, next) => {
  try {
    const id = req.params.id;
    const reserveIndex = bookings.findIndex(
      (booking) => booking.id === Number(id)
    );

    if (reserveIndex === -1) {
      res.json({
        status: false,
        message: `Booking id '${id}' not found`,
      });
    }

    bookings[reserveIndex].tableIds.forEach((tbl) => {
      const tableIndex = tables.findIndex((t) => t.id === Number(tbl));
      tables[tableIndex] = {
        ...tables[tableIndex],
        isAvailable: true,
        bookId: null,
      };
    });

    res.json({
      status: true,
      message: "cancel success",
      data: tables[reserveIndex],
    });
  } catch (error) {}
};

module.exports = {
  getAllTable,
  newTable,
  clearTable,
  getTable,
  reserveTable,
  cancelReserveTable,
};
