"use client";
import { Droppable, Draggable, DragDropContext } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

const SectionEditor = dynamic(() => import("./SectionEditor"), { ssr: false });

export default function SectionBuilder({
    sections,
    handleDragEnd,
    handleChange,
    handleDelete,
}: any) {
    return (
        <div className="mt-6">


            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            <h1 className="text-2xl font-semibold mb-3 mx-8">Sections</h1>
                            <p className="text-gray-400 text-sm text-end mx-6">Please save your work to see changes in preview and public page </p>

                            {sections.map((section: any, index: number) => (
                                <Draggable key={section.id} draggableId={section.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="relative shadow-md rounded-2xl p-4 bg-white border hover:shadow-xl transition-all duration-200 mx-8"
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="absolute left-2 top-2 text-gray-400 hover:text-gray-600 cursor-grab"
                                            >
                                                ⠿
                                            </div>

                                            <button
                                                onClick={() => handleDelete(section.id)}
                                                className="absolute cursor-pointer top-2 right-2 p-1 rounded hover:bg-red-100 text-red-500 transition"
                                                title="Delete Section"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                            <input
                                                placeholder="Section Title"
                                                value={section.title}
                                                onChange={(e) => handleChange(section.id, "title", e.target.value)}
                                                className="text-lg font-semibold w-full mb-3 border-b border-transparent focus:border-gray-300 outline-none pl-6"
                                            />

                                            <SectionEditor
                                                value={section.content}
                                                onChange={(html: any) => handleChange(section.id, "content", html)}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
