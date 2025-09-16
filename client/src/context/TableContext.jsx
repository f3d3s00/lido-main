import { createContext, useContext, useState } from "react";

const TableContext = createContext();

export const TableProvider = ({ children }) => {
  const [tableId, setTableId] = useState(null);
  return (
    <TableContext.Provider value={{ tableId, setTableId }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);
export { TableContext };  // <-- named export corretto
