import { createContext, useContext, useState } from "react";

const TableContext = createContext();

export const TableProvider = ({ children }) => {
  // Carica id_ombrellone da localStorage all'avvio
  const [tableId, setTableIdState] = useState(() => {
    try {
      const saved = localStorage.getItem("tableId");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Salva id_ombrellone su localStorage ogni volta che cambia
  const setTableId = (id) => {
    setTableIdState(id);
    localStorage.setItem("tableId", JSON.stringify(id));
  };

  return (
    <TableContext.Provider value={{ tableId, setTableId }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);
export { TableContext };  
