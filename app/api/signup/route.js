import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req){
    const {email, password} = await req.json()
    //we are getting the email and password from the request body
    try{
        await dbConnect();

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
        //we will hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
        })
        await newUser.save()
        return NextResponse.json({message:'User created successfully'}, {status: 201})
    }
    catch(error){
        console.error('Error creating user:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
    }
}