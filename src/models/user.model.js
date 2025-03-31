import mongoose, {Schema} from "mongoose";  //If we write schema here we can use only new schema instead of new mongoose.schema.
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required!"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true     //Optimize this object for search
        },
        email: {
            type: String,
            required: [true, "Username is required!"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: [true, "Username is required!"], 
            trim: true,
            index: true
        },
        avatar: {
            type: String,    //Cloudinary url
            required: true
        },
        coverImage: {
            type:String
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type: String,
            required: [true, "Password is required"],
            min : [6, "Password must have more than 6 characters"]
        },
        refreshToken:{
            type:String
        }
    }, {timestamps: true}
)

//For storing password in hash format( using Pre ---> Default method in mongoose )
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//For checking if the password given by the user by comparing it to the pass stored in db!
userSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password, this.password)
}

//To generate jwt token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//to create refresh token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)