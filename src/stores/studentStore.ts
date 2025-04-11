import { create } from "zustand";

type Student = {
    id: string;
    name: string;
    age:number
}

type StudentStore = {
    students:Student[],
    addStudent: (student: Student) => void,
    removeStudent: (id: string) => void,
    updateStudent: (id:string, student: Student) => void
}

const initialData : Student[] = [
    {
        id:"1",
        name:"John",
        age:20
    },
    {
        id:"2",
        name:"Jane",
        age:21
    },
    {
        id:"3",
        name:"Jim",
        age:22
    }
]

const useStudentStore = create<StudentStore>((set)=>({
    students:initialData,
    addStudent:(student:Student)=>set((state)=>({
        students:[...state.students,student]
    })),
    removeStudent:(id:string)=>set((state)=>({
        students:state.students.filter((student)=>student.id !== id)
    })),
    updateStudent:(id:string, student:Student)=>set((state)=>({
        students:state.students.map((s)=>s.id === id ? student : s)
    }))
}))

export { useStudentStore };
export type { Student };