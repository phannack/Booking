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
    bookings = [];

    res.json({
      status: true,
      message: "clear data success",
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
const reserveTable2 = (req, res, next) => {
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

    /*const listTable = tables.filter(
      ([key, value]) => value.isAvailable === true
    );*/

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
    listTableAvailable.forEach((tbl, index) => {
      if (index >= tableReserve) {
        return;
      }

      const maxId =
        bookings.reduce(
          (acc, booking) => (acc = acc > booking.id ? acc : booking.id),
          0
        ) + 1;

      console.log("--maxId", maxId);

      bookings.push({
        id: maxId,
        tableId: tbl.id,
        customers,
        name,
        tel,
      });

      const reserveIndex = tables.findIndex((t) => t.id === Number(tbl.id));
      tables[reserveIndex] = {
        ...tables[reserveIndex],
        isAvailable: false,
      };
    });

    res.json({
      status: true,
      message: `reserve success`,
      data: bookings,
    });
  } catch (error) {
    throw new Error(error.toString());
  }
};

//PUT '/table/cancel/:id'
const cancelReserveTable = (req, res, next) => {
  try {
    const id = req.params.id;
    const reserveIndex = bookings.findIndex(
      (booking) => booking.id === Number(id)
    );

    console.log("--id", id);
    console.log("--bookings", bookings);
    console.log("--reserveIndex", reserveIndex);

    if (reserveIndex === -1) {
      res.json({
        status: false,
        message: `Booking id '${id}' not found`,
      });
    }

    const tableIndex = tables.findIndex(
      (t) => t.id === Number(bookings[reserveIndex].tableId)
    );
    tables[tableIndex] = {
      ...tables[tableIndex],
      isAvailable: true,
    };

    res.json({
      status: true,
      message: "cancel success",
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
