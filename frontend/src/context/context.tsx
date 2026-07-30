import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi, type Task } from '../utils';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    workspace: any | null;
    setWorkspace: React.Dispatch<React.SetStateAction<any | null>>;
    isLoadingWorkspace: boolean;
    currentWorkspace: string;
    setCurrentWorkspace: React.Dispatch<React.SetStateAction<string>>;
    dragData: any;
    setdragData: React.Dispatch<React.SetStateAction<any>>;
    taskToMove: Task | null;
    settaskToMove: React.Dispatch<React.SetStateAction<Task | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
    const [workspace, setWorkspace] = useState<any | null>(null);
    const [currentWorkspace, setCurrentWorkspace] = useState<string>(localStorage.getItem('current_workspace') || "");
    const [dragData, setdragData] = useState<{
        id: number,
        status: string,
        sourceIndex: number,
        destinationIndex: number,
        sourceStatus: string
    } | null>(null)
    const [taskToMove, settaskToMove] = useState<Task | null>(null)

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetchApi("user");

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    setUser(data.data);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error('Session validation failed:', error);
                handleLogout();
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            verifyToken();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const fetchWorkspace = React.useCallback(async () => {
        try {
            setIsLoadingWorkspace(true);
            const response = await fetchApi("workspaces");
            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setWorkspace(data.data?.data);
                // localStorage.setItem('workspace', JSON.stringify(data.data));
            } else {
                console.error('Failed to fetch workspace:', data.message);
            }
        } catch (error) {
            console.error('Error fetching workspace:', error);
        } finally {
            setIsLoadingWorkspace(false);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchWorkspace();
        }
    }, [token]);

    const handleLogin = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('current_workspace');
        setToken(null);
        setUser(null);
        setWorkspace(null);
        setCurrentWorkspace("");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isLoading,
                login: handleLogin,
                logout: handleLogout,
                workspace,
                setWorkspace,
                isLoadingWorkspace,
                currentWorkspace,
                setCurrentWorkspace,
                dragData,
                setdragData,
                taskToMove, settaskToMove
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
