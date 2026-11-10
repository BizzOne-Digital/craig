import mongoose from 'mongoose';
import BookingRequest from '../models/BookingRequest.js';
import ContactInquiry from '../models/ContactInquiry.js';
import { fail, success } from '../utils/apiResponse.js';
import { escapeRegex, parsePaging } from '../utils/asyncHandler.js';

function makeController(Model, label, searchFields) {
  const notFound = (res) => fail(res, `${label} not found`, 404);
  const validId = (id) => mongoose.Types.ObjectId.isValid(id);

  return {
    async list(req, res) {
      const { page, limit, skip } = parsePaging(req.query);
      const filter = {};
      if (req.query.status) filter.status = req.query.status;
      if (req.query.search) {
        const rx = new RegExp(escapeRegex(req.query.search), 'i');
        filter.$or = searchFields.map((field) => ({ [field]: rx }));
      }
      const [items, total] = await Promise.all([
        Model.find(filter).select('-ipHash').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Model.countDocuments(filter),
      ]);
      return success(res, items, { page, limit, total, pages: Math.ceil(total / limit) });
    },
    async get(req, res) {
      if (!validId(req.params.id)) return notFound(res);
      const item = await Model.findById(req.params.id).select('-ipHash');
      return item ? success(res, item) : notFound(res);
    },
    async updateStatus(req, res) {
      if (!validId(req.params.id)) return notFound(res);
      const item = await Model.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      ).select('-ipHash');
      return item ? success(res, item) : notFound(res);
    },
    async remove(req, res) {
      if (!validId(req.params.id)) return notFound(res);
      const item = await Model.findByIdAndDelete(req.params.id);
      return item ? success(res, { deleted: true }) : notFound(res);
    },
  };
}

export const bookings = makeController(BookingRequest, 'Booking', ['name', 'email', 'service', 'phone']);
export const contacts = makeController(ContactInquiry, 'Inquiry', ['name', 'email', 'subject', 'message']);
