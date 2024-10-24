import { User } from "@/types/model";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context
interface AppContextType {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

// export const defaultUser = {
//   id: "",
//   email: "",
//   name: "",
//   verified: false,
// };

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ selectedUser, setSelectedUser }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useSelectedUser must be used within a AppContextProvider");
  }
  return context;
};
