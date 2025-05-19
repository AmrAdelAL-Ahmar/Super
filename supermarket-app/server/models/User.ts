import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Address interface
export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}

// User interface for TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'owner' | 'delivery';
  password: string;
  addresses: IAddress[];
  createdBy?: mongoose.Types.ObjectId;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// User model schema
const UserSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    role: {
      type: String,
      enum: ['customer', 'owner', 'delivery'],
      default: 'customer',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    addresses: [
      {
        address: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        coordinates: {
          lat: {
            type: Number,
            required: true,
          },
          lng: {
            type: Number,
            required: true,
          },
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function(this: IUser, next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(this: IUser): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    } as jwt.SignOptions
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(this: IUser, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User; 