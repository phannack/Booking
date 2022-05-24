const tables = [];

export class TableDomain {
  createTable(req: any) {
    tables.push(req.body);
    console.log("---tables", tables);
    let json = req.body;
    req.send(`Add new user '${json.name}' completed.`);
  }
}
