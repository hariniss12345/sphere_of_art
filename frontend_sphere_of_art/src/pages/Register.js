import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
        username: "",
        email: "",
        password: "",
        role: ""
    });

    const [clientErrors, setClientErrors] = useState(null);
    const [serverErrors, setServerErrors] = useState(null);

    const clientValidationsErrors = {};

    const runClientValidations = () => {
        if (!formData.username.trim()) clientValidationsErrors.username = "Username is required";
        if (!formData.password.trim()) clientValidationsErrors.password = "Password is required";
        if (!formData.email.trim()) clientValidationsErrors.email = "Email is required";
        if (!formData.role.trim()) clientValidationsErrors.role = "Role is required";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        runClientValidations();
        
        if (Object.keys(clientValidationsErrors).length === 0) {
            try {
                await axios.post("http://localhost:4800/api/users/register", formData);
                navigate("/login");
            } catch (err) {
                setServerErrors(err.response?.data.errors);
            }
            setClientErrors({});
        } else {
            setClientErrors(clientValidationsErrors);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                {serverErrors && (
                    <div className="text-red-500 text-sm mb-4">
                        {serverErrors.map((error, i) => <p key={i}>{error.msg}</p>)}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormdata({ ...formData, username: e.target.value })}
                        placeholder="Username"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {clientErrors?.username && <p className="text-red-500 text-sm">{clientErrors.username}</p>}
                    
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormdata({ ...formData, email: e.target.value })}
                        placeholder="Email"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {clientErrors?.email && <p className="text-red-500 text-sm">{clientErrors.email}</p>}
                    
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormdata({ ...formData, password: e.target.value })}
                        placeholder="Password"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {clientErrors?.password && <p className="text-red-500 text-sm">{clientErrors.password}</p>}
                    
                    <div className="flex gap-4 items-center">
                        <label className="flex items-center space-x-2">
                            <label>Register As</label><br/>
                            <input
                                type="radio"
                                name="role"
                                value="customer"
                                onChange={(e) => setFormdata({ ...formData, role: e.target.value })}
                            />
                            <span>Customer</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="role"
                                value="artist"
                                onChange={(e) => setFormdata({ ...formData, role: e.target.value })}
                            />
                            <span>Artist</span>
                        </label>
                    </div>
                    {clientErrors?.role && <p className="text-red-500 text-sm">{clientErrors.role}</p>}
                    
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">Sign Up</button>
                </form>
            </div>
        </div>
    );
}
