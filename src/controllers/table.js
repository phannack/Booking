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
  } catch (error) {
    throw ThrowError.BAD_REQUEST("Bad Request", error);
  }
};

//Clear Table'
const clearTable = (req, res, next) => {
  try {
    tables = [];

    res.json({
      status: true,
      message: "clear tables success",
      data: tables,
    });
  } catch (error) {
    throw ThrowError.BAD_REQUEST("Bad Request", error);
  }
};

//GET '/table/:id'
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
      message: "create success",
      data: tables[0],
    });
  } catch (error) {
    throw ThrowError.BAD_REQUEST("Bad Request", error);
  }
};

//PUT '/table/reserve/:id'
const reserveTable = (req, res, next) => {
  try {
    const id = req.params.id;
    const reserveIndex = tables.findIndex((table) => table.id === Number(id));

    if (reserveIndex === -1) {
      res.json({
        status: false,
        message: `Table id ${id} not found`,
      });
    }

    if (tables[reserveIndex].isAvailable !== false) {
      res.json({
        status: false,
        message: `Table id ${id} not available`,
      });
    }

    const bookingInfo = req.body.bookingInfo;

    const { customers } = bookingInfo;

    if (customers < 1 || customers > 4) {
      res.json({
        status: false,
        message: `can not reserve for ${customers}`,
      });
    }

    tables[reserveIndex] = {
      ...tables[reserveIndex],
      isAvailable: false,
      bookingInfo,
    };

    res.json({
      status: true,
      message: "reserve success",
      data: tables[reserveIndex],
    });
  } catch (error) {}
};

//PUT '/table/cancel/:id'
const cancelReserveTable = (req, res, next) => {
  try {
    const id = req.params.id;
    const reserveIndex = tables.findIndex((table) => table.id === Number(id));

    if (reserveIndex === -1) {
      res.json({
        status: false,
        message: `Table id '${id}' not found`,
      });
    }

    const bookingInfo = req.body.bookingInfo;

    tables[reserveIndex] = {
      ...tables[reserveIndex],
      isAvailable: true,
      bookingInfo: {},
    };

    res.json({
      status: true,
      message: "reserve success",
      data: tables[reserveIndex],
    });
  } catch (error) {}
};

//export controller functions
module.exports = {
  getAllTable,
  newTable,
  clearTable,
  getTable,
  reserveTable,
  cancelReserveTable,
};
