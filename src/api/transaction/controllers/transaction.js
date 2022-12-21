"use strict";

const dayjs = require("dayjs");

/**
 *  transaction controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::transaction.transaction");

module.exports = createCoreController(
  "api::transaction.transaction",
  ({ strapi }) => ({
    async getTotalRevenue(ctx) {
      const knex = strapi.db.connection;

      return await knex("transactions")
        .where(function () {
          this.whereNotIn("transactions.payment_method", [
            "member-card",
            "service-card",
          ]).orWhereNull("transactions.payment_method");
        })
        .sum({ total: "total" });
    },
    async getTotalDebt(ctx) {
      const knex = strapi.db.connection;

      return await knex("transactions")
        .where("transactions.status", "paid")
        .sum({ totalDebt: "debt_balance" });
    },
    async getTopDebts(ctx) {
      const knex = strapi.db.connection;

      return await knex("transactions")
        .select(
          "up_users.code",
          "up_users.first_name as firstName",
          "up_users.last_name as lastName",
          "up_users.avatar"
        )
        .join(
          "transactions_user_links",
          "transactions_user_links.transaction_id",
          "transactions.id"
        )
        .join("up_users", "up_users.id", "transactions_user_links.user_id")
        .where("transactions.status", "paid")
        .groupByRaw("up_users.id")
        .sum({ debtBalance: "debt_balance" })
        .orderBy("debtBalance", "desc")
        .limit(3);
    },
    async getDebtDistribution(ctx) {
      const knex = strapi.db.connection;

      return await knex("transactions")
        .select("transactions.billing_type as billingType")
        .whereNot("transactions.debt_balance", 0)
        .andWhere("transactions.status", "paid")
        .groupByRaw("transactions.billing_type")
        .count({ totalTransactions: "*" })
        .orderBy("totalTransactions", "desc");
    },
    async getUserAnalytics(ctx) {
      var { userId } = ctx.request.body;
      const knex = strapi.db.connection;

      const { totalSpent, totalDebt, totalPurchase } = (
        await knex
          .from("transactions")
          .join(
            "transactions_user_links",
            "transactions_user_links.transaction_id",
            "transactions.id"
          )
          .where("user_id", userId)
          .andWhere("transactions.status", "paid")
          .sum({
            totalSpent: "total",
            totalDebt: "debt_balance",
            totalPurchase: "purchase",
          })
      )[0];

      const { totalIncome } = (
        await knex
          .from("transactions")
          .join(
            "transactions_user_links",
            "transactions_user_links.transaction_id",
            "transactions.id"
          )
          .where("user_id", userId)
          .andWhere("type", "income")
          .andWhere("transactions.status", "paid")
          .sum({
            totalIncome: "purchase",
          })
      )[0];

      return {
        totalSpent: totalSpent || 0,
        totalDebt: totalDebt || 0,
        totalIncome: totalIncome || 0,
        totalExpense: (totalPurchase || 0) - (totalIncome || 0),
      };
    },
    async getUserDebt(ctx) {
      var { userId } = ctx.request.body;
      const knex = strapi.db.connection;

      return await knex
        .from("transactions")
        .join(
          "transactions_user_links",
          "transactions_user_links.transaction_id",
          "transactions.id"
        )
        .where("user_id", userId)
        .andWhere("transactions.status", "paid")
        .sum({
          totalDebt: "debt_balance",
        });
    },
    async getMonthlyRevenue(ctx) {
      var { day, month, year } = ctx.request.body;
      const knex = strapi.db.connection;

      const totalRevenue = await knex
        .select("created_at as createdAt")
        .from("transactions")
        .where(function () {
          if (day) {
            this.whereRaw(
              "DAY(transactions.created_at) = ? AND MONTH(transactions.created_at) = ? AND YEAR(transactions.created_at) = ?",
              [day, month, year]
            );
          } else {
            this.whereRaw(
              "MONTH(transactions.created_at) = ? AND YEAR(transactions.created_at) = ?",
              [month, year]
            );
          }
        })
        .andWhere(function () {
          this.whereNotIn("transactions.payment_method", [
            "member-card",
            "service-card",
          ]).orWhereNull("transactions.payment_method");
        })
        .andWhere("transactions.status", "paid")
        .groupByRaw("DATE(transactions.created_at)")
        .sum({
          totalRevenue: "total",
        });

      const totalIncome = await knex
        .select("created_at as createdAt")
        .from("transactions")
        .where(function () {
          if (day) {
            this.whereRaw(
              "DAY(transactions.created_at) = ? AND MONTH(transactions.created_at) = ? AND YEAR(transactions.created_at) = ?",
              [day, month, year]
            );
          } else {
            this.whereRaw(
              "MONTH(transactions.created_at) = ? AND YEAR(transactions.created_at) = ?",
              [month, year]
            );
          }
        })
        .andWhere(function () {
          this.whereNotIn("transactions.payment_method", [
            "member-card",
            "service-card",
          ]).orWhereNull("transactions.payment_method");
        })
        .andWhere("transactions.type", "income")
        .andWhere("transactions.status", "paid")
        .groupByRaw("DATE(transactions.created_at)")
        .sum({
          totalIncome: "total",
        });

      const totalCustomers = await knex
        .select("created_at as createdAt")
        .from("up_users as user")
        .where(function () {
          if (day) {
            this.whereRaw(
              "DAY(user.created_at) = ? AND MONTH(user.created_at) = ? AND YEAR(user.created_at) = ?",
              [day, month, year]
            );
          } else {
            this.whereRaw(
              "MONTH(user.created_at) = ? AND YEAR(user.created_at) = ?",
              [month, year]
            );
          }
        })
        .groupByRaw("DATE(user.created_at)")
        .count({ totalCustomers: "*" });

      const res = {};

      totalRevenue?.forEach((total) => {
        res[dayjs(total.createdAt).format("YYYY-MM-DD")] = {
          totalCustomers: 0,
          totalIncome: 0,
          totalRevenue: total.totalRevenue,
        };
      });
      totalIncome?.forEach((total) => {
        if (!res[dayjs(total.createdAt).format("YYYY-MM-DD")]) {
          res[dayjs(total.createdAt).format("YYYY-MM-DD")] = {
            totalCustomers: 0,
            totalIncome: 0,
            totalRevenue: 0,
          };
        }
        res[dayjs(total.createdAt).format("YYYY-MM-DD")].totalIncome =
          total.totalIncome;
      });
      totalCustomers?.forEach((total) => {
        if (!res[dayjs(total.createdAt).format("YYYY-MM-DD")]) {
          res[dayjs(total.createdAt).format("YYYY-MM-DD")] = {
            totalCustomers: 0,
            totalIncome: 0,
            totalRevenue: 0,
          };
        }
        res[dayjs(total.createdAt).format("YYYY-MM-DD")].totalCustomers =
          total.totalCustomers;
      });

      return res;
    },
    async getYearlyRevenue(ctx) {
      var { year } = ctx.request.body;
      const knex = strapi.db.connection;

      const totalRevenue = await knex
        .select("created_at as createdAt")
        .from("transactions")
        .whereRaw("YEAR(transactions.created_at) = ?", [year])
        .andWhere(function () {
          this.whereNotIn("transactions.payment_method", [
            "member-card",
            "service-card",
          ]).orWhereNull("transactions.payment_method");
        })
        .andWhere("transactions.status", "paid")
        .groupByRaw("MONTH(transactions.created_at)")
        .sum({
          totalRevenue: "total",
        });

      const totalIncome = await knex
        .select("created_at as createdAt")
        .from("transactions")
        .whereRaw("YEAR(transactions.created_at) = ?", [year])
        .andWhere(function () {
          this.whereNotIn("transactions.payment_method", [
            "member-card",
            "service-card",
          ]).orWhereNull("transactions.payment_method");
        })
        .andWhere("transactions.type", "income")
        .andWhere("transactions.status", "paid")
        .groupByRaw("MONTH(transactions.created_at)")
        .sum({
          totalIncome: "total",
        });

      const totalCustomers = await knex
        .select("created_at as createdAt")
        .from("up_users as user")
        .whereRaw("YEAR(user.created_at) = ?", [year])
        .groupByRaw("MONTH(user.created_at)")
        .count({ totalCustomers: "*" });

      const res = {};

      totalRevenue?.forEach((total) => {
        res[dayjs(total.createdAt).format("MM")] = {
          totalCustomers: 0,
          totalIncome: 0,
          totalRevenue: total.totalRevenue,
        };
      });
      totalIncome?.forEach((total) => {
        if (!res[dayjs(total.createdAt).format("MM")]) {
          res[dayjs(total.createdAt).format("MM")] = {
            totalCustomers: 0,
            totalIncome: 0,
            totalRevenue: 0,
          };
        }
        res[dayjs(total.createdAt).format("MM")].totalIncome =
          total.totalIncome;
      });
      totalCustomers?.forEach((total) => {
        if (!res[dayjs(total.createdAt).format("MM")]) {
          res[dayjs(total.createdAt).format("MM")] = {
            totalCustomers: 0,
            totalIncome: 0,
            totalRevenue: 0,
          };
        }
        res[dayjs(total.createdAt).format("MM")].totalCustomers =
          total.totalCustomers;
      });

      return res;
    },
    async getCustomerAnalytics(ctx) {
      var { month, year } = ctx.request.body;
      const knex = strapi.db.connection;

      const totalCustomers = await knex
        .from("up_users as user")
        .join("up_users_role_links", "up_users_role_links.user_id", "user.id")
        .join("up_roles", "up_roles.id", "up_users_role_links.role_id")
        .where("up_roles.type", "authenticated")
        .count({ total: "*" });

      const newCustomers = await knex
        .from("up_users as user")
        .join("up_users_role_links", "up_users_role_links.user_id", "user.id")
        .join("up_roles", "up_roles.id", "up_users_role_links.role_id")
        .whereRaw(
          "up_roles.type = 'authenticated' AND MONTH(user.created_at) = ? AND YEAR(user.created_at) = ?",
          [month, year]
        )
        .count({ total: "*" });

      const totalExpense = await knex
        .from("transactions")
        .where(function () {
          this.whereNotIn("transactions.payment_method", [
            "member-card",
            "service-card",
          ]).orWhereNull("transactions.payment_method");
        })
        .andWhere("transactions.status", "paid")
        .sum({
          total: "total",
        });

      const topExpenses = await knex
        .select(
          "up_users.first_name as firstName",
          "up_users.last_name as lastName"
        )
        .from("transactions")
        .join(
          "transactions_user_links",
          "transactions_user_links.transaction_id",
          "transactions.id"
        )
        .join("up_users", "up_users.id", "transactions_user_links.user_id")
        .where(function () {
          this.whereNotIn("transactions.payment_method", [
            "member-card",
            "service-card",
          ]).orWhereNull("transactions.payment_method");
        })
        .andWhere("transactions.status", "paid")
        .andWhereRaw(
          "MONTH(transactions.created_at) = ? AND YEAR(transactions.created_at) = ?",
          [month, year]
        )
        .groupByRaw("up_users.id")
        .sum({
          totalExpense: "total",
        })
        .orderBy("totalExpense", "desc")
        .limit(10);

      const topDebt = await knex
        .select(
          "up_users.first_name as firstName",
          "up_users.last_name as lastName"
        )
        .from("transactions")
        .join(
          "transactions_user_links",
          "transactions_user_links.transaction_id",
          "transactions.id"
        )
        .join("up_users", "up_users.id", "transactions_user_links.user_id")
        .andWhere("transactions.status", "paid")
        .andWhereRaw(
          "MONTH(transactions.created_at) = ? AND YEAR(transactions.created_at) = ?",
          [month, year]
        )
        .groupByRaw("up_users.id")
        .sum({
          totalDebt: "debt_balance",
        })
        .orderBy("totalDebt", "desc")
        .limit(10);

      const topCheckins = await knex
        .select(
          "up_users.first_name as firstName",
          "up_users.last_name as lastName"
        )
        .from("check_ins")
        .join(
          "check_ins_user_links",
          "check_ins_user_links.check_in_id",
          "check_ins.id"
        )
        .join("up_users", "up_users.id", "check_ins_user_links.user_id")
        .andWhereRaw(
          "MONTH(check_ins.created_at) = ? AND YEAR(check_ins.created_at) = ?",
          [month, year]
        )
        .groupByRaw("up_users.id")
        .count({
          totalCheckIns: "*",
        })
        .orderBy("totalCheckIns", "desc")
        .limit(10);

      return {
        totalCustomers: totalCustomers?.[0]?.total,
        newCustomers: newCustomers?.[0]?.total,
        totalExpense: totalExpense?.[0]?.total,
        topExpenses,
        topDebt: topDebt?.filter((debt) => debt?.totalDebt !== 0),
        topCheckins,
      };
    },
    async getStaffAnalytics(ctx) {
      const knex = strapi.db.connection;

      const totalStaff = await knex
        .from("up_users as user")
        .join("up_users_role_links", "up_users_role_links.user_id", "user.id")
        .join("up_roles", "up_roles.id", "up_users_role_links.role_id")
        .whereNotIn("up_roles.type", ["public", "authenticated"])
        .count({ total: "*" });

      const totalIncome = await knex
        .from("transactions")
        .whereNotIn("transactions.billing_type", [
          "member-card",
          "service-card",
        ])
        .andWhere("transactions.status", "paid")
        .sum({
          total: "total",
        });

      const totalInterest = await knex
        .from("transactions")
        .where("transactions.status", "paid")
        .sum({
          total: "interest_money",
        });

      return {
        totalStaff: totalStaff?.[0]?.total || 0,
        totalIncome: totalIncome?.[0]?.total || 0,
        totalInterest: totalInterest?.[0]?.total || 0,
      };
    },
    async getProductAnalytics(ctx) {
      const knex = strapi.db.connection;

      // calculate total products from order
      const productsFromOrder = await knex
        .jsonExtract("orders.products", "$[*].amount", "products")
        .from("orders");

      const totalFromOrders = productsFromOrder?.map((order) => {
        const products = JSON.parse(order?.products);
        return Array.isArray(products)
          ? products?.reduce((sum, value) => sum + value, 0)
          : 0;
      });

      // calculate total products from transaction
      const productsFromTransaction = await knex
        .jsonExtract("transactions.products", "$[*].amount", "products")
        .from("transactions");

      const totalFromTransactions = productsFromTransaction?.map(
        (transaction) => {
          const products = JSON.parse(transaction?.products);
          return Array.isArray(products)
            ? products?.reduce((sum, value) => sum + value, 0)
            : 0;
        }
      );

      return {
        totalProducts: [...totalFromOrders, ...totalFromTransactions]?.reduce(
          (sum, value) => sum + value,
          0
        ),
      };
    },
    async getSuggestionServices(ctx) {
      var { userId } = ctx.request.body;

      const serviceCards = await strapi.entityService.findMany(
        "api::membership-card.membership-card",
        {
          filters: {
            type: "service-card",
            $or: [
              {
                extraMembers: {
                  member: { id: { $contains: userId } },
                },
              },
              {
                user: userId,
              },
            ],
          },
          populate: ["service", "service.thumbnail"],
        }
      );
      const suggestionServices = [];
      for (let i = 0; i < serviceCards?.length; i++) {
        const treatment = serviceCards[i]?.service;
        // get next booking of treatment
        const listScheduledBookings = await strapi.entityService.findMany(
          "api::booking.booking",
          {
            filters: {
              user: userId,
              scheduleTreatmentTimes: {
                $gt: 0,
              },
              treatment: treatment?.id,
              bookingDate: {
                $gte: dayjs().format("YYYY-MM-DD"),
              },
              status: "scheduled",
            },
            sort: "bookingDate",
          }
        );

        const nextBooking = listScheduledBookings?.[0];
        if (!nextBooking) continue;
        // get last booking
        const listLastBookings = await strapi.entityService.findMany(
          "api::booking.booking",
          {
            filters: {
              user: userId,
              scheduleTreatmentTimes: {
                $gt: 0,
              },
              treatment: treatment?.id,
              bookingDate: {
                $lte: dayjs().format("YYYY-MM-DD"),
              },
              treatmentTime: nextBooking?.treatmentTime - 1,
              status: {
                $ne: "scheduled",
              },
            },
          }
        );

        suggestionServices.push({
          nextBooking,
          lastBooking: listLastBookings?.[0],
          card: serviceCards?.[i],
        });
      }

      return suggestionServices;
    },
  })
);
