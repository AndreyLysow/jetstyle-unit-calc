import mongoose, { Schema } from 'mongoose';

const LeadSchema = new Schema(
  {
    email: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    inputs: {
      cpc: Number, cr: Number, cps: Number,
      avp: Number, cogs: Number, ret: Number, au: Number,
    },
    type: { type: String }, // если ты пишешь type: 'download' / 'callback'
  },
  { timestamps: true }
);

export type LeadDoc = mongoose.Document & {
  email: string;
  name?: string;
  inputs: {
    cpc: number; cr: number; cps: number;
    avp: number; cogs: number; ret: number; au: number;
  };
  type?: string;
};

export default (mongoose.models.Lead as mongoose.Model<LeadDoc>) ||
  mongoose.model<LeadDoc>('Lead', LeadSchema);