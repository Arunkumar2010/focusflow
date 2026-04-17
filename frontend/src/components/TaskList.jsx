import React from 'react';
import TaskItem from './TaskItem';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TaskList = ({ tasks, onUpdate, onDelete, onEdit, onReorder }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div style={styles.emptyState}>
                <p>No tasks found. Create one to get started!</p>
            </div>
        );
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        if (onReorder) {
            onReorder(result.source.index, result.destination.index);
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-tasks">
                {(provided) => (
                    <div 
                        style={styles.list} 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                    >
                        {tasks.map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.9 : 1,
                                            transform: snapshot.isDragging ? `${provided.draggableProps.style.transform} scale(1.02)` : provided.draggableProps.style.transform,
                                            zIndex: snapshot.isDragging ? 100 : 1,
                                        }}
                                    >
                                        <TaskItem 
                                            task={task} 
                                            onUpdate={onUpdate}
                                            onDelete={onDelete}
                                            onEdit={onEdit}
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
    );
};

const styles = {
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    emptyState: {
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-color)'
    }
};

export default TaskList;
