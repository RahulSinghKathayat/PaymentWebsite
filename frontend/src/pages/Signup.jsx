import { Heading } from "../components/Heading";
import { SubHeading } from "../components/Subheading";
import { BottomWarning } from "../components/BottomWarning";
import { InputBox } from "../components/InputBox";
import { Button } from '../components/Button'
import  axios  from "axios"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () =>{

    
    const [firstName, setFirstName] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [lastName, setLastName] = useState("")
    const navigate = useNavigate()
    return <div className="bg-slate-300 h-screen flex justify-center">

        
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label = {"SignUp"} />
                <SubHeading label = {"Enter your information here"} />
                
                <InputBox onChange={e => {
                    setFirstName(e.target.value)
                }}placeholder="John" label={"First Name"} />
                
                <InputBox onChange={(e)=>{
                    setLastName(e.target.value)
                }}placeholder="Doe" label={"Last Name"} />
                
                <InputBox onChange={e=>{
                    setUsername(e.target.value)
                }}placeholder="harkirat@gmail.com" label={"Email"} />
                
                <InputBox onChange={(e)=>{
                    setPassword(e.target.value)
                }}placeholder="12345" label={"Password"} />

                <div className="pt-4">
                    <Button onClick={ async ()=>{
                            const response = await axios.post("http://localhost:8000/api/v1/user/signup", {
                                username,
                                firstName,
                                lastName,
                                password
                              });
                                localStorage.setItem("token", response.data.token)
                                navigate('/dashboard')
                        }}label={"Signup"} />
                </div>
                <BottomWarning label={"Account already exist"} buttonText={"Sign in"} to={'/signin'}></BottomWarning>
            </div>
        </div>
    </div>
}

