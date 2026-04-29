import React, { createContext, useContext, useState, useEffect } from "react";
import taskService from "../services/taskService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [tasks, setTasks] = useState(() => {
        try {
            const saved = localStorage.getItem("tasks");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    
    const [loading, setLoading] = useState(true);

    const syncTasks = async () => {
        try {
            setLoading(true);
            const res = await taskService.getTasks();
            const fetchedTasks = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
            const finalTasks = fetchedTasks || [];
            setTasks(finalTasks);
            localStorage.setItem("tasks", JSON.stringify(finalTasks));
        } catch (error) {
            console.error("Nexus Sync Warning:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        syncTasks();
    }, []);

    const updateTaskStatus = async (taskId, updates) => {
        try {
            // Defensive mapping
            setTasks(prev => (Array.isArray(prev) ? prev : []).map(t => 
                (t && t._id === taskId) ? { ...t, ...updates } : t
            ));
            await taskService.updateTask(taskId, updates);
        } catch (error) {
            console.error("Operation failed", error);
            syncTasks();
        }
    };

    return (
        <AppContext.Provider value={{ 
            tasks: Array.isArray(tasks) ? tasks : [], 
            setTasks, 
            updateTaskStatus, 
            syncTasks, 
            loading 
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        return { tasks: [], loading: false, syncTasks: () => {}, updateTaskStatus: () => {} };
    }
    return context;
};
