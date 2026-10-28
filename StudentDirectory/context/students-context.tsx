
import {
    createContext,
    useContext,
    useReducer,
    type ReactNode,
} from "react";

import { STUDENTS } from "@/data/students";

import {
    studentsReducer,
    type StudentsAction,
    type StudentsState,
} from "./students-reducer";

type StudentsContextType = {
    students: StudentsState;
    dispatch: React.Dispatch<StudentsAction>;
};

const StudentsContext = createContext<StudentsContextType | undefined>(
    undefined
);

type StudentsProviderProps = {
    children: ReactNode;
};

export function StudentsProvider({
    children,
}: StudentsProviderProps) {
    const [students, dispatch] = useReducer(
        studentsReducer,
        STUDENTS
    );

    return (
        <StudentsContext.Provider value={{ students, dispatch }}>
            {children}
        </StudentsContext.Provider>
    );
}

export function useStudents() {
    const context = useContext(StudentsContext);

    if (context === undefined) {
        throw new Error(
            "useStudents must be used within a StudentsProvider"
        );
    }

    return context;
}
