import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import prisma from "../lib/prisma.js";
import * as z from "zod";

const schema = z.object({});

export const getAll = (Model, queryOptions) =>
  catchAsync(async (req, res) => {
    const features = new APIFeatures(req.query)
      .filter()
      .sort()
      .fieldLimit()
      .paginate();

    if (queryOptions?.include) {
      features.prismaQuery.include = queryOptions.include;
    }

    const records = await prisma[Model].findMany(features.prismaQuery);

    res.status(200).json({
      status: "success",
      results: records.length,
      data: {
        records,
      },
    });
  });

catchAsync(async (req, res, next) => {
  const products = await prisma.product.findMany(features.prismaQuery);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: { products },
  });
});

export const getOne = (Model, queryOptions) =>
  catchAsync(async (req, res, next) => {
    const options = {
      where: { id: parseInt(req.params.id) },
    };

    if (queryOptions?.include) options.include = queryOptions.include;

    const record = await prisma[Model].findUnique(options);

    if (!record) return next(new AppError("No record found", 404));

    res.status(200).json({
      status: "success",
      data: record,
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
    const { title, description, price, quantity, imageUrl } = req.body;

    const record = await prisma[Model].update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price,
        quantity,
        imageUrl,
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
