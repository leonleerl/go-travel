"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button,
    Label,
    Input,
    DialogClose
  } from "@/components/ui"
import { Student, useStudentStore } from "@/stores"
  
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

function StudentTable() {
    const updateStudent = useStudentStore((state) => state.updateStudent)
    const removeStudent = useStudentStore((state) => state.removeStudent)
    const students = useStudentStore((state) => state.students)
    const addStudent = useStudentStore((state) => state.addStudent)

    const [editStudent, setEditStudent] = useState<Student | null>(null)
    const [newStudent, setNewStudent] = useState<Student>({ id: '', name: '', age: 0 })

    const handleEdit = () => {
        if (editStudent) {
            updateStudent(editStudent.id, editStudent)
            setEditStudent(null) 
        }
        
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this student?")
        if (confirm) {
            removeStudent(id)
        }
    }

    const handleAdd = () => {
        if (newStudent.name && newStudent.age) {
            newStudent.id = uuidv4()
            addStudent(newStudent)
            setNewStudent({ id: '', name: '', age: 0 }) // Reset the new student state
        }
    }

    return (
        <>
            <Table>
                <TableCaption>Student List</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Operation</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((stu) => (
                        <TableRow key={stu.id}>
                            <TableCell>{stu.id}</TableCell>
                            <TableCell>{stu.name}</TableCell>
                            <TableCell>{stu.age}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" onClick={() => setEditStudent(stu)}>Edit</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit profile</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your profile here. Click save when you&apos;re done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={editStudent?.name || ''}
                                                    onChange={(e) => setEditStudent({ ...editStudent!, name: e.target.value })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="age" className="text-right">
                                                    Age
                                                </Label>
                                                <Input
                                                    id="age"
                                                    value={editStudent?.age || ''}
                                                    onChange={(e) => setEditStudent({ ...editStudent!, age: parseInt(e.target.value) })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button onClick={handleEdit} variant={"default"}>Save changes</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button onClick={() => handleDelete(stu.id)} variant={"destructive"} className="ml-10">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex">
                <Input
                    name="name"
                    type="text"
                    placeholder="Name"
                    className="w-36"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
                <Input
                    name="age"
                    type="number"
                    placeholder="Age"
                    className="w-36"
                    value={newStudent.age}
                    onChange={(e) => setNewStudent({ ...newStudent, age: parseInt(e.target.value) })}
                />
                <Button onClick={handleAdd} variant={"default"} className="w-36">Add</Button>
            </div>
        </>
    );
}

export { StudentTable }