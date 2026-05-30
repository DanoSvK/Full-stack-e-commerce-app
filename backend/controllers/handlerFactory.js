import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import prisma from "../lib/prisma.js";
import * as z from "zod";

const schema = z.object({});

export const getAll = (Model, queryOptions) =>
  catchAsync(async (req, res) => {
    const options = { ...queryOptions };

    // To allow for nested GET reviews on product
    if (req.params.prodId) {
      options.where = {
        ...(options.where || {}),
        product_id: Number(req.params.prodId),
      };
    }

    const records = await prisma[Model].findMany(options);

    res.status(200).json({
      status: "success",
      results: records.length,
      data: {
        records,
      },
    });
  });

export const getOne = (Model, queryOptions) =>
  catchAsync(async (req, res, next) => {
    const options = {
      where: { id: parseInt(req.params.id) },
    };

    if (queryOptions) options.include = queryOptions;

    const doc = await prisma[Model].findUnique(options);

    if (!doc) return next(new AppError("No document found", 404));

    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const record = await prisma[Model].delete({
      where: { id: parseInt(req.params.id) },
    });

    if (!record) {
      return next(new AppError(`No record found with that ID`, 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, quantity, image_url } = req.body;

    const record = await prisma[Model].update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price,
        quantity,
        image_url,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        record,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const record = await prisma[Model].create({
      data: req.body,
    });

    res.status(201).json({
      status: "success",
      data: {
        record,
      },
    });
  });
