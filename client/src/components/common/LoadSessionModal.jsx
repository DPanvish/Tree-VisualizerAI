import React, {useEffect, useState} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setTreeState } from "../../redux/slice/treeSlice.js";
import { addMessage, clearMessages } from "../../redux/slice/chatSlice.js";
import { TrashIcon} from "@heroicons/react/24/outline/index.js";

const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    })
}

const LoadSessionModal = ({isOpen, onClose}) => {
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all sessions when the modal opens
    useEffect(() => {
        if(isOpen){
            const fetchSessions = async() => {
                setIsLoading(true);
                try{
                    const config = {
                        headers: {Authorization: `Bearer ${token}`}
                    };

                    const response = await axios.get("http://16.16.211.73:5000/api/sessions", config);
                    if(response.data.status === "success"){
                        setSessions(response.data.data.sessions || []);
                    }
                }catch(err){
                    toast.error("Failed to fetch sessions");
                }finally {
                    setIsLoading(false);
                }
            };

            fetchSessions();
        }
    }, [isOpen, token]);

    // Handle loading a specific session
    const handleSessionClick = async(sessionId) => {
        try{
            const config = {
                headers: {Authorization: `Bearer ${token}`}
            };

            const response = await axios.get(`http://16.16.211.73:5000/api/sessions/${sessionId}`, config);

            if(response.data.status === "success"){
                const {session} = response.data.data;

                // Update the tree in the Redux store
                dispatch(setTreeState({nodes: session.nodes, edges: session.edges}));

                // Update the chat
                dispatch(clearMessages());
                const chatMessages = session.chatHistory?.messages || [];
                chatMessages.forEach(message => {
                    dispatch(addMessage(message));
                });

                toast.success(`Session "${session.name}" loaded successfully!"`);
                onClose();
            }
        }catch(err){
            toast.error("Failed to load session");
        }
    }

    // Delete a session
    const handleDelete = async(e, sessionId, sessionName) => {
        e.stopPropagation(); // Prevent closing the modal when clicking the delete button

        if(!window.confirm(`Are you sure you want to delete "${sessionName}"?`)){
            return;
        }

        try{
            const config = {
                headers: {Authorization: `Bearer ${token}`}
            };

            const response = await axios.delete(`http://16.16.211.73:5000/api/sessions/${sessionId}`, config);

            if(response.data.status === "success"){
                toast.success(`Session "${sessionName}" deleted successfully!`);
                // Refresh the list by filtering out the deleted session
                setSessions(sessions.filter(session => session.id !== sessionId));
            }
        }catch(err){
            toast.error("Failed to delete session");
        }
    }

    if(!isOpen){
        return null; // Don't render anything if the modal is not open
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div
                className="bg-bg-secondary w-full max-w-lg rounded-lg shadow-xl border border-border-accent p-6"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <h2 className="text-xl font-semibold text-text-primary mb-4">Load Session</h2>

                <div className="max-h-96 overflow-y-auto space-y-2 custom-scrollbar">
                    {isLoading && <p className="text-text-secondary">Loading...</p>}

                    {!isLoading && sessions.length === 0 && (
                        <p className="text-text-secondary">No saved sessions found</p>
                    )}

                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="flex justify-between items-center p-3 bg-bg-primary rounded-lg border border-border-accent hover:border-accent hover:shadow-lg transition cursor-pointer"
                            onClick={() => handleSessionClick(session.id)}
                        >
                            <div>
                                <p className="font-medium text-text-primary">{session.name}</p>
                                <p className="text-sm text-text-secondary">
                                    Last updated: {formatDate(session.updatedAt)}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Load
                                </span>

                                <button
                                    onClick={(e) => handleDelete(e, session.id, session.name)}
                                    className="text-text-secondary hover:text-red-500 transition-colors p1 cursor-pointer"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-bg-primary hover:bg-bg-secondary text-text-primary font-medium py-2 px-4 rounded-lg border border-border-accent transition-colors cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
export default LoadSessionModal
